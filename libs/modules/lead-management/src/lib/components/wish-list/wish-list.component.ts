import { Component, Input, OnInit } from '@angular/core';
import { IWishList } from '../../models';

@Component({
  selector: 'neural-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss']
})
export class WishListComponent {

  @Input() wishItem: IWishList.IDocument;
  
}
