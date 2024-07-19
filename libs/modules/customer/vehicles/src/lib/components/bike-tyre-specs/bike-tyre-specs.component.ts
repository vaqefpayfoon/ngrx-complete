import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';

// Models
import { IVehicle } from '../../models';

// Angular Form
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

// Material event
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'neural-bike-tyre-specs',
  templateUrl: './bike-tyre-specs.component.html',
  styleUrls: ['./bike-tyre-specs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BikeTyreSpecsComponent implements OnChanges {
  @Input()
  vehicle: IVehicle.IDocument;

  @Input()
  bikeTyreSpecs: any;

  @Input() tyre: IVehicle.ITyre;

  @Input() rearTyre: IVehicle.ITyre;

  @Input()
  error: any;

  @Output()
  update = new EventEmitter<IVehicle.IUpdate>();

  @Output() aspectRatio = new EventEmitter<{ width: string }>();
  @Output() rim = new EventEmitter<{ width: string; aspectRatio: string }>();

  @Output() rearWidth = new EventEmitter<any>();
  @Output() rearAspectRatio = new EventEmitter<{ width: string }>();
  @Output() rearRim = new EventEmitter<{ width: string; aspectRatio: string }>();

  form = this.fb.group({
    front: this.fb.group(this.specification),
    rear: this.fb.group(this.specification),
    sameTyre: [false, [Validators.required]]
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.bikeTyreSpecs &&
      changes.bikeTyreSpecs.currentValue &&
      this.bikeTyreSpecs
    ) {
      const { front, rear } = this.bikeTyreSpecs;

      if (front.width === rear.width) {
        this.sameTyre.patchValue(true);
        this.setTyreSpecs(front);
      } else {
        this.setTyreSpecs(front, rear);
      }

      this.form.disable();
    }

    if (changes && changes.error && !changes.error.firstChange) {
      this.form.enable();
    }
  }

  setTyreSpecs(front: any, rear?: any) {
    this.front.patchValue(front);
    this.rear.patchValue(rear ? rear : front);
  }

  sameTyreToggle(event: MatSlideToggleChange) {
    const { checked } = event;
    
    if (checked) {
      this.setTyreSpecs(this.front.value);
    } else {
      this.rearWidth.emit();
      this.setTyreSpecs(this.front.value, this.rear.value);
    }
  }

  updateTyreSpecs(form: FormGroup) {
    const { value, valid, touched } = form;

    if (touched && valid) {
      this.update.emit({
        ...this.vehicle,
        bikeTyreSpecs: {
          front: {
            aspectRatio: parseInt(value.front.aspectRatio, 10),
            rimSize: parseInt(value.front.rimSize, 10),
            width: parseInt(value.front.width, 10)
          },
          rear: {
            aspectRatio: parseInt(value.rear.aspectRatio, 10),
            rimSize: parseInt(value.rear.rimSize, 10),
            width: parseInt(value.rear.width, 10)
          }
        }
      });
      this.form.disable();
    }
  }

  get specification() {
    return {
      width: ['', Validators.required],
      rimSize: ['', Validators.required],
      aspectRatio: ['', Validators.required]
    };
  }

  onSelectWidth(event: MatAutocompleteSelectedEvent, from: FormControl, formControls: FormControl[], isRear: boolean) {
    const { value } = event.option;
    
    !isRear ? this.aspectRatio.emit(value) : this.rearAspectRatio.emit(value);
    
    formControls.forEach(formControl => {
      formControl.patchValue(from.value);
      formControl.get('aspectRatio').reset();
      formControl.get('rimSize').reset();
    });    
  }

  onSelectAspectRatio(event: MatAutocompleteSelectedEvent, from: FormControl, formControls: FormControl[], isRear: boolean) {
    const aspectRatio = event.option.value;
    const width = from.get('width').value;
    
    !isRear? this.rim.emit({ width, aspectRatio }) : this.rearRim.emit({ width, aspectRatio });

    formControls.forEach(formControl => {
      formControl.patchValue(from.value);
      formControl.get('rimSize').reset();
    });
  }

  onSelectRim(from: FormControl, formControls: FormControl[]) {
    formControls.forEach(formControl => formControl.patchValue(from.value));
  }

  get rear(): any {
    return this.form.get('rear') as FormGroup;
  }

  get rearAR(): any {
    return this.rear.get('aspectRatio') as FormControl;
  }

  get rearRimSize(): any {
    return this.rear.get('rimSize') as FormControl;
  }

  get front(): any {
    return this.form.get('front') as FormGroup;
  }

  get frontAspectRatio(): any {
    return this.front.get('aspectRatio') as FormControl;
  }

  get frontRimSize(): any {
    return this.front.get('rimSize') as FormControl;
  }
  
  get sameTyre(): any {
    return this.form.get('sameTyre') as FormGroup;
  }
}
