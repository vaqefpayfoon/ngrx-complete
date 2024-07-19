import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive()
export abstract class NextServiceDirective<T> {
  @Input()
  disabled: boolean = false;

  @Input()
  nextService!: T;

  @Input() permissions: any;

  @Output() cancelChange = new EventEmitter<T>();

  @Output() completeChange = new EventEmitter<T>();
}
