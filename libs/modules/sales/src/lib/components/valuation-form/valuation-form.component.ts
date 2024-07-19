import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'neural-valuation-form',
  templateUrl: './valuation-form.component.html',
  styleUrls: [
    './valuation-form.component.scss',
    '../purchase-form/purchase-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValuationFormComponent implements OnInit {
  @ViewChild('tradeInDocs', { static: false }) tradeInDocEle: ElementRef<
    HTMLInputElement
  >;

  @ViewChild('valuationRequestDocs', { static: false }) valuationRequestDocsEle: ElementRef<HTMLInputElement>;

  @ViewChild('valuationDoc', { static: false }) valuationDocEle: ElementRef<HTMLInputElement>;
  
  @ViewChild('inspectionOfferDoc', { static: false }) inspectionOfferDocEle: ElementRef<HTMLInputElement>;

  valuationRequest = true;
  valuation = true;
  inspectionRequest = true;
  inspectionValuation = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onClickValuationRequest() {
    const fileUpload = this.valuationRequestDocsEle.nativeElement;
    fileUpload.value = '';

    fileUpload.onchange = () => {
      this.cdr.detectChanges();
    };
    fileUpload.click();
  }

  onClickValuationDoc() {
    const fileUpload = this.valuationDocEle.nativeElement;
    fileUpload.value = '';

    fileUpload.onchange = () => {
      this.cdr.detectChanges();
    };
    fileUpload.click();
  }

  onClickInspectionOfferDoc() {
    const fileUpload = this.inspectionOfferDocEle.nativeElement;
    fileUpload.value = '';

    fileUpload.onchange = () => {
      this.cdr.detectChanges();
    };
    fileUpload.click();
  }
}
