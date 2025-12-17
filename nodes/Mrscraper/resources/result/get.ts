import type { INodeProperties } from 'n8n-workflow';

const showOnlyForResultGet = {
    operation: ['get'],
    resource: ['result'],
};

export const resultGetDescription: INodeProperties[] = [
    {
        displayName: 'Result ID',
        name: 'resultId',
        type: 'string',
        displayOptions: {
            show: showOnlyForResultGet,
        },
        required: true,
        default: '',
        description: 'Result ID to be fetched',
    },
];
