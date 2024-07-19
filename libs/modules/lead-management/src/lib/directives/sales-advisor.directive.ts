import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

import { ISalesAdvisor } from '@neural/modules/administration';
import { FormControl, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[neuralSalesAdvisor]',
})
export class SalesAdvisorDirective {
  @Input() salesAdvisors: ISalesAdvisor.ISADocument[];

  @Input() selected: FormControl | AbstractControl;

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
    private renderer2: Renderer2
  ) {}

  private formatValue() {
    const findOne = this.salesAdvisors.find(
      (acc) => acc.uuid === this.selected.value?.uuid
    );
    if (!findOne) {
      this.renderer2.setStyle(
        this.elementRef.nativeElement,
        'border-color',
        'red'
      );
    } else {
      this.renderer2.setStyle(
        this.elementRef.nativeElement,
        'border-color',
        'green'
      );
    }
  }

  @HostListener('blur')
  _onBlur() {
    this.formatValue();
  }

  @HostListener('focus')
  _onFocus() {
    this.formatValue();
  }
}
