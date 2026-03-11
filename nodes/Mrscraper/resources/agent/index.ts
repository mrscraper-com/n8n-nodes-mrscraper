import type { INodeProperties } from 'n8n-workflow';
import { GeneralAgentDescription } from './generalAgent';
import { ListingAgentDescription } from './listingAgent';
import { MapAgentDescription } from './mapAgent';

const showOnlyForAgent = {
    resource: ['agent'],
};

export const agentDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForAgent,
        },
        options: [
            {
                name: 'General Agent - AI-Powered Web Data Extraction',
                value: 'generalAgent',
                action: 'General Agent AI powered web data extraction', // eslint-disable-line
                description: 'Create a general agent (AI) scraper at Mrscraper platform using input link and message',
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
                name: 'Listing Agent - AI-Powered Listing Data Extraction',
                value: 'listingAgent',
                action: 'Listing Agent AI powered listing data extraction', // eslint-disable-line
                description: 'Create a listing agent (AI) scraper at Mrscraper platform using input link and message',
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
                name: 'Map Agent - Web Crawling',
                value: 'mapAgent',
                action: 'Map Agent web crawling', // eslint-disable-line
                description: 'Create a map agent (AI) scraper at Mrscraper platform using input link and message',
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
    ...GeneralAgentDescription,
    ...ListingAgentDescription,
    ...MapAgentDescription,
];
