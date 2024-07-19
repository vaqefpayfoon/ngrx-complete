import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';

// Models
import { ITemplates } from '../../models';
import { Auth } from '@neural/auth';

// Location
import { Location } from '@angular/common';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  FormArray
} from '@angular/forms';

// permission tags
import { MatSelectChange } from '@angular/material/select';

import { traverseAndRemove } from '@neural/shared/data';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

// editor interface
import { IData } from '@neural/shared/data';

import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  QuickToolbarService,
  RichTextEditorComponent,
  NodeSelection
} from '@syncfusion/ej2-angular-richtexteditor';
import { Dialog } from '@syncfusion/ej2-popups';

import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HtmlEditorComponent } from '@neural/ui';

@Component({
  selector: 'neural-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService
  ]
})
export class TemplateFormComponent implements OnChanges, OnInit, OnDestroy {
  favoriteType = ITemplates.Types.EDITOR;

  get types() {
    return ITemplates.Types;
  }

  /**
   * @description uploaded images
   * @type {string}
   * @memberof TemplateFormComponent
   */
  @Input() images: string[];

  /**
   * @description
   * @type {*}
   * @memberof TemplateFormComponent
   */
  @Input() router: any;

  /**
   * @description
   * @type {Auth.ICorporates}
   * @memberof TemplateFormComponent
   */
  @Input() selectedCorporate: Auth.ICorporates;

  /**
   * @description
   * @type {ITemplates.IDocument}
   * @memberof TemplateFormComponent
   */
  @Input() template: ITemplates.IDocument;

  /**
   * @description
   * @type {ITemplates.IDocument[]}
   * @memberof TemplateFormComponent
   */
  @Input() masterTemplates: ITemplates.IDocument[];

  /**
   * @description
   * @type {*}
   * @memberof TemplateFormComponent
   */
  @Input() permissions: any;

  /**
   * @description
   * @type {EventEmitter<ITemplates.ICreate | ITemplates.ICreateMaster>}
   * @memberof TemplateFormComponent
   */
  @Output() create: EventEmitter<
    ITemplates.ICreate | ITemplates.ICreateMaster
  > = new EventEmitter();

  /**
   * @description
   * @type {EventEmitter<ITemplates.ICreateFromMaster>}
   * @memberof TemplateFormComponent
   */
  @Output() createFromMaster: EventEmitter<
    ITemplates.ICreateFromMaster
  > = new EventEmitter();

  /**
   * @description
   * @type {EventEmitter<ITemplates.IUpdate>}
   * @memberof TemplateFormComponent
   */
  @Output() update: EventEmitter<ITemplates.IUpdate> = new EventEmitter();

  /**
   * @description
   * @type {EventEmitter<ITemplates.IDocument>}
   * @memberof TemplateFormComponent
   */
  @Output() loaded: EventEmitter<ITemplates.IDocument> = new EventEmitter();

  /**
   * @description upload imgae emitter
   * @memberof TemplateFormComponent
   */
  @Output() uploadImage = new EventEmitter<File>();

  @Output() corporateChange = new EventEmitter<boolean>();

  /**
   * @description
   * @type {RichTextEditorComponent}
   * @memberof TemplateFormComponent
   */
  @ViewChild('customRTE', { static: true })
  public rteEle: RichTextEditorComponent;

  @ViewChild('Dialog', { static: true }) public dialogObj: Dialog;

  /**
   * @description
   * @type {FormGroup}
   * @memberof TemplateFormComponent
   */
  form: FormGroup;

  templateMasterTags: ITemplates.ITag[] = [];

  /**
   * @description
   * @private
   * @type {boolean}
   * @memberof TemplateFormComponent
   */
  private _exists: boolean;

  private dialogRef: MatDialogRef<HtmlEditorComponent>;

  /**
   * @description
   * @type {boolean}
   * @memberof TemplateFormComponent
   */

  public get exists(): boolean {
    return this._exists;
  }
  /**
   * @description
   * @memberof TemplateFormComponent
   */
  public set exists(value: boolean) {
    this._exists = value;
  }

  public backGroundColor = '#4265ed';

  public color = '#FFFFFF';

  public selection: NodeSelection = new NodeSelection();

  public ranges: Range;

