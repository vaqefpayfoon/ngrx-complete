import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// Models
import { ICampaigns, IInboxMessages } from '../../models';
import { Auth } from '@neural/auth';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';

import { traverseAndRemove } from '@neural/shared/data';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

/**
 * @description form class for create/update inbox messages
 * @author {{Mohammad Jalili}}
 * @export
 * @class InboxMessageFormComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'neural-inbox-message-form',
  templateUrl: './inbox-message-form.component.html',
  styleUrls: ['./inbox-message-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxMessageFormComponent implements OnChanges {
  /**
   * @description bind corporateUuid to create inbox per corporate.
   *
   * it changes on selected corporate on switcher
   * @type {Auth.ICorporates}
   * @memberof InboxMessageFormComponent
   */
  @Input() selectedCorporate: Auth.ICorporates;

  @Input() loading: any;

  @Input() campaigns: ICampaigns.IDocument[];

  @Output() search = new EventEmitter<ICampaigns.IConfig>();

  timer: number;

  /**
   * @description permissions object
   * to prevent use form create
   * @type {*}
   * @memberof InboxMessageFormComponent
   */
  @Input() permissions: any;

  /**
   * @description emit create campaign
   * @type {EventEmitter<IInboxMessages.ICreate>}
   * @memberof InboxMessageFormComponent
   */
  @Output() create: EventEmitter<IInboxMessages.ICreate> = new EventEmitter<
    IInboxMessages.ICreate
  >();

  @Output() corporateChange = new EventEmitter<boolean>();

  /**
   * @description form group for inbox messages
   * @type {FormGroup}
   * @memberof InboxMessageFormComponent
   */
  form: FormGroup = this.fb.group({
    corporateUuid: ['', Validators.compose([Validators.required])],
    type: ['', Validators.compose([Validators.required])],
    payload: this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      description: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ]),
      ],
      htmlBody: ['', Validators.compose([Validators.required])],
      campaignUuid: [''],
    }),
  });

  public height: any = '350px';
  public width: any = '800px';

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
      '|',
      'Undo',
      'Redo',
    ],
  };

  constructor(private fb: FormBuilder) {}

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
  }

  /**
   * @description type FormControl for each inbox
   * @readonly
   * @type {FormControl}
   * @memberof InboxMessageFormComponent
   */
  get type(): FormControl {
    return <FormControl>this.form.get('type');
  }

  /**
   * @description corporateUuid FormControl it changes when switcher will change
   * @readonly
   * @type {FormControl}
   * @memberof InboxMessageFormComponent
   */
  get corporateUuid(): FormControl {
    return <FormControl>this.form.get('corporateUuid');
  }

  /**
   * @description form group payload
   * @readonly
   * @type {FormGroup}
   * @memberof InboxMessageFormComponent
   */
  get payload(): FormGroup {
    return <FormGroup>this.form.get('payload');
  }

  get campaignUuid(): FormControl {
    return <FormControl>this.payload.get('campaignUuid');
  }

  /**
   * @description status of form
   * @readonly
   * @type {boolean}
   * @memberof InboxMessageFormComponent
   */
  get formDisabled(): boolean {
    return <boolean>this.form.disabled;
  }

  /**
   * @description status of form
   * @readonly
   * @type {boolean}
   * @memberof InboxMessageFormComponent
   */
  get formEnabled(): boolean {
    return <boolean>this.form.enabled;
  }

  /**
   * @description message type
   * @readonly
   * @memberof InboxMessageFormComponent
   */
  get messageTypes() {
    return IInboxMessages.MessageType;
  }

  get htmlBody(): FormControl {
    return <FormControl>this.form.get('htmlBody');
  }

  /**
   * @description create permission
   * @readonly
   * @memberof InboxMessageFormComponent
   */
  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Inbox.CREATE_INBOX_MESSAGE]
    ) {
      return true;
    }
    return false;
  }

  /**
   * @description create campaign
   * @author {{Mohammad Jalili}}
   * @param {FormGroup} form
   * @memberof InboxMessageFormComponent
   */
  onCreate(form: FormGroup) {
    const { value, valid } = form;

    if (value.type !== this.messageTypes.CAMPAIGN) {
      value.payload.campaignUuid = '';
    }

    if (valid) {
      traverseAndRemove(value);
      this.create.emit(value);
    }
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];

    const html = <FormControl>this.payload.get('htmlBody');

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

  onSearchCampaign(event) {
    const searchedCampaign = event?.target.value;

    const campaignParams: ICampaigns.IConfig = {
      page: 1,
      limit: 10,
      name: searchedCampaign,
      active: true,
      _id: -1,
    };

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      traverseAndRemove(campaignParams);
      this.search.emit(campaignParams);
    }, 1000);
  }
}
