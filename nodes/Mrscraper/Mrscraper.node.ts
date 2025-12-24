import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { rerunDescription } from './resources/rerun';
import { resultDescription } from './resources/result';
import { advanceChatDescription } from './resources/createScraper';

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
						name: 'Rerun',
						value: 'rerun',
					},
					{
						name: 'Result',
						value: 'result',
					},
					{
						name: 'Create Scraper',
						value: 'createScraper',
					},
				],
				default: 'rerun',
			},
			...rerunDescription,
			...resultDescription,
			...advanceChatDescription,
		],
	};
}
