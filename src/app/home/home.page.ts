import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  foodList: any[] = [];
  cart: any[] = [];
  searchQuery: string = '';

  // Example categories (static data)
  categories = [
    { name: 'Pizza', image: 'assets/img/pizza.jpg' },
    { name: 'Burger', image: 'assets/img/burger.jpg' },
    { name: 'Sushi', image: 'assets/img/sushi.jpg' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadFoodList();  // Load the food list on page load
  }

  // Load the food list from the backend
  loadFoodList() {
    this.authService.getFoodList().subscribe(
      (response: any) => {
        this.foodList = response;
      },
      (error) => {
        console.error('Failed to load food list:', error);
      }
    );
  }

  // Search food based on user input
  filteredFoods() {
    if (this.searchQuery) {
      return this.foodList.filter(food =>
        food.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    return this.foodList;
  }
  

  // Add food to cart
  openCart() {
    this.router.navigate(['/cart']); // Navigate to the cart page
  }

  addToCart(food: any) {
    this.authService.addToCart(food, 1).then(() => {
      console.log('Food added to cart:', food);
    });
  }


  // Logout the user
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);  // Redirect to login page
  }
}
