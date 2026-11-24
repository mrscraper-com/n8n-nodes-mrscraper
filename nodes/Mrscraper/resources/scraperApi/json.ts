import { NodeOperationError, type IDataObject, type PreSendAction } from 'n8n-workflow';

export const preparePageRequest: PreSendAction = async function (requestOptions) {
	const operation = this.getNodeParameter('operation') as string;
	const supplied = (requestOptions.qs ?? {}) as IDataObject;
	const allowed = [
		'url',
		'html',
		'markdown',
		'screenshot',
		'browserRendering',
		'timeout',
		'warmStart',
		'blockResources',
		'waitForSelector',
		'geoCode',
		'maxAge',
		'maxRetries',
		'prompt',
		'agent',
	];
	const qs: IDataObject = Object.fromEntries(
		Object.entries(supplied).filter(([key, value]) => allowed.includes(key) && value !== undefined),
	);
	const fail = (message: string): never => {
		throw new NodeOperationError(this.getNode(), message);
	};
	const integer = (name: string, minimum: number, maximum = Number.MAX_SAFE_INTEGER) => {
		const value = qs[name];
		if (
			value !== undefined &&
			(!Number.isInteger(value) || Number(value) < minimum || Number(value) > maximum)
		)
			fail(`${name} must be an integer from ${minimum} to ${maximum}`);
	};
	try {
		const url = new URL(String(qs.url));
		if (!['http:', 'https:'].includes(url.protocol))
			fail('URL must be an absolute HTTP or HTTPS URL');
	} catch {
		fail('URL must be an absolute HTTP or HTTPS URL');
	}
	qs.timeout ??= 300;
	qs.maxAge ??= 0;
	qs.saveResult = true;
	integer('timeout', 1, 330);
	integer('maxAge', 0, 604800000);
	integer('maxRetries', 0);
	if (qs.browserRendering === 'none' || qs.browserRendering === 'auto') delete qs.browserRendering;
	else if (qs.browserRendering === 'true' || qs.browserRendering === 'false')
		qs.browserRendering = qs.browserRendering === 'true';
	if (operation !== 'getScreenshot') {
		qs.warmStart ??= false;
		qs.blockResources ??= false;
	} else {
		delete qs.warmStart;
		delete qs.blockResources;
	}
	for (const name of ['waitForSelector', 'geoCode']) {
		if (qs[name] === undefined) continue;
		qs[name] = String(qs[name]).trim();
		if (!qs[name]) delete qs[name];
	}
	if (String(qs.waitForSelector ?? '').length > 500)
		fail('Wait for Selector must be at most 500 characters');
	if (qs.geoCode !== undefined) {
		if (!/^[a-z]{2}$/i.test(String(qs.geoCode))) fail('Geo Code must be a two-letter country code');
		qs.geoCode = String(qs.geoCode).toLowerCase();
	}
	if (operation === 'scrapeJson') {
		let prompt = this.getNodeParameter('prompt') as string;
		if (!prompt.trim()) fail('Prompt must be a non-empty string');
		const outputSchema = this.getNodeParameter('outputSchema', '') as string | IDataObject;
		if (outputSchema) {
			let schema: unknown;
			try {
				schema = typeof outputSchema === 'string' ? JSON.parse(outputSchema) : outputSchema;
			} catch {
				fail('Expected Output Schema must be valid JSON');
			}
			prompt += `\n\nJson Schema:\n${JSON.stringify(schema)}`;
		}
		qs.prompt = prompt;
		qs.agent = 'general';
	} else if (operation === 'getScreenshot') {
		const capture = String(qs.screenshot);
		const match = /^(\d{3,4})x(\d{3,4})(?:-(\d{2,3}))?$/.exec(capture);
		if (
			!['full', 'top'].includes(capture) &&
			!(
				match &&
				Number(match[1]) >= 100 &&
				Number(match[1]) <= 3840 &&
				Number(match[2]) >= 100 &&
				Number(match[2]) <= 3840 &&
				Number(match[3] ?? 100) >= 25 &&
				Number(match[3] ?? 100) <= 300
			)
		)
			fail('Screenshot must be full, top, or WIDTHxHEIGHT[-ZOOM] (100–3840 pixels, 25–300% zoom)');
		qs.browserRendering = true;
	}
	if (operation !== 'getScreenshot' && typeof qs.screenshot !== 'boolean')
		fail('Screenshot must be true or false');
	requestOptions.timeout = (Number(qs.timeout) + 30) * 1000;
	requestOptions.method = 'GET';
	delete requestOptions.body;
	const encoded = Object.entries(qs)
		.map(
			([key, value]) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(String(value)).replace(/%20/g, '+')}`,
		)
		.join('&');
	if (operation === 'scrapeJson' && `https://api.mrscraper.com?${encoded}`.length > 8000) {
		requestOptions.method = 'POST';
		requestOptions.body = { url: qs.url, prompt: qs.prompt, agent: qs.agent };
		for (const key of ['url', 'prompt', 'agent']) delete qs[key];
	}
	requestOptions.qs = qs;
	return requestOptions;
};
