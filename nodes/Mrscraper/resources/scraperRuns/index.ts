import type { INodeProperties } from 'n8n-workflow';

const showOnlyForScraperRuns = {
	resource: ['rerun'],
};

const showForSingleRun = {
	resource: ['rerun'],
	operation: ['runExisting'],
};

const showForBatchRun = {
	resource: ['rerun'],
	operation: ['runExistingBatch'],
};

const showForAnyRun = {
	resource: ['rerun'],
	operation: ['runExisting', 'runExistingBatch'],
};

const showForSingleAiRun = {
	resource: ['rerun'],
	operation: ['runExisting'],
	scraperType: ['ai'],
};

const showForSingleManualRun = {
	resource: ['rerun'],
	operation: ['runExisting'],
	scraperType: ['manual'],
};

const showForSingleAiListingRun = {
	resource: ['rerun'],
	operation: ['runExisting'],
	scraperType: ['ai'],
	agentType: ['listing'],
};

const showForSingleAiGeneralRun = {
	resource: ['rerun'],
	operation: ['runExisting'],
	scraperType: ['ai'],
	agentType: ['general'],
};

const showForSingleAiMapRun = {
	resource: ['rerun'],
	operation: ['runExisting'],
	scraperType: ['ai'],
	agentType: ['map'],
};

