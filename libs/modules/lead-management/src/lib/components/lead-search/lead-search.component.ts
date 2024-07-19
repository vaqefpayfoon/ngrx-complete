import {
  Component, OnChanges, SimpleChanges
} from '@angular/core';

//Angular forms
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

//Directive
import { SearchDirective } from '../../directives';
import { ILead } from '../../models';

@Component({
  selector: 'neural-lead-search',
  templateUrl: './lead-search.component.html',
  styleUrls: ['./lead-search.component.scss'],
})
export class LeadSearchComponent extends SearchDirective implements OnChanges {
  constructor(fb: FormBuilder) {
    super(fb);
  }
  onReset(): void {
    this.form.reset();
  }
  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    this.corporateUuid.patchValue(this.selectedCorporate?.uuid);
    this.branchUuid.patchValue(this.selectedBranch?.uuid);
  }
  ngOnDestroy(): void {
    this.subscribtion?.unsubscribe();
  }

  initialForm(): FormGroup {
    return this.fb.group({
      corporateUuid: [''],
      branchUuid: [''],
      account: this.fb.group({
        email: ['', Validators.compose([Validators.email])],
        identity: this.fb.group({
          fullName: [],
        }),
      }),
      salesAdvisor: this.fb.group({
        identity: this.fb.group({
          fullName: [],
        }),
      }),
      advisorAssigned: [''],
      status: [''],
      priority: ['']
    });
  }

  get leadStatuses() {
    return ILead.Status;
  }
  get leadPriority() {
    return ILead.Priority;
  }
  clearSalesAdvisorFullName(form: FormGroup) {
    this.fullNameSalesAdvisor.patchValue('');
    this.onSearch(form);
  }
  clearAccountFullName(form: FormGroup) {
    this.fullNameAccount.patchValue('');
    this.onSearch(form);
  }
  clearAccountEmail(form: FormGroup) {
    this.accountEmail.patchValue('');
    this.onSearch(form);
  }
  clientFilter(event) {
    this.clientSearch.emit(event);
  }
}
