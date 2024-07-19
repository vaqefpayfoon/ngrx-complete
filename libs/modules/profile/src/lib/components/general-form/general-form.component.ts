import {
  Component,
  OnChanges,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';

// Angular Forms
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';

// Regex pattern
import { REGEX_PATTERNS } from '@neural/shared/data';

// Interfaces
import { Auth } from '@neural/auth';

import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle';

// ngrx store
import { Store } from '@ngrx/store';

// Validation
import { ValidationService } from '@neural/ui';

@Component({
  selector: 'neural-general-form',
  templateUrl: './general-form.component.html',
  styleUrls: ['./general-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,
      useValue: { disableToggleValue: true, disableDragValue: true },
    },
  ],
})
export class GeneralFormComponent implements OnChanges {
  @Input() account: Auth.AccountClass;
  @Input() codes: Auth.IPhoneCode[];
  @Output() submittedAccountProfile = new EventEmitter();
  @Output() submittedEmail = new EventEmitter();
  @Output() submittedPhone = new EventEmitter();
  @Output() submittedPassword = new EventEmitter();
  @Output() submittedImage = new EventEmitter();
  exists: boolean;

  hide = true;
  hideRepass = true;

  salutationList = Auth.Salutation;

  documentTypeList = Auth.DocumentType;

  nameForm = this.fb.group({
    identity: this.fb.group({
      salutation: [''],
      fullName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
      ],
    }),
    document: this.fb.group({
      id: [''],
      type: [''],
    }),
    // first: [
    //   '',
    //   Validators.compose([
    //     Validators.required,
    //     Validators.minLength(2),
    //     Validators.maxLength(50)
    //   ])
    // ],
    // last: [
    //   '',
    //   Validators.compose([
    //     Validators.required,
    //     Validators.minLength(2),
    //     Validators.maxLength(50)
    //   ])
    // ]
  });

  emailForm = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
  });

  passwordForm = this.fb.group(
    {
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          ValidationService.password,
        ]),
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          ValidationService.password,
        ],
      ],
    },
    {
      validator: this.matchPassword,
    }
  );

  phoneForm = this.fb.group({
    phone: this.fb.group({
      code: ['', Validators.compose([Validators.required])],
      number: ['', Validators.compose([Validators.required])],
    }),
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.account && changes.account && changes.account.currentValue) {
      this.exists = true;

      const { name, identity, email, phone, document } = this.account;
      // Name form

      if (identity) {
        this.identity.patchValue(identity);
      }

      // Email form
      this.emailForm.patchValue({
        email,
      });

      // Phone form
      if (phone) {
        this.phoneForm.patchValue({
          phone,
        });
      }
      if (document) {
        this.document.patchValue(document);
      }
      this.nameForm.disable();
      this.emailForm.disable();
      this.phoneForm.disable();
    }
  }

  matchPassword(control: AbstractControl) {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;

    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ passwordMismatch: true });
    } else {
      return null;
    }
  }

  uploadImg(file: FileList) {
    const isFile = Boolean(file.length);

    if (isFile) {
      this.submittedImage.emit({ ...this.account, file: file[0] });
    }
  }

  onSelfAccountProfile(form: FormGroup) {
    const { valid, value, pristine } = form;

    if (valid && !pristine) {
      this.submittedAccountProfile.emit({
        ...this.account,
        ...value,
      });
    }
  }

  onPhoneSubmit(form: FormGroup) {
    const { valid, value, pristine } = form;
    if (valid && !pristine) {
      this.submittedPhone.emit(value.phone);
    }
  }

  onPasswordSubmit(form: FormGroup) {
    const { valid, value, pristine } = form;
    if (valid && !pristine) {
      this.submittedPassword.emit(value.password);
    }
  }

  get name() {
    return this.account.identity;
  }

  get image() {
    return this.account ? this.account.image : null;
  }

  get isFacebookConnect(): boolean {
    return this.account ? this.account.isFacebookConnected : null;
  }

  get isGoogleConnected(): boolean {
    return this.account ? this.account.isGoogleConnected : null;
  }

  get isAppleConnected(): boolean {
    return this.account ? this.account.isAppleConnected : null;
  }

  get phoneGroup() {
    return this.phoneForm.get('phone') as FormGroup;
  }

  get identity() {
    return this.nameForm.get('identity') as FormGroup;
  }

  get formDisabled() {
    return this.identity.disabled;
  }
  get documentFormDisabled() {
    return this.document.disabled;
  }

  get phoneFormDisabled() {
    return this.phoneForm.disabled;
  }
  get document() {
    return this.nameForm.get('document') as FormGroup;
  }
}
