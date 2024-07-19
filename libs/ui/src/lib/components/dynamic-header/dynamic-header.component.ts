import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// BreaCrumb and Sort Models
import {
  ISort,
  IBreadCrumb,
  IBC,
  IFilters,
  IFilter,
} from '@neural/shared/data';

// Angular Forms
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Mat Select
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'neural-dynamic-header',
  templateUrl: './dynamic-header.component.html',
  styleUrls: ['./dynamic-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicHeaderComponent implements OnChanges {
  @Input() title: string;
  @Input() breadcrumb: IBreadCrumb;
  @Input() breadcrumbs: IBC[] | null;
  @Input() sort: ISort[];
  @Input() link: string | null;
  @Input() loading!: boolean | null;
  @Input() isSearch: boolean;
  @Input() placeholder: string;
  @Input() selectedSort: ISort;
  @Input() filters: IFilters;
  @Input() filtered: IFilter;

  @Output() refreshChange = new EventEmitter();
  @Output() selectedChange = new EventEmitter();
  @Output() searchChange = new EventEmitter();
  @Output() filterChange = new EventEmitter<IFilter>();
  @Output() syncDMS = new EventEmitter<boolean>();

  disableSearch = false;
  disableSort = false;

  sortData: any;
  defaultValue = null;

  searchForm: FormGroup = this.fb.group({
    email: ['', Validators.compose([Validators.required])],
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.sort && changes.sort.currentValue) {
      const entities = this.sort.reduce(
        (per, cur) => Object.assign(per, cur),
        {}
      );
      this.sortData = {
        sortItems: entities ? entities : null,
      };
    }

    if (changes.filtered && changes.filtered.currentValue) {
      this.defaultValue = null;
    }
  }

  refresh() {
    this.refreshChange.emit(true);
  }

  search(form: FormGroup) {
    const { valid, value } = form;

    if (valid) {
      this.searchChange.emit(value);
    }
  }

  cancel(form: FormGroup) {
    form.reset();
    this.searchChange.emit(false);
  }

  selectSort(event: ISort) {
    const key = event.key;

    const sort = {
      [key]: event.value,
    };

    this.selectedSort = sort;

    this.selectedChange.emit(sort);
  }

  onChangeFilter(event: MatSelectChange, key: string) {
    const { value } = event;
    this.filterChange.emit({ [`${key}`]: value });
  }

  syncServiceLineDMS() {
    this.syncDMS.emit(true);
  }

  get isFormPage() {
    if (
      this.breadcrumbs &&
      !!this.breadcrumbs.length &&
      this.breadcrumbs[this.breadcrumbs.length - 2].path
    ) {
      return true;
    }
    return false;
  }
}
