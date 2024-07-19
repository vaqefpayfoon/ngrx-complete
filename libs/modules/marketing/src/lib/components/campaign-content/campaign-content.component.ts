import {
  Component,
  ChangeDetectionStrategy,
  Optional,
  SkipSelf,
  OnChanges,
  SimpleChanges,
  Input,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

// Angular Form
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';

// Parent form
import { CampaignFormComponent } from '../campaign-form/campaign-form.component';

// Material component
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { ContentType } from '../../models/campaigns.interface';
import { ICampaigns } from '../../models';

import { isDataURL } from '@neural/shared/data';
import { IData } from '@neural/shared/data';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HtmlEditorComponent } from 'libs/ui/src/lib/components/html-editor/html-editor.component';

/**
 * @description form class for create/update content campaign
 * @author {{Mohammad Jalili}}
 * @export
 * @class CampaignContentComponent
 */
@Component({
  selector: 'neural-campaign-content',
  templateUrl: './campaign-content.component.html',
  styleUrls: [
    './campaign-content.component.scss',
    '../campaign-form/campaign-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignContentComponent implements OnChanges, OnDestroy {
  /**
   * @description campaign interface
   * @type {ICampaigns.IDocument}
   * @memberof CampaignContentComponent
   */
  @Input() campaign: ICampaigns.IDocument;

  /**
   * @description uploaded images
   * @type {string}
   * @memberof CampaignContentComponent
   */
  @Input() images: string[];

  /**
   * @description
   * @type {string}
   * @memberof CampaignContentComponent
   */
  favoritePdfFile: string;

  private dialogRef: MatDialogRef<HtmlEditorComponent>;

  /**
   * Creates an instance of CampaignContentComponent.
   * @author {{Mohammad Jalili}}
   * @param {CampaignFormComponent} campaignForm
   * @memberof CampaignContentComponent
   */
  constructor(
    @SkipSelf() @Optional() private campaignForm: CampaignFormComponent,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.campaign && changes.campaign.currentValue) {
      const { content } = this.campaign;

      if (content && content.body && isDataURL(content.body)) {
        this.favoritePdfFile = ICampaigns.ContentPDFType.LINK;
      }

      this.campaignForm.form.markAllAsTouched();
      this.campaignForm.form.markAsDirty();
    }

    if (
      changes.images &&
      changes.images.currentValue &&
      this.dialogRef?.componentInstance
    ) {
      this.dialogRef.componentInstance.renderImage(this.images);
    }
  }

  ngOnDestroy() {
    this.removeHTMLEditorCache();
  }

  /**
   * @description validation of form
   * @readonly
   * @type {boolean}
   * @memberof CampaignContentComponent
   */
  get formInvalid(): boolean {
    return <boolean>this.campaignForm.formInvalid;
  }

  /**
   * @description get content Types
   * @readonly
   * @memberof CampaignContentComponent
   */
  get contentTypes() {
    return this.campaignForm.contentTypes;
  }

  /**
   * @description users can send file with two way
   * upload | link
   * @readonly
   * @memberof CampaignContentComponent
   */
  get contentPdfType() {
    return this.campaignForm.contentPdfType;
  }

  /**
   * @description get enable status of campaign form
   * @readonly
   * @type {boolean}
   * @memberof CampaignContentComponent
   */
  get formEnabled(): boolean {
    return <boolean>this.campaignForm.formEnabled;
  }

  /**
   * @description get disable status of campaign form
   * @readonly
   * @type {boolean}
   * @memberof CampaignContentComponent
   */
  get formDisabled(): boolean {
    return <boolean>this.campaignForm.formDisabled;
  }

  /**
   * @description data form group
   * @readonly
   * @type {FormGroup}
   * @memberof CampaignContentComponent
   */
  get content(): FormGroup {
    return <FormGroup>this.campaignForm.content;
  }

  /**
   * @description check model is exists
   * @readonly
   * @type {boolean}
   * @memberof CampaignContentComponent
   */
  get exists(): boolean {
    return <boolean>this.campaignForm.exists;
  }

  /**
   * @description update permission
   * @readonly
   * @memberof CampaignContentComponent
   */
  get createPermission() {
    return this.campaignForm.createPermission;
  }

  /**
   * @description update permission
   * @readonly
   * @memberof CampaignContentComponent
   */
  get updatePermission() {
    return this.campaignForm.updatePermission;
  }

  /**
   * @description mat congent type change
   * @author {{Mohammad Jalili}}
   * @param {MatSelectChange} event
   * @returns {void}
   * @memberof CampaignContentComponent
   */
  contentTypeChange(event: MatSelectChange): void {
    this.content.controls.body.reset();

    const { value } = event;

    if (ContentType[value] === ContentType.HTML) {
      this.favoritePdfFile = '';
      this.content
        .get('body')
        .setValidators(Validators.compose([Validators.required]));
      return this.campaignForm.form.removeControl('file');
    }
  }

  /**
   * @description MatRadioChange form pdf type
   * @author {{Mohammad Jalili}}
   * @param {MatRadioChange} event
   * @returns
   * @memberof CampaignContentComponent
   */
  pdfTypeChange(event: MatRadioChange) {
    this.content.controls.body.reset();

    const { value } = event;

    if (ICampaigns.ContentPDFType[value] === ICampaigns.ContentPDFType.LINK) {
      this.content
        .get('body')
        .setValidators(Validators.compose([Validators.required]));
      return this.campaignForm.form.removeControl('file');
    } else {
      this.content.get('body').clearValidators();
    }
  }

  /**
   * @description upload pdf file
   * @author {{Mohammad Jalili}}
   * @param {*} event
   * @memberof CampaignContentComponent
   */
  uploadFile(event): void {
    if (!!event.target.files.length) {
      const file = event.target.files[0];

      this.campaignForm.form.addControl(
        'file',
        this.fb.control(file, Validators.compose([Validators.required]))
      );
    }
  }

  /**
   * @description enable camapin form
   * @author {{Mohammad Jalili}}
   * @returns {void}
   * @memberof CampaignContentComponent
   */
  enableForm(): void {
    return this.campaignForm.form.enable();
  }

  /**
   * @description disable campaign form
   * @author {{Mohammad Jalili}}
   * @returns {void}
   * @memberof CampaignContentComponent
   */
  disableForm(): void {
    return this.campaignForm.onCancel();
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignContentComponent
   */
  onCreate() {
    this.campaignForm.onCreate(this.campaignForm.form);
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignContentComponent
   */
  onUpdate() {
    this.campaignForm.onUpdate(this.campaignForm.form);
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @param {*} event
   * @memberof CampaignContentComponent
   */
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];

    const html = <FormControl>this.content.get('body');

    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (evt: any) => {
        html.patchValue(evt.target.result);

        html.updateValueAndValidity();
        this.cd.detectChanges();
      };

      reader.onerror = () => {
        alert('Please upload an valid html file');
      };
    }
  }

  downloadFile(data: string) {
    const blob = new Blob([data], { type: 'application/octet-stream' });

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
  }

  openHTMLEditor(data?: IData) {
    this.dialogRef = this.dialog.open(HtmlEditorComponent, {
      disableClose: false,
      autoFocus: true,
      height: '95%',
      width: '100%',
      data: {
        ...data,
        images: this.campaignForm.images,
      },
    });

    this.dialogRef.componentInstance.image.subscribe((res: File) => {
      if (res) {
        this.campaignForm.uploadImage.emit(res);
      }
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const html = <FormControl>this.content.get('body');

        html.patchValue(result.data);
        html.updateValueAndValidity();
        this.cd.detectChanges();
      }
    });
  }

  removeHTMLEditorCache() {
    localStorage.removeItem('gjs-assets');
    localStorage.removeItem('gjs-components');
    localStorage.removeItem('gjs-css');
    localStorage.removeItem('gjs-html');
    localStorage.removeItem('gjs-styles');
  }
}
