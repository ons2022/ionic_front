import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  phoneNumber: string = '';
  address: string = '';
  isSubmitted: boolean = false;

  constructor() {}

  ngOnInit() {}

  onValidate() {
    this.isSubmitted = true;
  }
}
