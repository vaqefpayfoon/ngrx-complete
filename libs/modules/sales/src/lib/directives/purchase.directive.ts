import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive()
export abstract class PurchaseDirective<T> {
  @Input() disabled: boolean;

  @Input() purchase: T;

  @Input() permissions: any;

  @Output() cancelChange = new EventEmitter<T>();

  @Output() completeChange = new EventEmitter<T>();
}
