import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

import { ICampaignTargets, IInboxMessages, IInbox } from '../../models';
import { Auth } from '@neural/auth';

// Permission Tags
import { permissionTags, traverseAndRemove } from '@neural/shared/data';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  FormArray,
} from '@angular/forms';

import { Subscription, from } from 'rxjs';
import { MatRadioChange } from '@angular/material/radio';
import readXlsxFile from 'read-excel-file';
import { distinct, switchMap } from 'rxjs/operators';
import { IVehicle } from '@neural/modules/customer/vehicles';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'neural-inbox-message-send',
  templateUrl: './inbox-message-send.component.html',
  styleUrls: ['./inbox-message-send.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxMessageSendComponent implements OnChanges, OnDestroy {
  @Input() inboxMessage: IInboxMessages.IDocument;

  @Input() codes: Auth.IPhoneCode[];

  @Input() campaignTargets: ICampaignTargets.IDocument[];

  @Input() permissions: any;

  @Input() accounts: Auth.IAccount[];

  @Input() vehicles: IVehicle.IDocument[];

  chosenTargetType = IInbox.TargetTypes.AccountId;

  @Output() loadCampaignTargets: EventEmitter<{
    filters: ICampaignTargets.IFilter[];
  }> = new EventEmitter<{ filters: ICampaignTargets.IFilter[] }>();

  @Output() create: EventEmitter<IInbox.ISendMessage> = new EventEmitter<
    IInbox.ISendMessage
  >();

  @Output() loaded: EventEmitter<IInboxMessages.IDocument> = new EventEmitter<
    IInboxMessages.IDocument
  >();

  @Output() searchChange = new EventEmitter<IInboxMessages.IFilter>();
  @Output() searchChangeVehicle = new EventEmitter<IInboxMessages.IFilter>();

  @ViewChild('search', { static: true }) public searchElementRef: ElementRef;

  @ViewChild('allAccountSelected') private allAccountSelected: MatOption;
  @ViewChild('allVehicleSelected') private allVehicleSelected: MatOption;

  searchInput: Subscription;

  subscription: Subscription;

  @ViewChild('myCustomerExcelInput') myCustomerExcelInput: ElementRef;
  @ViewChild('myVehicleExcelInput') myVehicleExcelInput: ElementRef;

  form: FormGroup = this.fb.group({
    inboxMessageUuid: ['', Validators.compose([Validators.required])],
    target: ['', Validators.compose([Validators.required])],
    notification: this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      body: ['', Validators.compose([Validators.required])],
    }),
    accountUuids: [''],
    identificationNumbers: ['']
  });

  searchForm: FormGroup = this.fb.group({
    uuid: [''],
    email: ['', Validators.compose([Validators.email])],
    'phone.code': [''],
    'phone.number': [''],
    'identity.fullName': [''],
  });

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    // patch inbox Message Uuid
    if (
      changes.inboxMessage &&
      changes.inboxMessage.currentValue &&
      this.inboxMessage
    ) {
      const { uuid } = this.inboxMessage;

      this.inboxMessageUuid.patchValue(uuid);

      this.loaded.emit(this.inboxMessage);
    }

    if(changes.accounts && changes.accounts.currentValue) {
      if(this.isAccountsFilled) {
        let accountUuids = [];
        this.form.patchValue({accountUuids});
        accountUuids = this.accounts.map(item => item.uuid);
        accountUuids.push('0');
        this.form.patchValue({accountUuids});
      }
    }

    if(changes.vehicles && changes.vehicles.currentValue) {
      if(this.isVehicleFilled) {
        let identificationNumbers = [];
        this.form.patchValue({identificationNumbers});
        identificationNumbers = this.vehicles.map(item => item.identificationNumber);
        identificationNumbers.push('0');
        this.form.patchValue({identificationNumbers});
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.searchInput) {
      this.searchInput.unsubscribe();
    }
  }

  onCreate(form: FormGroup) {
    const { valid, value } = form;
    if(value.accountUuids && value.accountUuids.length > 0) {
      const accountUuids = value.accountUuids.filter(x => x != "0");;
      this.form.patchValue({accountUuids});
    }

    if(value.identificationNumbers && value.identificationNumbers.length > 0) {
      const identificationNumbers = value.identificationNumbers.filter(x => x != "0");;
      this.form.patchValue({identificationNumbers});
    }
    if (valid) {
      traverseAndRemove(form.value);
      this.create.emit(form.value);
    }
  }

  onSearch(value: IInboxMessages.IFilter) {
    this.searchChange.emit(value);
  }

  onSearchVehicle(value: IInboxMessages.IFilter) {
    this.searchChangeVehicle.emit(value);
  }

  get inboxMessageUuid(): FormControl {
    return <FormControl>this.form.get('inboxMessageUuid');
  }

  get target(): FormControl {
    return <FormControl>this.form.get('target');
  }

  get accountUuids(): FormControl {
    return <FormControl>this.form.get('accountUuids');
  }

  get notification(): FormGroup {
    return <FormGroup>this.form.get('notification');
  }

  get formDisabled(): boolean {
    return <boolean>this.form.disabled;
  }

  get formEnabled(): boolean {
    return <boolean>this.form.enabled;
  }

  get targets() {
    return Object.keys(IInbox.Target);
  }

  get targetEnum() {
    return IInbox.Target;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Inbox.SEND_INBOX_MESSAGE]
    ) {
      return true;
    }
    return false;
  }

  get TargetTypes() {
    return IInbox.TargetTypes;
  }

  onChangeTargetType(_: MatRadioChange) {
    if(_.value == "Filter By Customer's Account") {
      this.form.patchValue({identificationNumbers: []});
    } else {
      this.form.patchValue({accountUuids: []});
    }
  }

  showAccountPreview(event: any) {
    const accountFile = (event.target as HTMLInputElement).files[0];

    const addAccountUuid = from(readXlsxFile(accountFile))
      .pipe(
        switchMap((data: any) => {
          data.shift();
          return data.map((x: any) => x.toString());
        }),
        distinct()
      )
      .subscribe((rest) => {
        this.addAccountUuid(rest);
        this.myCustomerExcelInput.nativeElement.value = '';
        this.cd.detectChanges();
      });
    this.subscription.add(addAccountUuid);
  }

  addAccountUuid(uuid?: string | any): void {
    let value = this.form.value?.accountUuids;

    if (!value.includes(uuid)) {
      if (uuid) {
        const accountUuids = [];
        if(value) {
          value.push(uuid)
          accountUuids.push(...value)
        } else {
          accountUuids.push(uuid)
        }
        this.form.patchValue({ accountUuids });
      }
    }
  }

  showVehiclePreview(event: any) {
    const vehicleFile = (event.target as HTMLInputElement).files[0];

    const vehicleUuid = from(readXlsxFile(vehicleFile))
      .pipe(
        switchMap((data: any[]) => {
          data.shift();
          return data.map((x: Array<any>) => x.toString());
        }),
        distinct()
      )
      .subscribe((rest) => {
        this.addVehicleUuid(rest);
        this.myVehicleExcelInput.nativeElement.value = '';
        this.cd.detectChanges();
      });

    this.subscription.add(vehicleUuid);
  }

  addVehicleUuid(uuid?: string | any): void {
    let value = this.form.value?.identificationNumbers;

    if (!value.includes(uuid)) {
      if (uuid) {
        const identificationNumbers = [];
        if(value) {
          value.push(uuid)
          identificationNumbers.push(...value)
        } else {
          identificationNumbers.push(uuid)
        }
        this.form.patchValue({ identificationNumbers });
      }
    }
  }

  toggleAllSelection(param: IInbox.TargetTypes) {
    if(param  == IInbox.TargetTypes.AccountId) {
      let accountUuids = [];
      if (this.allAccountSelected.selected) {
        accountUuids = this.accounts.map(item => item.uuid);
        accountUuids.push('0');
      }
      this.form.patchValue({accountUuids});
    } else {
      let identificationNumbers = [];
      if (this.allVehicleSelected.selected) {
        identificationNumbers = this.vehicles.map(item => item.identificationNumber);
        identificationNumbers.push('0');
      }
      this.form.patchValue({identificationNumbers});
    }
  }
  
  get isAccountsFilled(): boolean {
    if(this.accounts && this.accounts.length > 0) {
      return true;
    }
    return false;
  }

  get isVehicleFilled(): boolean {
    if(this.vehicles && this.vehicles.length > 0) {
      return true;
    }
    return false;
  }
  turnOffSelectAll(param: IInbox.TargetTypes) {
    if(param  == IInbox.TargetTypes.AccountId) {
      this.allAccountSelected.deselect()
    } else {
      this.allVehicleSelected.deselect()
    }
  }
}
