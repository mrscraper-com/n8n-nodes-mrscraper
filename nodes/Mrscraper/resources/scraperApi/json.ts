import { NodeOperationError, type IDataObject, type PreSendAction } from 'n8n-workflow';

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
	requestOptions.body = { ...(requestOptions.body as IDataObject), prompt };
	return requestOptions;
};
