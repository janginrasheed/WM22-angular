import {Component, OnInit} from '@angular/core';
import {User} from "../types/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User = {email: "", firstName: "", lastName: "", password: ""};
  public passwordV: string = "";

  constructor() {
  }

  ngOnInit(): void {
    // this.user.email = "jangin9rasheed@gmail.com";
    // this.user.firstName = "Jangin";
    // this.user.lastName = "Rasheed";
    // this.user.password = "123456";
  }

  submitClicked(): void {
    console.log(this.user);
  }

  resetClicked(): void {
    this.user.email = "";
    this.user.firstName = "";
    this.user.lastName = "";
    this.user.password = "";
    this.passwordV = "";
  }

}
