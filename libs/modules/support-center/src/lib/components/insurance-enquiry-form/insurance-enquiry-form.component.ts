import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// Model
import { IInsuranceEnquiries } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';
import {
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'neural-insurance-enquiry-form',
  templateUrl: './insurance-enquiry-form.component.html',
  styleUrls: [
    './insurance-enquiry-form.component.scss',
    '../enquiry-form/enquiry-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceEnquiryFormComponent implements OnChanges {
  @Input() disabled: boolean;

  @Input() insuranceEnquiry: IInsuranceEnquiries.IDocument;

  @Input() permissions: any;

  @Output() loaded: EventEmitter<
    IInsuranceEnquiries.IDocument
  > = new EventEmitter<IInsuranceEnquiries.IDocument>();

  @Output() updated: EventEmitter<
    IInsuranceEnquiries.IDocument
  > = new EventEmitter<IInsuranceEnquiries.IDocument>();

  exists = false;

  form = this.fb.group({
    status: [''],
    adminRemark: [''],
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.insuranceEnquiry && changes.insuranceEnquiry.currentValue) {
      this.loaded.emit(this.insuranceEnquiry);

      this.form.patchValue(this.insuranceEnquiry);

      this.form.disable();

      this.exists = true;
    }
  }

  cancel(form: FormGroup) {
    form.disable();
  }

  edit(form: FormGroup) {
    const status = <FormControl>form.get('status');
    const adminRemark = <FormControl>form.get('adminRemark');

    status.enable();
    adminRemark.enable();
  }

  update(form: FormGroup) {
    const { valid, value } = form;
    if (valid) {
      this.updated.emit({ ...this.insuranceEnquiry, ...value });
    }
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.InsuranceEnquiry.UPDATE_INSURANCE_ENQUIRY]
    ) {
      return true;
    }
    return false;
  }

  get statuses() {
    return IInsuranceEnquiries.Status;
  }
}
