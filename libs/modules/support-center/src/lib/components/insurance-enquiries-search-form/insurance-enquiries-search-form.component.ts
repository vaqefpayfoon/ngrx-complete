import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  SimpleChanges,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';

// Models
import { IInsuranceEnquiries } from '../../models';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Auth } from '@neural/auth';
import { traverseAndRemove, IGlobalFilter } from '@neural/shared/data';

@Component({
  selector: 'neural-insurance-enquiries-search-form',
  templateUrl: './insurance-enquiries-search-form.component.html',
  styleUrls: ['./insurance-enquiries-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceEnquiriesSearchFormComponent implements OnInit {
  @Input() filters: IGlobalFilter;

  form: FormGroup;

  formChange$: Observable<any>;

  @Output() formValueChanges = new EventEmitter<IGlobalFilter>();

  panelOpenState = true;

  constructor(private fb: FormBuilder) {
    this.form = this.initialForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters && changes.filters.currentValue) {
      this.form.patchValue(this.filters, { onlySelf: true, emitEvent: false });
    }

    if (
      changes.filters &&
      !changes.filters.firstChange &&
      !Object.keys(this.filters).length
    ) {
      this.form.reset({}, { onlySelf: true, emitEvent: false });
    }
  }

  ngOnInit() {
    this.formChange$ = this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      map((value) => {
        traverseAndRemove(value);
        this.formValueChanges.emit(value);
      })
    );
  }
  private initialForm(): FormGroup {
    const formGroup = {};

    for (const item of IInsuranceEnquiries.Filter.like) {
      formGroup[item] = [''];
    }

    return this.fb.group({
      numberPlate: [],
      'document.type': [],
      'document.id': [],
      postCode: [],
    });
  }

  get filterItems(): string[] {
    return IInsuranceEnquiries.Filter.like;
  }

  get documentType() {
    return Auth.DocumentType;
  }

  get numberPlate(): FormControl {
    return this.form.controls['numberPlate'] as FormControl;
  }

  get postCode(): FormControl {
    return this.form.controls['postCode'] as FormControl;
  }

  get documentTypeCtrl(): FormControl {
    return this.form.controls['document.type'] as FormControl;
  }

  get documentId(): FormControl {
    return this.form.controls['document.id'] as FormControl;
  }
}

function defaultCompare(a: any, b: any) {
  return a === b;
}
