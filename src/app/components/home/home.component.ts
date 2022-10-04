import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BotDialogComponent} from "../shared/bot-dialog/bot-dialog.component";
import {User} from "../../types/user";
import {ViewportScroller} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {Match} from "../../types/match";
import {Stage} from "../../enums/stage";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;
  stagesEnum: Stage;
  stageMatches: Match[];
  selectedStageId: number;


  constructor(public dialog: MatDialog,
              private scroll: ViewportScroller,
              public translate: TranslateService) {
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('de');
  }

  ngOnInit() {
  }

  openDialog() {
    this.dialog.open(BotDialogComponent);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

}
