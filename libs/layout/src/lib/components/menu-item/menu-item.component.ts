import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'neural-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemComponent {

  @Input() items: any[];
  @ViewChild('childMenu',{static: true}) public childMenu: any;

}
