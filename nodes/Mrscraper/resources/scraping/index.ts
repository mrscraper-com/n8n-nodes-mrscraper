import type { INodeProperties } from 'n8n-workflow';
import { advanceChatGeneralAgentDescription } from './generalAgent';
import { webUnblockerFetchHTMLDescription } from './fetchHTML';
import { scrapingStructuredDataDescription } from './structuredData';
import { advanceChatListingAgentPaginatedDescription } from './listingAgentPaginated';

const showOnlyForScraping = {
    resource: ['scraping'],
};

export const scrapingDescription: INodeProperties[] = [
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
                    'Listing agent on api.mrscraper.com: send URL, prompt, agent listing, and maxPages for paginated scrape',
                routing: {
                    request: {
                        method: 'POST',
                        baseURL: 'https://api.mrscraper.com',
                        url: '/',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        qs: {
                            token: '={{$credentials.apiToken}}',
                        },
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
                        method: 'GET',
                        baseURL: 'https://api.mrscraper.com',
                        url: '/',
                        qs: {
                            token: '={{$credentials.apiToken}}',
                            url: '={{$parameter.url}}',
                            timeout: '={{$parameter.timeout ?? 120}}',
                            geoCode: '={{$parameter.geoCode ?? "US"}}',
                            blockResources: '={{$parameter.blockResources ? "true" : "false"}}',
                        },
                    },
                },
            },
        ],
        default: 'fetchHTML',
    },
    ...advanceChatGeneralAgentDescription,
    ...advanceChatListingAgentPaginatedDescription,
    ...scrapingStructuredDataDescription,
    ...webUnblockerFetchHTMLDescription,
];
