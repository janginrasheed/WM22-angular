import {Component, OnInit} from '@angular/core';
import {User} from "../../types/user";
import {DataService} from "../../services/data.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User = {email: "", password: ""};
  public passwordV: string = "";
  hidePassword: boolean = true;
  hidePassword2: boolean = true;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  password2FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
  }

  showPassword() {
    this.hidePassword = !this.hidePassword;
  }

  showPassword2() {
    this.hidePassword2 = !this.hidePassword2;
  }

  loginClicked(): void {
    console.log("Login User: " + this.user);
  }

  registerClicked(): void {
    this.dataService.getUserByEmail(this.user.email).subscribe(user => {
      if (user) {
        console.log("Email is already registered");
      } else {
        console.log("Register User: " + this.user);
        this.dataService.registerUser(this.user).subscribe(response => {
          console.log(response);
        });
      }
    });
  }

}
