import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Directive
import * as fromPipes from './pipes';

@NgModule({
  imports: [CommonModule],
  exports: [...fromPipes.PIPES],
  declarations: [...fromPipes.PIPES]
})
export class PipesModule {}
