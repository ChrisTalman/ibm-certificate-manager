declare module '@chris-talman/ibm-certificate-manager'
{
	// External Modules
	import { Domain, RequestRawError } from '@chris-talman/request';

	// Client
	export class Client
	{
		public readonly region: string;
		public readonly token: string;
		public readonly domain: Domain;
		constructor({region, token}: {region: Client['region'], token: Client['token']});
		public readonly certificates: Certificates;
	}

	// Resource
	class Resource
	{
		public readonly _client: Client;
		constructor({client}: {client: Client});
	}

	// Certificates
	export class Certificates extends Resource
	{
		public get(parameters: CertificatesGetParameters): Promise <Certificate>;
	}
	// Certificates: Get
	export interface CertificatesGetParameters
	{
		id: string;
	}
	export interface Certificate
	{
		_id: string;
		issuer: string;
		domains: Array <string>;
		begins_on: number;
		expires_on: number;
		imported: boolean;
		status: 'active' | 'inactive' | 'expired' | 'revoked' | 'valid' | 'pending' | 'failed';
		algorithm: string;
		key_algorithm: string;
		has_previous: boolean;
		data: CertificateData;
		name: string;
		description: string;
		issuance_info: CertificateIssuanceInfo;
		order_policy: CertificateOrderPolicy;
		downloaded: boolean;
		serial_number: string;
	}
	export interface CertificateData
	{
		content: string;
		priv_key: string;
		intermediate: string;
	}
	export interface CertificateIssuanceInfo
	{
		status: 'pending' | 'valid' | 'failed' | 'valid_renew_failed' | 'expired_renew_failed' | 'valid_renew_pending' | 'expired_renew_pending';
		ordered_on: number;
		code: string;
		additional_info: string;
		auto: boolean;
	}
	export interface CertificateOrderPolicy
	{
		auto_renew_enabled: boolean;
	}

	// API Error
	export class ApiError extends Error
	{
		public readonly message: string;
		public readonly error: RequestRawError;
		constructor({error}: {error: RequestRawError});
	}
}