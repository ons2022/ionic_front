// admin.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  newFood: any = { name: '', description: '', price: '', available: true, image: null };
  foods: any[] = [];
  users: any[] = [];  // List of users
  editMode = false;
  editFoodId: number | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadFoods();
    this.loadUsers(); // Load the list of users
  }

  // Load foods list
  loadFoods() {
    this.authService.getFoodList().subscribe(
      (response) => {
        this.foods = response;
      },
      (error) => {
        console.error('Failed to load food list:', error);
      }
    );
  }

  // Load users list
  loadUsers() {
    this.authService.getAllUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error('Failed to load user list:', error);
      }
    );
  }

  // File upload handling for food images
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newFood.image = file;
    }
  }

  // Add new food
  addFood() {
    if (!this.authService.token) {
      console.error('No authorization token found');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newFood.name);
    formData.append('description', this.newFood.description);
    formData.append('price', this.newFood.price.toString());
    formData.append('available', this.newFood.available ? 'true' : 'false');
    if (this.newFood.image) {
      formData.append('image', this.newFood.image);
    }

    this.authService.addNewFood(formData).subscribe(
      () => {
        this.loadFoods();
        this.resetForm();
      },
      (error) => {
        console.error('Failed to add food:', error);
      }
    );
  }

  // Update existing food
  updateFood() {
    if (this.editFoodId !== null) {
      const formData = new FormData();
      formData.append('name', this.newFood.name);
      formData.append('description', this.newFood.description);
      formData.append('price', this.newFood.price.toString());
      formData.append('available', this.newFood.available ? 'true' : 'false');
      if (this.newFood.image) {
        formData.append('image', this.newFood.image);
      }

      this.authService.updateFood(this.editFoodId, formData).subscribe(
        () => {
          this.loadFoods();
          this.resetForm();
        },
        (error) => {
          console.error('Failed to update food:', error);
        }
      );
    }
  }

  // Set the selected food item to edit mode
  editFood(food: any) {
    this.newFood = { ...food };
    this.editFoodId = food.id;
    this.editMode = true;
  }

  // Delete a food item
  deleteFood(foodId: number) {
    this.authService.deleteFood(foodId).subscribe(
      () => {
        this.loadFoods();
      },
      (error) => {
        console.error('Failed to delete food:', error);
      }
    );
  }

  // Delete a user (Admin only)
  deleteUser(userId: number) {
    this.authService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter(user => user.id !== userId);
        console.log('User deleted successfully');
      },
      (error) => {
        console.error('Failed to delete user:', error);
      }
    );
  }

  // Reset form fields
  resetForm() {
    this.newFood = { name: '', description: '', price: '', available: true, image: null };
    this.editMode = false;
    this.editFoodId = null;
  }

  // Logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
