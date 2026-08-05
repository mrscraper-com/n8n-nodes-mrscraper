import type { INodeProperties } from 'n8n-workflow';
import { resultGetManyDescription } from './getResults';
import { resultGetLatestDescription } from './getLatestResults';
import { resultGetDescription } from './getResultDetail';

const showOnlyForResult = {
    resource: ['result'],
};

export const resultsDescription: INodeProperties[] = [
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
                name: 'Get Results',
                value: 'getMany',
                action: 'Get Results',  // eslint-disable-line n8n-nodes-base/node-param-operation-option-action-miscased
                description: 'Get results based on given page number, page size, filters, and sorting by scraper ID',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/api/v1/results?filters[scraperId]={{$parameter.scraperId}}&page={{$parameter.page}}&pageSize={{$parameter.pageSize}}&sort={{$parameter.sortBy}}&sortOrder={{$parameter.sortOrder}}',
                    },
                },
            },
            {
                name: 'Get Latest Results',
                value: 'getLatest',
                action: 'Get Latest Results',  // eslint-disable-line n8n-nodes-base/node-param-operation-option-action-miscased
                description: 'Get N latest results by scraper ID',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/api/v1/results?filters[scraperId]={{$parameter.scraperId}}&page=1&pageSize={{$parameter.pageSize}}&sort=createdAt&sortOrder=DESC',
                    },
                },
            },
            {
                name: 'Get Result Detail',
                value: 'get',
                action: 'Get Result Detail',  // eslint-disable-line n8n-nodes-base/node-param-operation-option-action-miscased
                description: 'Get a result detail by its result ID',
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
