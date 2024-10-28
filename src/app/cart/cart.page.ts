import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';  // Assuming you use AuthService for cart logic

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private modalController: ModalController, private authService: AuthService) {}

  ngOnInit() {
    this.loadCart();  // Load cart items when the modal is opened
  }

  // Load cart items and calculate the total price
  loadCart() {
    this.cartItems = this.authService.getCartItems();  // Assuming getCartItems() returns the cart items
    this.calculateTotalPrice();
  }

  // Calculate the total price
  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  // Dismiss the modal
  dismissCart() {
    this.modalController.dismiss();
  }

  // Handle checkout logic
  checkout() {
    console.log('Proceed to checkout');
    // Implement the checkout process here
  }
}
