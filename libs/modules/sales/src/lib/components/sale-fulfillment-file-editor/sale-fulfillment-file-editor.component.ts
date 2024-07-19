import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// interfcae
import { IPurchases, ISales } from '../../models';

@Component({
  selector: 'neural-sale-fulfillment-file-editor',
  templateUrl: './sale-fulfillment-file-editor.component.html',
  styleUrls: ['./sale-fulfillment-file-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleFulfillmentFileEditorComponent implements OnInit, OnDestroy {

  pdfSrc = '';

  file: any;

  loading = true;

  signed = false;
  x = 0;
  y = 0;

  offsetWidth = 0;
  offsetHeight = 0;

  page = 1;
  renderText = true;
  originalSize = true;
  fitToPage = false;
  showAll = false;
  autoresize = false;
  showBorders = true;
  renderTextModes = [0, 1, 2];
  renderTextMode = 0;
  rotation = 0;
  zoom = 0.7;
  zoomScale = 'page-width';
  zoomScales = ['page-width', 'page-fit', 'page-height'];
  pdfQuery = '';
  totalPages: number;

  constructor(
    public dialogRef: MatDialogRef<SaleFulfillmentFileEditorComponent>,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: IPurchases.ISaleFulfillment
  ) {
    if (!!data.file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        this.ngOnInit();
        this.cd.detectChanges();
      };

      reader.readAsArrayBuffer(data.file);

      this.page = !!data?.document?.signature?.position?.page ? data?.document?.signature?.position?.page : 1;
    }
  }

  private listenerFn: () => void;

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }

  zoomIn() {
    // this.zoom += 0.05;
  }

  zoomOut() {
    // if (this.zoom > 0.05) this.zoom -= 0.05;
  }

  rotateDoc() {
    this.rotation += 90;
  }

  // Event for search operation
  searchQueryChanged(newQuery: string) {
    console.log(newQuery)
  }

  downloadFile(data: File): void {
    const blob = new Blob([data], { type: 'text/csv' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }
  // Event handler when new PDF file is selected
  onFileSelected(event) {
    if (event) {
      const file = (event.target as HTMLInputElement).files[0];

      if (!!file) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.pdfSrc = e.target.result;

          this.ngOnInit();
          this.cd.detectChanges();
        };

        this.file = file;

        reader.readAsArrayBuffer(file);
      }
    }
  }

  async callBackFn(event) {
    console.log('callBackFn', event);
    // Setting total number of pages
    this.totalPages = event._pdfInfo.numPages;

    this.loading = false;
    this.cd.detectChanges();
  }

  pageRendered(event) {
    console.log('pageRendered', event);
    this.loading = false;
    this.ngOnInit();
  }

  textLayerRendered(event) {
    console.log('textLayerRendered', event);
  }

  onError(event) {
    console.error('onError', event);
  }

  onProgress(event) {
    console.log('onProgress', event);
  }

  async onNext() {
    if (this.page < this.totalPages) {
      ++this.page;
      await this.ngOnInit();
      // this.cd.detectChanges();
    }
  }

  async onPerv() {
    if (this.page !== 1) {
      --this.page;
      await this.ngOnInit();
      // this.cd.detectChanges();
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }

  toggleStatus() {
    this.dialogRef.close({
      position: {
        x: this.x / this.offsetWidth,
        y: this.y / this.offsetHeight,
        page: this.page,
      },
    });
  }
}
