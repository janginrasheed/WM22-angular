import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    /*
    if (this.isLoggedIn() && this.isAdmin()) {
      this.router.navigate(['/admin']);
    } else
    */
    if (this.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') == "true";
  }

  public isAdmin(): boolean {
    console.log(localStorage.getItem('roleId'));
    // @ts-ignore
    return localStorage.getItem('roleId') < 2;
  }

}
