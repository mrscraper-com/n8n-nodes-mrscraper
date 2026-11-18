const assert = require('node:assert/strict');
const { test } = require('node:test');
const { Expression, NodeHelpers } = require('n8n-workflow');
const { Mrscraper } = require('../dist/nodes/Mrscraper/Mrscraper.node.js');
const { MrscraperApi } = require('../dist/credentials/MrscraperApi.credentials.js');

const node = new Mrscraper();
const description = node.getNodeType(3).description;
const resource = (version = 3) =>
	node.getNodeType(version).description.properties.find((p) => p.name === 'resource');
const operations = (value) =>
	description.properties.find(
		(p) => p.name === 'operation' && p.displayOptions.show.resource.includes(value),
	);
const operation = (value) => operations('scraperApi').options.find((p) => p.value === value);
const parameters = (values) =>
	NodeHelpers.getNodeParameters(
		description.properties,
		{ resource: 'scraperApi', ...values },
		true,
		false,
		{ typeVersion: 3 },
		description,
	);
const field = (name, values) =>
	description.properties.find(
		(p) =>
			p.name === name &&
			NodeHelpers.displayParameter(values, p, { typeVersion: 3 }, description, values),
	);
const expressionEngine = new Expression('Asia/Jakarta');
const resolve = (expression, data) =>
	expressionEngine.resolveSimpleParameterValue(expression, data);
const context = (values, helpers = {}) => ({
	getNodeParameter(name, fallback) {
		if (name in values) return values[name];
		if (arguments.length > 1) return fallback;
		throw new Error(`Unexpected parameter: ${name}`);
	},
	getNode: () => ({ name: 'MrScraper', type: 'n8n-nodes-mrscraper.mrscraper', typeVersion: 3 }),
	helpers,
});

test('new nodes expose exactly three resources and five Scraper API operations', () => {
	assert.equal(node.currentVersion, 3);
	assert.deepEqual(
		resource()
			.options.map((p) => p.name)
			.sort(),
		['Account', 'Discovery', 'Scraper API'],
	);
	assert.deepEqual(
		operations('scraperApi')
			.options.map((p) => p.name)
			.sort(),
		['Get Screenshot', 'Scrape Brand', 'Scrape HTML', 'Scrape JSON', 'Scrape Markdown'],
	);
	assert.deepEqual(
		operations('discovery').options.map((p) => p.name),
		['Web Search'],
	);
	assert.equal(resource().default, 'scraperApi');
});

test('existing versions keep all previous resources and the Account request', () => {
	for (const version of [0, 2]) {
		assert.deepEqual(
			resource(version).options.map((p) => p.value),
			['account', 'serp', 'scraping', 'result', 'createScraper', 'rerun'],
		);
		assert.equal(resource(version).default, 'rerun');
	}
	const oldDescription = node.getNodeType(2).description;
	assert.equal(description.requestDefaults.baseURL, oldDescription.requestDefaults.baseURL);
	assert.deepEqual(
		operations('account'),
		oldDescription.properties.find(
			(p) => p.name === 'operation' && p.displayOptions.show.resource.includes('account'),
		),
	);
	assert.deepEqual(operations('account').options[0].routing.request, {
		method: 'GET',
		url: '/api/v1/subscription-accounts',
	});
	assert.equal(
		new MrscraperApi().authenticate.properties.headers['x-api-token'],
		'={{$credentials.apiToken}}',
	);
});

test('Web Search matches the supplied POST contract and defaults', () => {
	const values = NodeHelpers.getNodeParameters(
		description.properties,
		{ resource: 'discovery', operation: 'webSearch' },
		true,
		false,
		{ typeVersion: 3 },
		description,
	);
	assert.deepEqual(values, {
		resource: 'discovery',
		operation: 'webSearch',
		query: '',
		country: 'us',
		numResults: 10,
	});
	const search = operations('discovery').options[0];
	assert.deepEqual(search.routing.request, {
		method: 'POST',
		baseURL: 'https://api.mrscraper.com',
		url: '/',
	});
	assert.deepEqual(search.routing.send, { type: 'body', property: 'action', value: 'websearch' });
	for (const name of ['query', 'country', 'numResults']) {
		assert.deepEqual(field(name, values).routing.send, { type: 'body', property: name });
	}
	// The API rejects numResults below 10 with HTTP 400.
	assert.equal(field('numResults', values).typeOptions.minValue, 10);
	assert.equal(description.requestDefaults.headers['Content-Type'], 'application/json');
});

