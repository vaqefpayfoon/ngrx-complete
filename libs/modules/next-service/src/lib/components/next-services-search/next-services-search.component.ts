import { Component, OnDestroy, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchDirective } from '../../directives';

@Component({
  selector: 'neural-next-services-search',
  templateUrl: './next-services-search.component.html',
  styleUrls: ['./next-services-search.component.scss'],
})
export class NextServicesSearchComponent
  extends SearchDirective {
  constructor(fb: FormBuilder) {
    super(fb);
  }

  onReset(): void {
    this.form.reset();
    this.to.disable();
  }
  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    // this.corporateUuid.patchValue(this.selectedCorporate?.uuid);
    // this.branchUuid.patchValue(this.selectedBranch?.uuid);
  }

  initialForm(): FormGroup {
    return this.fb.group({
      // corporateUuid: [''],
      // branchUuid: [''],
      type: [''],
      account: this.fb.group({
        email: [''],
      }),
      accountVehicle: this.fb.group({
        vehicleReference: this.fb.group({
          unit: this.fb.group({
            display: [''],
          }),
        }),
        nextService: this.fb.group({
          estimatedEngineOilService: this.fb.group({
            from: [''],
            to: [
              {
                value: '',
                disabled: true,
              },
            ],
          }),
        })
      }),
    });
  }
  clearAccountEmail(form: FormGroup) {
    this.accountEmail.patchValue('');
    this.onSearch(form);
  }
  clearDisplay(form: FormGroup) {
    this.displayForm.patchValue('');
    this.onSearch(form);
  }
}
