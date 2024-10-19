import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';  // Make sure you have the AuthService in place
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username = '';  // Input for the username
  password = '';  // Input for the password
  isAdmin = false;  // Checkbox for admin
  errorMessage = '';  // Error message if registration fails

  constructor(private authService: AuthService, private router: Router) {}

  // Register the user
  register() {
    const userData = {
      username: this.username,
      password: this.password,
      is_admin: this.isAdmin  // Send admin status
    };

    // Call the AuthService to register the user
    this.authService.register(userData).subscribe(
      (res) => {
        // Navigate to login page on successful registration
        this.router.navigate(['/login']);
      },
      (err) => {
        // Display error message if registration fails
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
