import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';  // For local storage of tokens
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';  // To perform side-effects after the login request

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api';  // Replace with your Django backend URL
  private _storage: Storage | null = null;
  token: string = '';

  constructor(private http: HttpClient, private storage: Storage) {
    this.init();
  }

  // Initialize Ionic Storage
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    const storedToken = await this._storage.get('access_token');
    if (storedToken) {
      this.token = storedToken;  // Load the token if it exists in storage
    }
  }

  // Register user
  register(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, credentials);
  }

  // Login user and store token
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, credentials).pipe(
      tap(async (res: any) => {
        // On successful login, store the token in storage
        this.token = res.access;  // Assuming your Django backend returns an access token
        await this._storage?.set('access_token', this.token);  // Store token in Ionic Storage
      })
    );
  }

  // Add food to cart
  addToCart(foodId: number, quantity: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.post(`${this.baseUrl}/cart/add/`, { food_id: foodId, quantity }, { headers });
  }

  // Get food list
  getFoodList() {
    return this.http.get(`${this.baseUrl}/foods/`);
  }

  // Admin: Add new food
  addNewFood(food: { name: string; price: number }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.post(`${this.baseUrl}/foods/`, food, { headers });
  }

  // Admin: Edit existing food
  updateFood(foodId: number, food: { name: string; price: number }) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.put(`${this.baseUrl}/foods/${foodId}/`, food, { headers });
  }

  // Admin: Delete food
  deleteFood(foodId: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.delete(`${this.baseUrl}/foods/${foodId}/`, { headers });
  }

  // Logout function to clear token
  logout() {
    this.token = '';  // Clear token in memory
    this._storage?.remove('access_token');  // Remove token from storage
  }
}
