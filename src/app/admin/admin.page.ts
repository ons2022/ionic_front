import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  newFood: any = {
    name: '',
    description: '',
    price: '',
    available: true,
    image: null
  };

  foods: any[] = [];
  editMode = false;
  editFoodId: number | null = null;

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit() {
    this.loadFoods();
  }

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newFood.image = file;
    }
  }

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
        this.loadFoods();  // Refresh the food list
        this.resetForm();  // Reset the form fields after successful add
      },
      (error) => {
        console.error('Failed to add food:', error);
      }
    );
  }

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
          this.loadFoods();  // Refresh the food list
          this.resetForm();  // Reset the form fields after successful update
        },
        (error) => {
          console.error('Failed to update food:', error);
        }
      );
    }
  }

  editFood(food: any) {
    this.newFood = { ...food };  // Copy the selected food details into the form
    this.editFoodId = food.id;
    this.editMode = true;
  }

  deleteFood(foodId: number) {
    this.authService.deleteFood(foodId).subscribe(
      () => {
        this.loadFoods();  // Refresh the food list after deletion
      },
      (error) => {
        console.error('Failed to delete food:', error);
      }
    );
  }

  // Method to reset the form fields
  resetForm() {
    this.newFood = { name: '', description: '', price: '', available: true, image: null };  // Reset all fields
    this.editMode = false;  // Exit edit mode
    this.editFoodId = null;  // Reset the editFoodId
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);  // Redirect to login page
  }
}


