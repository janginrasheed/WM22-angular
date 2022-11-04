import {Component, OnInit} from '@angular/core';
import {User} from "../../types/user";
import {DataService} from "../../services/data.service";
import {FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {ParamsService} from "../../services/params.service";
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
/**
 * Dieses Komponente hat alle Elemente der Login/Registrieren Seite
 */
export class LoginComponent implements OnInit {
  message: string;
  public user: User = {email: "", password: "", roleId: 3};
  public passwordV: string = "";
  hidePassword = true;
  hidePassword2 = true;
  fNameFormControl = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  lNameFormControl = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  password2FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  constructor(private dataService: DataService,
              private paramsService: ParamsService,
              private snackBar: MatSnackBar,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  /**
   * Mitteilung in Snackbar anzeigen
   * @param message
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, "X", {
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: "snackbar",
      duration: 5000
    });
  }

  /**
   * Passwort einblenden
   */
  showPassword() {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Passwort einblenden
   */
  showPassword2() {
    this.hidePassword2 = !this.hidePassword2;
  }

  /**
   * Prüfen ob der User schon registriert ist
   * in lokale Speicher in Browser Userdaten speichern
   * Zur Startseite navigieren
   */
  loginClicked(): void {
    this.dataService.getUser(this.user).subscribe(user => {
      if (user != null) {
        localStorage.setItem('isLoggedIn', "true");
        if (typeof this.emailFormControl.value === "string") {
          localStorage.setItem('token', this.emailFormControl.value);
        }
        localStorage.setItem('firstName', <string>user.firstName);
        localStorage.setItem('lastName', <string>user.lastName);
        // @ts-ignore
        localStorage.setItem('roleId', user.roleId);
        this.navigateTo("home");
      } else {
        this.openSnackBar("Email oder Passwort falsch");
      }
    })
  }

  /**
   * Prüfen ob der Email schon registriert ist
   * Der neue User in DB hinzufügen
   */
  registerClicked(): void {
    if (this.user.password != this.passwordV) {
      this.openSnackBar("Passwörter müssen übereinstimmen");
      return;
    }

    this.dataService.getUserByEmail(this.user.email).subscribe(user => {
      if (user) {
        this.openSnackBar("Email ist bereits registriert");
      } else {
        this.openSnackBar("Erfolgreich registriert");
        this.dataService.registerUser(this.user).subscribe(response => {
          console.log(response);
        });
      }
    });
  }

  /**
   * Navigieren zum übergebene URL
   * @param url
   */
  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

}
