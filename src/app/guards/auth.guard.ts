import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const token = await this.authService.getToken();  // Retrieve the token from storage
    if (token) {
      return true;  // Token exists, allow access
    } else {
      this.router.navigate(['/login']);  // Redirect to login page
      return false;  // Block access
    }
  }
}
