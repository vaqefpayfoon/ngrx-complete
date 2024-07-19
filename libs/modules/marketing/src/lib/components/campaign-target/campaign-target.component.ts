import {
  Component,
  ChangeDetectionStrategy,
  Optional,
  SkipSelf,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';

// Angular Form
import { FormGroup, FormControl } from '@angular/forms';

// Parent form
import { ICampaigns, ICampaignTargets } from '../../models';

import { fromEvent, of, Subscription } from 'rxjs';

// Parent form
import { CampaignFormComponent } from '../campaign-form/campaign-form.component';

import {
  map,
  filter,
  delay,
  distinctUntilChanged,
  switchMap
} from 'rxjs/operators';

@Component({
  selector: 'neural-campaign-target',
  templateUrl: './campaign-target.component.html',
  styleUrls: [
    './campaign-target.component.scss',
    '../campaign-form/campaign-form.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignTargetComponent implements OnInit, OnDestroy {
  @Input() parent: FormGroup;

  @Input() campaign;

  /**
   * @description observable subscription for search
   * @type {Subscription}
   * @memberof CampaignTargetComponent
   */
  subscription: Subscription;

  /**
   * @description serach target with name
   * @type {ElementRef}
   * @memberof CampaignTargetComponent
   */
  @ViewChild('search', { static: true }) public searchElementRef: ElementRef;

  /**
   * Creates an instance of CampaignTargetComponent.
   * @author {{Mohammad Jalili}}
   * @param {CampaignTargetComponent} campaignForm
   * @memberof CampaignTargetComponent
   */
  constructor(
    @SkipSelf() @Optional() private campaignForm: CampaignFormComponent
  ) {}

  /**
   * @description initial data
   * @author {{Mohammad Jalili}}
   * @memberof CampaignTargetComponent
   */
  ngOnInit() {
    const node = this.searchElementRef.nativeElement;
    this.subscription = fromEvent(node, 'keyup')
      .pipe(
        map((event: any) => {
          const input = event.target as HTMLTextAreaElement;
          return input.value;
        }),
        filter(value => value.length > 2),
        switchMap(search => of(search).pipe(delay(500))),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.targetUuid.reset();

        const filters: ICampaignTargets.IFilter[] = [
          {
            name: value
          }
        ];

        this.campaignForm.loadCampaignTargets.emit({ filters });
      });
  }

  /**
   * @description destroy observable data
   * @author {{Mohammad Jalili}}
   * @memberof CampaignTargetComponent
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * @description validation of form
   * @readonly
   * @type {boolean}
   * @memberof CampaignTargetComponent
   */
  get formInvalid(): boolean {
    return <boolean>this.campaignForm.formInvalid;
  }

  /**
   * @description get enable status of campaign form
   * @readonly
   * @type {boolean}
   * @memberof CampaignTargetComponent
   */
  get formEnabled(): boolean {
    return <boolean>this.campaignForm.formEnabled;
  }

  /**
   * @description get disable status of campaign form
   * @readonly
   * @type {boolean}
   * @memberof CampaignTargetComponent
   */
  get formDisabled(): boolean {
    return <boolean>this.campaignForm.formDisabled;
  }

  /**
   * @description target form group
   * @readonly
   * @type {FormGroup}
   * @memberof CampaignTargetComponent
   */
  get form(): FormGroup {
    return <FormGroup>this.campaignForm.form;
  }

  /**
   * @description target form group
   * @readonly
   * @type {FormControl}
   * @memberof CampaignTargetComponent
   */
  get targetUuid(): FormControl {
    return <FormControl>this.campaignForm.targetUuid;
  }

  /**
   * @description check model is exists
   * @readonly
   * @type {boolean}
   * @memberof CampaignTargetComponent
   */
  get exists(): boolean {
    return <boolean>this.campaignForm.exists;
  }

  /**
   * @description campaign Targets list
   * @readonly
   * @type {ICampaignTargets.IDocument[]}
   * @memberof CampaignTargetComponent
   */
  get campaignTargets(): ICampaignTargets.IDocument[] {
    return <ICampaignTargets.IDocument[]>this.campaignForm.campaignTargets;
  }

  /**
   * @description update permission
   * @readonly
   * @memberof CampaignTargetComponent
   */
  get createPermission() {
    return this.campaignForm.createPermission;
  }

  /**
   * @description update permission
   * @readonly
   * @memberof CampaignTargetComponent
   */
  get updatePermission() {
    return this.campaignForm.updatePermission;
  }

  /**
   * @description enable camapin form
   * @author {{Mohammad Jalili}}
   * @returns {void}
   * @memberof CampaignTargetComponent
   */
  enableForm(): void {
    return this.campaignForm.form.enable();
  }

  /**
   * @description disable campaign form
   * @author {{Mohammad Jalili}}
   * @returns {void}
   * @memberof CampaignTargetComponent
   */
  disableForm(): void {
    return this.campaignForm.onCancel();
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignTargetComponent
   */
  onCreate() {
    this.campaignForm.onCreate(this.campaignForm.form);
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignTargetComponent
   */
  onUpdate() {
    this.campaignForm.onUpdate(this.campaignForm.form);
  }
}
