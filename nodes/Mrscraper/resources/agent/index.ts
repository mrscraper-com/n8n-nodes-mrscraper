import type { INodeProperties } from 'n8n-workflow';
import { GeneralAgentDescription } from './generalAgent';
import { ListingAgentDescription } from './listingAgent';
import { MapAgentDescription } from './mapAgent';

const showOnlyForAgent = {
    resource: ['agent'],
};

const showForAiAgent = {
    resource: ['agent'],
    operation: ['aiAgent'],
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
                name: 'AI Agent',
                value: 'aiAgent',
                action: 'Create AI Agent Scraper',
                description:
                    'Create an AI agent scraper on the Mrscraper platform. Choose General, Listing, or Map agent type.',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai',
                    },
                },
            },
        ],
        default: 'aiAgent',
    },
    {
        displayName: 'Agent Type',
        name: 'agentType',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showForAiAgent,
        },
        options: [
            {
                name: 'General Agent - AI-Powered Web Data Extraction',
                value: 'general',
                description:
                    'Create a general agent (AI) scraper using input link and message',
            },
            {
                name: 'Listing Agent - AI-Powered Listing Data Extraction',
                value: 'listing',
                description:
                    'Create a listing agent (AI) scraper using input link and message',
            },
            {
                name: 'Map Agent - Web Crawling',
                value: 'map',
                description: 'Create a map agent (AI) scraper for URL discovery and crawling',
            },
        ],
        default: 'general',
        description: 'Which AI agent graph to use',
        routing: {
            send: {
                type: 'body',
                property: 'graph',
                value: '={{ $value }}',
            },
        },
    },
    ...GeneralAgentDescription,
    ...ListingAgentDescription,
    ...MapAgentDescription,
];
