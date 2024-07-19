import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

//Angular forms
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

// Models
import { IPurchases, ISales, ITradeIn } from '../../models';

//Directive
import { SearchDirective } from '../../directives';

//Permission
import { permissionTags } from '@neural/shared/data';

//functions
import { traverseAndRemove } from '../../functions';

@Component({
  selector: 'neural-purchase-search',
  templateUrl: './purchase-search.component.html',
  styleUrls: ['./purchase-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseSearchComponent
  extends SearchDirective
  implements OnDestroy {
  constructor(fb: FormBuilder) {
    super(fb);
  }

  onReset(): void {
    this.form.reset();
    this.to.disable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (
      changes.downloadedReportUrl &&
      changes.downloadedReportUrl.currentValue
    ) {
      this.downloadFile(this.downloadedReportUrl);
    }
    this.corporateUuid.patchValue(this.selectedCorporate.uuid);
    this.branchUuid.patchValue(this.selectedBranch.uuid);

    this.patchDownloadForm();
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

  initialForm(): FormGroup {
    return this.fb.group({
      createdAt: this.fb.group({
        from: [''],
        to: [
          {
            value: '',
            disabled: true,
          },
        ],
      }),
      tradeIn: this.fb.group({
        offer: this.fb.group({
          status: [''],
        }),
      }),
      account: this.fb.group({
        email: ['', Validators.compose([Validators.email])],
      }),
      status: [''],
      referenceNumber: [''],
    });
  }

  initDownloadForm(): FormGroup {
    return this.fb.group({
      corporateUuid: ['', Validators.compose([Validators.required])],
      branchUuid: ['', Validators.compose([Validators.required])],
      resultType: [
        IPurchases.ResultType.EXCEL,
        Validators.compose([Validators.required]),
      ],
      saleStatus: [''],
      tradeInStatus: [''],
      referenceNumber: [''],
      startDate: [''],
      endDate: [''],
      email: ['', Validators.compose([Validators.email])],
    });
  }

  patchDownloadForm() {
    this.subscribtion = this.form.valueChanges.subscribe((val) =>
      this.downloadForm.patchValue({
        saleStatus: val.status,
        tradeInStatus: val.tradeIn?.offer?.status,
        referenceNumber: val.referenceNumber,
        startDate: val.createdAt?.from,
        endDate: val.createdAt?.to,
        email: val.account?.email,
      })
    );
  }

  onDownload(downloadForm: FormGroup) {
    const { value, valid } = downloadForm;

    if (valid) {
      traverseAndRemove(value);
      this.download.emit(value);
    }
  }

  get statuses() {
    return ISales.Status;
  }

  get offerStatuses() {
    return ITradeIn.OfferStatus;
  }

  get downloadPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Analytic.SALE_DOWNLOAD_REPORT]
    ) {
      return true;
    }
    return false;
  }
}
