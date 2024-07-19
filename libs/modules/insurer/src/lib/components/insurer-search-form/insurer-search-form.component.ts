import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'neural-insurer-search-form',
  templateUrl: './insurer-search-form.component.html',
  styleUrls: ['./insurer-search-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InsurerSearchFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
