import type { INodeProperties } from 'n8n-workflow';
import { advanceChatGeneralAgentDescription } from './generalAgent';
import { advanceChatListingAgentDescription } from './listingAgent';
import { advanceChatMapAgentDescription } from './mapAgent';
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
                name: 'Crawl Website Sitemap',
                value: 'mapAgent',
                action: 'Crawl website sitemap',
                description: 'Crawl a website sitemap and extract all URLs up to a limit',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai',
                    },
                    send: {
                        type: 'body',
                        property: 'graph',
                        value: 'map',
                    },
                },
            },
            {
                name: 'Scrape Dynamic Content by Prompt',
                value: 'generalAgent',
                action: 'Scrape dynamic content by prompt',
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
                name: 'Scrape Search Results',
                value: 'listingAgent',
                action: 'Scrape search results',
                description:
                    'Create a listing agent (AI) scraper at Mrscraper platform using input link and message',
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
                name: 'Scrape Paginated Content',
                value: 'listingAgentPaginated',
                action: 'Scrape paginated content',
                description:
                    'Create a listing agent (AI) scraper at Mrscraper that scrapes paginated content with max pages to scrape',
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
                name: 'Scrape Structured Data',
                value: 'scrapeStructuredData',
                action: 'Scrape structured data',
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
                name: 'Scrape Web Page',
                value: 'fetchHTML',
                action: 'Scrape web page',
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
    ...advanceChatMapAgentDescription,
    ...advanceChatGeneralAgentDescription,
    ...advanceChatListingAgentDescription,
    ...advanceChatListingAgentPaginatedDescription,
    ...scrapingStructuredDataDescription,
    ...webUnblockerFetchHTMLDescription,
];
