import type { INodeProperties } from 'n8n-workflow';
import { createPromptBasedScraperDescription } from './createPromptBasedScraper';
import { createListingScraperDescription } from './createListingScraper';
import { createWebsiteCrawlScraperDescription } from './createWebsiteCrawlScraper';

const showOnlyForAdvanceChat = {
    resource: ['createScraper'],
};

export const scraperCreationDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForAdvanceChat,
        },
        options: [
            {
                name: 'Create Prompt-Based Scraper',
                value: 'generalAgent',
                action: 'Create prompt based scraper',
                description: 'Create an AI scraper from a URL, extraction prompt, and expected JSON output schema',
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
                name: 'Create Listing Scraper',
                value: 'listingAgent',
                action: 'Create listing scraper',
                description: 'Create an AI scraper for repeated listing data using a prompt and expected JSON output schema',
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
                name: 'Create Website Crawl Scraper',
                value: 'mapAgent',
                action: 'Create website crawl scraper',
                description: 'Create a scraper that discovers URLs by crawling a website',
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
        ],
        default: 'generalAgent',
    },
    ...createPromptBasedScraperDescription,
    ...createListingScraperDescription,
    ...createWebsiteCrawlScraperDescription,
];
