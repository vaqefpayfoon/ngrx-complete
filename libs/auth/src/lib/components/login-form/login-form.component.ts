import {
  Component,
  OnChanges,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';

// Interfaces
import { Auth } from '../../models';

// Angular Forms
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ValidationService } from '@neural/ui';

@Component({
  selector: 'neural-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnChanges {
  @Input()
  version: string;

  @Input()
  loading: boolean;

  @Input()
  anonymousToken: string;

  @Input()
  error: string | null;

  @Output()
  submitted: EventEmitter<Auth.Login> = new EventEmitter<Auth.Login>();

  @Output() forgot = new EventEmitter();

  @Output() contactUs = new EventEmitter();

  loginForm: FormGroup;

  private _hide = true;

  public get hide() {
    return this._hide;
  }

  public set hide(value) {
    this._hide = value;
  }

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          ValidationService.password,
        ]),
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.loading) {
      this.loading ? this.loginForm.disable() : this.loginForm.enable();
    }
  }

  login(form: FormGroup) {
    const { valid, value } = form;

    if (valid) {
      this.submitted.emit({
        ...value,
        token: this.anonymousToken,
      });
    } else {
      this.validateAllFormFields(form);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  OnContactUs() {
    this.contactUs.emit(true);
  }
}
