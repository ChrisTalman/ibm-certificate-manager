'use strict';

// External Modules
import { RequestRawError } from '@chris-talman/request';

// Constants
import { API_NAME } from 'src/Constants';

export class ApiError extends Error
{
	public readonly message: string;
	public readonly json?: object;
	public readonly error: RequestRawError;
	constructor({error, errorText}: {error: RequestRawError, errorText: string})
	{
		const message = `${API_NAME} Error: ${error.response.status} ${errorText}`;
		super(message);
		this.error = error;
		try
		{
			this.json = JSON.parse(errorText);
		}
		catch (error) {};
	};
};

/** If promise rejects with an API error, the error is thrown in a more readable form. */
export async function throwRejectionApiError <GenericResolution> (promise: Promise<GenericResolution>)
{
	let result: GenericResolution;
	try
	{
		result = await promise;
	}
	catch (error)
	{
		await throwApiError(error);
		throw new Error('throwApiError() failed');
	};
	return result;
};

export async function throwApiError(error: any)
{
	const apiError: RequestRawError = error;
	if (apiError instanceof RequestRawError)
	{
		const apiErrorText = await apiError.response.text();
		throw new ApiError({error: apiError, errorText: apiErrorText});
	}
	else
	{
		throw error;
	};
};