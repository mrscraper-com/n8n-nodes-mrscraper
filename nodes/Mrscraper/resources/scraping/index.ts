import type { INodeProperties } from 'n8n-workflow';
import { scrapingManualDescription } from './manual';
import { scrapingGeneralAgentDescription } from './generalAgent';
import { scrapingListingAgentDescription } from './listingAgent';
import { scrapingMapAgentDescription } from './mapAgent';
import { scrapingBulkAIScrapeDescription } from './bulkAIScrape';
import { scrapingBulkManualDescription } from './bulkManualScrape';

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
                name: 'Batch Scrape Multiple URLs (AI)',
                value: 'bulkAIScrape',
                action: 'Batch scrape multiple ur ls ai',
                description: 'Use an AI scraper you created in the app. Input a list of URLs; all are run in one batch (parallel on the server). Provide scraper ID and URLs.',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai-rerun/bulk',
                    },
                },
            },
            {
                name: 'Batch Scrape Multiple URLs (Manual)',
                value: 'bulkManualScrape',
                action: 'Batch scrape multiple ur ls manual',
                description: 'Use a manual scraper you created in the app. Input a list of URLs; all are run in one batch (parallel on the server). Provide scraper ID and URLs.',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-manual-rerun/bulk',
                    },
                },
            },
            {
                name: 'Crawl Website Sitemap',
                value: 'mapAgent',
                action: 'Crawl website sitemap',
                description: 'Rerun a Map Agent scraper you created (e.g at app.mrscraper.com/scrapers/form). Provide the scraper ID and one URL to get the result.',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai-rerun',
                    },
                },
            },
            {
                name: 'Scrape Listing or Search Page Returns Structured Data (AI)',
                value: 'listingAgent',
                action: 'Scrape listing or search page returns structured data (AI)',
                description: 'Rerun a Listing Agent scraper you created (e.g at app.mrscraper.com/scrapers/form). Provide the scraper ID and one URL to get the result.',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai-rerun',
                    },
                },
            },
            {
                name: 'Scrape Website Returns Structured Data (AI)',
                value: 'generalAgent',
                action: 'Scrape website returns structured data (AI)',
                description: 'Rerun a General Agent scraper you created (e.g at app.mrscraper.com/scrapers/form). Provide the scraper ID and one URL to get the result.',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai-rerun',
                    },
                },
            },
            {
                name: 'Scrape Website Returns Structured Data (Manual)',
                value: 'manual',
                action: 'Scrape website returns structured data manual',
                description: 'Rerun a manual scraper you already created (e.g. at app.mrscraper.com/scrapers/form?mode=manual). Provide the scraper ID and one URL to get the result.',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-manual-rerun',
                    },
                },
            },
        ],
        default: 'manual',
    },
    ...scrapingManualDescription,
    ...scrapingGeneralAgentDescription,
    ...scrapingListingAgentDescription,
    ...scrapingMapAgentDescription,
    ...scrapingBulkManualDescription,
    ...scrapingBulkAIScrapeDescription,
];
