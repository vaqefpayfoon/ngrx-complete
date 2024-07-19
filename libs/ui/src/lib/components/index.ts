import { DynamicHeaderComponent } from './dynamic-header/dynamic-header.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { ErrorComponent } from './error/error.component';
import { HtmlEditorComponent } from './html-editor/html-editor.component';
import { TagsComponent } from './html-editor/tags/tags.component';

export const COMPONENTS: any[] = [
  DynamicHeaderComponent,
  ShowErrorsComponent,
  ErrorComponent,
  HtmlEditorComponent,
  TagsComponent
];

export * from './dynamic-header/dynamic-header.component';
export * from './show-errors/show-errors.component';
export * from './error/error.component';
export * from './html-editor/html-editor.component';
export * from './html-editor/tags/tags.component';