// purchases
import { PurchasesComponent } from './purchases/purchases.component';
import { PurchaseItemComponent } from './purchase-item/purchase-item.component';

// purchase Quotes
import { PurchaseQuoteItemComponent } from './purchase-quote-item/purchase-quote-item.component';
import { PurchaseQuotesComponent } from './purchase-quotes/purchase-quotes.component';

// valuation
import { ValuationsComponent } from './valuations/valuations.component';
import { ValuationItemComponent } from './valuation-item/valuation-item.component';

export const COMPONENTS: any[] = [
  PurchasesComponent,
  PurchaseItemComponent,
  PurchaseQuoteItemComponent,
  PurchaseQuotesComponent,
  ValuationsComponent,
  ValuationItemComponent,
];

export * from './purchases/purchases.component';
export * from './purchase-item/purchase-item.component';

export * from './purchase-quote-item/purchase-quote-item.component';
export * from './purchase-quotes/purchase-quotes.component';

export * from './valuations/valuations.component';
export * from './valuation-item/valuation-item.component';
