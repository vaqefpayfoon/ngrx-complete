import { ServicesResolver } from './services.resolver';
import { ServiceExistsResolver } from './service-exists.resolver';

export const resolvers: any[] = [ServicesResolver, ServiceExistsResolver];

export * from './services.resolver';
export * from './service-exists.resolver';
