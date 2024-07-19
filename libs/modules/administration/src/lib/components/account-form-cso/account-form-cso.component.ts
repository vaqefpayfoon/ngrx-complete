import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

// forms
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

// Models
import { IAccount } from '../../models';

@Component({
  selector: 'neural-account-form-cso',
  templateUrl: './account-form-cso.component.html',
  styleUrls: ['./account-form-cso.component.scss'],
})
export class AccountFormCsoComponent implements OnChanges, OnInit {
  @Input() cso: IAccount.ICso;

  @Input() formDisabled: boolean;

  form: FormGroup;

  constructor(private fb: FormBuilder, private parentForm: FormGroupDirective) {
    this.form = this.csoForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cso && changes.cso.currentValue) {
      this.form.patchValue(this.cso);
    }

    if (changes.formDisabled && changes.formDisabled.currentValue) {
      this.form.disable();
    }
  }

  private csoForm(): FormGroup {
    return this.fb.group({
      since: [''],
      rate: ['', Validators.compose([Validators.min(0), Validators.max(5)])],
      averageServiceTime: [''],
    });
  }

  ngOnInit(): void {
    this.parentForm.form.addControl('cso', this.form);
  }
}
