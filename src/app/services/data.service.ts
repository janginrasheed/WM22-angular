import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, first, Observable, retry, throwError} from "rxjs";
import {Team} from "../types/team";
import {Match} from "../types/match";
import {User} from "../types/user";
import {Stage} from "../types/stage";
import {News} from "../types/news";
import {GroupDetails} from "../types/group-details";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // dataApiUrl = 'http://localhost:8081/';
  // dataApiUrl = 'https://wm22.herokuapp.com/';
  dataApiUrl = 'https://wm22.azurewebsites.net/';

  newsApiUrl = 'https://newsdata.io/api/1/news?apikey=pub_107858411e9fea4c6d3e422f5cfd83713a8a7&q=fifa%20world%20cup&language=en';
  newsTest = 'assets/newsApiTest.json';

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
    return this.http.get<User>(this.dataApiUrl + "userByEmail/" + email).pipe(
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

  public getStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(this.dataApiUrl + "stages").pipe(
      first(),
      retry(1),
      catchError(error => {
        console.error("Fehler beim Laden der Runden");
        return throwError(error);
      })
    );
  }

  public getNews(): Observable<News> {
    return this.http.get<News>(this.newsApiUrl).pipe(
      first(),
      retry(1),
      catchError((error) => {
        // this.handleError(error);
        console.error('Fehler beim Laden der aktuellen Nachrichten');
        return throwError(error);
      })
    );
  }

  public getGroupsDetails(): Observable<GroupDetails[]> {
    return this.http.get<GroupDetails[]>(this.dataApiUrl + "teamsGroups").pipe(
      first(),
      retry(1),
      catchError((error) => {
        // this.handleError(error);
        console.error('Fehler beim Laden der Gruppendaten');
        return throwError(error);
      })
    );
  }

  getTestNews(): Observable<any> {
    return this.http.get(this.newsTest);
  }

}