  public tools: object = {
    items: [
      'Bold',
      'Italic',
      'Underline',
      '|',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      '|',
      'Formats',
      'Alignments',
      'OrderedList',
      'UnorderedList',
      '|',
      'CreateLink',
      'Image',
      '|',
      'SourceCode',
      {
        tooltipText: 'Insert Tag',
        undo: true,
        click: this.onClick.bind(this),
        template:
          '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">' +
          '<div class="e-tbar-btn-text" style="font-weight: 500;"> Ω </div></button>'
      },
      '|',
      'Undo',
      'Redo'
    ]
  };

  // public toolsHeader: object = {
  //   items: [
  //     'Bold',
  //     'Italic',
  //     'Underline',
  //     '|',
  //     'FontSize',
  //     'FontColor',
  //     'BackgroundColor',
  //     '|',
  //     'Formats',
  //     'Alignments',
  //     'OrderedList',
  //     'UnorderedList',
  //     '|',
  //     'CreateLink',
  //     'Image',
  //     '|',
  //     'SourceCode',
  //     '|',
  //     'Undo',
  //     'Redo'
  //   ]
  // };

  // public toolsFooter: object = {
  //   items: [
  //     'Bold',
  //     'Italic',
  //     'Underline',
  //     '|',
  //     'FontSize',
  //     'FontColor',
  //     'BackgroundColor',
  //     '|',
  //     'Formats',
  //     'Alignments',
  //     'OrderedList',
  //     'UnorderedList',
  //     '|',
  //     'CreateLink',
  //     'Image',
  //     '|',
  //     'SourceCode',
  //     '|',
  //     'Undo',
  //     'Redo'
  //   ]
  // };

  public dlgButtons: any = [
    {
      buttonModel: { content: 'Insert', isPrimary: true },
      click: this.onInsert.bind(this)
    },
    { buttonModel: { content: 'Cancel' }, click: this.dialogOverlay.bind(this) }
  ];

  public target: HTMLElement = document.getElementById('rteSection');

  public height: any = '350px';
  public width: any = '800px';
  public dialogWidth = '600px';
  public dialogHeight = '600px';

  public dialogCreate(): void {
    const dialogCtn: HTMLElement = document.getElementById('rteSpecial_char');
    dialogCtn.onclick = (e: Event) => {
      const target: HTMLElement = e.target as HTMLElement;
      const activeEle: Element = this.dialogObj.element.querySelector(
        '.char_block.e-active'
      );
      if (target.classList.contains('char_block')) {
        target.classList.add('e-active');
        if (activeEle) {
          activeEle.classList.remove('e-active');
        }
      }
    };
  }

  public onClick() {
    this.rteEle.focusIn();
    this.ranges = this.selection.getRange(document);
    this.dialogObj.width = this.rteEle.element.offsetWidth * 0.5;
    this.dialogObj.dataBind();
    this.dialogObj.show();
    this.dialogObj.element.style.maxHeight = 'none';
  }

  public onInsert(): void {
    const activeEle: Element = this.dialogObj.element.querySelector(
      '.char_block.e-active'
    );
    if (activeEle) {
      this.ranges.insertNode(
        document.createTextNode(activeEle.getAttribute('title'))
      );

      this.addTag({
        key: activeEle.textContent.trim(),
        value: activeEle.getAttribute('title')
      });
    }
    this.dialogOverlay();
  }

  public dialogOverlay(): void {
    const activeEle: Element = this.dialogObj.element.querySelector(
      '.char_block.e-active'
    );
    if (activeEle) {
      activeEle.classList.remove('e-active');
    }
    this.dialogObj.hide();
  }

  addCutomBtn(event: any) {
    const value = (!!this.body.value ? this.body.value : '') + event;

    this.body.patchValue(value);
  }

  /**
   *Creates an instance of TemplateFormComponent.
   * @author {{Mohammad Jalili}}
   * @param {FormBuilder} fb
   * @param {Location} location
   * @param {ChangeDetectorRef} cd
   * @memberof TemplateFormComponent
   */
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    this.form = this.fb.group({
      corporateUuid: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      subject: ['', Validators.compose([Validators.required])],
      html: ['', Validators.compose([Validators.required])],
      labels: [''],
      tags: this.fb.array([])
    });
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @param {SimpleChanges} changes
   * @memberof TemplateFormComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    // patch corporateUuid
    if (
      changes.selectedCorporate &&
      changes.selectedCorporate.currentValue &&
      this.selectedCorporate
    ) {
      const { uuid } = this.selectedCorporate;

      this.corporateUuid.patchValue(uuid);
    }

