'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Types
interface Parameters
{
	id: string;
};

export async function get(this: Resource, {id}: Parameters)
{
	const result = await this._client.executeApiRequest
	(
		{
			request:
			{
				method: 'GET',
				path: `/certificate/${id}`,
				jsonResponseSuccess: true
			}
		}
	);
	const { json } = result;
	return json;
};