test('HTML and Markdown use GET, query URLs, and preserve raw text in valid n8n items', async () => {
	for (const [name, outputKey, body] of [
		['scrapeHtml', 'html', '<h1>Example & test</h1>'],
		['scrapeMarkdown', 'markdown', '# Example\n\nContent'],
	]) {
		const values = parameters({ operation: name });
		const route = operation(name).routing;
		assert.equal(route.request.baseURL, 'https://api.mrscraper.com');
		assert.equal(route.request.method, 'GET');
		assert.equal(route.request.json, false);
		assert.equal(route.request.encoding, 'text');
		assert.equal(route.request.qs[outputKey], true);
		assert.deepEqual(field('url', values).routing.send, { type: 'query', property: 'url' });
		assert.deepEqual(await route.output.postReceive[0]([], { body }), [
			{ json: { [outputKey]: body } },
		]);
	}
	assert.equal(operation('scrapeMarkdown').routing.request.qs.html, false);
});

test('screenshot requests force browser rendering and support full or top', () => {
	const values = parameters({ operation: 'getScreenshot' });
	assert.equal(values.screenshotMode, 'full');
	assert.equal('browserRendering' in values, false);
	assert.equal(operation('getScreenshot').routing.request.qs.browserRendering, true);
	assert.equal(operation('getScreenshot').routing.request.method, 'GET');
	assert.deepEqual(
		field('screenshotMode', values).options.map((p) => p.value),
		['full', 'top'],
	);
	assert.deepEqual(field('screenshotMode', values).routing.send, {
		type: 'query',
		property: 'screenshot',
	});
});

test('page operations include the documented token query parameter from the credential', () => {
	for (const name of ['scrapeHtml', 'scrapeMarkdown', 'getScreenshot', 'scrapeJson']) {
		assert.equal(operation(name).routing.request.qs.token, '={{$credentials.apiToken}}');
	}
	assert.equal(operation('scrapeBrand').routing.request.qs.token, undefined);
	assert.equal(operations('discovery').options[0].routing.request.qs, undefined);
});

test('JSON extraction keeps long prompts in a POST body and validates schemas before sending', async () => {
	const values = parameters({ operation: 'scrapeJson' });
	const route = operation('scrapeJson').routing.request;
	assert.equal(route.method, 'POST');
	assert.equal(route.baseURL, 'https://api.mrscraper.com');
	assert.deepEqual(route.body, { agent: 'general' });
	assert.deepEqual(field('url', values).routing.send, { type: 'body', property: 'url' });
	const prompt = field('prompt', values).routing.send;
	assert.equal(prompt.type, 'body');
	assert.equal(prompt.property, 'prompt');
	const longPrompt = 'Extract the product name. '.repeat(500);
	const prepare = operation('scrapeJson').routing.send.preSend[0];
	const request = {
		...route,
		body: { ...route.body, url: 'https://example.com', prompt: longPrompt },
	};
	assert.equal(
		(await prepare.call(context({ ...values, prompt: longPrompt }), structuredClone(request))).body
			.prompt,
		longPrompt,
	);
	for (const outputSchema of ['{"name":"string"}', { name: 'string' }]) {
		assert.equal(
			(
				await prepare.call(
					context({ ...values, prompt: 'Extract name', outputSchema }),
					structuredClone(request),
				)
			).body.prompt,
			'Extract name\n\nJson Schema:\n{"name":"string"}',
		);
	}
	await assert.rejects(
		() => prepare.call(context({ ...values, outputSchema: '{invalid' }), structuredClone(request)),
		/Expected Output Schema must be valid JSON/,
	);
});

test('scraper options preserve zero and false values and hide unsupported controls', () => {
	const values = parameters({
		operation: 'scrapeJson',
		options: { maxRetries: 0, super: false, saveResult: false, waitUntil: 'networkidle2' },
	});
	assert.equal(values.options.maxRetries, 0);
	assert.equal(values.options.super, false);
	assert.equal(values.options.saveResult, false);
	assert.equal(values.options.waitUntil, 'networkidle2');
	const options = field('options', values).options;
	assert.deepEqual(options.find((p) => p.name === 'maxRetries').routing.send, {
		type: 'query',
		property: 'maxRetries',
	});
	for (const name of ['blockResources', 'proxy', 'returnCookie', 'waitForSelector']) {
		assert.equal(
			NodeHelpers.displayParameter(
				values.options,
				options.find((p) => p.name === name),
				{ typeVersion: 3 },
				description,
				values,
			),
			false,
		);
	}
});

