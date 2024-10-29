import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage  {
  phoneNumber: string = '';
  address: string = '';
  isSubmitted: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  

  onValidate() {
    this.isSubmitted = true;
  }
  openCart() {
    this.router.navigate(['/cart']); 
  }
}
