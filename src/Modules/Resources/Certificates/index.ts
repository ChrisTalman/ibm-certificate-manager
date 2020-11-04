'use strict';

// Internal Modules
import { Resource } from 'src/Modules/Resource';

// Methods
import { get } from './Methods/Get';

export class Certificates extends Resource
{
	public get = get;
};