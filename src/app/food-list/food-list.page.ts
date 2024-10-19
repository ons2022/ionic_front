import { Component } from '@angular/core';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.page.html',
  styleUrls: ['./food-list.page.scss'],
})
export class FoodListPage {
  foodItems = [
    { name: 'Pizza' },
    { name: 'Burger' },
    { name: 'Pasta' },
  ];
}
