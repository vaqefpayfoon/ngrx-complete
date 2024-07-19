import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchDirective } from '../../directives/search.directive';
import { IServiceLine } from '../../models';

@Component({
  selector: 'neural-service-line-search',
  templateUrl: './service-line-search.component.html',
  styleUrls: ['./service-line-search.component.scss']
})
export class ServiceLineSearchComponent extends SearchDirective implements OnChanges {
  
  @Input() services: IServiceLine.IServiceType;

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

  initialForm(): FormGroup {
    return this.fb.group({
      active: [''],
      operationCode: [''],
      isInCustomerApp: [''],
      service: this.fb.group({
        title: [''],
        type: [''],
      }),
    });
  }

  clearTitle(form: FormGroup) {
    this.title.patchValue('');
    this.onSearch(form);
  }
  
  clearOperationCode(form: FormGroup) {
    this.operationCode.patchValue('');
    this.onSearch(form);
  }
}
