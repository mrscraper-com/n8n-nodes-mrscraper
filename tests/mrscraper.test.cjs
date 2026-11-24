const assert = require('node:assert/strict');
const { test } = require('node:test');
const { NodeHelpers } = require('n8n-workflow');
const { Mrscraper } = require('../dist/nodes/Mrscraper/Mrscraper.node.js');
const { MrscraperApi } = require('../dist/credentials/MrscraperApi.credentials.js');

const { description } = new Mrscraper();
const resource = () => description.properties.find((p) => p.name === 'resource');
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
const context = (values, helpers = {}) => ({
	getNodeParameter(name, fallback) {
		if (name in values) return values[name];
		if (arguments.length > 1) return fallback;
		throw new Error(`Unexpected parameter: ${name}`);
	},
	getNode: () => ({ name: 'MrScraper', type: 'n8n-nodes-mrscraper.mrscraper', typeVersion: 3 }),
	helpers,
});

test('the node exposes exactly three resources and only the requested operations', () => {
	assert.equal(description.version, 3);
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
	assert.deepEqual(
		operations('account').options.map((p) => p.name),
		['Get Account Info'],
	);
	assert.equal(resource().default, 'scraperApi');
	assert.equal(
		description.properties.filter((p) => p.name === 'operation').length,
		3,
		'one operation selector per resource',
	);
});

