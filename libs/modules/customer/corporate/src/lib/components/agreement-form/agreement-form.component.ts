import {
  Component,
  ChangeDetectionStrategy,
  OnChanges,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl,
} from '@angular/forms';

// Models
import { IAgreements, ICorporates } from '../../models';

// Material select
import { MatSelectChange } from '@angular/material/select';

// Location
import { Location } from '@angular/common';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-agreement-form',
  templateUrl: './agreement-form.component.html',
  styleUrls: ['./agreement-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementFormComponent implements OnChanges {
  @Input() corporate: ICorporates.IDocument;

  @Input() agreement: IAgreements.IDocument;

  @Input() permissions: any;

  @Input() agreementUploadedFile: {
    index: number;
    pdfUrl: string;
  };

  @Output()
  create: EventEmitter<IAgreements.ICreate> = new EventEmitter<
    IAgreements.ICreate
  >();

  @Output()
  update: EventEmitter<IAgreements.IDocument> = new EventEmitter<
    IAgreements.IDocument
  >();

  @Output()
  loaded = new EventEmitter<{
    agreement?: IAgreements.IDocument;
    corporate: ICorporates.IDocument;
  }>();

  @Output() uploadFile = new EventEmitter<{
    index: number;
    payload: IAgreements.IUploadFile;
  }>();

  exists: boolean;

  editable: boolean;

  form = this.fb.group({
    corporateUuid: ['', Validators.compose([Validators.required])],
    type: ['', Validators.compose([Validators.required])],
    clauses: this.fb.array([]),
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.corporate && changes.corporate.currentValue) {
      // patch corporateUuid
      this.corporateUuid.patchValue(this.corporate.uuid);

      this.loaded.emit({ corporate: this.corporate });
    }

    if (
      changes.agreementUploadedFile &&
      changes.agreementUploadedFile.currentValue
    ) {
      const { index, pdfUrl } = this.agreementUploadedFile;

      const pdfUrlCtrl: FormControl = this.getPdfUrl(index);

      pdfUrlCtrl.patchValue(pdfUrl);
    }

    if (changes.agreement && changes.agreement.currentValue) {
      this.form.patchValue(this.agreement);

      this.emptyClauses();

      const { clauses } = this.agreement;

      for (const clause of clauses) {
        this.addClauses(clause);
      }

      this.exists = true;
      this.form.disable();
    }

    if (this.agreement && this.corporate) {
      this.loaded.emit({
        agreement: this.agreement,
        corporate: this.corporate,
      });
    }
  }

  elementType(clausesIdx: number, elementIdx: number): FormControl {
    const clausesControls = this.clausesControls[clausesIdx].get(
      'elements'
    ) as FormArray;

    return clausesControls.controls[elementIdx].get('type') as FormControl;
  }

  elementsControls(index: number) {
    const elements = this.clausesControls[index].get('elements') as FormArray;
    return elements.controls;
  }

  emptyClauses() {
    while (this.clauses.controls.length) {
      this.clauses.removeAt(0);
    }
  }

  createClauses() {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      elements: this.fb.array([]),
      pdfUrl: [''],
    });
  }

  createElement() {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      isCompulsory: [false, Validators.compose([Validators.required])],
      isChecked: [false, Validators.compose([Validators.required])],
    });
  }

  addClauses(clause?: IAgreements.IClause) {
    if (clause) {
      const elements: FormArray = this.fb.array([]);

      for (const ele of clause.elements) {
        const createElement = this.fb.group({
          title: [ele.title, Validators.compose([Validators.required])],
          type: [ele.type, Validators.compose([Validators.required])],
          isCompulsory: [
            ele.isCompulsory,
            Validators.compose([Validators.required]),
          ],
          isChecked: [ele.isChecked, Validators.compose([Validators.required])],
        });
        elements.push(createElement);
      }

      const createclauses = this.fb.group({
        title: [clause.title, Validators.compose([Validators.required])],
        elements,
        pdfUrl: [clause.pdfUrl],
      });

      this.clauses.push(createclauses);
    } else {
      this.clauses.push(this.createClauses());
    }
  }

  addElement(index: number, element?: IAgreements.IClausElement | any) {
    const elements = this.clauses.controls[index].get('elements') as FormArray;

    if (element) {
      const createElement = this.fb.group({
        title: [element.title, Validators.compose([Validators.required])],
        type: [element.type, Validators.compose([Validators.required])],
        isCompulsory: [
          element.isCompulsory,
          Validators.compose([Validators.required]),
        ],
        isChecked: [
          element.isChecked,
          Validators.compose([Validators.required]),
        ],
      });
      elements.push(createElement);
    } else {
      elements.push(this.createElement());
    }
  }

  removeElement(index: number, idx: number) {
    const element = this.clauses.controls[index].get('elements') as FormArray;
    return element.removeAt(idx);
  }

  removeClauses(event: number) {
    const control = this.form.get('clauses') as FormArray;
    return control.removeAt(event);
  }

  checkClausesNumber(value: string) {
    return Object.keys(IAgreements.ClauseTypes[value]).length;
  }

  onChangeType(event: MatSelectChange) {
    const { value } = event;
    if (value) {
      this.emptyClauses();
      this.addClauses();
      this.clauses.enable();
    }
  }

  behaviourForm(event: boolean) {
    if (event) {
      if (!!this.agreement) {
        this.form.patchValue(this.agreement);

        this.emptyClauses();

        const { clauses, pdfUrl } = this.agreement;

        for (const clause of clauses) {
          this.addClauses(clause);
        }

        this.exists = true;

        return this.form.disable();
      }
      return this.location.back();
    } else {
      if (this.agreement && this.updatePermission) {
        this.form.enable();

        this.type.disable();
      }
    }
  }

  createAgreement(form: FormGroup) {
    const { valid, value } = form;
    if (valid && this.createPermission) {
      this.create.emit(value);
      this.form.disable();
    }
  }

  updateAgreement(form: FormGroup) {
    const { valid, value, pristine } = form;
    if (valid && !pristine && this.updatePermission) {
      this.update.emit({
        ...this.agreement,
        ...value,
      });

      this.form.disable();
    }
  }

  // Image Preview
  showPreview(event: Event, clauseIndex: number) {
    const file = (event.target as HTMLInputElement).files[0];

    const payload: IAgreements.IUploadFile = {
      corporateUuid: this.corporate.uuid,
      file: file,
      type: this.type.value,
    };

    this.uploadFile.emit({
      index: clauseIndex,
      payload,
    });

    this.form.markAllAsTouched();
    this.form.markAsDirty();
  }

  getPdfUrl(index: number): FormControl | null {
    const pdfUrl = this.clausesControls[index].get('pdfUrl') as FormControl;
    if (pdfUrl) {
      return pdfUrl;
    }
    return null;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Agreement.CREATE_AGREEMENT]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Agreement.UPDATE_AGREEMENT]
    ) {
      return true;
    }
    return false;
  }

  get clauses(): FormArray {
    return this.form.get('clauses') as FormArray;
  }

  get clausesControls() {
    return (this.form.get('clauses') as FormArray).controls;
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get corporateUuid() {
    return this.form.get('corporateUuid') as FormControl;
  }

  get type() {
    return this.form.get('type') as FormControl;
  }

  get agreementTypes() {
    return IAgreements.Types;
  }

  get agreementTypesClauseTypes() {
    return IAgreements.ClauseTypes;
  }
}
