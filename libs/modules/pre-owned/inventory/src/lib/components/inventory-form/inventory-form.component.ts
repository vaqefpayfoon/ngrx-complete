import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';

// Auth
import { Auth } from '@neural/auth';

// Account tags
import { permissionTags } from '@neural/shared/data';

//Forms
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

//Models
import { IInventory } from '../../models';

@Component({
  selector: 'neural-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss'],
})
export class InventoryFormComponent implements OnChanges {
  @Input() permissions: any;

  @Input() selectedCorporate: Auth.ICorporates | null;

  @Input() inventoryUploadedFile: IInventory.ICreate | null;

  @Output() loaded = new EventEmitter<string>();

  @Output() uploaded = new EventEmitter<IInventory.ICreate>();

  @ViewChild('zipFileInput') zipFileInput: ElementRef;

  form = this.fb.group({
    uuid: ['', Validators.compose([Validators.required])],
    file: ['', Validators.compose([Validators.required])],
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      this.loaded.emit(this.selectedCorporate.name);

      this.cancel();
    }
  }

  cancel() {
    this.form.reset();

    this.zipFileInput.nativeElement.value = '';
  }

  upload(form: FormGroup) {
    const { valid, value } = form;
    if (valid) {
      this.uploaded.emit(value);
      this.form.reset();
    }
  }

  // Image Preview
  showPreview(event: any) {
    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({
      file: file,
      uuid: this.selectedCorporate.uuid,
    });
    this.form.markAllAsTouched();
    this.form.markAsDirty();
  }

  get file(): FormControl {
    return <FormControl>this.form.get('file');
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Analytic.UPLOAD_PRE_OWNED_INVENTORY]
    ) {
      return true;
    }
    return false;
  }
}
