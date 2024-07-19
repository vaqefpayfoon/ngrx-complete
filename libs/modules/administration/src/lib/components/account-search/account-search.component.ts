import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

// Angular Form Builder
import {
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'neural-account-search',
  templateUrl: './account-search.component.html',
  styleUrls: ['./account-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSearchComponent implements OnInit {
  @Output() searched = new EventEmitter<string>();

  email = new FormControl(
    '',
    Validators.compose([Validators.required, Validators.email])
  );

  constructor() {}

  ngOnInit() {}

  onSearch(form: FormControl) {
    const { value, valid } = form;
    if (valid) {
      this.searched.emit(value);
    }
  }
}
