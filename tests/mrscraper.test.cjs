const assert = require('node:assert/strict');
const { test } = require('node:test');
const { NodeHelpers, Workflow } = require('n8n-workflow');
const { Mrscraper } = require('../dist/nodes/Mrscraper/Mrscraper.node.js');
const { MrscraperApi } = require('../dist/credentials/MrscraperApi.credentials.js');

const { description } = new Mrscraper();
const node = { typeVersion: 3 };
const PAGE = 'https://example.com/?q=a&b=c';
const resource = () => description.properties.find((p) => p.name === 'resource');
const operations = (value) =>
	description.properties.find(
		(p) => p.name === 'operation' && p.displayOptions.show.resource.includes(value),
	);
const operation = (value) => operations('scraperApi').options.find((p) => p.value === value);
const parameters = (values, resourceName = 'scraperApi') =>
	NodeHelpers.getNodeParameters(
		description.properties,
		{ resource: resourceName, ...values },
		true,
		false,
		node,
		description,
	);
const field = (name, values) =>
	description.properties.find(
		(p) => p.name === name && NodeHelpers.displayParameter(values, p, node, description, values),
	);
const scraperOption = (name) =>
	description.properties.find((p) => p.name === 'options').options.find((p) => p.name === name);
const context = (values) => ({
	getNodeParameter(name, fallback) {
		const value = name.split('.').reduce((current, key) => current?.[key], values);
		if (value !== undefined) return value;
		if (arguments.length > 1) return fallback;
		throw new Error(`Unexpected parameter: ${name}`);
	},
	getNode: () => ({ name: 'MrScraper', type: 'n8n-nodes-mrscraper.mrscraper', typeVersion: 3 }),
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

/**
 * Build a request the way n8n-core's RoutingNode does: every displayed property is visited in
 * description order, the selected operation contributes its request, each routed parameter writes
 * its query field (undefined does not replace an existing value, as with lodash merge), and the
 * preSend actions run last. Undefined query values are not sent.
 */
async function routedRequest(values, resourceName = 'scraperApi') {
	const params = parameters(values, resourceName);
	const request = { options: { qs: {} }, preSend: [], postReceive: [] };
	const merge = (qs) => {
		for (const [key, value] of Object.entries(qs)) {
			if (value !== undefined || !(key in request.options.qs)) request.options.qs[key] = value;
		}
	};
	const visit = (property, path) => {
		if (!NodeHelpers.displayParameter(params, property, node, description, params)) return;
		const name = path ? `${path}.${property.name}` : property.name;
		const value =
			'type' in property ? context(params).getNodeParameter(name, undefined) : undefined;
		const routing = property.routing;
		if (routing?.request) {
			const { qs, ...rest } = routing.request;
			Object.assign(request.options, rest);
			if (qs) merge(qs);
		}
		if (routing?.send?.property) {
			const sent = routing.send.value ? resolve(routing.send.value, value) : value;
			merge({ [routing.send.property]: sent });
		}
		if (routing?.send?.preSend) request.preSend.push(...routing.send.preSend);
		if (routing?.output?.postReceive) request.postReceive.push(...routing.output.postReceive);
		if (property.type === 'options') {
			const selected = property.options.find((option) => option.value === value);
			if (selected) visit(selected, path);
		} else if (property.type === 'collection') {
			for (const option of property.options) if (value && option.name in value) visit(option, name);
		}
	};
	for (const property of description.properties) visit(property, '');
	let options = { ...request.options, qs: { ...request.options.qs } };
	for (const preSend of request.preSend) options = await preSend.call(context(params), options);
	const query = Object.entries(options.qs)
		.filter(([, value]) => value !== undefined && value !== null)
		.map(([key, value]) => [key, String(value)]);
	return { method: options.method, baseURL: options.baseURL, query, body: options.body, options };
}

// The query each operation sends with its defaults, in the order n8n builds it.
const HTML_DEFAULTS = [
	['html', 'true'],
	['markdown', 'false'],
	['timeout', '300'],
	['saveResult', 'true'],
	['maxAge', '0'],
	['blockResources', 'false'],
	['url', PAGE],
	['screenshot', 'false'],
	['warmStart', 'false'],
];
const MARKDOWN_DEFAULTS = [
	['markdown', 'true'],
	['html', 'false'],
	['screenshot', 'false'],
	['timeout', '300'],
	['saveResult', 'true'],
	['maxAge', '0'],
	['blockResources', 'false'],
	['url', PAGE],
	['warmStart', 'false'],
];
const SCREENSHOT_DEFAULTS = [
	['screenshot', 'full'],
	['html', 'false'],
	['markdown', 'false'],
	['browserRendering', 'true'],
	['timeout', '300'],
	['saveResult', 'true'],
	['maxAge', '0'],
	['url', PAGE],
];
const JSON_DEFAULTS = [
	['agent', 'general'],
	['html', 'true'],
	['screenshot', 'false'],
	['timeout', '300'],
	['saveResult', 'true'],
	['maxAge', '0'],
	['blockResources', 'false'],
	['url', PAGE],
	['warmStart', 'false'],
	['prompt', 'Extract all data as complete as possible.'],
];

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

test('Scrape HTML sends html=true and the documented defaults', async () => {
	const sent = await routedRequest({ operation: 'scrapeHtml', url: PAGE });
	assert.equal(sent.method, 'GET');
	assert.equal(sent.baseURL, 'https://api.mrscraper.com');
	assert.deepEqual(sent.query, HTML_DEFAULTS);
	assert.equal(operation('scrapeHtml').routing.request.headers.Accept, 'text/html');
});

test('Scrape HTML maps every documented option to its query field', async () => {
	const sent = await routedRequest({
		operation: 'scrapeHtml',
		url: PAGE,
		screenshot: 'custom',
		screenshotViewport: ' 1920x1080-75 ',
		browserRendering: false,
		warmStart: true,
		options: {
			action: ' analytics ',
			blockResources: true,
			geoCode: ' GB ',
			maxAge: 3600000,
			maxRetries: 0,
			saveResult: false,
			timeout: 330,
			tokenCap: 25,
			waitForSelector: ' .ready ',
		},
	});
	// Save Result and Token Cap are no longer options; values saved by 5.0 are not sent.
	assert.deepEqual(sent.query, [
		['html', 'true'],
		['markdown', 'false'],
		['timeout', '330'],
		['saveResult', 'true'],
		['maxAge', '3600000'],
		['blockResources', 'true'],
		['url', PAGE],
		['screenshot', '1920x1080-75'],
		['browserRendering', 'true'],
		['warmStart', 'true'],
		['action', 'analytics'],
		['geoCode', 'gb'],
		['maxRetries', '0'],
		['waitForSelector', '.ready'],
	]);
});

test('Scrape HTML screenshots accept full, top, and valid custom viewports only', async () => {
	assert.deepEqual(
		field('screenshot', parameters({ operation: 'scrapeHtml' })).options.map((p) => p.value),
		['custom', 'full', false, 'top'],
	);
	for (const screenshot of ['full', 'top']) {
		const sent = await routedRequest({ operation: 'scrapeHtml', url: PAGE, screenshot });
		assert.deepEqual(Object.fromEntries(sent.query).screenshot, screenshot);
	}
	for (const viewport of ['100x100', '3840x3840', '1280x800-25', '1280x800-300']) {
		const sent = await routedRequest({
			operation: 'scrapeHtml',
			url: PAGE,
			screenshot: 'custom',
			screenshotViewport: viewport,
		});
		assert.equal(Object.fromEntries(sent.query).screenshot, viewport);
	}
	for (const viewport of ['', '99x800', '1280x3841', '1280x800-24', '1280x800-301', 'top-ish']) {
		await assert.rejects(
			routedRequest({
				operation: 'scrapeHtml',
				url: PAGE,
				screenshot: 'custom',
				screenshotViewport: viewport,
			}),
			/Viewport must be WIDTHxHEIGHT/,
			viewport,
		);
	}
	assert.equal(
		'screenshotViewport' in parameters({ operation: 'scrapeHtml', screenshot: 'full' }),
		false,
	);
});

test('a Scrape HTML screenshot sends browserRendering=true whatever Browser Rendering is set to', async () => {
	const captures = [
		{ screenshot: 'full' },
		{ screenshot: 'top' },
		{ screenshot: 'custom', screenshotViewport: '1280x800' },
	];
	for (const capture of captures) {
		for (const browserRendering of ['auto', true, false]) {
			const sent = await routedRequest({
				operation: 'scrapeHtml',
				url: PAGE,
				browserRendering,
				...capture,
			});
			const query = Object.fromEntries(sent.query);
			assert.equal(
				query.browserRendering,
				'true',
				`${JSON.stringify(capture)} ${browserRendering}`,
			);
			assert.equal(query.screenshot, capture.screenshotViewport ?? capture.screenshot);
		}
	}
	// Without a screenshot, Browser Rendering is sent as selected and omitted on Auto.
	for (const [browserRendering, expected] of [
		['auto', undefined],
		[true, 'true'],
		[false, 'false'],
	]) {
		const sent = await routedRequest({ operation: 'scrapeHtml', url: PAGE, browserRendering });
		const query = Object.fromEntries(sent.query);
		assert.equal(query.browserRendering, expected);
		assert.equal(query.screenshot, 'false');
	}
	// Scrape JSON's screenshot flag does not change browser rendering.
	for (const [browserRendering, expected] of [
		['auto', undefined],
		[false, 'false'],
	]) {
		const sent = await routedRequest({
			operation: 'scrapeJson',
			url: PAGE,
			browserRendering,
			options: { screenshot: true },
		});
		const query = Object.fromEntries(sent.query);
		assert.equal(query.screenshot, 'true');
		assert.equal(query.browserRendering, expected);
	}
});

test('HTML output keeps raw text and parses the JSON returned with a screenshot', async () => {
	const [htmlOutput] = operation('scrapeHtml').routing.output.postReceive;
	const html = '<h1>Example & test</h1>';
	assert.deepEqual(
		await htmlOutput([], { body: html, headers: { 'content-type': 'text/html; charset=utf-8' } }),
		[{ json: { html } }],
	);
	const body = JSON.stringify({ html, screenshot: 'iVBORw0KGgo=' });
	assert.deepEqual(
		await htmlOutput([], {
			body,
			headers: { 'content-type': 'application/json; charset=utf-8' },
		}),
		[{ json: { html, screenshot: 'iVBORw0KGgo=' } }],
	);
});

test('Scrape Markdown sends markdown=true with html=false and screenshot=false', async () => {
	const sent = await routedRequest({ operation: 'scrapeMarkdown', url: PAGE });
	assert.deepEqual(sent.query, MARKDOWN_DEFAULTS);
	const withOptions = await routedRequest({
		operation: 'scrapeMarkdown',
		url: PAGE,
		browserRendering: false,
		options: { blockResources: true, action: 'docs', geoCode: 'ID' },
	});
	assert.deepEqual(withOptions.query, [
		['markdown', 'true'],
		['html', 'false'],
		['screenshot', 'false'],
		['timeout', '300'],
		['saveResult', 'true'],
		['maxAge', '0'],
		['blockResources', 'true'],
		['url', PAGE],
		['browserRendering', 'false'],
		['warmStart', 'false'],
		['action', 'docs'],
		['geoCode', 'id'],
	]);
	const [markdownOutput] = operation('scrapeMarkdown').routing.output.postReceive;
	assert.deepEqual(await markdownOutput([], { body: '# Example' }), [
		{ json: { markdown: '# Example' } },
	]);
});

test('Get Screenshot always sends screenshot=full, html=false, markdown=false, and browserRendering=true', async () => {
	const values = parameters({ operation: 'getScreenshot' });
	for (const name of ['screenshot', 'screenshotViewport', 'browserRendering', 'warmStart']) {
		assert.equal(name in values, false, `${name} is not a Get Screenshot field`);
	}
	assert.deepEqual(
		(await routedRequest({ operation: 'getScreenshot', url: PAGE })).query,
		SCREENSHOT_DEFAULTS,
	);
	const sent = await routedRequest({
		operation: 'getScreenshot',
		url: PAGE,
		options: {
			geoCode: 'de',
			maxAge: 86400000,
			maxRetries: 1,
			saveResult: false,
			timeout: 120,
			tokenCap: 10,
			waitForSelector: '#results',
		},
	});
	assert.deepEqual(sent.query, [
		['screenshot', 'full'],
		['html', 'false'],
		['markdown', 'false'],
		['browserRendering', 'true'],
		['timeout', '120'],
		['saveResult', 'true'],
		['maxAge', '86400000'],
		['url', PAGE],
		['geoCode', 'de'],
		['maxRetries', '1'],
		['waitForSelector', '#results'],
	]);
});

test('Options appear only for the operations the reference lists them for', () => {
	const shown = (operationName) => {
		const values = parameters({ operation: operationName });
		return field('options', values)
			.options.filter((option) =>
				NodeHelpers.displayParameter(values, option, node, description, values),
			)
			.map((option) => option.name);
	};
	assert.deepEqual(shown('scrapeHtml'), [
		'action',
		'blockResources',
		'geoCode',
		'maxAge',
		'maxRetries',
		'timeout',
		'waitForSelector',
	]);
	assert.deepEqual(shown('scrapeMarkdown'), shown('scrapeHtml'));
	assert.deepEqual(shown('getScreenshot'), [
		'geoCode',
		'maxAge',
		'maxRetries',
		'timeout',
		'waitForSelector',
	]);
	assert.deepEqual(shown('scrapeJson'), [
		'blockResources',
		'geoCode',
		'maxAge',
		'maxRetries',
		'html',
		'screenshot',
		'timeout',
		'waitForSelector',
	]);
	assert.deepEqual(shown('scrapeBrand'), ['geoCode', 'timeout']);
	assert.equal(scraperOption('timeout').typeOptions.maxValue, 330);
	assert.deepEqual(scraperOption('maxAge').typeOptions, {
		minValue: 0,
		maxValue: 604800000,
		numberPrecision: 0,
	});
	assert.equal(scraperOption('html').default, true);
});

test('Browser Rendering is omitted on Auto and keeps 5.0.0 true and false values', async () => {
	for (const operationName of ['scrapeHtml', 'scrapeMarkdown', 'scrapeJson']) {
		const values = parameters({ operation: operationName });
		assert.equal(values.browserRendering, 'auto');
		assert.deepEqual(
			field('browserRendering', values).options.map((p) => p.value),
			['auto', false, true],
		);
		for (const [browserRendering, expected] of [
			['auto', undefined],
			[true, 'true'],
			[false, 'false'],
		]) {
			const sent = await routedRequest({
				operation: operationName,
				url: PAGE,
				prompt: 'Extract name',
				browserRendering,
			});
			assert.equal(Object.fromEntries(sent.query).browserRendering, expected);
		}
	}
});

test('JSON extraction is a GET with url, prompt, and agent in the query and validates schemas', async () => {
	assert.deepEqual(operation('scrapeJson').routing.request, {
		baseURL: 'https://api.mrscraper.com',
		url: '/',
		method: 'GET',
		qs: {
			agent: 'general',
			html: true,
			screenshot: false,
			timeout: 300,
			saveResult: true,
			maxAge: 0,
			blockResources: false,
		},
	});
	const sent = await routedRequest({ operation: 'scrapeJson', url: PAGE });
	assert.equal(sent.method, 'GET');
	assert.deepEqual(sent.query, JSON_DEFAULTS);
	assert.deepEqual(sent.body, undefined);
	const withOptions = await routedRequest({
		operation: 'scrapeJson',
		url: PAGE,
		prompt: 'Extract name',
		browserRendering: true,
		warmStart: true,
		options: { html: false, screenshot: true, waitForSelector: 'body', blockResources: true },
	});
	assert.deepEqual(withOptions.query, [
		['agent', 'general'],
		['html', 'false'],
		['screenshot', 'true'],
		['timeout', '300'],
		['saveResult', 'true'],
		['maxAge', '0'],
		['blockResources', 'true'],
		['url', PAGE],
		['browserRendering', 'true'],
		['warmStart', 'true'],
		['waitForSelector', 'body'],
		['prompt', 'Extract name'],
	]);
	for (const outputSchema of ['{"name":"string"}', { name: 'string' }]) {
		const withSchema = await routedRequest({
			operation: 'scrapeJson',
			url: PAGE,
			prompt: 'Extract name',
			outputSchema,
		});
		assert.equal(withSchema.method, 'GET');
		assert.equal(
			Object.fromEntries(withSchema.query).prompt,
			'Extract name\n\nJson Schema:\n{"name":"string"}',
		);
	}
	await assert.rejects(
		routedRequest({ operation: 'scrapeJson', url: PAGE, outputSchema: '{invalid' }),
		/Expected Output Schema must be valid JSON/,
	);
});

test('JSON extraction switches to POST only when the encoded GET URL exceeds 8,000 characters', async () => {
	const send = (prompt) => routedRequest({ operation: 'scrapeJson', url: PAGE, prompt });
	const getUrl = new URL('https://api.mrscraper.com/');
	for (const [name, value] of JSON_DEFAULTS)
		getUrl.searchParams.set(name, name === 'prompt' ? '' : value);
	const longest = 'x'.repeat(8000 - getUrl.href.length);

	const atLimit = await send(longest);
	assert.equal(atLimit.method, 'GET');
	assert.equal(Object.fromEntries(atLimit.query).prompt, longest);

	// One more character, or a shorter prompt that is longer once encoded, moves to a POST body.
	for (const prompt of [`${longest}x`, 'é'.repeat(2000)]) {
		const overLimit = await send(prompt);
		assert.equal(overLimit.method, 'POST');
		assert.deepEqual(overLimit.body, { url: PAGE, prompt, agent: 'general' });
		assert.deepEqual(
			overLimit.query,
			JSON_DEFAULTS.filter(([name]) => !['agent', 'url', 'prompt'].includes(name)),
		);
	}
});

test('invalid ranges and formats fail before a request is sent', async () => {
	const cases = [
		[{ timeout: 331 }, /Timeout must be an integer from 1 to 330/],
		[{ timeout: '={{ 0 }}' }, /Timeout must be an integer from 1 to 330/],
		[{ maxAge: 604800001 }, /Max Age must be an integer from 0 to 604800000/],
		[{ maxAge: 1.5 }, /Max Age must be an integer/],
		[{ maxRetries: -1 }, /Max Retries must be an integer from 0/],
		[{ geoCode: 'usa' }, /Geo Code must be a two-letter country code/],
		[{ waitForSelector: 'a'.repeat(501) }, /Wait for Selector must be at most 500 characters/],
	];
	for (const operationName of ['scrapeHtml', 'scrapeMarkdown', 'getScreenshot', 'scrapeJson']) {
		for (const [options, message] of cases) {
			const values = { operation: operationName, url: PAGE, options };
			if (typeof options.timeout === 'string') values.options = { timeout: 0 };
			await assert.rejects(
				routedRequest(values),
				message,
				`${operationName} ${JSON.stringify(options)}`,
			);
		}
	}
	// Numeric strings from expressions are accepted and sent as numbers.
	const sent = await routedRequest({
		operation: 'scrapeHtml',
		url: PAGE,
		options: { timeout: '120', maxAge: '0' },
	});
	assert.equal(Object.fromEntries(sent.query).timeout, '120');
});

test('removed fields are gone: no token query parameter, Save Result, or Token Cap', () => {
	const names = new Set();
	const collect = (properties) => {
		for (const property of properties) {
			names.add(property.name);
			if (property.type === 'collection') collect(property.options);
		}
	};
	collect(description.properties);
	for (const removed of [
		'super',
		'proxyCountry',
		'proxy',
		'returnCookie',
		'waitUntil',
		'screenshotMode',
		'saveResult',
		'tokenCap',
	]) {
		assert.equal(names.has(removed), false, removed);
	}
	for (const option of operations('scraperApi').options) {
		assert.equal(option.routing.request.qs.token, undefined, option.value);
		assert.equal(option.routing.request.qs.tokenCap, undefined, option.value);
	}
	// Every page operation always saves its result.
	for (const name of ['scrapeHtml', 'scrapeMarkdown', 'getScreenshot', 'scrapeJson']) {
		assert.equal(operation(name).routing.request.qs.saveResult, true, name);
	}
	assert.equal(operation('scrapeBrand').routing.request.qs.saveResult, undefined);
	assert.equal(operations('discovery').options[0].routing.request.qs.token, undefined);
});

test('Web Search is a GET with the action, a trimmed query, an optional country, and 10 to 100 results', async () => {
	const values = parameters({ operation: 'webSearch' }, 'discovery');
	assert.deepEqual(values, {
		resource: 'discovery',
		operation: 'webSearch',
		query: '',
		country: '',
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
	assert.equal(field('country', values).required, undefined);
	assert.deepEqual(field('numResults', values).typeOptions, {
		minValue: 10,
		maxValue: 100,
		numberPrecision: 0,
	});
	const search = (extra) =>
		routedRequest({ operation: 'webSearch', query: '  best hotels  ', ...extra }, 'discovery');
	assert.deepEqual((await search({})).query, [
		['action', 'websearch'],
		['query', 'best hotels'],
		['numResults', '10'],
	]);
	assert.deepEqual((await search({ country: ' GB ', numResults: 20 })).query, [
		['action', 'websearch'],
		['query', 'best hotels'],
		['country', 'gb'],
		['numResults', '20'],
	]);
	assert.deepEqual((await search({ country: '   ' })).query, [
		['action', 'websearch'],
		['query', 'best hotels'],
		['numResults', '10'],
	]);
});

test('Scrape Brand is a GET with fixed action and bundle and no body', () => {
	const values = parameters({ operation: 'scrapeBrand', url: 'https://books.toscrape.com/' });
	assert.deepEqual(Object.keys(values).sort(), [
		'operation',
		'options',
		'resource',
		'url',
		'warmStart',
	]);
	for (const name of ['browserRendering', 'screenshot', 'prompt']) {
		assert.equal(name in values, false, `${name} is not a Scrape Brand field`);
	}
	const route = operation('scrapeBrand').routing;
	assert.deepEqual(route.request, {
		baseURL: 'https://api.mrscraper.com',
		url: '/',
		method: 'GET',
		qs: { action: 'brand-scraping', bundle: 'none' },
	});
	assert.equal(route.request.qs.token, undefined);
	assert.equal(route.send.preSend.length, 1);
	assert.equal(route.output, undefined);
	assert.deepEqual(field('url', values).routing.send, { type: 'query', property: 'url' });
	assert.deepEqual(
		field('options', values).options.map((option) => option.name),
		['geoCode', 'timeout'],
	);
});

test('Scrape Brand sends action, url, bundle, timeout when set, warmStart, and geoCode when set', async () => {
	const url = 'https://books.toscrape.com/';
	assert.deepEqual((await routedRequest({ operation: 'scrapeBrand', url })).query, [
		['action', 'brand-scraping'],
		['url', url],
		['bundle', 'none'],
		['warmStart', 'false'],
	]);
	const sent = await routedRequest({
		operation: 'scrapeBrand',
		url,
		warmStart: true,
		options: { timeout: 120, geoCode: ' GB ' },
	});
	assert.deepEqual(sent.query, [
		['action', 'brand-scraping'],
		['url', url],
		['bundle', 'none'],
		['timeout', '120'],
		['warmStart', 'true'],
		['geoCode', 'gb'],
	]);
	assert.deepEqual(
		(await routedRequest({ operation: 'scrapeBrand', url, options: { geoCode: 'id' } })).query,
		[
			['action', 'brand-scraping'],
			['url', url],
			['bundle', 'none'],
			['warmStart', 'false'],
			['geoCode', 'id'],
		],
	);
	for (const [options, message] of [
		[{ timeout: 331 }, /Timeout must be an integer from 1 to 330/],
		[{ timeout: 0 }, /Timeout must be an integer from 1 to 330/],
		[{ geoCode: 'usa' }, /Geo Code must be a two-letter country code/],
	]) {
		await assert.rejects(routedRequest({ operation: 'scrapeBrand', url, options }), message);
	}
});
