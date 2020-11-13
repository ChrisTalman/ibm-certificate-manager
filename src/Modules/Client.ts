'use strict';

// External Modules
import { request, guaranteeResultJson, Domain, Definition as RequestDefinition, Result as RequestResult, RequestRawError } from '@chris-talman/request';

// Internal Modules
import { throwRejectionApiError } from 'src/Modules/ApiError';
import { Certificates } from './Resources/Certificates';
interface TokenResponseBody
{
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	expiration: number;
};

// Constants
import { API_NAME } from 'src/Constants';

export class Client
{
	public readonly region: string;
	public readonly key: string;
	public token?: TokenResponseBody;
	public readonly domain: Domain;
	constructor({region, key}: {region: Client['region'], key: Client['key']})
	{
		this.region = region;
		this.key = key;
		const url = `https://${this.region}.certificate-manager.cloud.ibm.com/api`;
		this.domain = new Domain
		(
			{
				path: url,
				auth: () => `Bearer ${this.token?.access_token}`
			}
		);
	};
	public async executeApiRequest <GenericResultJson, GenericResult extends RequestResult<GenericResultJson>> ({request}: {request: RequestDefinition})
	{
		if (!this.token || Date.now() >= (this.token.expiration * 1000))
		{
			try
			{
				await this.obtainToken();
			}
			catch (error)
			{
				if (error instanceof RequestRawError)
				{
					const text = await error.response.text();
					throw new Error(`${API_NAME}: Failed to obtain authentication token: ${text}`);
				}
				else
				{
					throw error;
				};
			};
		};
		const result: GenericResult = await throwRejectionApiError(this.domain.request(request));
		return result;
	};
	private async obtainToken()
	{
		const result = await request <TokenResponseBody>
		(
			{
				method: 'POST',
				path: 'https://iam.cloud.ibm.com/identity/token',
				type: 'application/x-www-form-urlencoded',
				body:
				{
					grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
					apikey: this.key
				},
				jsonResponseSuccess: true
			}
		);
		const token = guaranteeResultJson(result);
		this.token = token;
	};
	public certificates = new Certificates({client: this});
};