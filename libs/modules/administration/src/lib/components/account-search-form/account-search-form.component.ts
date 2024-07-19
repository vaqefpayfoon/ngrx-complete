import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Auth } from '@neural/auth';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { traverseAndRemove } from '@neural/shared/data';
import { IAccount } from '../../models';

@Component({
  selector: 'neural-account-search-form',
  templateUrl: './account-search-form.component.html',
  styleUrls: ['./account-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSearchFormComponent implements OnInit {

  @Input() codes: Auth.IPhoneCode[];

  @Output() searchChange = new EventEmitter<IAccount.IFilter>();

  searchForm: FormGroup = this.fb.group({
    email: ['', Validators.email],
    'phone.code': [''],
    'phone.number': [''],
    'identity.fullName': [''],
  });

  constructor(private fb: FormBuilder) {
    this.searchForm.disable();
  }

  ngOnInit(): void {
  }

  onSearch(form: FormGroup) {
    const { valid, value } = form;
    if (valid) {
      traverseAndRemove(value);
      this.searchChange.emit(value);
    }
  }

}
