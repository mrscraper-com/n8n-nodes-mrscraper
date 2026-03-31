import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAccount = {
	resource: ['account'],
};

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForAccount,
		},
		options: [
			{
				name: 'Get Account Info',
				value: 'accountInformation',
				action: 'Get Account Info',
				description: 'Get account details including token usage and token limits',
				routing: {
					request: {
						method: 'GET',
						url: '/api/v1/subscription-accounts',
					},
				},
			},
		],
		default: 'accountInformation',
	},
];
