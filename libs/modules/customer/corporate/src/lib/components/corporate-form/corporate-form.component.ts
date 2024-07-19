import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

// Models
import { IBranches, ICorporates } from '../../models';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl,
} from '@angular/forms';

// Location
import { Location } from '@angular/common';

// permission tags
import { permissionTags } from '@neural/shared/data';

// JSON
import countries from '@nerv/countries';

// functions
import { traverseAndRemove } from '@neural/shared/data';

// Facades
import { CorporatesFacade } from '../../+state/facades';
import { Observable } from 'rxjs';
import { Auth } from '@neural/auth';

@Component({
  selector: 'neural-corporate-form',
  templateUrl: './corporate-form.component.html',
  styleUrls: ['./corporate-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateFormComponent implements OnChanges, OnInit {
  @Input() corporate: ICorporates.IDocument;

  @Input() corporateBranches: IBranches.IDocument[];

  @Input() permissions: any;

  @Input() isSuperAdmin: boolean;

  @Input() error: any;

  @Input() operations: Auth.IAccount[];

  @Input() appImages: {
    [file: string]: string;
  };

  @Output() create = new EventEmitter<ICorporates.ICreate>();

  @Output() updated = new EventEmitter<ICorporates.IUpdate>();

  @Output() loaded = new EventEmitter<ICorporates.IDocument>();

  @Output() reseted = new EventEmitter<boolean>();

  @Output() upload = new EventEmitter<ICorporates.IDocument>();

  @Output() uploadSocialIcon = new EventEmitter<ICorporates.IDocument>();

  uploadedSocialIcon$: Observable<{
    url: string;
    index: number;
  }>;

  watermarkImage$!: Observable<string>;

  panelOpenState = true;
  urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;


  private _exists: boolean;
  public get exists(): boolean {
    return this._exists;
  }
  public set exists(value: boolean) {
    this._exists = value;
  }

  private _editable: boolean;
  public get editable(): boolean {
    return this._editable;
  }
  public set editable(value: boolean) {
    this._editable = value;
  }

  countries: any[] = [];

  form = this.fb.group({
    name: [
      '',
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ],
    file: [''],
    description: [''],
    type: ['', Validators.compose([Validators.required])],
    registrationNumber: ['', Validators.compose([Validators.required])],
    peopleInCharge: this.fb.array([]),
    appIdentifiers: ['', Validators.compose([Validators.required])],
    socialAccounts: this.fb.array([]),
    configuration: this.fb.group({
      reservation: this.fb.group({
        repairOrder: this.fb.group({
          signature: this.fb.group({
            position: this.fb.group({
              x: [''],
              y: [''],
              page: [''],
            }),
          }),
        }),
        invoice: this.fb.group({
          signature: this.fb.group({
            position: this.fb.group({
              x: [''],
              y: [''],
              page: [''],
            }),
          }),
        }),
      }),
      synchronization: this.fb.group({
        active: [false],
        account: this.fb.group({
          active: [false],
          type: [''],
        }),
      }),
      calendar: this.fb.group({
        active: [false],
        schema: this.fb.group({
          branches: this.fb.array([]),
        }),
        services: this.fb.array([]),
      }),
      reminder: this.fb.group({
        active: [false],
        displayDays: [null],
      }),
      model: this.fb.group({
        active: [false],
        sale: this.fb.group({
          fulfillments: this.fb.array([]),
        }),
      }),
      subscriptions: this.fb.group({
        modules: this.fb.array([]),
      }),
      vehicles: this.fb.group({
        coverages: this.fb.array([this.createVehicleCoverage()]),
      }),
      reports: this.fb.group({
        email: [
          '',
          Validators.compose([Validators.required, Validators.email]),
        ],
      }),
      email: this.fb.group({
        name: ['', Validators.compose([Validators.required])],
        address: [
          '',
          Validators.compose([Validators.required, Validators.email]),
        ],
        authentication: this.fb.group({
          username: ['', Validators.compose([Validators.required])],
          password: ['', Validators.compose([Validators.required])],
          port: ['', Validators.compose([Validators.required])],
          host: ['', Validators.compose([Validators.required])],
          ssl: [false],
        }),
      }),
      locale: this.fb.group({
        countryCode: ['', Validators.compose([Validators.required])],
      }),
      web: this.fb.group({
        redirection: this.fb.group({
          success: ['', Validators.compose([Validators.required])],
          error: ['', Validators.compose([Validators.required])],
        }),
      }),
      appFeatures: this.fb.group({
        account: this.fb.group({
          authentication: this.fb.group({
            magicLink: [false, Validators.compose([Validators.required])],
            whatsapp: this.fb.group({
              active: [false,Validators.compose([Validators.required])],
              token: [''],
              phoneNumberId: [''],
              phoneNumber: [''],
            }),
            social: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              facebook: [false, Validators.compose([Validators.required])],
              gmail: [false, Validators.compose([Validators.required])],
              apple: [false, Validators.compose([Validators.required])],
              facebookAccessToken: [''],
            }),
            custom: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              myInfo: [false, Validators.compose([Validators.required])],
            }),
          }),
          profile: this.fb.group({
            document: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              types: this.fb.array([]),
            }),
          }),
          salutations: ['', Validators.compose([Validators.required])],
        }),
        postServiceInspection: this.fb.group({
          active: [false],
        }),
        analytics: this.fb.group({
          pendo: this.fb.group({
            active: [false],
          }),
        }),
        serviceCenter: this.fb.group({
          mileage: [false],
          anyCSO: [false],
          logistic: [false],
        }),
        nextService: this.fb.group({
          nextServiceBooking: this.fb.group({
            active: [false],
            customerApp: [false],
            cdkExistingCustomer: [false],
            cdkNewCustomer: [false],
            general: [false],
          }),
        }),
        autoClassifications: this.fb.group({
          isSynchClassify: [false],
          isAutoClassify: [false],
        }),
        mobileService: this.fb.group({
          mileage: [false],
          anyCSO: [false],
          logistic: [false],
        }),
        home: this.fb.group({
          helpCenter: this.fb.group({
            active: [false, Validators.compose([Validators.required])],
            call: this.fb.group({
              generalLine: this.fb.group({
                active: [false, Validators.compose([Validators.required])],
                number: [''],
              }),
              insurance: this.fb.group({
                active: [false, Validators.compose([Validators.required])],
                number: [''],
                name: [''],
              }),
              roadSideAssist: this.fb.group({
                active: [false, Validators.compose([Validators.required])],
                number: [''],
              }),
            }),
            enquiry: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              divisions: [''],
              topics: ['', Validators.compose([Validators.required])],
            }),
            liveChat: [false, Validators.compose([Validators.required])],
            whatsApp: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              phoneNumber: [''],
              defaultMessage: [''],
            }),
          }),
          panel: this.fb.group({
            inProgress: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              mobileService: this.fb.group({
                active: [false],
                isTrackAndChat: [false],
              }),
              serviceCenter: this.fb.group({
                active: [false],
                isTrackAndChat: [false],
              }),
            }),
          }),
          insuranceEnquiry: this.fb.group({
            ncdEntitlement: [''],
          }),
          displayAdditionalInformation: this.fb.group({
            navigationBarAppLogo: [false],
            profileDetails: [false],
            enquiry: [false],
            enquiryBranch: [false],
            enquiryDivision: [false],
            wishList: [false],
            insuranceRenewal: [false],
            hotDealsList: [false],
          }),
        }),
        vehicle: this.fb.group({
          register: this.fb.group({
            lta: [false, Validators.compose([Validators.required])],
            enhanceAddVehicle: this.fb.group({
              active: [false],
              numberPlate: this.fb.group({
                active: [false],
                mandatory: [false],
              }),
              identificationNumber: this.fb.group({
                active: [false],
                mandatory: [false],
              }),
              documentTypeAndId: this.fb.group({
                active: [false],
                mandatory: [false],
              }),
              identificationCard: this.fb.group({
                active: [false],
                mandatory: [false],
              }),
              registrationCard: this.fb.group({
                active: [false],
                mandatory: [false],
              }),
              additionalDocument: this.fb.group({
                active: [false],
                mandatory: [false],
              }),
              brand: this.fb.group({
                active: [false],
                mandatory: [false],
              }),
              model: this.fb.group({
                active: [false],
                mandatory: [false],
              }),
            }),
          }),
          profile: this.fb.group({
            vehicleDetails: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              vehicleSpecs: [false, Validators.compose([Validators.required])],
              tyreSpecs: [false, Validators.compose([Validators.required])],
              insurancePolicies: [
                false,
                Validators.compose([Validators.required]),
              ],
              alternateDrivers: [
                false,
                Validators.compose([Validators.required]),
              ],
              tradeIn: this.fb.group({
                active: [false, Validators.compose([Validators.required])],
                sources: [''],
                type: [''],
                inspection: this.fb.group({
                  active: [false, Validators.compose([Validators.required])],
                }),
              }),
              insurance: this.fb.group({
                active: [false, Validators.compose([Validators.required])],
                names: [''],
              }),
              warranty: this.fb.group({
                active: [false, Validators.compose([Validators.required])],
              }),
              roadTax: this.fb.group({
                active: [false, Validators.compose([Validators.required])],
              }),
              list: this.fb.array([]),
            }),
            serviceDetails: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              serviceHistories: [
                false,
                Validators.compose([Validators.required]),
              ],
              inspectionDetails: [
                false,
                Validators.compose([Validators.required]),
              ],
            }),
            externalApps: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              bmwDriversGuide: [
                false,
                Validators.compose([Validators.required]),
              ],
            }),
          }),
          widgets:this.fb.array([]),
        }),
        service: this.fb.group({
          mobileService: [false, Validators.compose([Validators.required])],
          serviceCenter: [false, Validators.compose([Validators.required])],
          digitalRepairOrder: this.fb.group({
            active: [false, Validators.compose([Validators.required])],
            disclaimer: this.fb.group({
              active: [false],
            }),
            termsAndCondition: this.fb.group({
              active: [false],
              link: [''],
            }),
            reservationApproval: [
              false,
              Validators.compose([Validators.required]),
            ],
            manualReservationApproval: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              redirection: this.fb.group({
                approve: [''],
                reject: [''],
                error: [''],
              }),
            }),
            retrieval: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
            }),
            rejectionReason: [false, Validators.compose([Validators.required])],
            autoRoRetrieval: [false, Validators.compose([Validators.required])],
          }),
          serviceRecommendation: this.fb.group({
            active: [false],
            serviceLines: this.fb.group({
              active: [false],
            }),
            servicePackages: this.fb.group({
              active: [false],
            }),
          }),
          digitalInvoice: this.fb.group({
            active: [false],
            autoDispatch: this.fb.group({
              active: [false],
              exclusionList: [],
            }),
          }),
        }),
        testDrive: this.fb.group({
          location: [false, Validators.compose([Validators.required])],
          showRoom: [false, Validators.compose([Validators.required])],
          questions: [''],
          loanType: ['', Validators.compose([Validators.required])],
          appointment: this.fb.group({
            cancel: [false, Validators.compose([Validators.required])],
            reschedule: [false, Validators.compose([Validators.required])],
          }),
        }),
        model: this.fb.group({
          preOwnedModelUrl: [''],
          sale: this.fb.group({
            tradeIn: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              type: [''],
            }),
            insurance: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
              type: [''],
            }),
            loan: this.fb.group({
              active: [false, Validators.compose([Validators.required])],
            }),
            active: [false, Validators.compose([Validators.required])],
            bank: this.fb.group({
              new: this.fb.array([]),
              used: this.fb.array([]),
            }),
          }),
        }),
        images: this.createAppfeatureImages(),
        widgets: this.fb.array([]),
        lead: this.fb.group({
          active: [false],
          salesLead: this.fb.group({
            active: [false],
            questionnaire: this.fb.group({
              active: [false],
            }),
          }),
        }),
      }),
      salesforce: this.fb.group({
        authentication: this.fb.group({
          subject: [''],
          issuer: [''],
        }),
        api: this.fb.group({
          getVehicleByNumberplate: this.fb.group({
            url: [''],
            active: [''],
          }),
          accountSynchronization: this.fb.group({
            url: [''],
            active: [''],
          }),
        }),
        webHook: this.fb.group({
          url: [''],
          active: [''],
          versions: this.fb.array([]),
        }),
        companyId: [''],
        adtorqueCompanyId: [''],
        source: [''],
        accountSynchronization: this.fb.group({
          company: [''],
          url: [''],
          active: [''],
        }),
      }),
      fortellis: this.fb.group({
        active: [],
      }),
      cdk: this.fb.group({
        active: [],
      }),
      watermark: this.fb.group({
        active: [false, Validators.compose([Validators.required])],
        image: [''],
      }),
    }),
  });

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private corporatesFacade: CorporatesFacade,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isSuperAdmin && changes.isSuperAdmin.currentValue) {
      this.subscriptions.addControl(
        'plan',
        this.fb.group({
          period: this.fb.group({
            start: [''],
            end: [''],
            bill: [''],
          }),
          active: [''],
          cost: this.fb.group({
            currency: [''],
            total: [''],
          }),
          type: [''],
          autoRenew: [''],
        })
      );
    }

    if (changes.corporate && changes.corporate.currentValue) {
      this._initialForm();
    } else {
      this.reseted.emit(true);
    }

    if (changes.appImages && changes.appImages.currentValue && this.corporate) {
      for (const [key, value] of Object.entries(this.appImages)) {
        if (value) {
          this.images.get(key).setValue(value);
          this.cd.detectChanges();
        }
      }
    }
  }

  ngOnInit() {
    this.uploadedSocialIcon$ = this.corporatesFacade.socialImage$;
  }

  urlValidator(control) {
    // Regular expression to match a URL
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

    // Check if the input value matches the URL pattern
    if (!urlPattern.test(control.value)) {
      // Return an error object if validation fails
      return { invalidUrl: true };
    }

    // Return null if validation passes
    return null;
  }

  get types() {
    return ICorporates.Types;
  }

  get appFeatureImages() {
    return ICorporates.AppFeatureImages;
  }

  get codes() {
    return Object.keys(countries).map((country) => {
      return {
        country,
        alfa2: countries[country].codes.alpha2,
      };
    });
  }

  get locale() {
    return this.configuration.get('locale') as FormGroup;
  }

  get appFeatures() {
    return this.configuration.get('appFeatures') as FormGroup;
  }

  get pendo() {
    return this.configuration.get('pendo') as FormGroup;
  }

  get account() {
    return this.appFeatures.get('account') as FormGroup;
  }

  get accountProfile() {
    return this.account.get('profile') as FormGroup;
  }

  get accountProfileDocument() {
    return this.accountProfile.get('document') as FormGroup;
  }

  get accountProfileDocumentTypes() {
    return this.accountProfileDocument.get('types') as FormArray;
  }

  get salesforce() {
    return this.configuration.get('salesforce') as FormGroup;
  }

  get fortellis() {
    return this.configuration.get('fortellis') as FormGroup;
  }

  get webHook() {
    return this.salesforce.get('webHook') as FormGroup;
  }

  get versions() {
    return this.webHook.get('versions') as FormArray;
  }

  get images() {
    return this.appFeatures.get('images') as FormGroup;
  }

  get file() {
    return this.form.get('file') as FormControl;
  }

  get peopleInCharge() {
    return this.form.get('peopleInCharge') as FormArray;
  }

  get socialAccounts() {
    return this.form.get('socialAccounts') as FormArray;
  }

  get configuration() {
    return this.form.get('configuration') as FormGroup;
  }

  get calendar() {
    return this.configuration.get('calendar') as FormGroup;
  }

  get schema() {
    return this.calendar.get('schema') as FormGroup;
  }

  get calendarServices() {
    return this.calendar.get('services') as FormArray;
  }

  get branches() {
    return this.schema.get('branches') as FormArray;
  }

  get branchesControls() {
    return (this.schema.get('branches') as FormArray).controls;
  }

  get services() {
    return this.configuration.get('services') as FormGroup;
  }

  get vehicle() {
    return this.appFeatures.get('vehicle') as FormGroup;
  }

  get register() {
    return this.vehicle.get('register') as FormGroup;
  }

  get enhanceAddVehicle() {
    return this.register.get('enhanceAddVehicle') as FormGroup;
  }

  get enhanceAddVehicleActive() {
    return this.enhanceAddVehicle.get('active') as FormControl;
  }

  get lead(): FormGroup {
    return this.appFeatures.get('lead') as FormGroup;
  }

  get profile() {
    return this.vehicle.get('profile') as FormGroup;
  }

  get vehicleDetails() {
    return this.profile.get('vehicleDetails') as FormGroup;
  }

  get list() {
    return this.vehicleDetails.get('list') as FormArray;
  }

  get serviceCenter() {
    return this.services.get('serviceCenter') as FormArray;
  }

  get appIdentifiers() {
    return this.form.get('appIdentifiers') as FormControl;
  }

  get type() {
    return this.form.get('type') as FormControl;
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  get registrationNumber() {
    return this.form.get('registrationNumber') as FormControl;
  }

  get description() {
    return this.form.get('description') as FormControl;
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get subscriptions() {
    return this.configuration.get('subscriptions') as FormGroup;
  }

  get plan() {
    return this.subscriptions.get('plan') as FormGroup;
  }

  get modules() {
    return this.subscriptions.get('modules') as FormArray;
  }

  get vehicles() {
    return this.configuration.get('vehicles') as FormGroup;
  }

  get coverages() {
    return this.vehicles.get('coverages') as FormArray;
  }

  get model() {
    return this.configuration.get('model') as FormGroup;
  }

  get sale() {
    return this.model.get('sale') as FormGroup;
  }

  get fulfillments() {
    return this.sale.get('fulfillments') as FormArray;
  }

  get fulfillmentsCtrl() {
    return (this.sale.get('fulfillments') as FormArray).controls;
  }

  get appFeaturesModel(): FormGroup {
    return this.appFeatures.get('model') as FormGroup;
  }

  get appFeaturesModelSale(): FormGroup {
    return this.appFeaturesModel.get('sale') as FormGroup;
  }

  get bank(): FormGroup {
    return this.appFeaturesModelSale.get('bank') as FormGroup;
  }

  get newBanks(): FormArray {
    return this.bank.get('new') as FormArray;
  }

  get usedBanks(): FormArray {
    return this.bank.get('used') as FormArray;
  }

  get widgets(): FormArray {
    return this.appFeatures.get('widgets') as FormArray;
  }

  private _initialForm() {
    this.exists = true;
    this.editable = false;
    this.loaded.emit(this.corporate);

    this.form.patchValue(this.corporate);

    this.addCalendarSchemaBranches();

    const { calendar } = this.corporate.configuration;

    if (calendar) {
      if (!!calendar?.schema?.branches) {
        this.emptyCalendarSchemaBranches();

        for (const branch of calendar?.schema?.branches) {
          this.addCalendarSchemaBranches(branch);
        }
      }

      if (!!calendar?.services) {
        this.emptyCalendarServices();

        for (const branch of calendar?.services) {
          this.addCalendarService(branch);
        }
      }
    }

    const peopleInCharges = this.corporate.peopleInCharge;

    if (peopleInCharges) {
      this.emptyPeopleInCharges();

      for (const peopleInCharge of peopleInCharges) {
        this.addPeopleInCharge(peopleInCharge);
      }
    } else {
      this.addPeopleInCharge();
    }

    // Social Media
    const { socialAccounts, configuration } = this.corporate;

    if (
      configuration?.appFeatures?.vehicle?.profile?.vehicleDetails?.list
        ?.length >= 1
    ) {
      for (const item of configuration.appFeatures.vehicle.profile
        .vehicleDetails?.list) {
        this.addListItem(item);
      }
    }

    if (configuration.subscriptions && configuration.subscriptions.modules) {
      for (const module of configuration.subscriptions.modules) {
        this.addSubscriptionModules(module);
      }
    }

    if (configuration?.subscriptions && configuration?.subscriptions?.plan) {
      this.plan.patchValue(configuration.subscriptions.plan);
    }

    if (socialAccounts) {
      this.emptySocialAccounts();

      for (const socialAccount of socialAccounts) {
        this.addSocialAccounts(socialAccount);
      }
    } else {
      this.addSocialAccounts();
    }

    if (configuration?.vehicles) {
      this.emptyVehicleCoverage();

      for (const coverage of configuration.vehicles.coverages) {
        this.addVehicleCoverage(coverage);
      }
    } else {
      this.addVehicleCoverage();
    }

    if (configuration?.subscriptions && configuration?.subscriptions?.modules) {
      this.emptySubscriptionModules();

      for (const module of configuration.subscriptions.modules) {
        this.addSubscriptionModules(module);
      }
    }

    if (!!configuration?.locale) {
      this.countries = this.codes.filter(
        (code) => code.alfa2 === configuration.locale.countryCode
      );
    }

    if (configuration?.model?.sale?.fulfillments) {
      this.emptyFulfillments();
      for (const fulfillment of configuration?.model?.sale?.fulfillments) {
        this.addFulfillment(fulfillment);
      }
    }

    if (configuration?.appFeatures?.model?.sale?.bank?.new) {
      this.emptyNewBanks();

      for (const bank of configuration?.appFeatures?.model?.sale?.bank?.new) {
        this.addNewBanks(bank);
      }
    }

    if (configuration?.appFeatures?.model?.sale?.bank?.used) {
      this.emptyUsedBanks();

      for (const bank of configuration?.appFeatures?.model?.sale?.bank?.used) {
        this.addUsedBanks(bank);
      }
    }

    if (configuration?.appFeatures?.widgets) {
      this.emptyWidgets();

      for (const widget of configuration?.appFeatures?.widgets) {
        this.addWidget(widget);
      }
    }


    if (configuration?.appFeatures?.vehicle?.widgets) {
      this.emptyVehicleWidgets();

      for (const widget of configuration?.appFeatures?.vehicle?.widgets) {
        this.addVehicleWidget(widget);
      }
    }

    if (configuration?.appFeatures?.account?.profile?.document?.types) {
      this.emptyAccountProfileDocumentTypes();

      for (const type of configuration?.appFeatures?.account?.profile?.document
        ?.types) {
        this.addAccountProfileDocumentTypes(type);
      }
    }

    this.form.disable();
  }

  // Search from Code JSON
  searchInCodes(event: string) {
    this.countries = this.codes.filter((code) =>
      code.country.toLowerCase().includes(event.toLowerCase())
    );
  }

  // ---- Vehicle Details ----

  addListItem(
    listItem?: ICorporates.IAppFeatureVehicleProfileVehicleDetailsList | any
  ): void {
    const item = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      order: [this.list.length + 1, Validators.compose([Validators.required])],
    });

    if (listItem) {
      item.patchValue(listItem);
    }

    return this.list.push(item);
  }

  removeListItem(index: number): void {
    this.list.removeAt(index);

    this.list.controls.map((_, i) =>
      this.list.controls[i].get('order').patchValue(++i)
    );
  }

  // app feature images

  createAppfeatureImages(): FormGroup {
    const images: FormGroup = this.fb.group({});

    for (const key in this.appFeatureImages) {
      if (Object.prototype.hasOwnProperty.call(this.appFeatureImages, key)) {
        images.addControl(this.appFeatureImages[key], this.fb.control(''));
      }
    }
    return images;
  }

  uploadFeatureImage({
    file,
    key,
  }: {
    file: File;
    key: ICorporates.AppFeatureImages;
  }) {
    const { uuid } = this.corporate;

    this.corporatesFacade.uploadAppImage({
      corporateUuid: uuid,
      file,
      key,
    });
  }

  uploadWatermarkImage({ file }: { file: File }) {
    const { uuid: corporateUuid } = this.corporate;

    const payload: ICorporates.IAppImageUpload = {
      file,
      corporateUuid,
    };

    this.watermarkImage$ = this.corporatesFacade.uploadWatermarkImage(payload);
  }

  // ---- Fulfillments ----

  removeFulfillments(event: number) {
    const control = this.sale.get('fulfillments') as FormArray;
    return control.removeAt(event);
  }

  emptyFulfillments() {
    while (this.fulfillments.controls.length) {
      this.fulfillments.removeAt(0);
    }
  }

  createFulfillment() {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      order: [
        this.fulfillments.length ?? 0,
        Validators.compose([Validators.required]),
      ],
      description: [''],
      type: ['', Validators.compose([Validators.required])],
    });
  }

  addFulfillment(fulfillment?: ICorporates.IModelSaleFulfillment) {
    if (fulfillment) {
      const createFulfillment = this.fb.group({
        title: [fulfillment?.title, Validators.compose([Validators.required])],
        order: [fulfillment?.order, Validators.compose([Validators.required])],
        description: [fulfillment?.description],
        type: [fulfillment?.type, Validators.compose([Validators.required])],
      });

      if (
        ICorporates.ModelSaleFulfillmentType[fulfillment?.type] ===
        ICorporates.ModelSaleFulfillmentType.DOCUMENT
      ) {
        createFulfillment.addControl(
          'document',
          this.fb.group({
            signature: this.fb.group({
              isRequired: [
                fulfillment?.document?.signature?.isRequired ?? false,
                Validators.compose([Validators.required]),
              ],
              position: this.fb.group({
                page: [
                  fulfillment?.document?.signature?.position?.page,
                  Validators.compose(
                    fulfillment?.document?.signature?.isRequired
                      ? [Validators.required]
                      : []
                  ),
                ],
                x: [
                  fulfillment?.document?.signature?.position?.x,
                  Validators.compose(
                    fulfillment?.document?.signature?.isRequired
                      ? [Validators.required]
                      : []
                  ),
                ],
                y: [
                  fulfillment?.document?.signature?.position?.y,
                  Validators.compose(
                    fulfillment?.document?.signature?.isRequired
                      ? [Validators.required]
                      : []
                  ),
                ],
              }),
            }),
          })
        );
      }

      if (
        ICorporates.ModelSaleFulfillmentType[fulfillment?.type] ===
        ICorporates.ModelSaleFulfillmentType.RCO
      ) {
        createFulfillment.addControl(
          'rco',
          this.fb.group({
            signature: this.fb.group({
              isRequired: [
                fulfillment?.rco?.signature?.isRequired ?? false,
                Validators.compose([Validators.required]),
              ],
              position: this.fb.group({
                page: [
                  fulfillment?.rco?.signature?.position?.page,
                  Validators.compose(
                    fulfillment?.rco?.signature?.isRequired
                      ? [Validators.required]
                      : []
                  ),
                ],
                x: [
                  fulfillment?.rco?.signature?.position?.x,
                  Validators.compose(
                    fulfillment?.rco?.signature?.isRequired
                      ? [Validators.required]
                      : []
                  ),
                ],
                y: [
                  fulfillment?.rco?.signature?.position?.y,
                  Validators.compose(
                    fulfillment?.rco?.signature?.isRequired
                      ? [Validators.required]
                      : []
                  ),
                ],
              }),
            }),
          })
        );
      } else if (
        ICorporates.ModelSaleFulfillmentType[fulfillment?.type] ===
        ICorporates.ModelSaleFulfillmentType.CALENDAR
      ) {
        createFulfillment.addControl(
          'calendar',
          this.fb.group({
            isRequired: [
              fulfillment?.calendar?.isRequired ?? false,
              Validators.compose([Validators.required]),
            ],
          })
        );
      } else if (
        ICorporates.ModelSaleFulfillmentType[fulfillment?.type] ===
        ICorporates.ModelSaleFulfillmentType.DOWNPAYMENT
      ) {
        createFulfillment.addControl(
          'downPayment',
          this.fb.group({
            payment: this.fb.group({
              currency: [
                fulfillment.downPayment?.payment?.currency ?? '',
                Validators.compose([Validators.required]),
              ],
              method: [
                fulfillment?.downPayment?.payment?.method ?? '',
                Validators.compose([Validators.required]),
              ],
            }),
          })
        );
      }

      this.fulfillments.push(createFulfillment);
    } else {
      this.fulfillments.push(this.createFulfillment());
    }
  }

  addFullFillmentObjects({ index, value }: { index: number; value: string }) {
    const fulfillments = (<FormArray>this.sale.get('fulfillments')).controls;

    (<FormGroup>fulfillments[index]).removeControl('document');
    (<FormGroup>fulfillments[index]).removeControl('calendar');
    (<FormGroup>fulfillments[index]).removeControl('rco');
    (<FormGroup>fulfillments[index]).removeControl('downPayment');

    if (
      ICorporates.ModelSaleFulfillmentType[value] ===
      ICorporates.ModelSaleFulfillmentType.DOCUMENT
    ) {
      return (<FormGroup>fulfillments[index]).addControl(
        'document',
        this.fb.group({
          signature: this.fb.group({
            isRequired: [false, Validators.compose([Validators.required])],
          }),
        })
      );
    } else if (
      ICorporates.ModelSaleFulfillmentType[value] ===
      ICorporates.ModelSaleFulfillmentType.CALENDAR
    ) {
      return (<FormGroup>fulfillments[index]).addControl(
        'calendar',
        this.fb.group({
          isRequired: [false, Validators.compose([Validators.required])],
        })
      );
    } else if (
      ICorporates.ModelSaleFulfillmentType[value] ===
      ICorporates.ModelSaleFulfillmentType.RCO
    ) {
      return (<FormGroup>fulfillments[index]).addControl(
        'rco',
        this.fb.group({
          signature: this.fb.group({
            isRequired: [false, Validators.compose([Validators.required])],
          }),
        })
      );
    } else if (
      ICorporates.ModelSaleFulfillmentType[value] ===
      ICorporates.ModelSaleFulfillmentType.DOWNPAYMENT
    ) {
      return (<FormGroup>fulfillments[index]).addControl(
        'downPayment',
        this.fb.group({
          payment: this.fb.group({
            method: ['', Validators.compose([Validators.required])],
            currency: ['', Validators.compose([Validators.required])],
          }),
        })
      );
    }
  }

  // ---- People In Charges ----

  emptyCalendarSchemaBranches() {
    while (this.branches.controls.length) {
      this.branches.removeAt(0);
    }
  }

  createCalendarSchemaBranches() {
    return this.fb.group({
      uuid: ['', Validators.compose([Validators.required])],
      mobility: this.fb.group({
        days: this.fb.group({
          monday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              travelTime: [''],
              serviceTime: [''],
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
          }),
          tuesday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              travelTime: [''],
              serviceTime: [''],
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
          }),
          wednesday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              travelTime: [''],
              serviceTime: [''],
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
          }),
          thursday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              travelTime: [''],
              serviceTime: [''],
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
          }),
          friday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              travelTime: [''],
              serviceTime: [''],
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
          }),
          saturday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              travelTime: [''],
              serviceTime: [''],
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
          }),
          sunday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              travelTime: [''],
              serviceTime: [''],
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
          }),
        }),
      }),
      repair: this.fb.group({
        csoCount: [''],
        days: this.fb.group({
          monday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                start: [''],
                end: [''],
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          tuesday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                start: [''],
                end: [''],
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          wednesday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                start: [''],
                end: [''],
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          thursday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                start: [''],
                end: [''],
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          friday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                start: [''],
                end: [''],
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          saturday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                start: [''],
                end: [''],
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          sunday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                start: [''],
                end: [''],
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
        }),
      }),
      service: this.fb.group({
        csoCount: [''],
        days: this.fb.group({
          monday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          tuesday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          wednesday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          thursday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          friday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          saturday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
          sunday: this.fb.group({
            start: [''],
            end: [''],
            session: this.fb.group({
              serviceTime: [''],
              meeting: this.fb.group({
                duration: [''],
              }),
            }),
            break: this.fb.group({
              start: [''],
              end: [''],
            }),
            bay: this.fb.group({
              count: [''],
            }),
          }),
        }),
      }),
    });
  }

  addCalendarSchemaBranches(
    calendarSchemaBranch?: ICorporates.ICalendarSchemaBranch | any
  ) {
    if (calendarSchemaBranch) {
      const createCalendarSchemaBranch = this.fb.group({
        uuid: [
          calendarSchemaBranch?.uuid ?? '',
          Validators.compose([Validators.required]),
        ],
        mobility: this.fb.group({
          days: this.fb.group({
            monday: this.fb.group({
              start: [
                calendarSchemaBranch?.mobility?.days?.monday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.mobility?.days?.monday?.end ?? ''],
              session: this.fb.group({
                travelTime: [
                  calendarSchemaBranch?.mobility?.days?.monday?.session
                    ?.travelTime ?? '',
                ],
                serviceTime: [
                  calendarSchemaBranch?.mobility?.days?.monday?.session
                    ?.serviceTime ?? '',
                ],
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.mobility?.days?.monday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.mobility?.days?.monday?.break?.end ??
                    '',
                ],
              }),
            }),
            tuesday: this.fb.group({
              start: [
                calendarSchemaBranch?.mobility?.days?.tuesday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.mobility?.days?.tuesday?.end ?? ''],
              session: this.fb.group({
                travelTime: [
                  calendarSchemaBranch?.mobility?.days?.tuesday?.session
                    ?.travelTime ?? '',
                ],
                serviceTime: [
                  calendarSchemaBranch?.mobility?.days?.tuesday?.session
                    ?.serviceTime ?? '',
                ],
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.mobility?.days?.tuesday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.mobility?.days?.tuesday?.break?.end ??
                    '',
                ],
              }),
            }),
            wednesday: this.fb.group({
              start: [
                calendarSchemaBranch?.mobility?.days?.wednesday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.mobility?.days?.wednesday?.end ?? ''],
              session: this.fb.group({
                travelTime: [
                  calendarSchemaBranch?.mobility?.days?.wednesday?.session
                    ?.travelTime ?? '',
                ],
                serviceTime: [
                  calendarSchemaBranch?.mobility?.days?.wednesday?.session
                    ?.serviceTime ?? '',
                ],
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.mobility?.days?.wednesday?.break
                    ?.start ?? '',
                ],
                end: [
                  calendarSchemaBranch?.mobility?.days?.wednesday?.break?.end ??
                    '',
                ],
              }),
            }),
            thursday: this.fb.group({
              start: [
                calendarSchemaBranch?.mobility?.days?.thursday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.mobility?.days?.thursday?.end ?? ''],
              session: this.fb.group({
                travelTime: [
                  calendarSchemaBranch?.mobility?.days?.thursday?.session
                    ?.travelTime ?? '',
                ],
                serviceTime: [
                  calendarSchemaBranch?.mobility?.days?.thursday?.session
                    ?.serviceTime ?? '',
                ],
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.mobility?.days?.thursday?.break
                    ?.start ?? '',
                ],
                end: [
                  calendarSchemaBranch?.mobility?.days?.thursday?.break?.end ??
                    '',
                ],
              }),
            }),
            friday: this.fb.group({
              start: [
                calendarSchemaBranch?.mobility?.days?.friday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.mobility?.days?.friday?.end ?? ''],
              session: this.fb.group({
                travelTime: [
                  calendarSchemaBranch?.mobility?.days?.friday?.session
                    ?.travelTime ?? '',
                ],
                serviceTime: [
                  calendarSchemaBranch?.mobility?.days?.friday?.session
                    ?.serviceTime ?? '',
                ],
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.mobility?.days?.friday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.mobility?.days?.friday?.break?.end ??
                    '',
                ],
              }),
            }),
            saturday: this.fb.group({
              start: [
                calendarSchemaBranch?.mobility?.days?.saturday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.mobility?.days?.saturday?.end ?? ''],
              session: this.fb.group({
                travelTime: [
                  calendarSchemaBranch?.mobility?.days?.saturday?.session
                    ?.travelTime ?? '',
                ],
                serviceTime: [
                  calendarSchemaBranch?.mobility?.days?.saturday?.session
                    ?.serviceTime ?? '',
                ],
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.mobility?.days?.saturday?.break
                    ?.start ?? '',
                ],
                end: [
                  calendarSchemaBranch?.mobility?.days?.saturday?.break?.end ??
                    '',
                ],
              }),
            }),
            sunday: this.fb.group({
              start: [
                calendarSchemaBranch?.mobility?.days?.sunday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.mobility?.days?.sunday?.end ?? ''],
              session: this.fb.group({
                travelTime: [
                  calendarSchemaBranch?.mobility?.days?.sunday?.session
                    ?.travelTime ?? '',
                ],
                serviceTime: [
                  calendarSchemaBranch?.mobility?.days?.sunday?.session
                    ?.serviceTime ?? '',
                ],
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.mobility?.days?.sunday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.mobility?.days?.sunday?.break?.end ??
                    '',
                ],
              }),
            }),
          }),
        }),
        repair: this.fb.group({
          csoCount: [calendarSchemaBranch?.repair?.csoCount ?? ''],
          days: this.fb.group({
            monday: this.fb.group({
              start: [calendarSchemaBranch?.repair?.days?.monday?.start ?? ''],
              end: [calendarSchemaBranch?.repair?.days?.monday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.repair?.days?.monday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  start: [
                    calendarSchemaBranch?.repair?.days?.monday?.session?.meeting
                      ?.start ?? '',
                  ],
                  end: [
                    calendarSchemaBranch?.repair?.days?.monday?.session?.meeting
                      ?.end ?? '',
                  ],
                  duration: [
                    calendarSchemaBranch?.repair?.days?.monday?.session?.meeting
                      ?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.repair?.days?.monday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.repair?.days?.monday?.break?.end ?? '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.repair?.days?.monday?.bay?.count ?? '',
                ],
              }),
            }),
            tuesday: this.fb.group({
              start: [calendarSchemaBranch?.repair?.days?.tuesday?.start ?? ''],
              end: [calendarSchemaBranch?.repair?.days?.tuesday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.repair?.days?.tuesday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  start: [
                    calendarSchemaBranch?.repair?.days?.tuesday?.session
                      ?.meeting?.start ?? '',
                  ],
                  end: [
                    calendarSchemaBranch?.repair?.days?.tuesday?.session
                      ?.meeting?.end ?? '',
                  ],
                  duration: [
                    calendarSchemaBranch?.repair?.days?.tuesday?.session
                      ?.meeting?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.repair?.days?.tuesday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.repair?.days?.tuesday?.break?.end ?? '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.repair?.days?.tuesday?.bay?.count ?? '',
                ],
              }),
            }),
            wednesday: this.fb.group({
              start: [
                calendarSchemaBranch?.repair?.days?.wednesday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.repair?.days?.wednesday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.repair?.days?.wednesday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  start: [
                    calendarSchemaBranch?.repair?.days?.wednesday?.session
                      ?.meeting?.start ?? '',
                  ],
                  end: [
                    calendarSchemaBranch?.repair?.days?.wednesday?.session
                      ?.meeting?.end ?? '',
                  ],
                  duration: [
                    calendarSchemaBranch?.repair?.days?.wednesday?.session
                      ?.meeting?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.repair?.days?.wednesday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.repair?.days?.wednesday?.break?.end ??
                    '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.repair?.days?.wednesday?.bay?.count ??
                    '',
                ],
              }),
            }),
            thursday: this.fb.group({
              start: [
                calendarSchemaBranch?.repair?.days?.thursday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.repair?.days?.thursday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.repair?.days?.thursday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  start: [
                    calendarSchemaBranch?.repair?.days?.thursday?.session
                      ?.meeting?.start ?? '',
                  ],
                  end: [
                    calendarSchemaBranch?.repair?.days?.thursday?.session
                      ?.meeting?.end ?? '',
                  ],
                  duration: [
                    calendarSchemaBranch?.repair?.days?.thursday?.session
                      ?.meeting?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.repair?.days?.thursday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.repair?.days?.thursday?.break?.end ??
                    '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.repair?.days?.thursday?.bay?.count ??
                    '',
                ],
              }),
            }),
            friday: this.fb.group({
              start: [calendarSchemaBranch?.repair?.days?.friday?.start ?? ''],
              end: [calendarSchemaBranch?.repair?.days?.friday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.repair?.days?.friday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  start: [
                    calendarSchemaBranch?.repair?.days?.friday?.session?.meeting
                      ?.start ?? '',
                  ],
                  end: [
                    calendarSchemaBranch?.repair?.days?.friday?.session?.meeting
                      ?.end ?? '',
                  ],
                  duration: [
                    calendarSchemaBranch?.repair?.days?.friday?.session?.meeting
                      ?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.repair?.days?.friday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.repair?.days?.friday?.break?.end ?? '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.repair?.days?.friday?.bay?.count ?? '',
                ],
              }),
            }),
            saturday: this.fb.group({
              start: [
                calendarSchemaBranch?.repair?.days?.saturday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.repair?.days?.saturday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.repair?.days?.saturday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  start: [
                    calendarSchemaBranch?.repair?.days?.saturday?.session
                      ?.meeting?.start ?? '',
                  ],
                  end: [
                    calendarSchemaBranch?.repair?.days?.saturday?.session
                      ?.meeting?.end ?? '',
                  ],
                  duration: [
                    calendarSchemaBranch?.repair?.days?.saturday?.session
                      ?.meeting?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.repair?.days?.saturday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.repair?.days?.saturday?.break?.end ??
                    '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.repair?.days?.saturday?.bay?.count ??
                    '',
                ],
              }),
            }),
            sunday: this.fb.group({
              start: [calendarSchemaBranch?.repair?.days?.sunday?.start ?? ''],
              end: [calendarSchemaBranch?.repair?.days?.sunday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.repair?.days?.sunday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  start: [
                    calendarSchemaBranch?.repair?.days?.sunday?.session?.meeting
                      ?.start ?? '',
                  ],
                  end: [
                    calendarSchemaBranch?.repair?.days?.sunday?.session?.meeting
                      ?.end ?? '',
                  ],
                  duration: [
                    calendarSchemaBranch?.repair?.days?.sunday?.session?.meeting
                      ?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.repair?.days?.sunday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.repair?.days?.sunday?.break?.end ?? '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.repair?.days?.sunday?.bay?.count ?? '',
                ],
              }),
            }),
          }),
        }),
        service: this.fb.group({
          csoCount: [calendarSchemaBranch?.service?.csoCount ?? ''],
          days: this.fb.group({
            monday: this.fb.group({
              start: [calendarSchemaBranch?.service?.days?.monday?.start ?? ''],
              end: [calendarSchemaBranch?.service?.days?.monday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.service?.days?.monday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  duration: [
                    calendarSchemaBranch?.service?.days?.monday?.session
                      ?.meeting?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.service?.days?.monday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.service?.days?.monday?.break?.end ?? '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.service?.days?.monday?.bay?.count ?? '',
                ],
              }),
            }),
            tuesday: this.fb.group({
              start: [
                calendarSchemaBranch?.service?.days?.tuesday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.service?.days?.tuesday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.service?.days?.tuesday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  duration: [
                    calendarSchemaBranch?.service?.days?.tuesday?.session
                      ?.meeting?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.service?.days?.tuesday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.service?.days?.tuesday?.break?.end ??
                    '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.service?.days?.tuesday?.bay?.count ??
                    '',
                ],
              }),
            }),
            wednesday: this.fb.group({
              start: [
                calendarSchemaBranch?.service?.days?.wednesday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.service?.days?.wednesday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.service?.days?.wednesday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  duration: [
                    calendarSchemaBranch?.service?.days?.wednesday?.session
                      ?.meeting?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.service?.days?.wednesday?.break
                    ?.start ?? '',
                ],
                end: [
                  calendarSchemaBranch?.service?.days?.wednesday?.break?.end ??
                    '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.service?.days?.wednesday?.bay?.count ??
                    '',
                ],
              }),
            }),
            thursday: this.fb.group({
              start: [
                calendarSchemaBranch?.service?.days?.thursday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.service?.days?.thursday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.service?.days?.thursday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  duration: [
                    calendarSchemaBranch?.service?.days?.thursday?.session
                      ?.meeting?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.service?.days?.thursday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.service?.days?.thursday?.break?.end ??
                    '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.service?.days?.thursday?.bay?.count ??
                    '',
                ],
              }),
            }),
            friday: this.fb.group({
              start: [calendarSchemaBranch?.service?.days?.friday?.start ?? ''],
              end: [calendarSchemaBranch?.service?.days?.friday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.service?.days?.friday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  duration: [
                    calendarSchemaBranch?.service?.days?.friday?.session
                      ?.meeting?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.service?.days?.friday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.service?.days?.friday?.break?.end ?? '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.service?.days?.friday?.bay?.count ?? '',
                ],
              }),
            }),
            saturday: this.fb.group({
              start: [
                calendarSchemaBranch?.service?.days?.saturday?.start ?? '',
              ],
              end: [calendarSchemaBranch?.service?.days?.saturday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.service?.days?.saturday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  duration: [
                    calendarSchemaBranch?.service?.days?.saturday?.session
                      ?.meeting?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.service?.days?.saturday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.service?.days?.saturday?.break?.end ??
                    '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.service?.days?.saturday?.bay?.count ??
                    '',
                ],
              }),
            }),
            sunday: this.fb.group({
              start: [calendarSchemaBranch?.service?.days?.sunday?.start ?? ''],
              end: [calendarSchemaBranch?.service?.days?.sunday?.end ?? ''],
              session: this.fb.group({
                serviceTime: [
                  calendarSchemaBranch?.service?.days?.sunday?.session
                    ?.serviceTime ?? '',
                ],
                meeting: this.fb.group({
                  duration: [
                    calendarSchemaBranch?.service?.days?.sunday?.session
                      ?.meeting?.duration ?? '',
                  ],
                }),
              }),
              break: this.fb.group({
                start: [
                  calendarSchemaBranch?.service?.days?.sunday?.break?.start ??
                    '',
                ],
                end: [
                  calendarSchemaBranch?.service?.days?.sunday?.break?.end ?? '',
                ],
              }),
              bay: this.fb.group({
                count: [
                  calendarSchemaBranch?.service?.days?.sunday?.bay?.count ?? '',
                ],
              }),
            }),
          }),
        }),
      });
      this.branches.push(createCalendarSchemaBranch);
    }
  }

  addedCalendarSchemaBranches(event?: any) {
    this.branches.push(this.createCalendarSchemaBranches());
  }

  removeCalendarSchemaBranches(event: number) {
    const control = this.schema.get('branches') as FormArray;
    return control.removeAt(event);
  }

  // ---- Calendar Services ----

  emptyCalendarServices() {
    while (this.calendarServices.controls.length) {
      this.calendarServices.removeAt(0);
    }
  }

  createCalendarService() {
    return this.fb.group({
      type: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      description: [''],
      includedTypes: [''],
    });
  }

  addCalendarService(
    calendarService?: ICorporates.IConfigurationCalendarService
  ) {
    if (calendarService) {
      const createCalendarService = this.fb.group({
        type: [
          calendarService?.type,
          Validators.compose([Validators.required]),
        ],
        name: [
          calendarService?.name,
          Validators.compose([Validators.required]),
        ],
        description: [calendarService?.description ?? ''],
        includedTypes: [calendarService?.includedTypes ?? ''],
      });
      this.calendarServices.push(createCalendarService);
    }
  }

  addedCalendarService(event?: any) {
    this.calendarServices.push(this.createCalendarService());
  }

  removeCalendarService(event: number) {
    const control = this.calendar.get('services') as FormArray;
    return control.removeAt(event);
  }

  // ---- People In Charges ----

  emptyPeopleInCharges() {
    while (this.peopleInCharge.controls.length) {
      this.peopleInCharge.removeAt(0);
    }
  }

  createPeopleInCharge() {
    return this.fb.group({
      department: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      jobTitle: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
    });
  }

  addPeopleInCharge(peopleInCharge?: ICorporates.IPeopleInCharge | any) {
    if (peopleInCharge) {
      const createPeopleInCharge = this.fb.group({
        department: [
          peopleInCharge.department,
          Validators.compose([Validators.required]),
        ],
        name: [peopleInCharge.name, Validators.compose([Validators.required])],
        jobTitle: [
          peopleInCharge.jobTitle,
          Validators.compose([Validators.required]),
        ],
        phone: [
          peopleInCharge.phone.toString(),
          Validators.compose([Validators.required]),
        ],
        email: [
          peopleInCharge.email ?? '',
          Validators.compose([Validators.required]),
        ],
      });
      this.peopleInCharge.push(createPeopleInCharge);
    } else {
      return this.peopleInCharge.push(this.createPeopleInCharge());
    }
  }

  removePeopleInCharge(event: number) {
    const control = this.form.get('peopleInCharge') as FormArray;
    return control.removeAt(event);
  }

  // ---- Social Accounts ----

  emptySocialAccounts() {
    while (this.socialAccounts.controls.length) {
      this.socialAccounts.removeAt(0);
    }
  }

  createSocialAccounts() {
    return this.fb.group({
      account: ['', Validators.compose([Validators.required])],
      url: ['', Validators.compose([Validators.required])],
      icon: [''],
    });
  }

  addSocialAccounts(socialAccount?: ICorporates.ISocialAccount | any) {
    if (socialAccount) {
      const createSocialAccount = this.fb.group({
        account: [
          socialAccount.account,
          Validators.compose([Validators.required]),
        ],
        url: [socialAccount.url, Validators.compose([Validators.required])],
        icon: [socialAccount.icon],
      });
      this.socialAccounts.push(createSocialAccount);
    } else {
      return this.socialAccounts.push(this.createSocialAccounts());
    }
  }

  removeSocialAccounts(event: number) {
    const control = this.form.get('socialAccounts') as FormArray;
    return control.removeAt(event);
  }

  // ---- Used Banks ----

  createBank(): FormGroup {
    return this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      uuid: ['', Validators.compose([Validators.required])],
      logo: ['', Validators.compose([Validators.required])],
      interestRate: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(10),
        ]),
      ],
      isDefault: [false, Validators.compose([Validators.required])],
      downPayment: this.fb.group({
        type: ['', Validators.compose([Validators.required])],
        amount: ['', Validators.compose([Validators.required])],
      }),
      period: this.fb.group({
        min: ['', Validators.compose([Validators.required])],
        max: ['', Validators.compose([Validators.required])],
      }),
    });
  }

  emptyUsedBanks(): void {
    while (this.usedBanks.controls.length) {
      this.usedBanks.removeAt(0);
    }
  }

  addUsedBanks(usedBank?: ICorporates.IBank): void {
    if (usedBank) {
      const createUsedBank = this.fb.group({
        name: [usedBank.name, Validators.compose([Validators.required])],
        uuid: [usedBank.uuid, Validators.compose([Validators.required])],
        logo: [usedBank.logo, Validators.compose([Validators.required])],
        interestRate: [
          usedBank.interestRate,
          Validators.compose([
            Validators.required,
            Validators.min(0),
            Validators.max(10),
          ]),
        ],
        isDefault: [
          usedBank.isDefault,
          Validators.compose([Validators.required]),
        ],
        downPayment: this.fb.group({
          type: [
            usedBank.downPayment.type,
            Validators.compose([Validators.required]),
          ],
          amount: [
            usedBank.downPayment.amount,
            Validators.compose([Validators.required]),
          ],
        }),
        period: this.fb.group({
          min: [
            usedBank.period.min,
            Validators.compose([Validators.required, Validators.min(1)]),
          ],
          max: [usedBank.period.max, Validators.compose([Validators.required])],
        }),
      });
      this.usedBanks.push(createUsedBank);
    } else {
      return this.usedBanks.push(this.createBank());
    }
  }

  removeUsedBanks(event: number): void {
    const control = this.bank.get('used') as FormArray;
    return control.removeAt(event);
  }
  // ---- New Banks ----

  emptyNewBanks(): void {
    while (this.newBanks.controls.length) {
      this.newBanks.removeAt(0);
    }
  }

  addNewBanks(newBank?: ICorporates.IBank): void {
    if (newBank) {
      const createNewBank = this.fb.group({
        name: [newBank.name, Validators.compose([Validators.required])],
        uuid: [newBank.uuid, Validators.compose([Validators.required])],
        logo: [newBank.logo, Validators.compose([Validators.required])],
        interestRate: [
          newBank.interestRate,
          Validators.compose([
            Validators.required,
            Validators.min(0),
            Validators.max(10),
          ]),
        ],
        isDefault: [
          newBank.isDefault,
          Validators.compose([Validators.required]),
        ],
        downPayment: this.fb.group({
          type: [
            newBank.downPayment.type,
            Validators.compose([Validators.required]),
          ],
          amount: [
            newBank.downPayment.amount,
            Validators.compose([Validators.required]),
          ],
        }),
        period: this.fb.group({
          min: [
            newBank.period.min,
            Validators.compose([Validators.required, Validators.min(1)]),
          ],
          max: [newBank.period.max, Validators.compose([Validators.required])],
        }),
      });
      this.newBanks.push(createNewBank);
    } else {
      return this.newBanks.push(this.createBank());
    }
  }

  removeNewBanks(event: number): void {
    const control = this.bank.get('new') as FormArray;
    return control.removeAt(event);
  }

  // ---- Widgets ----

  emptyWidgets(): void {
    while (this.widgets.controls.length) {
      this.widgets.removeAt(0);
    }
  }

  emptyVehicleWidgets(): void {
    while (this.vehicleWidgets.controls.length) {
      this.vehicleWidgets.removeAt(0);
    }
  }

  createWidget(): FormGroup {
    const order = this.widgets.controls.length;
    return this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      icon: ['', Validators.compose([Validators.required])],
      order: [order, Validators.compose([Validators.required])],
      active: [false, Validators.compose([Validators.required])],
      url: [''],
    });
  }

  createVehicleWidget(): FormGroup {
    const order = this.vehicleWidgets.controls.length;
    return this.fb.group({
      name: [''],
      type: [''],
      icon: [''],
      order: [order],
      active: [false],
    });
  }

  addWidget(widget?: ICorporates.IAppFeatureWidgets): void {
    if (widget) {
      const createWidget = this.fb.group({
        name: [widget?.name, Validators.compose([Validators.required])],
        type: [widget?.type, Validators.compose([Validators.required])],
        icon: [widget?.icon, Validators.compose([Validators.required])],
        order: [widget?.order, Validators.compose([Validators.required])],
        active: [widget?.active, Validators.compose([Validators.required])],
        url: [widget?.url ?? ''],
      });
      this.widgets.push(createWidget);
    } else {
      this.widgets.push(this.createWidget());
    }
  }

  addVehicleWidget(widget?: ICorporates.IAppFeatureVehicleWidgets): void {
    
    if (widget) {
      const createWidget = this.fb.group({
        name: [widget?.name],
        type: [widget?.type],
        icon: [widget?.icon],
        order: [widget?.order],
        active: [widget?.active],
      });
      this.vehicleWidgets.push(createWidget);

    } else {

      this.vehicleWidgets.push(this.createVehicleWidget());
    }

  }
  removeWidget(event: number): void {
    this.widgets.removeAt(event);
  }

  removeVehicleWidget(event: number): void {
    this.vehicleWidgets.removeAt(event);
  }

  // ---- Web Hook Version ----

  emptyWebhookVersion(): void {
    while (this.versions.controls.length) {
      this.versions.removeAt(0);
    }
  }

  createWebhookVersion(): FormGroup {
    return this.fb.group({
      url: ['', Validators.compose([Validators.required])],
      version: ['', Validators.compose([Validators.required])],
    });
  }

  addWebhookVersion(
    webHookVersion?: ICorporates.ISalesforceWebhookVersions
  ): void {
    if (webHookVersion) {
      const createWebHookVersion = this.fb.group({
        url: [webHookVersion.url, Validators.compose([Validators.required])],
        version: [
          webHookVersion.version,
          Validators.compose([Validators.required]),
        ],
      });
      this.versions.push(createWebHookVersion);
    } else {
      this.versions.push(this.createWebhookVersion());
    }
  }

  removeWebhookVersion(event: number): void {
    this.versions.removeAt(event);
  }

  // ---- Account profile types ----

  emptyAccountProfileDocumentTypes(): void {
    while (this.accountProfileDocumentTypes.controls.length) {
      this.versions.removeAt(0);
    }
  }

  createAccountProfileDocumentTypes(): FormGroup {
    return this.fb.group({
      key: ['', Validators.compose([Validators.required])],
      value: ['', Validators.compose([Validators.required])],
    });
  }

  addAccountProfileDocumentTypes(
    accountProfileDocumentTypes?: ICorporates.IAppFeatureAccountProfileDocumentTypes
  ): void {
    if (accountProfileDocumentTypes) {
      const createAccountProfileDocumentTypes = this.fb.group({
        key: [
          accountProfileDocumentTypes.key,
          Validators.compose([Validators.required]),
        ],
        value: [
          accountProfileDocumentTypes.value,
          Validators.compose([Validators.required]),
        ],
      });
      this.accountProfileDocumentTypes.push(createAccountProfileDocumentTypes);
    } else {
      this.accountProfileDocumentTypes.push(
        this.createAccountProfileDocumentTypes()
      );
    }
  }

  removeAccountProfileDocumentTypes(event: number): void {
    this.accountProfileDocumentTypes.removeAt(event);
  }

  // ---- Vehicle Coverage ----

  emptyVehicleCoverage() {
    while (this.coverages.controls.length) {
      this.coverages.removeAt(0);
    }
  }

  createVehicleCoverage() {
    return this.fb.group({
      brand: ['', Validators.compose([Validators.required])],
      mobileService: [false, Validators.compose([Validators.required])],
      serviceCenter: [false, Validators.compose([Validators.required])],
    });
  }

  addVehicleCoverage(
    vehicleCoverage?: ICorporates.IConfigurationVehicleCoverage | any
  ) {
    if (vehicleCoverage) {
      const createVehicleCoverage = this.fb.group({
        brand: [
          vehicleCoverage.brand,
          Validators.compose([Validators.required]),
        ],
        mobileService: [vehicleCoverage.mobileService],
        serviceCenter: [
          vehicleCoverage.serviceCenter,
          Validators.compose([Validators.required]),
        ],
      });
      this.coverages.push(createVehicleCoverage);
    } else {
      return this.coverages.push(this.createVehicleCoverage());
    }
  }

  removeVehicleCoverage(event: number) {
    const control = this.vehicles.get('coverages') as FormArray;
    return control.removeAt(event);
  }

  // ---- Modules ----

  emptySubscriptionModules() {
    while (this.modules.controls.length) {
      this.modules.removeAt(0);
    }
  }

  createSubscriptionModules() {
    return this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      description: [''],
      key: ['', Validators.compose([Validators.required])],
      options: this.fb.group({}),
    });
  }

  createServiceCenterConfigurationService() {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      calendarType: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      active: [false, Validators.compose([Validators.required])],
    });
  }

  removeModule(event: number) {
    const control = this.subscriptions.get('modules') as FormArray;
    return control.removeAt(event);
  }

  addServiceCenterConfigurationService(index: number) {
    const services = ((this.modules.controls[index] as FormGroup).get(
      'options'
    ) as FormGroup).get('services') as FormArray;

    services.push(this.createServiceCenterConfigurationService());
  }

  addSubscriptionModules(
    subscriptionModules?: ICorporates.ISubscriptionModules | any
  ) {
    if (subscriptionModules) {
      const services = this.fb.array([]);

      if (subscriptionModules.options && subscriptionModules.options.services) {
        subscriptionModules.options.services.map((s) => {
          services.push(
            this.fb.group({
              title: [s.title, Validators.compose([Validators.required])],
              calendarType: [
                s.calendarType,
                Validators.compose([Validators.required]),
              ],
              description: [
                s.description,
                Validators.compose([Validators.required]),
              ],
              active: [s.active, Validators.compose([Validators.required])],
            })
          );
        });
      }

      const createSubscriptionModules = this.fb.group({
        name: [
          subscriptionModules.name,
          Validators.compose([Validators.required]),
        ],
        description: [subscriptionModules.description],
        key: [
          subscriptionModules.key,
          Validators.compose([Validators.required]),
        ],
        options: subscriptionModules.options
          ? this.fb.group({
              services,
            })
          : this.fb.group({}),
      });

      this.modules.push(createSubscriptionModules);
    } else {
      return this.modules.push(this.createSubscriptionModules());
    }
  }

  addSubscriptionModulesOption({
    value,
    index,
  }: {
    value: string;
    index: number;
  }) {
    if (
      value === ICorporates.SubscriptionModules.SERVICE_CENTER &&
      index !== -1
    ) {
      ((this.modules.controls[index] as FormGroup).get(
        'options'
      ) as FormGroup).addControl(
        'services',
        this.fb.array([this.createServiceCenterConfigurationService()])
      );
    }
    if (
      value === ICorporates.SubscriptionModules.MOBILE_SERVICE &&
      index !== -1
    ) {
      ((this.modules.controls[index] as FormGroup).get(
        'options'
      ) as FormGroup).removeControl('services');
    }
  }

  removeCreateServiceCenterConfigurationService({
    index,
    j,
  }: {
    index: number;
    j: number;
  }) {
    const service = ((this.modules.controls[index] as FormGroup).get(
      'options'
    ) as FormGroup).get('services') as FormArray;

    return service.removeAt(j);
  }

  // Image Preview
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];

    this.form.patchValue({
      file,
    });

    this.file.updateValueAndValidity();
  }

  toggleCorporate(form: FormGroup) {
    const { controls } = form;
    if (
      controls.name.valid &&
      controls.type.valid &&
      controls.registrationNumber.valid &&
      !this.exists
    ) {
      this.addPeopleInCharge();
      this.addSocialAccounts();

      this.exists = true;
    } else if (!!this.corporate) {
      this.onUpdate(true, form);
    } else {
      this.createCorporate(true, form);
    }
  }

  createCorporate(event: boolean, form: FormGroup) {
    const { value, valid } = form;
    if (event && valid && this.createPermission) {
      traverseAndRemove(value);

      this.create.emit(value);
      form.disable();
    }
  }

  onUpdate(event: boolean, form: FormGroup) {
    const { value } = form;
    console.log("🚀 ~ file: corporate-form.component.ts:2940 ~ CorporateFormComponent ~ onUpdate ~ value:", value)
    if (event && this.updatePermission) {
      const updateDocument = {
        ...this.corporate,
        ...value,
      };

      traverseAndRemove(updateDocument);

      this.updated.emit(updateDocument);

      this.form.disable();
    }
  }

  onAction(action: string) {
    switch (action) {
      case 'edit':
        this.form.enable();
        this.form.markAllAsTouched();
        break;
      case 'cancel':
        this.cancel();
        break;
    }
  }

  onUpload(file: FormControl) {
    const { value, valid } = file;

    if (valid) {
      this.upload.emit({
        ...this.corporate,
        file: value,
      });
    }

    this.upload.emit();
  }

  cancel() {
    if (!this.exists) {
      this.location.back();
    } else {
      this._initialForm();
    }
  }

  openPanel(trigger: any) {
    if (this.form.enabled) {
      trigger.openPanel();
    }
  }

  uploadedSocialImage({ file, index }: { file: any; index: number }) {
    const payload = {
      file,
      index,
      corporate: this.corporate,
    };

    this.corporatesFacade.uploadSocialImage(payload);
  }

  get enabledGeneralForm() {
    return (
      this.type.valid &&
      this.name.valid &&
      this.registrationNumber.valid &&
      this.description.valid &&
      !this.formDisabled &&
      this.createPermission &&
      this.updatePermission
    );
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

  get vehicleWidgets(): FormArray {
    return this.vehicle.get('widgets') as FormArray;
  }
}
