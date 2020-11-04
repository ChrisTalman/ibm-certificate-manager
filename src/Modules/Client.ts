'use strict';

// External Modules
import { Domain, Definition as RequestDefinition, Result as RequestResult } from '@chris-talman/request';

// Internal Modules
import { throwRejectionApiError } from 'src/Modules/ApiError';
import { Certificates } from './Resources/Certificates';

export class Client
{
	public readonly region: string;
	public readonly token: string;
	public readonly domain: Domain;
	constructor({region, token}: {region: Client['region'], token: Client['token']})
	{
		this.region = region;
		this.token = token;
		const url = `https://${this.region}.certificate-manager.cloud.ibm.com/api`;
		this.domain = new Domain
		(
			{
				path: url,
				auth: () => `Bearer ${this.token}`
			}
		);
	};
	public async executeApiRequest <GenericResultJson, GenericResult extends RequestResult<GenericResultJson>> ({request}: {request: RequestDefinition})
	{
		const result: GenericResult = await throwRejectionApiError(this.domain.request(request));
		return result;
	};
	public certificates = new Certificates({client: this});
};