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
				name: 'Get Status',
				value: 'accountInformation',
				action: 'Get status',
				description:
					'Return the raw account status API response without summarizing, redacting body fields, or adding calculated fields',
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