export const scraperRunsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForScraperRuns,
		},
		options: [
			{
				name: 'Run Existing Scraper',
				value: 'runExisting',
				action: 'Run existing scraper',
				description: 'Run one URL with an existing AI or manual scraper',
				routing: {
					request: {
						method: 'POST',
						url: '={{ $parameter.scraperType === "manual" ? "/api/v1/scrapers-manual-rerun" : "/api/v1/scrapers-ai-rerun" }}',
					},
				},
			},
			{
				name: 'Run Existing Scraper in Batch',
				value: 'runExistingBatch',
				action: 'Run existing scraper in batch',
				description: 'Run multiple URLs with an existing AI or manual scraper',
				routing: {
					request: {
						method: 'POST',
						url: '={{ $parameter.scraperType === "manual" ? "/api/v1/scrapers-manual-rerun/bulk" : "/api/v1/scrapers-ai-rerun/bulk" }}',
					},
				},
			},
		],
		default: 'runExisting',
	},
	{
		displayName: 'Scraper Type',
		name: 'scraperType',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showForAnyRun,
		},
		options: [
			{
				name: 'AI',
				value: 'ai',
				description: 'Use a scraper created with an AI agent',
			},
			{
				name: 'Manual',
				value: 'manual',
				description: 'Use a scraper created with manual selectors',
			},
		],
		default: 'ai',
		description: 'Select the scraper type so the request is sent to the correct API endpoint',
	},
	{
		displayName: 'Agent Type',
		name: 'agentType',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showForSingleAiRun,
		},
		options: [
			{
				name: 'General',
				value: 'general',
				description: 'General-purpose agent for prompt-based page extraction',
			},
			{
				name: 'Listing',
				value: 'listing',
				description: 'Agent specialized for listings and paginated content',
			},
			{
				name: 'Map',
				value: 'map',
				description: 'Agent for crawling a website and discovering URLs',
			},
		],
		default: 'general',
		description: 'Select the AI agent type to display its run settings',
	},
	{
		displayName: 'Scraper ID',
		name: 'scraperId',
		type: 'string',
		default: '',
		placeholder: 'e.g. cm123abc456',
		required: true,
		displayOptions: {
			show: showForAnyRun,
		},
		description: 'ID of the existing scraper, available from the scraper detail page',
		routing: {
			send: {
				type: 'body',
				property: 'scraperId',
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		placeholder: 'https://example.com/products/123',
		required: true,
		displayOptions: {
			show: showForSingleRun,
		},
		description: 'Full URL to process in this scraper run',
		routing: {
			send: {
				type: 'body',
				property: 'url',
			},
		},
	},
	{
		displayName: 'Max Retry',
		name: 'maxRetry',
		type: 'number',
		default: 3,
		typeOptions: {
			minValue: 0,
		},
		displayOptions: {
			show: showForSingleRun,
		},
		description: 'Maximum retry attempts if the run fails, for example 3',
		routing: {
			send: {
				type: 'body',
				property: 'maxRetry',
			},
		},
	},
	{
		displayName: 'Proxy Country',
		name: 'proxyCountry',
		type: 'string',
		default: '',
		placeholder: 'e.g. us',
		displayOptions: {
			show: showForSingleRun,
		},
		description: 'Proxy country code, for example us or uk',
		routing: {
			send: {
				type: 'body',
				property: 'proxyCountry',
				value: '={{ $value || undefined }}',
			},
		},
	},
	{
		displayName: 'Max Pages',
		name: 'maxPages',
		type: 'number',
		default: 5,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showForSingleAiListingRun,
		},
		description: 'Maximum pagination pages to scrape, for example 5',
		routing: {
			send: {
				type: 'body',
				property: 'maxPages',
			},
		},
	},
	{
		displayName: 'Timeout',
		name: 'timeout',
		type: 'number',
		default: 300,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showForSingleAiListingRun,
		},
		description: 'Maximum seconds to wait for the listing run, for example 300',
		routing: {
			send: {
				type: 'body',
				property: 'timeout',
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showForSingleAiGeneralRun,
		},
		options: [
			{
				displayName: 'Bypass Proxy',
				name: 'bypassProxy',
				type: 'boolean',
				default: false,
				description:
					'Whether to block images, fonts, and stylesheets from loading to speed up scraping and reduce bandwidth usage',
				routing: {
					send: {
						type: 'body',
						property: 'bypassProxy',
					},
				},
			},
			{
				displayName: 'HTML',
				name: 'html',
				type: 'boolean',
				default: false,
				description: 'Whether to include HTML in the scraper result',
				routing: {
					send: {
						type: 'body',
						property: 'html',
					},
				},
			},
			{
				displayName: 'Markdown',
				name: 'markdown',
				type: 'boolean',
				default: false,
				description: 'Whether to include Markdown in the scraper result',
				routing: {
					send: {
						type: 'body',
						property: 'markdown',
					},
				},
			},
			{
				displayName: 'Render JavaScript',
				name: 'renderJavascript',
				type: 'boolean',
				default: false,
				description: 'Whether to render JavaScript before extracting content',
				routing: {
					send: {
						type: 'body',
						property: 'renderJavascript',
					},
				},
			},
			{
				displayName: 'Return Cookies',
				name: 'returnCookies',
				type: 'boolean',
				default: false,
				description: 'Whether to include browser cookies in the run result',
				routing: {
					send: {
						type: 'body',
						property: 'returnCookies',
					},
				},
			},
			{
				displayName: 'Screenshot',
				name: 'screenshot',
				type: 'boolean',
				default: false,
				description: 'Whether to capture a screenshot while running the scraper',
				routing: {
					send: {
						type: 'body',
						property: 'screenshot',
					},
				},
			},
			{
				displayName: 'Use Home Page',
				name: 'useHomePage',
				type: 'boolean',
				default: false,
				description: "Whether to first visit the website's home page before the target URL. This can improve the success rate on some websites, but increases latency, so only enable it if the scraper is blocked.",
				routing: {
					send: {
						type: 'body',
						property: 'useHomePage',
					},
				},
			},
			{
				displayName: 'Wait for Selector',
				name: 'waitForSelector',
				type: 'string',
				default: '',
				placeholder: '#product-list or .search-results',
				description: 'Optional CSS selector to wait for before extraction',
				routing: {
					send: {
						type: 'body',
						property: 'waitForSelector',
						value: '={{ $value || undefined }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showForSingleAiListingRun,
		},
		options: [
			{
				displayName: 'Bypass Proxy',
				name: 'bypassProxy',
				type: 'boolean',
				default: false,
				description:
					'Whether to block images, fonts, and stylesheets from loading to speed up scraping and reduce bandwidth usage',
				routing: {
					send: {
						type: 'body',
						property: 'bypassProxy',
					},
				},
			},
			{
				displayName: 'HTML',
				name: 'html',
				type: 'boolean',
				default: false,
				description: 'Whether to include HTML in the scraper result',
				routing: {
					send: {
						type: 'body',
						property: 'html',
					},
				},
			},
			{
				displayName: 'Markdown',
				name: 'markdown',
				type: 'boolean',
				default: false,
				description: 'Whether to include Markdown in the scraper result',
				routing: {
					send: {
						type: 'body',
						property: 'markdown',
					},
				},
			},
			{
				displayName: 'Render JavaScript',
				name: 'renderJavascript',
				type: 'boolean',
				default: false,
				description: 'Whether to render JavaScript before extracting content',
				routing: {
					send: {
						type: 'body',
						property: 'renderJavascript',
					},
				},
			},
			{
				displayName: 'Return Cookies',
				name: 'returnCookies',
				type: 'boolean',
				default: false,
				description: 'Whether to include browser cookies in the run result',
				routing: {
					send: {
						type: 'body',
						property: 'returnCookies',
					},
				},
			},
			{
				displayName: 'Screenshot',
				name: 'screenshot',
				type: 'boolean',
				default: false,
				description: 'Whether to capture a screenshot while running the scraper',
				routing: {
					send: {
						type: 'body',
						property: 'screenshot',
					},
				},
			},
			{
				displayName: 'Stream',
				name: 'stream',
				type: 'boolean',
				default: false,
				description: 'Whether to stream listing extraction results as they become available',
				routing: {
					send: {
						type: 'body',
						property: 'stream',
					},
				},
			},
			{
				displayName: 'Use Home Page',
				name: 'useHomePage',
				type: 'boolean',
				default: false,
				description: "Whether to first visit the website's home page before the target URL. This can improve the success rate on some websites, but increases latency, so only enable it if the scraper is blocked.",
				routing: {
					send: {
						type: 'body',
						property: 'useHomePage',
					},
				},
			},
			{
				displayName: 'Wait for Selector',
				name: 'waitForSelector',
				type: 'string',
				default: '',
				placeholder: '#product-list or .search-results',
				description: 'Optional CSS selector to wait for before extraction',
				routing: {
					send: {
						type: 'body',
						property: 'waitForSelector',
						value: '={{ $value || undefined }}',
					},
				},
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showForSingleManualRun,
		},
		options: [
			{
				displayName: 'Bypass Proxy',
				name: 'bypassProxy',
				type: 'boolean',
				default: true,
				description:
					'Whether to block images, fonts, and stylesheets from loading to speed up scraping and reduce bandwidth usage',
				routing: {
					send: {
						type: 'body',
						property: 'bypassProxy',
					},
				},
			},
			{
				displayName: 'Cookie Jar',
				name: 'cookieJar',
				type: 'string',
				default: '',
				placeholder: 'my-session-cookie-jar',
				description: 'Optional cookie jar identifier or serialized cookie jar value',
				routing: {
					send: {
						type: 'body',
						property: 'cookieJar',
						value: '={{ $value || undefined }}',
					},
				},
			},
			{
				displayName: 'Cookies',
				name: 'cookies',
				type: 'json',
				default: '[]',
				placeholder:
					'[{"name":"session","value":"abc123","domain":"www.example.com"}]',
				description: 'JSON array of browser cookie objects to use for this run',
				routing: {
					send: {
						type: 'body',
						property: 'cookies',
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
			{
				displayName: 'Home Page',
				name: 'homePage',
				type: 'boolean',
				default: false,
				description: "Whether to first visit the website's home page before the target URL. This can improve the success rate on some websites, but increases latency, so only enable it if the scraper is blocked.",
				routing: {
					send: {
						type: 'body',
						property: 'homePage',
					},
				},
			},
			{
				displayName: 'Home Page Timeout',
				name: 'homePageTimeout',
				type: 'number',
				default: 10,
				typeOptions: {
					minValue: 1,
				},
				description: 'Maximum seconds to wait for the home page, for example 10',
				routing: {
					send: {
						type: 'body',
						property: 'homePageTimeout',
					},
				},
			},
			{
				displayName: 'HTML',
				name: 'html',
				type: 'boolean',
				default: false,
				description: 'Whether to include HTML in the scraper result',
				routing: {
					send: {
						type: 'body',
						property: 'html',
					},
				},
			},
			{
				displayName: 'Markdown',
				name: 'markdown',
				type: 'boolean',
				default: false,
				description: 'Whether to include Markdown in the scraper result',
				routing: {
					send: {
						type: 'body',
						property: 'markdown',
					},
				},
			},
			{
				displayName: 'Paginator',
				name: 'paginator',
				type: 'json',
				default: '{}',
				placeholder: '{"selector":"a.next","maxPages":5}',
				description: 'JSON object containing the manual scraper pagination configuration',
				routing: {
					send: {
						type: 'body',
						property: 'paginator',
						value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
					},
				},
			},
			{
				displayName: 'Proxy',
				name: 'proxy',
				type: 'string',
				default: '',
				placeholder: 'http://user:password@proxy.example.com:8080',
				description: 'Optional proxy URL used for this manual run',
				routing: {
					send: {
						type: 'body',
						property: 'proxy',
						value: '={{ $value || undefined }}',
					},
				},
			},
			{
				displayName: 'Record',
				name: 'record',
				type: 'boolean',
				default: false,
				description: 'Whether to record the browser session for this run',
				routing: {
					send: {
						type: 'body',
						property: 'record',
					},
				},
			},
			{
				displayName: 'Return Cookie',
				name: 'returnCookie',
				type: 'boolean',
				default: false,
				description: 'Whether to include browser cookies in the manual run result',
				routing: {
					send: {
						type: 'body',
						property: 'returnCookie',
					},
				},
			},
			{
				displayName: 'Screenshot',
				name: 'screenshot',
				type: 'boolean',
				default: false,
				description: 'Whether to capture a screenshot during the manual scraper run and return it as a Base64-encoded string',
				routing: {
					send: {
						type: 'body',
						property: 'screenshot',
						value: '={{ $value ? "true" : "false" }}',
					},
				},
			},
			{
				displayName: 'Stream',
				name: 'stream',
				type: 'boolean',
				default: false,
				description: 'Whether to stream results as they become available',
				routing: {
					send: {
						type: 'body',
						property: 'stream',
					},
				},
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 600,
				typeOptions: {
					minValue: 1,
				},
				description: 'Maximum seconds to wait for the manual run, for example 600',
				routing: {
					send: {
						type: 'body',
						property: 'timeout',
					},
				},
			},
			{
				displayName: 'Token Cap',
				name: 'tokenCap',
				type: 'number',
				default: 0,
				typeOptions: {
					minValue: 0,
				},
				description: 'Maximum token count for the result; use 0 for no explicit limit',
				routing: {
					send: {
						type: 'body',
						property: 'tokenCap',
					},
				},
			},
		],
	},
	{
		displayName: 'Max Depth',
		name: 'maxDepth',
		type: 'number',
		default: 2,
		typeOptions: {
			minValue: 0,
		},
		displayOptions: {
			show: showForSingleAiMapRun,
		},
		description: 'Maximum link depth to crawl from the starting URL, for example 2',
		routing: {
			send: {
				type: 'body',
				property: 'maxDepth',
			},
		},
	},
	{
		displayName: 'Max Pages',
		name: 'maxPages',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showForSingleAiMapRun,
		},
		description: 'Maximum pages to evaluate during URL discovery, for example 50',
		routing: {
			send: {
				type: 'body',
				property: 'maxPages',
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showForSingleAiMapRun,
		},
		description: 'Max number of results to return',
		routing: {
			send: {
				type: 'body',
				property: 'limit',
			},
		},
	},
	{
		displayName: 'Include Patterns',
		name: 'includePatterns',
		type: 'string',
		default: '',
		placeholder: '^https://www\\.example\\.com/blog/|^https://www\\.example\\.com/products/',
		displayOptions: {
			show: showForSingleAiMapRun,
		},
		description: 'Pipe-separated regular expressions for URLs to include',
		routing: {
			send: {
				type: 'body',
				property: 'includePatterns',
				value: '={{ $value || undefined }}',
			},
		},
	},
	{
		displayName: 'Exclude Patterns',
		name: 'excludePatterns',
		type: 'string',
		default: '',
		placeholder: '/login|/admin|\\?preview=true',
		displayOptions: {
			show: showForSingleAiMapRun,
		},
		description: 'Pipe-separated regular expressions for URLs to exclude',
		routing: {
			send: {
				type: 'body',
				property: 'excludePatterns',
				value: '={{ $value || undefined }}',
			},
		},
	},
	{
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		default: '',
		placeholder:
			'https://example.com/page-1, https://example.com/page-2\nor ["https://example.com/page-1", "https://example.com/page-2"]',
		required: true,
		displayOptions: {
			show: showForBatchRun,
		},
		description:
			'URLs as an array, a JSON array string, or a comma/newline-separated list. The value is normalized to an array before it is sent.',
		routing: {
			send: {
				type: 'body',
				property: 'urls',
				value:
					'={{ (Array.isArray($value) ? $value : (String($value).trim().startsWith("[") ? JSON.parse(String($value)) : String($value).split(/[,\\n]/))).map(url => String(url).trim()).filter(Boolean) }}',
			},
		},
	},
];
