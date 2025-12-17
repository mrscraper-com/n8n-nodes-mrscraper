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
	documentationUrl = 'https://github.com/mrscraper-com/n8n-nodes-mrscraper?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
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
				'x-api-token': '={{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.mrscraper.com',
			url: '/subscription-accounts',
		},
	};

	icon = undefined;
}
