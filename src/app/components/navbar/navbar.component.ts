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
/**
 * Dieses Komponente ist das Navigationsleiste für die Applikation
 */
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;
  user: User = {email: "", firstName: "", lastName: "", password: ""};
  currentPage = "";

  constructor(private router: Router,
              private authService: AuthService,
              public translate: TranslateService) {
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('de');
  }

  ngOnInit(): void {
  }

  /**
   * Prüft ob die gegebene Parameter gleich ist wie die aktuelle Seite
   * @param page
   */
  currentPath(page: string): boolean {
    return window.location.pathname.includes(page);
  }

  /**
   * Navigiert zu der Seite die im Parameter gegeben
   * @param url
   */
  public navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  /**
   * Meldet der User ab und navigiert zur Startseite
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  /**
   * Prüft ob ein User angemeldet ist, und setzt der Username für die Anzeige in Navbar
   */
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

  /**
   * Wechselt die Sprache
   * @param lang: Die Sprache die gesetzt wird
   */
  switchLang(lang: string) {
    this.translate.use(lang);
  }

}