test('Account keeps the existing Get Account Info request and header auth', () => {
	assert.equal(description.requestDefaults.baseURL, 'https://api.app.mrscraper.com');
	assert.deepEqual(operations('account').options[0].routing.request, {
		method: 'GET',
		url: '/api/v1/subscription-accounts',
	});
	assert.equal(
		new MrscraperApi().authenticate.properties.headers['x-api-token'],
		'={{$credentials.apiToken}}',
	);
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

test('Scrape Brand is a GET with action, bundle, and url in the query and no body', () => {
	const values = parameters({ operation: 'scrapeBrand', url: 'https://books.toscrape.com/' });
	assert.deepEqual(Object.keys(values).sort(), ['operation', 'resource', 'url']);
	const route = operation('scrapeBrand').routing;
	assert.deepEqual(route.request, {
		baseURL: 'https://api.mrscraper.com',
		url: '/',
		method: 'GET',
		qs: { action: 'brand-scraping', bundle: 'none' },
	});
	assert.equal(route.send, undefined);
	assert.equal(route.output, undefined);
	assert.deepEqual(field('url', values).routing.send, { type: 'query', property: 'url' });
});

const prepare = operation('scrapeJson').routing.send.preSend[0];
const pageRequest = (operationName, extra = {}, values = {}) =>
	prepare.call(context({ operation: operationName, prompt: 'Extract names', ...values }), {
		method: 'GET',
		qs: { ...operation(operationName).routing.request.qs, url: 'https://example.com', ...extra },
	});

test('page requests match SDK defaults and drop legacy query fields', async () => {
	for (const name of ['scrapeHtml', 'scrapeMarkdown', 'getScreenshot', 'scrapeJson']) {
		const result = await pageRequest(name, {
			browserRendering: 'none',
			screenshot: name === 'getScreenshot' ? 'full' : false,
			proxy: 'secret',
			proxyCountry: 'us',
			super: true,
			token: 'secret',
			tokenCap: 30,
			waitUntil: 'load',
		});
		assert.equal(result.method, 'GET');
		assert.equal(result.timeout, 330000);
		assert.equal(result.qs.saveResult, true);
		assert.equal(result.qs.maxAge, 0);
		assert.equal(result.qs.timeout, 300);
		for (const key of ['proxy', 'proxyCountry', 'super', 'token', 'tokenCap', 'waitUntil'])
			assert.equal(key in result.qs, false);
		assert.equal(result.qs.browserRendering, name === 'getScreenshot' ? true : undefined);
	}
	const properties = [
		...description.properties,
		...field('options', parameters({ operation: 'scrapeHtml' })).options,
	];
	for (const key of [
		'proxy',
		'proxyCountry',
		'super',
		'returnCookie',
		'saveResult',
		'tokenCap',
		'waitUntil',
	])
		assert.equal(
			properties.some((p) => p.name === key),
			false,
		);
	assert.equal(parameters({ operation: 'scrapeHtml' }).browserRendering, 'none');
});

test('JSON uses GET and falls back to POST with only url, prompt, agent in body', async () => {
	const short = await pageRequest('scrapeJson', {}, { outputSchema: '{"name":"string"}' });
	assert.equal(short.method, 'GET');
	assert.equal(short.body, undefined);
	assert.equal(short.qs.prompt, 'Extract names\n\nJson Schema:\n{"name":"string"}');
	const prompt = 'Extract '.repeat(1500);
	const long = await pageRequest('scrapeJson', { timeout: 120 }, { prompt });
	assert.equal(long.method, 'POST');
	assert.deepEqual(long.body, { url: 'https://example.com', prompt, agent: 'general' });
	assert.equal(long.qs.prompt, undefined);
	assert.equal(long.qs.timeout, 120);
	assert.equal(long.timeout, 150000);
	await assert.rejects(
		() => pageRequest('scrapeJson', {}, { outputSchema: '{invalid' }),
		/valid JSON/,
	);
});

test('page controls validate SDK limits and preserve false and zero', async () => {
	const result = await pageRequest('scrapeHtml', {
		screenshot: true,
		browserRendering: false,
		maxRetries: 0,
		geoCode: 'GB',
	});
	assert.equal(result.qs.browserRendering, false);
	assert.equal(result.qs.maxRetries, 0);
	assert.equal(result.qs.geoCode, 'gb');
	for (const extra of [
		{ timeout: 331 },
		{ maxAge: 604800001 },
		{ maxRetries: -1 },
		{ geoCode: 'USA' },
		{ waitForSelector: 'x'.repeat(501) },
		{ screenshot: '99x800' },
		{ url: 'file:///tmp/example' },
	]) {
		await assert.rejects(() => pageRequest('scrapeHtml', extra));
	}
	const screenshot = await pageRequest('getScreenshot', { screenshot: 'top' });
	assert.equal(screenshot.qs.html, false);
	assert.equal(screenshot.qs.markdown, false);
	assert.equal('warmStart' in screenshot.qs, false);
});

test('search uses GET query parameters and credentials use both SDK auth headers', () => {
	const route = operations('discovery').options[0].routing;
	assert.equal(route.request.method, 'GET');
	assert.equal(route.send.type, 'query');
	for (const name of ['query', 'country', 'numResults']) {
		assert.equal(
			field(name, { resource: 'discovery', operation: 'webSearch' }).routing.send.type,
			'query',
		);
	}
	assert.equal(field('country', { resource: 'discovery', operation: 'webSearch' }).default, '');
	assert.equal(
		field('numResults', { resource: 'discovery', operation: 'webSearch' }).typeOptions.maxValue,
		100,
	);
	assert.equal(
		new MrscraperApi().authenticate.properties.headers.Authorization,
		'=Bearer {{$credentials.apiToken}}',
	);
	assert.equal(new MrscraperApi().test.request.baseURL, 'https://api.app.mrscraper.com');
});

test('search preparation trims input, omits country, and validates SDK limits', async () => {
	const prepareSearch = operations('discovery').options[0].routing.send.preSend[0];
	const run = (values) =>
		prepareSearch.call(context({ query: '  example  ', numResults: 10, ...values }), {
			qs: { token: 'legacy' },
			body: { query: 'old' },
		});
	const result = await run({});
	assert.deepEqual(result.qs, { action: 'websearch', query: 'example', numResults: 10 });
	assert.equal(result.body, undefined);
	assert.equal((await run({ country: 'GB' })).qs.country, 'gb');
	for (const values of [
		{ query: '' },
		{ query: 'x'.repeat(1001) },
		{ country: 'USA' },
		{ numResults: 101 },
		{ numResults: 9 },
	])
		await assert.rejects(() => run(values));
});

test('HTML and Markdown omit action and expose a boolean screenshot toggle', async () => {
	for (const name of ['scrapeHtml', 'scrapeMarkdown']) {
		const values = parameters({ operation: name });
		const options = field('options', values).options;
		assert.equal(
			options.some((p) => p.name === 'action' || p.name === 'screenshotArea'),
			false,
		);
		const screenshot = options.find((p) => p.name === 'screenshot');
		assert.equal(screenshot.type, 'boolean');
		assert.equal(screenshot.default, false);
		assert.equal(
			NodeHelpers.displayParameter({}, screenshot, { typeVersion: 3 }, description, values),
			true,
		);
		assert.deepEqual(
			field('browserRendering', values).options.map((p) => p.value),
			['none', 'true', 'false'],
		);
		for (const capture of [true, false]) {
			for (const browser of ['none', 'true', 'false']) {
				const result = await pageRequest(name, {
					action: 'legacy-action',
					screenshot: capture,
					browserRendering: browser,
				});
				assert.equal(result.qs.action, undefined);
				assert.equal(result.qs.screenshot, capture);
				assert.equal(
					result.qs.browserRendering,
					browser === 'none' ? undefined : browser === 'true',
				);
			}
		}
	}
});
