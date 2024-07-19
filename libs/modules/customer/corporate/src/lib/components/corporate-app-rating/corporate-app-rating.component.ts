import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// forms
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

// Interfaces
import { IRating } from '../../models';

@Component({
  selector: 'neural-corporate-app-rating',
  templateUrl: './corporate-app-rating.component.html',
  styleUrls: [
    './corporate-app-rating.component.scss',
    '../corporate-form/corporate-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateAppRatingComponent implements OnChanges, OnInit {
  @Input() rating: IRating.IAppFeatureRating;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private parentForm: FormGroupDirective) {
    this.form = this.ratingForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rating && changes.rating.currentValue) {
      this.form.patchValue(this.rating);
    }
  }

  ngOnInit(): void {
    this.parentForm.form.addControl('rating', this.form);
  }

  private ratingForm(): FormGroup {
    return this.fb.group({
      active: [false],
      title: [''],
    });
  }
}
