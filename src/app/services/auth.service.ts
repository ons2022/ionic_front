import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api'; // Django backend URL
  private _storage: Storage | null = null;
  token: string = '';
  private cart: any[] = []; // Cart array

  constructor(private http: HttpClient, private storage: Storage) {
    this.init();
  }

  // Initialize Ionic Storage
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.cart = (await this._storage.get('cart')) || []; // Load existing cart from storage
    const storedToken = await this._storage.get('access_token');
    if (storedToken) {
      this.token = storedToken; // Load the token if it exists in storage
    }
  }

  // Retrieve token from Ionic Storage
  async getToken() {
    return await this.storage.get('access_token');
  }

  // Register user
  register(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, credentials).pipe(
      catchError(this.handleError)
    );
  }

  // Login user and store token
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, credentials).pipe(
      tap(async (res: any) => {
        this.token = res.access;
        await this._storage?.set('access_token', this.token);
        await this._storage?.set('user_role', res.role);
      })
    );
  }

  // Retrieve the user role from storage
  async getUserRole() {
    return await this.storage.get('user_role');
  }

  // Add food item to the cart
  async addToCart(food: { id: number; name: string; price: number; image: string }, quantity: number = 1) {
    const existingItem = this.cart.find(item => item.id === food.id);
    if (existingItem) {
      existingItem.quantity += quantity; // Update quantity if item already in cart
    } else {
      this.cart.push({ ...food, quantity }); // Add new item to cart
    }
    await this._storage?.set('cart', this.cart); // Save updated cart to storage
  }

  // Get all items in the cart
  async getCartItems() {
    this.cart = await this._storage?.get('cart') || [];
    return this.cart;
  }

  // Remove an item from the cart
  async removeFromCart(foodId: number) {
    this.cart = this.cart.filter(item => item.id !== foodId); // Filter out the item by ID
    await this._storage?.set('cart', this.cart); // Update cart in storage
  }

  // Clear the cart after checkout or logout
  async clearCart() {
    this.cart = [];
    await this._storage?.remove('cart'); // Remove cart from storage
  }

  // Calculate total price of items in the cart
  calculateTotalPrice(): number {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Get food list (with token authorization)
  getFoodList(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.get(`${this.baseUrl}/foods/`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Admin: Add new food (FormData format for image upload)
  addNewFood(food: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.post(`${this.baseUrl}/foods/`, food, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Admin: Edit existing food
  updateFood(foodId: number, food: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.put(`${this.baseUrl}/foods/${foodId}/`, food, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Admin: Delete food
  deleteFood(foodId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.delete(`${this.baseUrl}/foods/${foodId}/`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Logout function to clear token and cart
  async logout() {
    this.token = '';
    await this._storage?.remove('access_token');
    await this.clearCart(); // Clear the cart on logout
  }

  // Centralized error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  getAllUsers(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.get(`${this.baseUrl}/users/`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete a user by ID (Admin only)
  deleteUser(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.delete(`${this.baseUrl}/users/${userId}/`, { headers })
      .pipe(catchError(this.handleError));
  }

  

}
