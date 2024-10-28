import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';  // For local storage of tokens
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';  // For side-effects and error handling

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api';  // Django backend URL
  private _storage: Storage | null = null;
  token: string = '';
  private cart: any[] = [];

  constructor(private http: HttpClient, private storage: Storage) {
    this.init();
  }

  // Initialize Ionic Storage
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this.cart = (await this._storage.get('cart')) || [];
    const storedToken = await this._storage.get('access_token');
    if (storedToken) {
      this.token = storedToken;  // Load the token if it exists in storage
    }
  }
  // Retrieve token from Ionic Storage
async getToken() {
  return await this.storage.get('access_token');
}

  // Register user
  register(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, credentials).pipe(
      catchError(this.handleError)  // Handle any errors that occur
    );
  }

  // Login user and store token
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, credentials).pipe(
      tap(async (res: any) => {
        this.token = res.access;
        await this._storage?.set('access_token', this.token);
        await this._storage?.set('user_role', res.role);  // Store the user's role (admin/user)
      })
    );
  }
  
  // Retrieve the user role from storage
  async getUserRole() {
    return await this.storage.get('user_role');
  }

  // Add food to cart
  addToCart(foodId: number, quantity: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.post(`${this.baseUrl}/cart/add/`, { food_id: foodId, quantity }, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  getCartItems() {
    return this.cart;  // You can also retrieve from Ionic Storage if needed
  }

  // Optionally, clear the cart after checkout
  clearCart() {
    this.cart = [];
    this.storage.remove('cart');
  }

  // Get food list
  getFoodList(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`  // Send the token in the Authorization header
    });
    return this.http.get(`${this.baseUrl}/foods/`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Admin: Add new food (Now expects FormData)
  addNewFood(food: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`  // Send the token in the Authorization header
    });
    return this.http.post(`${this.baseUrl}/foods/`, food, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Admin: Edit existing food (Now expects FormData)
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

  // Logout function to clear token
  logout() {
    this.token = '';  // Clear token in memory
    this._storage?.remove('access_token');  // Remove token from storage
  }

  // Centralized error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