test('brand field visibility handles new jobs, saved jobs, files, and switching to page scraping', () => {
	const scrape = parameters({ operation: 'scrapeBrand' });
	assert.equal(scrape.brandMode, 'scrape');
	assert.equal(scrape.bundle, 'none');
	assert.ok('url' in scrape);
	for (const mode of ['get', 'download']) {
		const values = parameters({ operation: 'scrapeBrand', brandMode: mode });
		assert.ok('jobId' in values);
		assert.equal('url' in values, false);
		assert.equal('bundle' in values, false);
		assert.equal('brandOutput' in values, mode === 'download');
		assert.ok('url' in parameters({ operation: 'scrapeHtml', brandMode: mode }));
	}
});

test('brand creation matches the query and JSON body from the supplied cURL', async () => {
	const values = parameters({
		operation: 'scrapeBrand',
		url: 'https://www.cireba.com/cayman-islands-real-estate-listings/',
	});
	const route = operation('scrapeBrand').routing;
	assert.equal(route.request.method, 'POST');
	assert.deepEqual(route.request.qs, { action: 'brand-scraping' });
	assert.equal(resolve(route.request.body.url, { $parameter: values }), values.url);
	assert.equal(field('url', values).routing.send.type, 'query');
	assert.deepEqual(field('bundle', values).routing.send, { type: 'query', property: 'bundle' });
	const request = {
		...route.request,
		qs: { ...route.request.qs, url: values.url, bundle: values.bundle },
		body: { url: values.url },
	};
	assert.deepEqual(
		await route.send.preSend[0].call(context(values), structuredClone(request)),
		request,
	);
});

test('saved brand requests use /neo/brand and drop creation fields', async () => {
	const values = parameters({ operation: 'scrapeBrand', brandMode: 'get', jobId: 'job-123' });
	const route = operation('scrapeBrand').routing;
	assert.equal(resolve(route.request.body.url, { $parameter: values }), undefined);
	const request = await route.send.preSend[0].call(context(values), {
		...route.request,
		qs: { action: 'brand-scraping', bundle: 'full' },
		body: { url: 'https://example.com' },
	});
	assert.equal(request.method, 'GET');
	assert.equal(request.url, '/neo/brand');
	assert.deepEqual(request.qs, { id: 'job-123' });
	assert.equal('body' in request, false);
	const items = [{ json: { data: { job_id: 'job-123', brand: { name: 'Example' } } } }];
	assert.equal(await route.output.postReceive[0].call(context(values), items, {}), items);
});

test('all four brand file outputs become n8n binary data without text conversion', async () => {
	const route = operation('scrapeBrand').routing;
	for (const [output, mimeType, filename] of [
		['html', 'text/html; charset=utf-8', 'brand-html.html'],
		['bundle', 'application/zip', 'brand-bundle.zip'],
		['screenshot', 'image/jpeg', 'brand-screenshot.jpg'],
		['screenshot_full', 'image/png', 'brand-screenshot_full.png'],
	]) {
		const values = { brandMode: 'download', jobId: 'job-123', brandOutput: output };
		const bytes = Buffer.from([0, 255, 128, 10, 42]);
		const ctx = context(values, {
			async prepareBinaryData(buffer, name, mime) {
				assert.deepEqual(buffer, bytes);
				assert.equal(name, filename);
				assert.equal(mime, mimeType.split(';')[0]);
				return { data: buffer.toString('base64'), mimeType: mime, fileName: name };
			},
		});
		const request = await route.send.preSend[0].call(ctx, {
			...route.request,
			body: { url: 'https://example.com' },
		});
		assert.equal(request.method, 'GET');
		assert.equal(request.url, '/neo/brand');
		assert.deepEqual(request.qs, { id: 'job-123', output });
		assert.equal(request.encoding, 'arraybuffer');
		assert.equal(request.json, false);
		assert.equal('body' in request, false);
		const result = await route.output.postReceive[0].call(ctx, [], {
			body: bytes,
			headers: { 'content-type': mimeType },
		});
		assert.deepEqual(result[0].json, { jobId: 'job-123', output });
		assert.equal(result[0].binary.data.fileName, filename);
		assert.equal(result[0].binary.data.data, bytes.toString('base64'));
	}
});
