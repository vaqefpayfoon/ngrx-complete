import { PromotionsGuard } from './promotions.guard';
import { PromotionExistsGuard } from './promotion-exists.guard';

export const guards: any[] = [PromotionsGuard, PromotionExistsGuard];

export * from './promotions.guard';
export * from './promotion-exists.guard';
