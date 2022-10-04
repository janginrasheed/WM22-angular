import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, first, Observable, retry, throwError} from "rxjs";
import {Team} from "../types/team";
import {Match} from "../types/match";
import {User} from "../types/user";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _dataApiUrl = 'http://localhost:8081/';
  // private _dataApiUrl = 'https://wm22.azurewebsites.net/';

  // private _newsApiUrl = 'https://newsdata.io/api/1/news?apikey=pub_107858411e9fea4c6d3e422f5cfd83713a8a7&q=champions%20league&language=' + this.newLanguage + '&category=sports';

  get dataApiUrl(): string {
    return this._dataApiUrl;
  }

  set dataApiUrl(value: string) {
    this._dataApiUrl = value;
  }

  constructor(private http: HttpClient) {
  }

  public getAllTeams(): Observable<[]> {
    return this.http.get<Team[]>(this.dataApiUrl + "teams").pipe(
      first(),
      // @ts-ignore
      retry(1),
      catchError(error => {
        // this.handleError(error);
        console.error("Fehler beim Laden der Mannschaften");
        return throwError(error);
      })
    );
  }

  public getAllMatches(): Observable<[]> {
    return this.http.get<Match[]>(this.dataApiUrl + "matches").pipe(
      first(),
      // @ts-ignore
      retry(1),
      catchError(error => {
        // this.handleError(error);
        console.error("Fehler beim Laden der Spiele");
        return throwError(error);
      })
    );
  }

  public getUserByEmail(email: String): Observable<User> {
    return this.http.get<User>(this.dataApiUrl + "userbyemail/" + email).pipe(
      first(),
      // @ts-ignore
      retry(1),
      catchError(error => {
        // this.handleError(error);
        console.error("Fehler beim Laden des Users");
        return throwError(error);
      })
    );
  }

  public registerUser(user: User) {
    return this.http.post<User>(this.dataApiUrl + "register", user).pipe(
      first(),
      retry(1),
      catchError(error => {
        console.error("Fehler beim Registrieren");
        return throwError(error);
      })
    );
  }

  public getUser(user: User): Observable<User> {
    return this.http.get<User>(this.dataApiUrl + "user/" + user.email + "/" + user.password).pipe(
      first(),
      // @ts-ignore
      retry(1),
      catchError(error => {
        // this.handleError(error);
        console.error("Fehler beim Laden des Users");
        return throwError(error);
      })
    );
  }

}
