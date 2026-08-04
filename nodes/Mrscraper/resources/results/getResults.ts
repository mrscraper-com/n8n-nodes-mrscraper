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
        placeholder: 'e.g. cm123abc456',
        description: 'ID of the scraper whose results should be fetched',
    }, {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        required: true,
        displayOptions: {
            show: showOnlyForResultGetMany,
        },
        description: 'Page number for pagination, for example 1',
    }, {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'number',
        default: 10,
        required: true,
        displayOptions: {
            show: showOnlyForResultGetMany,
        },
        description: 'Number of results per page, for example 10',
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
        description: 'Field used to sort results, for example Created At',
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
        description: 'Direction used to sort results, for example Descending',
    },
];
