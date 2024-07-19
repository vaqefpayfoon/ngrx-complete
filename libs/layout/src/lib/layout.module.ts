import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// UI Module (Material)
import { UiModule } from '@neural/ui';

// Containers
import * as layoutContainers from './containers';

// Components
import * as layoutComponents from './components';

// Directive
import { DirectivesModule } from '@neural/shared/util/directives';

// Services
import * as fromServices from './services';

@NgModule({
  imports: [CommonModule, UiModule, DirectivesModule],
  declarations: [
    ...layoutComponents.COMPONENTS,
    ...layoutContainers.COMPONENTS,
  ],
  exports: [...layoutComponents.COMPONENTS, ...layoutContainers.COMPONENTS],
})
export class LayoutModule {
  static forRoot(): ModuleWithProviders<LayoutModule> {
    return {
      ngModule: LayoutModule,
      providers: [...fromServices.services],
    };
  }
}
