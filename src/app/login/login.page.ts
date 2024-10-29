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
       
        const userRole = await this.authService.getUserRole();
        
        
        
        if (userRole === 'admin') {
          this.router.navigate(['/admin']);  
        } else {
          this.router.navigate(['/home']);   
        }
      },
      (error) => {
        this.errorMessage = 'Invalid credentials. Please try again.';
        console.error('Login error:', error);  
      }
    );
  }
  
}
