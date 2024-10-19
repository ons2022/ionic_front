import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  foods: any[] = [];
  newFood = { name: '', price: '' };
  editMode = false;
  editFoodId: number | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadFoods();
  }

  // Load the list of food items
  loadFoods() {
    this.authService.getFoodList().subscribe((data: any) => {
      this.foods = data;
    });
  }

  // Add a new food item
  addFood() {
    const food = {
      name: this.newFood.name,
      price: Number(this.newFood.price)  // Convert the price from string to number
    };
  
    this.authService.addNewFood(food).subscribe(() => {
      this.newFood = { name: '', price: '' };  // Reset the form after successful addition
      this.loadFoods();  // Reload the list to show the new item
    });
  }

  // Edit food item
  editFood(food: any) {
    this.editMode = true;
    this.newFood = { name: food.name, price: food.price };
    this.editFoodId = food.id;
  }

  // Update food item
  updateFood() {
    if (this.editFoodId !== null) {
      // Convert the price from string to number
      const updatedFood = {
        name: this.newFood.name,
        price: Number(this.newFood.price)  // Convert price to a number
      };
  
      this.authService.updateFood(this.editFoodId, updatedFood).subscribe(() => {
        this.newFood = { name: '', price: '' };  // Reset form
        this.editMode = false;
        this.editFoodId = null;
        this.loadFoods();  // Reload the food list
      });
    }
  }

  // Delete food item
  deleteFood(foodId: number) {
    this.authService.deleteFood(foodId).subscribe(() => {
      this.loadFoods();
    });
  }
}
