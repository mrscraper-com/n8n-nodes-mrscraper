const assert = require('node:assert/strict');
const { test } = require('node:test');
const { NodeHelpers, Workflow } = require('n8n-workflow');
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
// Resolves a routing expression with n8n's expression engine, as n8n does before it sends a request.
const workflow = new Workflow({
	nodes: [
		{
			id: '1',
			name: 'MrScraper',
			type: 'n8n-nodes-mrscraper.mrscraper',
			typeVersion: 3,
			position: [0, 0],
			parameters: {},
		},
	],
	connections: {},
	active: false,
	nodeTypes: {
		getByName: () => new Mrscraper(),
		getByNameAndVersion: () => new Mrscraper(),
		getKnownTypes: () => ({}),
	},
});
const resolve = (expression, $value) =>
	workflow.expression.getParameterValue(expression, null, 0, 0, 'MrScraper', [], 'manual', {
		$value,
	});
// A Scrape JSON request as n8n hands it to preSend, with expressions resolved and query fields merged.
const jsonRequest = {
	baseURL: 'https://api.mrscraper.com',
	url: '/',
	method: 'GET',
	qs: {
		token: 'test-token',
		agent: 'general',
		url: 'https://example.com',
		browserRendering: false,
		super: false,
		proxyCountry: 'us',
		maxRetries: 0,
	},
	body: {},
};

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

test('Web Search is a GET with the action and search settings in the query', () => {
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
	assert.deepEqual(operations('discovery').options[0].routing, {
		request: {
			method: 'GET',
			baseURL: 'https://api.mrscraper.com',
			url: '/',
			qs: { action: 'websearch' },
		},
	});
	for (const name of ['query', 'country', 'numResults']) {
		const send = field(name, values).routing.send;
		assert.equal(send.type, 'query');
		assert.equal(send.property, name);
	}
	assert.equal(
		resolve(field('query', values).routing.send.value, '  best hotels  '),
		'best hotels',
	);
	assert.equal(resolve(field('country', values).routing.send.value, 'GB'), 'gb');
	assert.equal(field('numResults', values).routing.send.value, undefined);
	// The API rejects numResults below 10 with HTTP 400.
	assert.equal(field('numResults', values).typeOptions.minValue, 10);
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
	assert.equal(operations('discovery').options[0].routing.request.qs.token, undefined);
});

test('JSON extraction is a GET with url, prompt, and agent in the query and validates schemas', async () => {
	const values = parameters({ operation: 'scrapeJson' });
	assert.deepEqual(operation('scrapeJson').routing.request, {
		baseURL: 'https://api.mrscraper.com',
		url: '/',
		method: 'GET',
		qs: { token: '={{$credentials.apiToken}}', agent: 'general' },
	});
	assert.deepEqual(field('url', values).routing.send, { type: 'query', property: 'url' });
	assert.equal(field('prompt', values).routing, undefined, 'preSend sends the prompt and schema');
	const prepare = operation('scrapeJson').routing.send.preSend[0];
	const sent = await prepare.call(
		context({ ...values, prompt: 'Extract name' }),
		structuredClone(jsonRequest),
	);
	assert.equal(sent.method, 'GET');
	assert.deepEqual(sent.qs, { ...jsonRequest.qs, prompt: 'Extract name' });
	assert.deepEqual(sent.body, {});
	for (const outputSchema of ['{"name":"string"}', { name: 'string' }]) {
		const withSchema = await prepare.call(
			context({ ...values, prompt: 'Extract name', outputSchema }),
			structuredClone(jsonRequest),
		);
		assert.equal(withSchema.method, 'GET');
		assert.equal(withSchema.qs.prompt, 'Extract name\n\nJson Schema:\n{"name":"string"}');
	}
	await assert.rejects(
		() =>
			prepare.call(context({ ...values, outputSchema: '{invalid' }), structuredClone(jsonRequest)),
		/Expected Output Schema must be valid JSON/,
	);
});

test('JSON extraction switches to POST only when the encoded GET URL exceeds 8,000 characters', async () => {
	const values = parameters({ operation: 'scrapeJson' });
	const prepare = operation('scrapeJson').routing.send.preSend[0];
	const send = (prompt) =>
		prepare.call(context({ ...values, prompt }), structuredClone(jsonRequest));
	const getUrl = new URL('https://api.mrscraper.com/');
	for (const [name, value] of Object.entries({ ...jsonRequest.qs, prompt: '' })) {
		getUrl.searchParams.set(name, String(value));
	}
	const longest = 'x'.repeat(8000 - getUrl.href.length);

	const atLimit = await send(longest);
	assert.equal(atLimit.method, 'GET');
	assert.equal(atLimit.qs.prompt, longest);

	// One more character, or a shorter prompt that is longer once encoded, moves to a POST body.
	for (const prompt of [`${longest}x`, 'é'.repeat(2000)]) {
		const overLimit = await send(prompt);
		assert.equal(overLimit.method, 'POST');
		assert.deepEqual(overLimit.body, { url: 'https://example.com', prompt, agent: 'general' });
		assert.deepEqual(overLimit.qs, {
			token: 'test-token',
			browserRendering: false,
			super: false,
			proxyCountry: 'us',
			maxRetries: 0,
		});
	}
});

test('scraper options preserve zero and false values and hide unsupported controls', () => {
	const values = parameters({
		operation: 'scrapeJson',
		options: { maxRetries: 0, saveResult: false, waitUntil: 'networkidle2' },
	});
	assert.equal(values.options.maxRetries, 0);
	assert.equal(values.options.saveResult, false);
	assert.equal(values.options.waitUntil, 'networkidle2');
	const options = field('options', values).options;
	for (const name of ['proxyCountry', 'super', 'warmStart']) {
		assert.equal(
			options.some((p) => p.name === name),
			false,
			`${name} is a top-level field`,
		);
	}
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

test('Warm Start, Super, and Proxy Country are top-level query fields with off-by-default toggles', () => {
	for (const operationName of ['scrapeHtml', 'scrapeMarkdown', 'getScreenshot']) {
		const values = parameters({ operation: operationName });
		assert.equal(values.warmStart, false);
		assert.equal(values.super, false);
		assert.equal(values.proxyCountry, 'us');
		for (const name of ['warmStart', 'super', 'proxyCountry']) {
			assert.deepEqual(field(name, values).routing.send, { type: 'query', property: name });
		}
	}
	const json = parameters({ operation: 'scrapeJson' });
	assert.equal('warmStart' in json, false, 'Warm Start is only for HTML, Markdown, and Screenshot');
	assert.equal(json.super, false);
	assert.equal(json.proxyCountry, 'us');
	const brand = parameters({ operation: 'scrapeBrand' });
	for (const name of ['warmStart', 'super', 'proxyCountry']) assert.equal(name in brand, false);
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
