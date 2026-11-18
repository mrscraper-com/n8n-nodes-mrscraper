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
				action: 'Get account info',
				description: 'Retrieve your account details, including token usage and limits',
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
