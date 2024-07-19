import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

// Angular forms
import { FormGroup, FormArray, FormControl } from '@angular/forms';

// Models
import { IModels } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-model-gallery',
  templateUrl: './model-gallery.component.html',
  styleUrls: ['./model-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelGalleryComponent implements OnChanges {
  @Input() tempGalleryColorImage: {
    index: number;
    url: {
      interior?: string;
      exterior?: string;
      interiors?: string;
      exteriors?: string;
    };
  };

  @Input() parent: FormGroup;

  @Input() model: IModels.IDocument;

  @Input() permissions: any;

  @Output() addedInterior = new EventEmitter<any>();
  @Output() removedInterior = new EventEmitter<any>();
  @Output() addedExterior = new EventEmitter<any>();
  @Output() removedExterior = new EventEmitter<any>();

  @Output() removedInteriorGalleryImage = new EventEmitter<{
    image: string;
  }>();

  @Output() removedExteriorGalleryImage = new EventEmitter<{
    image: string;
  }>();

  @Output() uploadInteriorGalleryColorImage = new EventEmitter<{
    model: IModels.IFile;
    index: number;
  }>();

  @Output() uploadExteriorGalleryColorImage = new EventEmitter<{
    model: IModels.IFile;
    index: number;
  }>();

  @Output() uploadInteriorGalleryImages = new EventEmitter<{
    model: IModels.IFile;
    index: number;
  }>();

  @Output() uploadExteriorGalleryImages = new EventEmitter<{
    model: IModels.IFile;
    index: number;
  }>();

  @Output() updated = new EventEmitter<boolean>();

  @Output() updateModelImage = new EventEmitter<IModels.IDocument>();

  @Output() action = new EventEmitter<string>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.tempGalleryColorImage &&
      changes.tempGalleryColorImage.currentValue
    ) {
      const { index, url } = this.tempGalleryColorImage;

      if (url && url.interior) {
        (this.interior.controls[index].get('color') as FormGroup)
          .get('image')
          .patchValue(url.interior);
      }

      if (url && url.exterior) {
        (this.exterior.controls[index].get('color') as FormGroup)
          .get('image')
          .patchValue(url.exterior);
      }

      if (url && url.interiors) {
        (this.interior.controls[index].get('images') as FormControl).patchValue(
          [
            ...(this.interior.controls[index].get('images') as FormControl)
              .value,
            url.interiors
          ]
        );
      }

      if (url && url.exteriors) {
        (this.exterior.controls[index].get('images') as FormControl).patchValue(
          [
            ...(this.exterior.controls[index].get('images') as FormControl)
              .value,
            url.exteriors
          ]
        );
      }
    }
  }

  get gallery(): FormGroup {
    return this.parent.get('gallery') as FormGroup;
  }

  get interior(): FormArray {
    return this.gallery.get('interior') as FormArray;
  }

  get exterior(): FormArray {
    return this.gallery.get('exterior') as FormArray;
  }

  get formDisabled() {
    return this.parent.disabled;
  }

  onDeleteInteriorImage(index: number, image: string) {
    const { valid, value } = <FormControl>(
      this.interior.controls[index].get('images')
    );

    if (valid) {
      const imageIndex = value.indexOf(image);

      if (imageIndex !== -1) {
        const itemToBeRemoved = [image];

        const filteredArray = value.filter(
          item => !itemToBeRemoved.includes(item)
        );

        (this.interior.controls[index].get('images') as FormControl).patchValue(
          filteredArray
        );
        
        // todo: delete from s3
        // this.removedInteriorGalleryImage.emit({ image });
      }
    }
  }

  onDeleteExteriorImage(index: number, image: string) {
    const { valid, value } = <FormControl>(
      this.exterior.controls[index].get('images')
    );

    if (valid) {
      const imageIndex = value.indexOf(image);

      if (imageIndex !== -1) {
        const itemToBeRemoved = [image];

        const filteredArray = value.filter(
          item => !itemToBeRemoved.includes(item)
        );

        (this.exterior.controls[index].get('images') as FormControl).patchValue(
          filteredArray
        );
        
        // todo: delete from s3
        // this.removedExteriorGalleryImage.emit({ image });
      }
    }
  }

  onAddInterior() {
    this.addedInterior.emit();
  }

  onRemoveInterior(index: number) {
    if (this.interior.length !== 0) {
      this.removedInterior.emit(index);
    }
  }

  onAddExterior() {
    this.addedExterior.emit();
  }

  onRemoveExterior(index: number) {
    if (this.exterior.length !== 0) {
      this.removedExterior.emit(index);
    }
  }

  onSave(form: FormGroup) {
    if (form.valid && this.updatePermission) {
      this.updated.emit(form.valid);
    }
  }

  onChangeImage(form: FormGroup, image: string) {
    if (form.valid && this.updatePermission) {
      this.updateModelImage.emit({ ...this.model, image });
    }
  }

  onAction(action: string) {
    this.action.emit(action);
  }

  // Image Preview
  showPreviewInterior(event: any, index: any) {
    const file = (event.target as HTMLInputElement).files[0];

    if (file) {
      const model: IModels.IFile = {
        ...this.model,
        file
      };

      this.uploadInteriorGalleryColorImage.emit({ model, index });
    }
  }

  // Image Preview
  showPreviewExterior(event: any, index: any) {
    const file = (event.target as HTMLInputElement).files[0];

    if (file) {
      const model: IModels.IFile = {
        ...this.model,
        file
      };

      this.uploadExteriorGalleryColorImage.emit({ model, index });
    }
  }

  // Image Preview
  showPreviewInteriorImages(event: any, index: any) {
    const file = (event.target as HTMLInputElement).files[0];

    if (file) {
      const model: IModels.IFile = {
        ...this.model,
        file
      };

      this.uploadInteriorGalleryImages.emit({ model, index });
    }
  }

  // Image Preview
  showPreviewExteriorImages(event: any, index: any) {
    const file = (event.target as HTMLInputElement).files[0];

    if (file) {
      const model: IModels.IFile = {
        ...this.model,
        file
      };

      this.uploadExteriorGalleryImages.emit({ model, index });
    }
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Model.UPDATE_MODEL]
    ) {
      return true;
    }
    return false;
  }
}
