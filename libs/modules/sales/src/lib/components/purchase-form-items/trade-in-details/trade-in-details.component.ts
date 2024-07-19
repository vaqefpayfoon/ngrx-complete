import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  QueryList,
} from '@angular/core';

//Model
import { IPurchases, ISales, ITradeIn } from '../../../models';
import { IVehicle } from '@neural/modules/customer/vehicles';

// Angular forms
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { FormArray } from '@angular/forms';

//Permission
import { generateArrayOfYears, permissionTags } from '@neural/shared/data';

import { traverseAndRemove } from '../../../functions';
import { OnInit } from '@angular/core';

@Component({
  selector: 'neural-trade-in-details',
  templateUrl: './trade-in-details.component.html',
  styleUrls: [
    './trade-in-details.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
})
export class TradeInDetailsComponent implements OnChanges, OnInit {
  @Input() permissions: any;

  @Input() purchase: IPurchases.IDocument;

  @Input() globalVehicles: IVehicle.IGlobalVehicle;

  @Input() tradeInUploadedFile: ITradeIn.IDocument;

  @Input() tradeInDeletedFile: ISales.IDeleteFileResponse;

  @ViewChildren('tradeInDocs') tradeInDocEle: QueryList<
    ElementRef<HTMLInputElement>
  >;

  @Output() badgeChanges = new EventEmitter<IPurchases.IUpdateBadge>();

  @Output() brandChanges = new EventEmitter();


  @Output() updateTradeIn = new EventEmitter<ITradeIn.IUpdate>();

  @Output() createdTradeIn = new EventEmitter<ITradeIn.ICreate>();

  @Output() variantChanges = new EventEmitter<{
    brand: string;
    model: string;
  }>();

  @Output() fileChange = new EventEmitter<ISales.IUploadFile>();

  @Output() deleteFile = new EventEmitter<ISales.IDeleteFile>();

  tradeInDetail = false;

  exists = false;

  form: FormGroup;

  documentsForm: FormGroup;

  uploadTitleCount = Object.keys(this.TradeInUploadTitleType).length;

  constructor(private fb: FormBuilder) {
    this.form = this.initalForm();

    this.documentsForm = this.fb.group({
      files: this.fb.array([]),
    });
  }

  private initalForm(): FormGroup {
    return this.fb.group({
      unit: this.fb.group({
        brand: ['', Validators.compose([Validators.required])],
        model: ['', Validators.compose([Validators.required])],
        variant: ['', Validators.compose([Validators.required])],
      }),
      documents: this.fb.array([]),
      numberPlate: ['', Validators.compose([Validators.required])],
      manufacturerYear: ['', Validators.compose([Validators.required])],
      mileage: ['', Validators.compose([Validators.required])],
      remark: [''],
      accountUuid: [''],
      corporateUuid: [''],
      saleUuid: [''],
    });
  }

  private createDocument(document?: ITradeIn.IDocument | null): FormGroup {
    return this.fb.group({
      title: [document?.title ?? '', Validators.compose([Validators.required])],
      url: [document?.url ?? '', Validators.compose([Validators.required])],
      size: [document?.size ?? '', Validators.compose([Validators.required])],
      mime: [document?.mime ?? '', Validators.compose([Validators.required])],
    });
  }

  removeDocument(index: number): void {
    return this.document.removeAt(index);
  }

  private addDocument(doc: ITradeIn.IDocument): void {
    if (!!doc) {
      const index = this.document.controls.findIndex(
        (item) => item.get('title').value === doc.title
      );

      if (index !== -1) {
        this.removeDocument(index);
      }

      return this.document.push(this.createDocument(doc));
    }
    this.document.push(this.createDocument());
  }

  emptyDocuments() {
    while (this.document.controls.length) {
      this.document.removeAt(0);
    }
  }

  private createFileObject(): FormGroup {
    return this.fb.group({
      accountUuid: [
        this.purchase?.account?.uuid ?? '',
        Validators.compose([Validators.required]),
      ],
      saleUuid: [
        this.purchase?.uuid ?? '',
        Validators.compose([Validators.required]),
      ],
      type: [
        ISales.UploadLocationType.TRADE_IN,
        Validators.compose([Validators.required]),
      ],
      title: ['', Validators.compose([Validators.required])],
      file: ['', Validators.compose([Validators.required])],
    });
  }

  addFile(): void {
    this.filesArray.push(this.createFileObject());
  }

  private patchFormValue(purchase: IPurchases.IDocument) {
    const { tradeIn } = purchase;

    if (tradeIn) {
      const updatedDocument: ITradeIn.IUpdate = {
        unit: tradeIn?.unit,
        numberPlate: tradeIn?.numberPlate,
        manufacturerYear: tradeIn?.manufacturerYear,
        mileage: tradeIn?.mileage,
        remark: tradeIn?.remark,
      };

      this.form.patchValue(updatedDocument);

      this.emptyDocuments();

      if (tradeIn?.documents) {
        for (const item of tradeIn.documents) {
          this.addDocument(item);
        }
      }

      this.exists = true;

      this.form.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.purchase &&
      changes.purchase.currentValue &&
      this.purchase?.tradeIn
    ) {
      this.patchFormValue(this.purchase);

      this.tradeInDetail = true;
    }

    if (
      changes.purchase &&
      changes.purchase.currentValue &&
      !this.tradeInDetail
    ) {
      this.corporateUuid.patchValue(this.purchase.corporate.uuid);
      this.accountUuid.patchValue(this.purchase?.account?.uuid);
      this.saleUuid.patchValue(this.purchase.uuid);
    }

    if (
      changes.tradeInUploadedFile &&
      changes.tradeInUploadedFile.currentValue
    ) {
      this.addDocument(this.tradeInUploadedFile);
    }

    if (changes.tradeInDeletedFile && changes.tradeInDeletedFile.currentValue) {
      const index = this.document.controls.findIndex(
        (x: FormControl) => x.get('url').value === this.tradeInDeletedFile.url
      );

      if (index !== -1) {
        this.removeDocument(index);
      }
    }
  }

  ngOnInit() {
    if (!this.tradeInDetail) {
      this.accountUuid.setValidators(Validators.compose([Validators.required]));
      this.corporateUuid.setValidators(
        Validators.compose([Validators.required])
      );

      this.brandChanges.emit();
    }
  }

  // Image Preview
  showPreview(event: Event, index: number) {
    const file = (event.target as HTMLInputElement).files[0];

    const fileUpload = this.filesArray.controls[index] as FormGroup;

    fileUpload.get('file').patchValue(file);
    this.fileChange.emit(fileUpload.value);
  }

  fileDetail(index: number): File {
    const list = this.tradeInDocEle.toArray();
    return list[index]?.nativeElement?.files[0];
  }

  onClearBadge() {
    const payload: IPurchases.IUpdateBadge = {
      uuid: this.purchase.uuid,
      section: IPurchases.BadgeSection.TRADE_IN,
    };

    this.badgeChanges.emit(payload);
  }

  onEdit(form?: FormGroup) {
    this.tradeInDetail = false;
    this.form.enable();

    this.brandChanges.emit();
  }

  onCancel() {
    this.form.disable();
    this.tradeInDetail = true;
  }

  onCreateTradeIn(form: FormGroup) {
    const { value, valid } = form;

    if (valid && this.createPermission) {
      traverseAndRemove(value);

      this.createdTradeIn.emit(value);
      this.tradeInDetail = !this.tradeInDetail;
      this.form.disable();
    }
  }

  onUpdateTradeIn(form: FormGroup) {
    const { value, valid } = form;

    if (valid && this.updatePermission) {
      this.tradeInDetail = !this.tradeInDetail;
      traverseAndRemove(value);

      this.updateTradeIn.emit(value);
      this.form.disable();
    }
  }

  compareTitle(title: string): boolean {
    return this.filesArray.controls.some(
      (x: FormControl) => x.get('title').value === title
    );
  }

  removeFile(formCtrl: FormControl): void {
    const { value, valid } = formCtrl;

    if (valid) {
      const payload: ISales.IDeleteFile = {
        uuid: this.purchase?.account?.uuid,
        url: value,
        type: ISales.UploadLocationType.TRADE_IN,
        saleUuid: this.purchase?.uuid,
      };

      this.deleteFile.emit(payload);
    }
  }

  getTitle(index: number): FormControl {
    return this.filesArray.controls[index].get('title') as FormControl;
  }

  get unit(): FormGroup {
    return this.form.get('unit') as FormGroup;
  }

  get manufacturerYear(): FormControl {
    return this.form.get('manufacturerYear') as FormControl;
  }

  get variant(): FormControl {
    return this.unit.get('variant') as FormControl;
  }

  get brand(): FormControl {
    return this.unit.get('brand') as FormControl;
  }

  get model(): FormControl {
    return this.unit.get('model') as FormControl;
  }

  get accountUuid(): FormControl {
    return this.form.get('accountUuid') as FormControl;
  }

  get corporateUuid(): FormControl {
    return this.form.get('corporateUuid') as FormControl;
  }

  get saleUuid(): FormControl {
    return this.form.get('saleUuid') as FormControl;
  }

  get document(): FormArray {
    return this.form.get('documents') as FormArray;
  }

  get years(): number[] {
    return generateArrayOfYears();
  }

  get formDisabled(): boolean {
    return this.form.disabled;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.TradeIn.UPDATE_TRADE_IN]
    ) {
      return true;
    }
    return false;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.TradeIn.CREATE_TRADE_IN]
    ) {
      return true;
    }
    return false;
  }

  get TradeInUploadTitleType() {
    return ISales.TradeInUploadTitleType;
  }

  get filesArray(): FormArray {
    return this.documentsForm.get('files') as FormArray;
  }

  get tradeInDocEleList(): any[] {
    return this.tradeInDocEle ? this.tradeInDocEle.toArray() : [];
  }
}
