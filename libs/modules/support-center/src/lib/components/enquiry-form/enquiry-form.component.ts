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
import { IEnquiries } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'neural-enquiry-form',
  templateUrl: './enquiry-form.component.html',
  styleUrls: ['./enquiry-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiryFormComponent implements OnChanges {
  @Input() disabled: boolean;

  @Input() enquiry: IEnquiries.IDocument;

  @Input() permissions: any;

  @Output() loaded: EventEmitter<IEnquiries.IDocument> = new EventEmitter<
    IEnquiries.IDocument
  >();

  @Output() updated: EventEmitter<IEnquiries.IDocument> = new EventEmitter<
    IEnquiries.IDocument
  >();

  exists = false;

  form = this.fb.group({
    name: ['', Validators.compose([Validators.required])],
    email: ['', Validators.compose([Validators.required])],
    phone: this.fb.group({
      code: ['', Validators.compose([Validators.required])],
      number: ['', Validators.compose([Validators.required])],
    }),
    corporateUuid: ['', Validators.compose([Validators.required])],
    subject: ['', Validators.compose([Validators.required])],
    uuid: ['', Validators.compose([Validators.required])],
    status: ['', Validators.compose([Validators.required])],
    details: ['', Validators.compose([Validators.required])],
    division: ['', Validators.compose([Validators.required])],
    comment: ['', Validators.compose([Validators.required])],
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.enquiry && changes.enquiry.currentValue) {
      this.loaded.emit(this.enquiry);

      this.form.patchValue(this.enquiry);

      this.form.disable();

      this.exists = true;
    }
  }

  cancel(form: FormGroup) {
    form.disable();
  }

  edit(form: FormGroup) {
    const status = <FormControl>form.get('status');
    const comment = <FormControl>form.get('comment');

    status.enable();
    comment.enable();
  }

  update(form: FormGroup) {
    const { valid, value } = form;
    if (valid) {
      this.updated.emit({ ...this.enquiry, ...value });
    }
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Enquiry.UPDATE_ENQUIRY]
    ) {
      return true;
    }
    return false;
  }

  get phone(): FormGroup {
    return <FormGroup>this.form.get('phone');
  }

  get statuses() {
    return IEnquiries.Statuses;
  }
}
