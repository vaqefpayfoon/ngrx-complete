import { NumbersOnlyDirective } from './numbers-only/numbers-only.directive';
import { ClickStopPropagationDirective } from './stop-propagation/click-stop-propagation.directive';
import { UppercaseDirective } from './uppercase/uppercase.directive';

export const DIRECTIVES: any[] = [
  NumbersOnlyDirective,
  ClickStopPropagationDirective,
  UppercaseDirective
];

export * from './numbers-only/numbers-only.directive';
export * from './stop-propagation/click-stop-propagation.directive';
export * from './uppercase/uppercase.directive';
