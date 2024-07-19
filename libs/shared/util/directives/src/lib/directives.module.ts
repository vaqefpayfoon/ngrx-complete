import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Directive
import * as fromDirectives from './directives';

@NgModule({
  imports: [CommonModule],
  declarations: [...fromDirectives.DIRECTIVES],
  exports: [...fromDirectives.DIRECTIVES]
})
export class DirectivesModule {}
