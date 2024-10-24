import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

// Define Food interface here as well (or import it if defined elsewhere)
interface Food {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.page.html',
  styleUrls: ['./food-list.page.scss'],
})
export class FoodListPage implements OnInit {
  // Type the foodList as an array of Food
  foodList: Food[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadFoodList();
  }

  loadFoodList() {
    this.authService.getFoodList().subscribe(
      (response: Food[]) => {  
        this.foodList = response;  
      },
      (error) => {
        console.error('Failed to load food list:', error);
      }
    );
  }

  addToCart(foodId: number) {
    this.authService.addToCart(foodId, 1).subscribe(
      (response) => {
        console.log('Added to cart');
      },
      (error) => {
        console.error('Failed to add to cart', error);
      }
    );
  }
}
