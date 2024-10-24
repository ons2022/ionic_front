import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      async (response: any) => {
        // After successful login, retrieve the user role
        const userRole = await this.authService.getUserRole();
        
        
        // Redirect based on the user role (admin or user)
        if (userRole === 'admin') {
          this.router.navigate(['/admin']);  // Navigate to admin page if user is admin
        } else {
          this.router.navigate(['/home']);   // Navigate to home page if user is not admin
        }
      },
      (error) => {
        this.errorMessage = 'Invalid credentials. Please try again.';
        console.error('Login error:', error);  // Log error for debugging
      }
    );
  }
}
