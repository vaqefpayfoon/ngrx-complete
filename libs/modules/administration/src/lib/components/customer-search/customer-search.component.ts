import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchDirective } from '../../directives';

@Component({
  selector: 'neural-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss']
})
export class CustomerSearchComponent extends SearchDirective implements OnChanges {
  constructor(fb: FormBuilder) {
    super(fb);
  }
  onReset(): void {
    this.form.reset();
  }
  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }
  ngOnDestroy(): void {
    this.subscribtion?.unsubscribe();
  }
  clearName(form: FormGroup) {
    this.fullNameAccount.patchValue('');
    this.onSearch(form);
  }
  clearEmail(form: FormGroup) {
    this.customerEmail.patchValue('');
    this.onSearch(form);
  }
  initialForm(): FormGroup {
    return this.fb.group({
      identity: this.fb.group({
        fullName: [''],
      }),
      email: ['']
    });
  }

}
