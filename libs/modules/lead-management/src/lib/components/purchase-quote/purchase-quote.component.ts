import { Component, Input } from '@angular/core';
import { leadPurchaseQuotes } from '../../models';

@Component({
  selector: 'neural-purchase-quote',
  templateUrl: './purchase-quote.component.html',
  styleUrls: ['./purchase-quote.component.scss']
})
export class PurchaseQuoteComponent {

  @Input() purchaseItem: leadPurchaseQuotes.IDocument;

}
