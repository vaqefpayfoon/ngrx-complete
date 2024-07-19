import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiModule } from '@neural/ui';

import * as googleLocationComponents from './components';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [...googleLocationComponents.COMPONENTS],
  exports: [...googleLocationComponents.COMPONENTS],
})
export class GoogleLocationModule {}
