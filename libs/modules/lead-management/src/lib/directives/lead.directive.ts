import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive()
export abstract class LeadDirective<T> {
  @Input() disabled: boolean;

  @Input() lead: T;

  @Input() permissions: any;

  @Output() cancelChange = new EventEmitter<T>();

  @Output() completeChange = new EventEmitter<T>();
}
