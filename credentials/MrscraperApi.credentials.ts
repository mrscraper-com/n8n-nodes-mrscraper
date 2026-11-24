import {
	type IAuthenticateGeneric,
	type ICredentialTestRequest,
	type ICredentialType,
	type INodeProperties,
} from 'n8n-workflow';

export class MrscraperApi implements ICredentialType {
	name = 'mrscraperApi';

	displayName = 'MrScraper API';

	// Link to your community node's README
	documentationUrl =
		'https://github.com/mrscraper-com/n8n-nodes-mrscraper?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			description:
				'Your MrScraper API token, which you can copy from your account in the MrScraper app',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
				'x-api-token': '={{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.app.mrscraper.com',
			url: '/api/v1/subscription-accounts',
		},
	};

	icon = undefined;
}
