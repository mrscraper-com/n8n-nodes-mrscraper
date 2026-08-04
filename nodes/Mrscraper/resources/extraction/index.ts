import type { INodeProperties } from 'n8n-workflow';
import { extractPageByPromptDescription } from './extractPageByPrompt';
import { fetchRenderedHtmlDescription } from './fetchRenderedHtml';
import { extractStructuredDataDescription } from './extractStructuredData';
import { extractListingsAndPaginatedContentDescription } from './extractListingsAndPaginatedContent';

const showOnlyForScraping = {
    resource: ['scraping'],
};

export const extractionDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForScraping,
        },
        options: [
            {
                name: 'Extract Page by Prompt',
                value: 'generalAgent',
                action: 'Extract page by prompt',
                description:
                    'Create a General Agent (AI) scraper at Mrscraper platform using input link and Prompt to instruct the agent on what data to extract',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai',
                    },
                    send: {
                        type: 'body',
                        property: 'graph',
                        value: 'general',
                    },
                },
            },
            {
                name: 'Extract Listings and Paginated Content',
                value: 'listingAgentPaginated',
                action: 'Extract listings and paginated content',
                description:
                    'Create a listing scraper through the same AI scraper API used by Create Listing Scraper, with an optional page limit',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai',
                    },
                    send: {
                        type: 'body',
                        property: 'graph',
                        value: 'listing',
                    },
                },
            },
            {
                name: 'Extract Structured Data',
                value: 'scrapeStructuredData',
                action: 'Extract structured data',
                description:
                    'Create a General Agent (AI) scraper with a preset schema by category (article, product, hotel, etc.). The prompt is chosen from the selected category.',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai',
                    },
                    send: {
                        type: 'body',
                        property: 'graph',
                        value: 'general',
                    },
                },
            },
            {
                name: 'Fetch Rendered HTML',
                value: 'fetchHTML',
                action: 'Fetch rendered HTML',
                description:
                    'Fetch the rendered HTML of a page via the MrScraper stealth browser (JavaScript, bot evasion, optional geo proxy)',
                routing: {
                    request: {
                        method: 'POST',
                        baseURL: 'https://api.mrscraper.com',
                        url: '/',
                        qs: {
                            token: '={{$credentials.apiToken}}',
                            blockResources: '={{$parameter.blockResources ? "true" : "false"}}',
                            browserRendering: '={{$parameter.browserRendering ? "true" : "false"}}',
                            waitUntil: '={{$parameter.waitUntil ?? "domcontentloaded"}}',
                            timeout: '={{$parameter.timeout ?? 300}}',
                            geoCode: '={{$parameter.geoCode ?? "us"}}',
                            html: '={{$parameter.html ? "true" : "false"}}',
                            markdown: '={{$parameter.markdown ? "true" : "false"}}',
                            screenshot: '={{$parameter.screenshot ?? "full"}}',
                            super: '={{$parameter.super ? "true" : "false"}}',
                            returnCookie: '={{$parameter.returnCookie ? "true" : "false"}}',
                            proxyCountry: '={{$parameter.proxyCountry ?? "us"}}',
                        },
                    },
                },
            },
        ],
        default: 'fetchHTML',
    },
    ...extractPageByPromptDescription,
    ...extractListingsAndPaginatedContentDescription,
    ...extractStructuredDataDescription,
    ...fetchRenderedHtmlDescription,
];
