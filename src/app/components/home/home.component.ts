import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BotDialogComponent} from "../shared/bot-dialog/bot-dialog.component";
import {ParamsService} from "../../services/params.service";
import {User} from "../../types/user";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(public dialog: MatDialog,
              private paramsService: ParamsService) {
  }

  ngOnInit(): void {
    if (this.paramsService.user != null) {
      this.user = this.paramsService.user;
    }
  }

  openDialog() {
    this.dialog.open(BotDialogComponent);
  }

}
