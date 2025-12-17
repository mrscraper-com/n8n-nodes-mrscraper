import type { INodeProperties } from 'n8n-workflow';

const showOnlyForResultGetMany = {
    operation: ['getMany'],
    resource: ['result'],
};

export const resultGetManyDescription: INodeProperties[] = [
    {
        displayName: 'Scraper ID',
        name: 'scraperId',
        type: 'string',
        displayOptions: {
            show: showOnlyForResultGetMany,
        },
        required: true,
        default: '',
        description: 'Scraper ID to of which the results are to be fetched',
    }, {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        required: true,
        displayOptions: {
            show: showOnlyForResultGetMany,
        },
        description: 'Page number for pagination',
    }, {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'number',
        default: 10,
        required: true,
        displayOptions: {
            show: showOnlyForResultGetMany,
        },
        description: 'Size for one page for pagination',
    }, {
        displayName: 'Sort By',
        name: 'sortBy',
        type: 'options',
        default: 'createdAt',
        required: true,
        options: [
            { name: 'Created At', value: 'createdAt' },
        ],
        displayOptions: {
            show: showOnlyForResultGetMany,
        },
        description: 'Size for one page for pagination',
    }, {
        displayName: 'Sort Order',
        name: 'sortOrder',
        type: 'options',
        default: 'DESC',
        required: true,
        options: [
            { name: 'Ascending', value: 'ASC' },
            { name: 'Descending', value: 'DESC' },
        ],
        displayOptions: {
            show: showOnlyForResultGetMany,
        },
        description: 'Size for one page for pagination',
    },
];
