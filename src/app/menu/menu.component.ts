import { Dish } from './../shared/dish';
import { Component, Inject, OnInit } from '@angular/core';
import { DishService } from '../services/dish.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

  export class MenuComponent implements OnInit {

    dishes: Dish[]
    errMess: string 

    constructor(private dishService: DishService,
      @Inject('BaseURL') private BaseURL) { }

    ngOnInit() {
      this.dishService.getDishes()
      .subscribe((dishes) => this.dishes = dishes,  
        errmess => this.errMess = <any>errmess)
    }

  }
