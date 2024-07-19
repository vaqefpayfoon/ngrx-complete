import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'neural-fulfillment-file-editor',
  templateUrl: './fulfillment-file-editor.component.html',
  styleUrls: ['./fulfillment-file-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FulfillmentFileEditorComponent implements OnInit, OnDestroy {

  @ViewChild('signature') private signature: ElementRef;

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
    public dialogRef: MatDialogRef<FulfillmentFileEditorComponent>,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

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

  pageRendered(event) {
    console.log('pageRendered', event);
    this.loading = false;
    this.ngOnInit();
    this.x = 0;
    this.y = 0;
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

  onNext() {
    if (this.page < this.totalPages) {
      ++this.page;
      this.ngOnInit();
    }
  }

  onPerv() {
    if (this.page !== 1) {
      --this.page;
      this.ngOnInit();
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
