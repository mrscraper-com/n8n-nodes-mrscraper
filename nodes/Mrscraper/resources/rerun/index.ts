import type { INodeProperties } from 'n8n-workflow';
import { rerunManualDescription } from './manual';

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
        ],
        default: 'manual',
    },
    ...rerunManualDescription,
];
