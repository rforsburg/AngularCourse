import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginComponent } from '../login/login.component'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  dish: Dish
  promotion: Promotion

  constructor(private dishservice: DishService,
              private promotionservice: PromotionService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.dish = this.dishservice.getFeaturedDish();
   // this.promotion = this.promotionservice.getFeaturedPromotion();
  }

  openLoginForm() {
    this.dialog.open(LoginComponent, {width: '500px', height: '450px'});
  }

}
