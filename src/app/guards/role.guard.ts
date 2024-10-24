import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: any): Promise<boolean> {
    const token = await this.authService.getToken();  // Retrieve token from storage
    const userRole = await this.authService.getUserRole();  // Retrieve user role (admin or user)

    // Check if the user has the required role
    if (token && userRole === 'admin') {
      return true;  // Allow access for admins
    } else if (token && userRole === 'user') {
      this.router.navigate(['/home']);  // Redirect regular users to the home page
      return false;
    } else {
      this.router.navigate(['/login']);  // Redirect to login page if not authenticated
      return false;
    }
  }
}