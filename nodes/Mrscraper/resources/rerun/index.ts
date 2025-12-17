import type { INodeProperties } from 'n8n-workflow';
import { rerunManualDescription } from './manual';
import { rerunGeneralAgentDescription } from './generalAgent';
import { rerunListingAgentDescription } from './listingAgent';
import { rerunMapAgentDescription } from './mapAgent';

const showOnlyForRerun = {
    resource: ['rerun'],
};

export const rerunDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForRerun,
        },
        options: [
            {
                name: 'Run Manual Scraper',
                value: 'manual',
                action: 'Run manual scraper',
                description: 'Run manual scraper given a Scraper ID and get the result',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-manual-rerun',
                    },
                },
            },
            {
                name: 'Run General Agent Scraper',
                value: 'generalAgent',
                action: 'Run general agent scraper',
                description: 'Run general agent scraper given a Scraper ID and get the result',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai-rerun',
                    },
                },
            },
            {
                name: 'Run Listing Agent Scraper',
                value: 'listingAgent',
                action: 'Run listing agent scraper',
                description: 'Run listing agent scraper given a Scraper ID and get the result',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai-rerun',
                    },
                },
            },
            {
                name: 'Run Map Agent Scraper',
                value: 'mapAgent',
                action: 'Run map agent scraper',
                description: 'Run map agent scraper given a Scraper ID and get the result',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai-rerun',
                    },
                },
            },
        ],
        default: 'manual',
    },
    ...rerunManualDescription,
    ...rerunGeneralAgentDescription,
    ...rerunListingAgentDescription,
    ...rerunMapAgentDescription
];
