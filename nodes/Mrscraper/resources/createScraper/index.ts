import type { INodeProperties } from 'n8n-workflow';
import { advanceChatGeneralAgentDescription } from './generalAgent';
import { advanceChatListingAgentDescription } from './listingAgent';

const showOnlyForAdvanceChat = {
    resource: ['createScraper'],
};

export const advanceChatDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForAdvanceChat,
        },
        options: [
            {
                name: 'Create General agent',
                value: 'generalAgent',
                action: 'Create general agent',
                description: 'Run general agent chat',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai',
                    },
                    send: {
                        type: 'body',
                        property: 'graph',
                        value: 'ScrapeGPT_MrBrowser',
                    },
                },
            },
            {
                name: 'Create Listing agent',
                value: 'listingAgent',
                action: 'Create listing agent',
                description: 'Run listing agent chat',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/api/v1/scrapers-ai',
                    },
                    send: {
                        type: 'body',
                        property: 'graph',
                        value: 'ScrapeGPT_CBC_Booking_v2',
                    },
                },
            },
        ],
        default: 'generalAgent',
    },
    ...advanceChatGeneralAgentDescription,
    ...advanceChatListingAgentDescription,
];
