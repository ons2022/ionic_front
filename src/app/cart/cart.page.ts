import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cart: any[] = [];
  totalPrice: number = 0;

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    await this.loadCart();
  }

  async loadCart() {
    this.cart = await this.authService.getCartItems();
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  async removeItem(foodId: number) {
    await this.authService.removeFromCart(foodId);
    await this.loadCart(); 
  }

  async checkout() {
    alert('Order placed successfully!');
    await this.authService.clearCart(); 
    await this.loadCart();
    this.router.navigate(['/home']);
  }
}
