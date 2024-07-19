import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';

// Model
import { IAccount } from '../../models';
import { Auth } from '@neural/auth';

// Account tags
import { permissionTags } from '@neural/shared/data';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'neural-synchronization-form',
  templateUrl: './synchronization-form.component.html',
  styleUrls: ['./synchronization-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynchronizationFormComponent implements OnChanges {
  @Input() permissions: any;

  @Input() selectedCorporate: Auth.ICorporates;

  @Output() loaded = new EventEmitter<string>();

  @Output() updated: EventEmitter<IAccount.ISynchronization> = new EventEmitter<
    IAccount.ISynchronization
  >();

  form = this.fb.group({
    url: [
      {
        value: '',
        disabled: true,
      },
      Validators.compose([Validators.required]),
    ],
    file: [null, Validators.compose([Validators.required])],
  });

  labelType: 'link' | 'file' = 'file';

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      this.loaded.emit(this.selectedCorporate.name);
    }
  }

  cancel(form: FormGroup) {
    form.reset();
  }

  update(form: FormGroup) {
    const { valid, value } = form;
    if (valid) {
      this.updated.emit(value);
    }
  }

  // Image Preview
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({
      file: file,
    });

    this.form.markAllAsTouched();
    this.form.markAsDirty();
  }

  change(event: MatRadioChange) {
    this.form.reset();
    if (event.value === 'link') {
      this.url.enable();
      return this.file.disable();
    }
    this.file.enable();
    return this.url.disable();
  }

  get url(): FormControl {
    return <FormControl>this.form.get('url');
  }

  get file(): FormControl {
    return <FormControl>this.form.get('file');
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Account.ACCOUNT_EXCEL_IMPORT]
    ) {
      return true;
    }
    return false;
  }
}
