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
import { ICorporates } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-corporate-social',
  templateUrl: './corporate-social.component.html',
  styleUrls: [
    './corporate-social.component.scss',
    '../corporate-form/corporate-form.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateSocialComponent implements OnChanges {
  @Input() parent: FormGroup;

  @Input() corporate: ICorporates.IDocument;

  @Input() permissions: any;

  @Input() uploadedSocialIcon: {
    url: string;
    index: number;
  };

  @Output() added = new EventEmitter<any>();
  @Output() removed = new EventEmitter<any>();
  @Output() created = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<boolean>();

  @Output() action = new EventEmitter<string>();

  @Output() iconModel = new EventEmitter<{ file: any; index: number }>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.uploadedSocialIcon && changes.uploadedSocialIcon.currentValue) {
      const { index, url } = this.uploadedSocialIcon;
      const socials = <FormArray>this.parent.get('socialAccounts');

      if (!!socials.controls[index] && !!url) {
        const icon = <FormControl>socials.controls[index].get('icon');

        icon.patchValue(url);
      }
    }
  }

  get socialAccountTypes() {
    return ICorporates.SocialAccounts;
  }

  get socialAccounts() {
    return (this.parent.get('socialAccounts') as FormArray).controls;
  }

  get formDisabled() {
    return this.parent.disabled;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.CREATE_CORPORATE]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.UPDATE_CORPORATE]
    ) {
      return true;
    }
    return false;
  }

  onAdd() {
    this.added.emit();
  }

  onRemove(index: number) {
    if (this.socialAccounts.length !== 1) {
      this.removed.emit(index);
    }
  }

  onSave(form: FormGroup) {
    // Check it've saved
    if (this.corporate && this.corporate.uuid) {
      // create new people In Charges
      if (form.valid) {
        this.updated.emit(form.valid);
      }
    } else {
      // Update new people In Charges
      if (form.valid) {
        this.created.emit(form.valid);
      }
    }
  }

  openPanel(trigger: any) {
    if (this.parent.enabled) {
      trigger.openPanel();
    }
  }

  onAction(action: string) {
    this.action.emit(action);
  }

  // Image Preview
  showPreview(event, index: number) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!!file) {
      this.iconModel.emit({ file, index });
    }
  }
}
