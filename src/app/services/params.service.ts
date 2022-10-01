import { Injectable } from '@angular/core';
import {User} from "../types/user";

@Injectable({
  providedIn: 'root'
})
export class ParamsService {
  private _user: User;

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  constructor() { }
}
