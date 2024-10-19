import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodListPage } from './food-list.page';

describe('FoodListPage', () => {
  let component: FoodListPage;
  let fixture: ComponentFixture<FoodListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
