import { PromotionsResolver } from './promotions.resolver';
import { PromotionExistsResolver } from './promotion-exists.resolver';

export const resolvers: any[] = [PromotionsResolver, PromotionExistsResolver];

export * from './promotions.resolver';
export * from './promotion-exists.resolver';
