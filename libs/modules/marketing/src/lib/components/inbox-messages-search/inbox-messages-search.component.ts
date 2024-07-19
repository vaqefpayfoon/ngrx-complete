import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
} from '@angular/core';

//forms
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

//function
import { traverseAndRemove } from 'libs/shared/data/src/lib/functions';
import { Subscription } from 'rxjs';

//model
import { IInboxMessages } from '../../models';

@Component({
  selector: 'neural-inbox-messages-search',
  templateUrl: './inbox-messages-search.component.html',
  styleUrls: ['./inbox-messages-search.component.scss'],
})
export class InboxMessagesSearchComponent {
  form: FormGroup;

  panelOpenState = true;

  timer: number;

  @Output() searched = new EventEmitter<IInboxMessages.ISearch>();

  @Input() filters: IInboxMessages.IFilter;

  subscribtion: Subscription;

  constructor(private fb: FormBuilder) {
    this.form = this.initialForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters && changes.filters.currentValue) {
      this.form.patchValue(this.filters);
      this.title.patchValue(this.filters?.['payload.title']);
    }
    if (!this.filters) {
      this.onReset();
    }
  }

  ngOnDestroy(): void {
    this.subscribtion?.unsubscribe();
  }

  onReset(): void {
    this.form.reset();
  }

  initialForm() {
    return this.fb.group({
      title: [''],
      type: [''],
    });
  }

  onSearch(form: FormGroup): void {
    const { valid, value } = form;

    const filter = {
      type: value.type,
      ['payload.title']: value.title,
    };

    if (valid) {
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        traverseAndRemove(filter);
        this.searched.emit(filter);
      }, 1000);
    }
  }

  clearTitle(form: FormGroup) {
    this.title.patchValue('');
    this.onSearch(form);
  }

  get title(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get types() {
    return IInboxMessages.MessageType;
  }
}