    if (changes.selectedCorporate && !changes.selectedCorporate.firstChange) {
      this.corporateChange.emit(true);
    }

    if (changes.template && changes.template.currentValue) {
      this._initialTemplate();
      this.loaded.emit(this.template);
    }

    // patch form value
    if (changes.router && changes.router.currentValue) {
      if (this.router.state.data.labels) {
        this.form.get('labels').patchValue(this.router.state.data.labels);
      }
    }

    // if(this.exists && this.router) {
    //   this.form.disable();
    // }

    if (
      changes.images &&
      changes.images.currentValue &&
      this.dialogRef?.componentInstance
    ) {
      this.dialogRef.componentInstance.renderImage(this.images);
    }
  }

  private _initialTemplate() {
    this.form.patchValue(this.template);

    this.exists = true;
    this.form.disable();
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof TemplateFormComponent
   */
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.removeHTMLEditorCache();
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof TemplateFormComponent
   */
  rteCreated(): void {
    const customBtn: HTMLElement = document.getElementById(
      'custom_tbar'
    ) as HTMLElement;
    this.dialogObj.target = document.getElementById('rteSection');

    this.cd.detectChanges();
  }

  get campaignTags() {
    return ITemplates.CampaignTags;
  }

  get labels() {
    return ITemplates.Labels;
  }

  /**
   * @description
   * @readonly
   * @type {boolean}
   * @memberof TemplateFormComponent
   */
  get formDisabled(): boolean {
    return <boolean>this.form.disabled;
  }

  /**
   * @description
   * @readonly
   * @type {boolean}
   * @memberof TemplateFormComponent
   */
  get formEnabled(): boolean {
    return <boolean>this.form.enabled;
  }

  /**
   * @description
   * @readonly
   * @type {FormControl}
   * @memberof TemplateFormComponent
   */
  get corporateUuid(): FormControl {
    return <FormControl>this.form.get('corporateUuid');
  }

  /**
   * @description
   * @readonly
   * @type {FormControl}
   * @memberof TemplateFormComponent
   */
  get name(): FormControl {
    return <FormControl>this.form.get('name');
  }

  /**
   * @description
   * @readonly
   * @type {FormControl}
   * @memberof TemplateFormComponent
   */
  get html(): FormControl {
    return <FormControl>this.form.get('html');
  }

  get body(): FormControl {
    return <FormControl>this.form.get('html');
  }

  get label(): FormControl {
    return <FormControl>this.form.get('labels');
  }

  /**
   * @description
   * @readonly
   * @type {FormControl}
   * @memberof TemplateFormComponent
   */
  get subject(): FormControl {
    return <FormControl>this.form.get('subject');
  }

  get tags(): FormArray {
    return <FormArray>this.form.get('tags');
  }

  /**
   * @description
   * @readonly
   * @memberof TemplateFormComponent
   */
  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Template.CREATE_TEMPLATE]
    ) {
      return true;
    }
    return false;
  }

  /**
   * @description
   * @readonly
   * @memberof TemplateFormComponent
   */
  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Template.UPDATE_TEMPLATE]
    ) {
      return true;
    }
    return false;
  }

  get isEmail(): boolean {
    const index = (<any[]>this.label.value).includes(
      ITemplates.Labels.EmailNotification
    );
    return index;
  }

  emptyTags() {
    while (this.tags.controls.length) {
      this.tags.removeAt(0);
    }
  }

  createTag() {
    return this.fb.group({
      key: ['', Validators.compose([Validators.required])],
      value: ['', Validators.compose([Validators.required])]
    });
  }

  addTag(tag?: ITemplates.ITag) {
    if (tag) {
      const createTag = this.fb.group({
        key: [tag.key],
        value: [tag.value]
      });
      this.tags.push(createTag);
    }
  }

  removeTag(event: number) {
    const control = this.form.get('tags') as FormArray;
    return control.removeAt(event);
  }

  onChangeTemplate(event: MatSelectChange) {
    const { value } = event;
    if (!!value) {
      this.form.addControl(
        'uuid',
        this.fb.control('', Validators.compose([Validators.required]))
      );

      this.html.setValue(value.html);

      this.name.disable();

      const uuid = <FormControl>this.form.get('uuid');

      uuid.setValue(value.uuid);

      this.templateMasterTags = [...value.tags];
    } else {
      this.name.enable();
      this.form.removeControl('uuid');
      this.templateMasterTags = [];
    }
  }

  onCreate(form: FormGroup) {
    const { value, valid } = form;
    if (valid) {
      let createDoc = value;

      if (!!value.tags) {
        const tags = value.tags.reduce((acc, current) => {
          const x = acc.find(item => item.key === current.key);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        createDoc = {
          ...createDoc,
          tags
        };
      }

      // const html = `<section class="body">${value.html}</section>`;

      // createDoc = {
      //   ...createDoc,
      //   html
      // };

      // if (value.header) {
      //   const headerSeprator = `<header class="header">${
      //     value.header
      //   }</header>`;
      //   createDoc = {
      //     ...createDoc,
      //     html: headerSeprator + createDoc.html
      //   };
      // }

      // if (value.footer) {
      //   const footerSeprator = `<footer class="footer">${
      //     value.footer
      //   }</footer>`;
      //   createDoc = {
      //     ...createDoc,
      //     html: createDoc.html + footerSeprator
      //   };
      // }

      traverseAndRemove(createDoc);

      // remove header and footer objects
      // const { ['header']: header, ['footer']: footer, ...result } = createDoc;

      if (!!value.uuid) {
        return this.createFromMaster.emit(createDoc);
      }
      return this.create.emit(createDoc);
    }
  }

  onUpdate(form: FormGroup) {
    const { value, valid } = form;

    if (valid) {
      const { uuid } = this.template;

      let updateDoc = value;

      if (!!value.tags) {
        const tags = value.tags.reduce((acc, current) => {
          const x = acc.find(item => item.key === current.key);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        updateDoc = {
          ...updateDoc,
          tags
        };
      }

      // const html = `<section class="body">${value.html}</section>`;

      // updateDoc = {
      //   ...updateDoc,
      //   html
      // };

      // if (value.header) {
      //   const headerSeprator = `<header class="header">${
      //     value.header
      //   }</header>`;
      //   updateDoc = {
      //     ...updateDoc,
      //     html: headerSeprator + updateDoc.html
      //   };
      // }

      // if (value.footer) {
      //   const footerSeprator = `<footer class="footer">${
      //     value.footer
      //   }</footer>`;
      //   updateDoc = {
      //     ...updateDoc,
      //     html: updateDoc.html + footerSeprator
      //   };
      // }

      traverseAndRemove(updateDoc);

      // remove header and footer objects
      // const { ['header']: header, ['footer']: footer, ...result } = updateDoc;

      this.update.emit({
        ...updateDoc,
        uuid
      });
    }
  }

  onCancel(): void {
    if (!this.exists) {
      return this.location.back();
    }

    if (this.exists) {
      return this._initialTemplate();
    }
  }

  onEdit(form: FormGroup) {
    if (this.exists) {
      form.enable();
    }
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];

    const html = <FormControl>this.form.get('html');

    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (evt: any) => {
        html.patchValue(evt.target.result);

        html.updateValueAndValidity();
      };

      reader.onerror = () => {
        alert('Please upload an valid html file');
      };
    }
  }

  downloadFile(data: string) {
    const blob = new Blob([data], { type: 'application/octet-stream' });

    return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  openHTMLEditor(data?: IData) {
    const { name, tag } = this.router.state.data;

    this.dialogRef = this.dialog
      .open(HtmlEditorComponent, {
        disableClose: true,
        autoFocus: true,
        height: '95%',
        width: '100%',
        data: {
          ...data,
          name,
          tag,
          images: this.images
        }
      })

      this.dialogRef.componentInstance.image.subscribe((res: File) => {
        if (res) {
          this.uploadImage.emit(res);
        }
      });

      this.dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const html = this.html;

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

/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
const stringToHTML = function(str) {
  // Otherwise, fallback to old-school method
  const dom = document.createElement('div');
  dom.innerHTML = str;
  return dom;
};
