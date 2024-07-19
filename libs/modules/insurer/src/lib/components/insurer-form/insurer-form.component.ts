import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

// Permission Tags
import { IBody, permissionTags } from '@neural/shared/data';

import { IInsurer } from '../../models';

@Component({
  selector: 'neural-insurer-form',
  templateUrl: './insurer-form.component.html',
  styleUrls: ['./insurer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsurerFormComponent implements OnChanges {
  @Input() insurer!: IInsurer.IDocument | null | undefined;

  @Input() corporateUuid!: string | null | undefined;

  @Input() permissions!: { [name: string]: boolean } | null;

  @Output() created = new EventEmitter<IInsurer.ICreate>();

  @Output() updated = new EventEmitter<
    IBody<IInsurer.IDocument, IInsurer.IUpdate>
  >();

  @Output() loaded = new EventEmitter<IInsurer.IDocument>();

  form!: FormGroup;

  exists = false;

  constructor(private fb: FormBuilder) {
    this.form = this.initialForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.corporateUuid && changes.corporateUuid.currentValue) {
      this.corporateUuidCtrl.patchValue(this.corporateUuid);
    }

    if (changes.insurer && changes.insurer.currentValue && this.insurer) {
      this.form.patchValue(this.insurer);
      this.exists = true;
      this.form.disable();
      this.loaded.emit(this.insurer);
    }
  }

  private initialForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      corporateUuid: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      url: [''],
      image: ['', Validators.compose([Validators.required])],
    });
  }

  onCreate(form: FormGroup): void {
    const { valid, value } = form;
    if (valid && this.createPermission) {
      this.created.emit(value);
      this.form.disable();
    }
  }

  onUpdate(form: FormGroup): void {
    const { valid, value } = form;
    if (valid && this.insurer && this.updatePermission) {
      this.updated.emit({
        changes: value,
        document: this.insurer,
      });
      this.form.disable();
    }
  }

  onEdit(form: FormGroup) {
    const { value } = form;
    form.enable();

    this.urlAvailability(value.type);
  }

  onChangeType(event: MatSelectChange) {
    const { value } = event;

    this.urlAvailability(value);
  }

  private urlAvailability(value: string) {
    value === IInsurer.InsurerType.WEB ? this.url.enable() : this.url.disable();
  }

  get corporateUuidCtrl(): FormControl {
    return this.form.get('corporateUuid') as FormControl;
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get url(): FormControl {
    return this.form.get('url') as FormControl;
  }

  get insurerType() {
    return IInsurer.InsurerType;
  }

  get formDisabled(): boolean {
    return this.form.disabled;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Insurer.CREATE_INSURER]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Insurer.UPDATE_INSURER]
    ) {
      return true;
    }
    return false;
  }
}
