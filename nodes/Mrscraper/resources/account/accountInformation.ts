import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAccountInformation = {
    operation: ['accountInformation'],
    resource: ['account'],
};

export const accountInformation: INodeProperties[] = [
    {
        displayName: 'Account Information',
        name: 'accountInformation',
        type: 'string',
        default: 'accountInformation',
        displayOptions: {
            show: showOnlyForAccountInformation,
        },
    },
];