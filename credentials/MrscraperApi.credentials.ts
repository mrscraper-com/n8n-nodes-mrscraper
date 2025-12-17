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
	documentationUrl = 'https://github.com/org/-mrscraper?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
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
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.v3.app.mrscraper.com',
			url: '/v1/user',
		},
	};

	icon = undefined;
}
