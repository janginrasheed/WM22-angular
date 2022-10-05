import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BotDialogComponent} from "../shared/bot-dialog/bot-dialog.component";
import {User} from "../../types/user";
import {ViewportScroller} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {Match} from "../../types/match";
import {Stage} from "../../types/stage";
import {DataService} from "../../services/data.service";
import {News} from "../../types/news";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;
  stages: Stage[];
  matches: Match[];
  stageMatches: Match[] = [];
  private _selectedStageId: number;
  isLoading = true;
  newsList: News;
  newsErrorText: string;
  errorText: string;

  get selectedStageId(): number {
    return this._selectedStageId;
  }

  set selectedStageId(value: number) {
    this.stageMatches = [];
    this.matches.forEach(match => {
      if (match.stageId == value) {
        this.stageMatches.push(match);
      }
    });

    this._selectedStageId = value;
  }

  constructor(private dataService: DataService,
              public dialog: MatDialog,
              private scroll: ViewportScroller,
              public translate: TranslateService) {
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('de');
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    const stages = this.dataService.getStages();
    const matches = this.dataService.getAllMatches();
    // const news = this.dataService.getNews(); // Real News
    const news = this.dataService.getTestNews(); // Old News for Test
    forkJoin([stages, matches, news]).subscribe(result => {
        this.stages = result[0];
        this.matches = result[1];
        this.newsList = result[2];
        this.isLoading = false;
        this.newsErrorText = "";
        this.errorText = "";
        this.trimNewsDescription();
      }, error => {
        this.isLoading = false;
        if (this.newsList == null) {
          this.newsErrorText = "Nachrichten können nicht geladen werden";
        }
        if (this.matches == null) {
          this.errorText = "Daten können nicht geladen werden";
        }
      }
    );

  }

  public trimNewsDescription(): void {
    this.newsList.results?.forEach(newsItem => {
      if (newsItem.description) {
        if (newsItem.description.length > 150) {
          newsItem.description = newsItem.description.substring(0, 150) + "...";
        }
      }
    })
  }

  openDialog() {
    this.dialog.open(BotDialogComponent);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

}
