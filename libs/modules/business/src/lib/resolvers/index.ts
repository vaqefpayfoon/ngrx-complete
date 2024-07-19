import { BusinessesResolver } from './businesses.resolver';
import { BusinessExistsResolver } from './business-exists.resolver';

export const resolvers: any[] = [BusinessesResolver, BusinessExistsResolver];

export * from './businesses.resolver';
export * from './business-exists.resolver';
