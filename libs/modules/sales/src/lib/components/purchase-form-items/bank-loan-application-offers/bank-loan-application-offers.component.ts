import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Models
import { IBankLoan, IPurchases, ISales, ITradeIn } from '../../../models';

//Permission
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-bank-loan-application-offers',
  templateUrl: './bank-loan-application-offers.component.html',
  styleUrls: [
    './bank-loan-application-offers.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankLoanApplicationOffersComponent {
  @Input() purchase: IPurchases.IDocument;

  @Input() loans: IBankLoan.IDocument[];

  @Input() permissions: any;

  @Input() bankLoanApplicationOffersUploadedFile: {
    index: number;
    doc: ITradeIn.IDocument;
  };

  @Input() bankLoanApplicationOffersDeletedFile: {
    index: number;
    url: string;
  };

  @Input() countries!: string[];

  @Output() updateBankLoan = new EventEmitter<IBankLoan.IUpdateBankLoan>();

  @Output() deleteLoan = new EventEmitter<string>();

  @Output() updated = new EventEmitter<IBankLoan.IUpdateBankLoan>();

  @Output() updateFile = new EventEmitter<{
    index: number;
    doc: ISales.IUploadFile;
  }>();

  @Output() deleteFile = new EventEmitter<{
    index: number;
    doc: ISales.IDeleteFile;
  }>();

  @ViewChild('bankLoanOfferDoc', { static: false })
  bankLoanOfferDocEle: ElementRef<HTMLInputElement>;

  bankLoanOffer = true;

  onUpdate(event: IBankLoan.IUpdateBankLoan): void {
    this.bankLoanOffer = !this.bankLoanOffer;
    this.updated.emit(event);
  }

  onUploadFile(doc: ISales.IUploadFile, index: number): void {
    this.updateFile.emit({ index, doc });
  }

  onDeleteFile(doc: ISales.IDeleteFile, index: number): void {
    this.deleteFile.emit({ index, doc });
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.BankLoan.UPDATE_BANK_LOAN]
    ) {
      return true;
    }
    return false;
  }
}
