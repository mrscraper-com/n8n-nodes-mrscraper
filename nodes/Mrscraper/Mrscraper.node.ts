import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { userDescription } from './resources/user';
import { companyDescription } from './resources/company';
import { rerunDescription } from './resources/rerun';

export class Mrscraper implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MrScraper',
		name: 'mrscraper',
		icon: { light: 'file:mrscraper.svg', dark: 'file:mrscraper.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the MrScraper API',
		defaults: {
			name: 'MrScraper',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'mrscraperApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.app.mrscraper.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Rerun',
						value: 'rerun',
					},
				],
				default: 'user',
			},
			...userDescription,
			...companyDescription,
			...rerunDescription,
		],
	};
}
