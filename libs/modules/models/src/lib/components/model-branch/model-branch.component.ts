import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';

// Angular forms
import {
  FormArray,
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';

// Models
import { IModels } from '../../models';
import { Auth } from '@neural/auth';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Functions
import { traverseAndRemove } from '@neural/shared/data';

// Material Event
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'neural-model-branch',
  templateUrl: './model-branch.component.html',
  styleUrls: ['./model-branch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelBranchComponent implements OnChanges {
  @Input() model: IModels.IDocument;

  @Input() unit: IModels.IUnitList;

  @Input() selectedCorporate: Auth.ICorporates;

  @Input() permissions: any;

  @Output() setBranches = new EventEmitter<IModels.ISetBranches>();

  @Output() seriesChange = new EventEmitter<{
    brand: string;
    series: string;
  }>();

  form = this.fb.group({
    corporateUuid: ['', Validators.compose([Validators.required])],
    brand: ['', Validators.compose([Validators.required])],
    model: [''],
    variant: [''],
    series: ['', Validators.compose([Validators.required])],
    branches: this.fb.array([])
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      this.corporateUuid.patchValue(this.selectedCorporate.uuid);
    }

    if (changes.model && changes.model.currentValue) {
      const {
        unit: { brand, model, variant, series },
        corporateUuid,
        branches
      } = this.model;

      const setDocument: IModels.ISetBranches = {
        corporateUuid,
        brand,
        model,
        variant,
        series
      };

      this.form.patchValue(setDocument);

      if (branches) {
        this.emptyBranch();

        for (const branch of branches) {
          this.addBranch(branch);
        }
      }

      this.form.disable();
    }
  }

  get weekDays() {
    return IModels.weekDays;
  }

  get brand() {
    return this.form.get('brand') as FormControl;
  }

  get series() {
    return this.form.get('series') as FormControl;
  }

  get corporateUuid() {
    return this.form.get('corporateUuid') as FormControl;
  }

  get branches() {
    return this.form.get('branches') as FormArray;
  }

  get branchesControls() {
    return (this.form.get('branches') as FormArray).controls;
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get seriesList(): IModels.ISeries[] | string[] {
    const brand = this.form.get('brand') as FormControl;

    if (brand.valid) {
      const index = this.unit.brandsAndSeries.findIndex(
        x => x.name === brand.value
      );

      if (index !== -1) {
        return this.unit.brandsAndSeries[index].series;
      }
    }

    return [];
  }

  createBranch() {
    return this.fb.group({
      uuid: ['', Validators.compose([Validators.required])],
      testDrive: this.fb.group({
        location: this.fb.group({
          days: this.fb.group({
            monday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            tuesday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            wednesday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            thursday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            friday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            saturday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            sunday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            })
          }),
          active: [false, Validators.compose([Validators.required])]
        }),
        showRoom: this.fb.group({
          days: this.fb.group({
            monday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            tuesday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            wednesday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            thursday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            friday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            saturday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            }),
            sunday: this.fb.group({
              start: [''],
              end: [''],
              session: ['']
            })
          }),
          active: [false, Validators.compose([Validators.required])]
        }),
        active: [true, Validators.compose([Validators.required])]
      }),
      sales: this.fb.group({
        active: [false, Validators.compose([Validators.required])]
      })
    });
  }

  onRemoveBranch(event: number) {
    const control = this.form.get('branches') as FormArray;
    return control.removeAt(event);
  }

  emptyBranch() {
    while (this.branches.controls.length) {
      this.branches.removeAt(0);
    }
  }

  addBranch(branch?: IModels.IBranch | any) {
    if (branch) {
      const {
        testDrive: {
          location,
          showRoom
        },
        sales
      } = branch;
      const createBranch = this.fb.group({
        uuid: [branch.uuid],
        testDrive: this.fb.group({
          location: this.fb.group({
            days: this.fb.group({
              monday: this.fb.group({
                start: [location?.days?.monday?.start ? location?.days?.monday?.start : ''],
                end: [location?.days?.monday?.end ? location?.days?.monday.end : ''],
                session: [location?.days?.monday ? location?.days?.monday.session : '']
              }),
              tuesday: this.fb.group({
                start: [location?.days?.tuesday?.start ? location?.days?.tuesday.start : ''],
                end: [location?.days?.tuesday?.end ? location?.days?.tuesday.end : ''],
                session: [location?.days?.tuesday ? location?.days?.tuesday.session : '']
              }),
              wednesday: this.fb.group({
                start: [location?.days?.wednesday?.start ? location?.days?.wednesday.start : ''],
                end: [location?.days?.wednesday?.end ? location?.days?.wednesday.end : ''],
                session: [location?.days?.wednesday?.start ? location?.days?.wednesday.session : '']
              }),
              thursday: this.fb.group({
                start: [location?.days?.thursday?.start ? location?.days?.thursday.start : ''],
                end: [location?.days?.thursday?.end ? location?.days?.thursday.end : ''],
                session: [location?.days?.thursday?.start ? location?.days?.thursday.session : '']
              }),
              friday: this.fb.group({
                start: [location?.days?.friday?.start ? location?.days?.friday.start : ''],
                end: [location?.days?.friday?.end ? location?.days?.friday.end : ''],
                session: [location?.days?.friday?.start ? location?.days?.friday.session : '']
              }),
              saturday: this.fb.group({
                start: [location?.days?.saturday?.start ? location?.days?.saturday.start : ''],
                end: [location?.days?.saturday?.end ? location?.days?.saturday.end : ''],
                session: [location?.days?.saturday?.start ? location?.days?.saturday.session : '']
              }),
              sunday: this.fb.group({
                start: [location?.days?.sunday?.start ? location?.days?.sunday.start : ''],
                end: [location?.days?.sunday?.end ? location?.days?.sunday.end : ''],
                session: [location?.days?.sunday?.start ? location?.days?.sunday.session : '']
              })
            }),
            active: [location?.active]
          }),
          showRoom: this.fb.group({
            days: this.fb.group({
              monday: this.fb.group({
                start: [showRoom?.days?.monday ? showRoom.days.monday.start : ''],
                end: [showRoom?.days?.monday ? showRoom.days.monday.end : ''],
                session: [
                  showRoom?.days?.monday ? showRoom.days.monday.session : ''
                ]
              }),
              tuesday: this.fb.group({
                start: [
                  showRoom?.days?.tuesday?.start ? showRoom?.days?.tuesday?.start : ''
                ],
                end: [showRoom?.days?.tuesday?.end ? showRoom?.days?.tuesday?.end : ''],
                session: [
                  showRoom?.days?.tuesday?.session ? showRoom?.days?.tuesday?.session : ''
                ]
              }),
              wednesday: this.fb.group({
                start: [
                  showRoom?.days?.wednesday?.start ? showRoom.days.wednesday.start : ''
                ],
                end: [
                  showRoom?.days?.wednesday?.end ? showRoom.days.wednesday.end : ''
                ],
                session: [
                  showRoom?.days?.wednesday?.session ? showRoom.days.wednesday.session : ''
                ]
              }),
              thursday: this.fb.group({
                start: [
                  showRoom?.days?.thursday?.start ? showRoom.days.thursday.start : ''
                ],
                end: [showRoom?.days?.thursday?.end ? showRoom.days.thursday.end : ''],
                session: [
                  showRoom?.days?.thursday?.session ? showRoom.days.thursday.session : ''
                ]
              }),
              friday: this.fb.group({
                start: [showRoom?.days?.friday?.start ? showRoom.days.friday.start : ''],
                end: [showRoom?.days?.friday?.end ? showRoom.days.friday.end : ''],
                session: [
                  showRoom?.days?.friday?.session ? showRoom.days.friday.session : ''
                ]
              }),
              saturday: this.fb.group({
                start: [
                  showRoom?.days?.saturday?.start ? showRoom.days.saturday.start : ''
                ],
                end: [showRoom?.days?.saturday?.end ? showRoom.days.saturday.end : ''],
                session: [
                  showRoom?.days?.saturday?.session ? showRoom.days.saturday.session : ''
                ]
              }),
              sunday: this.fb.group({
                start: [showRoom?.days?.sunday?.start ? showRoom.days.sunday.start : ''],
                end: [showRoom?.days?.sunday?.end ? showRoom.days.sunday.end : ''],
                session: [
                  showRoom?.days?.sunday?.session ? showRoom.days.sunday.session : ''
                ]
              })
            }),
            active: [showRoom?.active]
          }),
          active: [
            !!branch.testDrive && branch.testDrive.active !== undefined
              ? branch.testDrive.active
              : true,
            Validators.compose([Validators.required])
          ]
        }),
        sales: this.fb.group({
          active: [
            !!sales ? sales.active : false,
            Validators.compose([Validators.required])
          ]
        })
      });
      this.branches.push(createBranch);
    } else {
      return this.branches.push(this.createBranch());
    }
  }

  setBranch(form: FormGroup) {
    const { value, valid } = form;
    if (valid && this.createPermission) {
      traverseAndRemove(value);
      this.setBranches.emit(value);
      form.disable();
    }
  }

  onChangeSeries(event: MatSelectChange) {
    const { value } = event;
    const brand = this.brand.value;
    this.seriesChange.emit({ brand, series: value });
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Model.CREATE_MODEL]
    ) {
      return true;
    }
    return false;
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
