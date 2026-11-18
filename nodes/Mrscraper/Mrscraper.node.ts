import { VersionedNodeType, type INodeType, type INodeTypeBaseDescription } from 'n8n-workflow';
import { MrscraperV2 } from './MrscraperV2.node';
import { MrscraperV3 } from './MrscraperV3.node';

export class Mrscraper extends VersionedNodeType {
	constructor() {
		const description: INodeTypeBaseDescription = {
			displayName: 'MrScraper',
			name: 'mrscraper',
			icon: { light: 'file:mrscraper.svg', dark: 'file:mrscraper.dark.svg' },
			group: ['transform'],
			description: 'Interact with the MrScraper API',
			defaultVersion: 3,
			usableAsTool: true,
		};
		const legacyNode = new MrscraperV2();
		super({ 0: legacyNode, 2: legacyNode, 3: new MrscraperV3() }, description);
	}

	getNodeType(version?: number): INodeType {
		return this.nodeVersions[version ?? this.currentVersion];
	}
}
