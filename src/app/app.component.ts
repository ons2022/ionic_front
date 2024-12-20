import { Component } from '@angular/core';
import { Router } from '@angular/router'; // To handle navigation
import { AuthService } from './services/auth.service'; // Ensure path to AuthService is correct
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router,private menuController: MenuController) {}
  
  navigateAndClose(route: string) {
    this.router.navigate([route]); // Navigate to the specified route
    this.menuController.close(); // Close the menu
  }
  // Add the logout method here
  logout() {
    this.authService.logout();  // Clear the auth token, and perform logout
    this.router.navigate(['/login']);  // Redirect the user to login page
  }

}
