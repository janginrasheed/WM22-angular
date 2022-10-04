import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../types/user";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;
  user: User = {email: "", firstName: "", lastName: "", password: ""};

  constructor(private router: Router,
              private authService: AuthService,
              public translate: TranslateService) {
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('de');
  }

  ngOnInit(): void {

  }

  public navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  logout() {
    console.log('logout');
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  checkIsLoggedIn(): boolean {
    if (localStorage.getItem('isLoggedIn') == "true") {
      // @ts-ignore
      this.user.firstName = localStorage.getItem('firstName');
      // @ts-ignore
      this.user.lastName = localStorage.getItem('lastName');
      return true;

    } else {
      return false;
    }
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

}
