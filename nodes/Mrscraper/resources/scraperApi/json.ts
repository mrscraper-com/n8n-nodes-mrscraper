import { NodeOperationError, type IDataObject, type PreSendAction } from 'n8n-workflow';
import { validatePageQuery } from './validation';

// Scrape JSON is a GET unless its encoded URL would exceed this length, as the API refuses request lines
// over about 8 KB. A longer request is a POST with url, prompt, and agent in a JSON body and the other
// settings in the query.
const MAX_GET_URL_LENGTH = 8000;

export const prepareJsonRequest: PreSendAction = async function (requestOptions) {
	let prompt = this.getNodeParameter('prompt') as string;
	const outputSchema = this.getNodeParameter('outputSchema', '') as string | IDataObject;
	if (outputSchema) {
		let schema: unknown;
		try {
			schema = typeof outputSchema === 'string' ? JSON.parse(outputSchema) : outputSchema;
		} catch {
			throw new NodeOperationError(this.getNode(), 'Expected Output Schema must be valid JSON');
		}
		prompt += `\n\nJson Schema:\n${JSON.stringify(schema)}`;
	}
	const settings: IDataObject = validatePageQuery.call(this, { ...requestOptions.qs });
	const qs: IDataObject = { ...settings, prompt };
	const getUrl = new URL(requestOptions.url, requestOptions.baseURL);
	for (const [name, value] of Object.entries(qs)) {
		if (value !== undefined && value !== null) getUrl.searchParams.set(name, String(value));
	}
	if (getUrl.href.length <= MAX_GET_URL_LENGTH) {
		requestOptions.qs = qs;
		return requestOptions;
	}
	const { url, agent } = settings;
	delete settings.url;
	delete settings.agent;
	requestOptions.method = 'POST';
	requestOptions.qs = settings;
	requestOptions.body = { url, prompt, agent };
	return requestOptions;
};
