import type { INodeProperties } from 'n8n-workflow';
import { resultGetManyDescription } from './getMany';
import { resultGetLatestDescription } from './getLatest';
import { resultGetDescription } from './get';

const showOnlyForResult = {
    resource: ['result'],
};

export const resultDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForResult,
        },
        options: [
            {
                name: 'Get Many',
                value: 'getMany',
                action: 'Get results',
                description: 'Get results based on given page number, page size, filters, and sorting',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/api/v1/results?filters[scraperId]={{$parameter.scraperId}}&page={{$parameter.page}}&pageSize={{$parameter.pageSize}}&sort={{$parameter.sort}}&sortOrder={{$parameter.sortOrder}}',
                    },
                },
            },
            {
                name: 'Get Latest',
                value: 'getLatest',
                action: 'Get latest results',
                description: 'Get N latest results',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/api/v1/results?filters[scraperId]={{$parameter.scraperId}}&page=1&pageSize={{$parameter.pageSize}}&sort=createdAt&sortOrder=DESC',
                    },
                },
            },
            {
                name: 'Get Detail',
                value: 'get',
                action: 'Get result detail',
                description: 'Get a result detail by its ID',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/api/v1/results/{{$parameter.resultId}}',
                    },
                },
            },
        ],
        default: 'getMany',
    },
    ...resultGetManyDescription,
    ...resultGetLatestDescription,
    ...resultGetDescription,
];
