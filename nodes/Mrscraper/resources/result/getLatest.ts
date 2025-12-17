import type { INodeProperties } from 'n8n-workflow';

const showOnlyForResultGetLatest = {
    operation: ['getLatest'],
    resource: ['result'],
};

export const resultGetLatestDescription: INodeProperties[] = [
    {
        displayName: 'Scraper ID',
        name: 'scraperId',
        type: 'string',
        displayOptions: {
            show: showOnlyForResultGetLatest,
        },
        required: true,
        default: '',
        description: 'Scraper ID to of which the results are to be fetched',
    }, {
        displayName: 'N',
        name: 'pageSize',
        type: 'number',
        default: 10,
        required: true,
        displayOptions: {
            show: showOnlyForResultGetLatest,
        },
        description: 'Number of latest results to fetch',
    },
];
