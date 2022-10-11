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
import {TeamTable} from "../../types/team-table";
import {GroupDetails} from "../../types/group-details";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  newsErrorText: string;
  errorText: string;
  isLoading = true;
  groups = ["A", 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  private _selectedStageId: number;
  user: User;
  stages: Stage[];

  matches: Match[];
  selectedStageMatches: Match[] = [];
  groupsMatches: Match[] = [];
  roundOf16Matches: Match[] = [];
  quarterFinalsMatches: Match[] = [];
  semiFinalsMatches: Match[] = [];
  thirdPlaceMatch: Match;
  finalMatch: Match;

  newsList: News;
  teamsGroupsData: TeamTable[][] = [[], [], [], [], [], [], [], []];
  groupsDetails: GroupDetails[];

  get selectedStageId(): number {
    return this._selectedStageId;
  }

  set selectedStageId(value: number) {
    this.selectedStageMatches = [];

    switch (value) {
      case 1: {
        this.selectedStageMatches = this.groupsMatches;
        break;
      }
      case 2: {
        this.selectedStageMatches = this.roundOf16Matches;
        break;
      }
      case 3: {
        this.selectedStageMatches = this.quarterFinalsMatches;
        break;
      }
      case 4: {
        this.selectedStageMatches = this.semiFinalsMatches;
        break;
      }
      case 5: {
        this.selectedStageMatches.push(this.thirdPlaceMatch);
        break;
      }
      case 6: {
        this.selectedStageMatches.push(this.finalMatch);
        break;
      }
    }

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
    this.initTeamsGroupsData();
  }

  getData() {
    const stages = this.dataService.getStages();
    const matches = this.dataService.getAllMatches();
    const groupsDetails = this.dataService.getGroupsDetails();
    // const news = this.dataService.getNews(); // Real News
    const news = this.dataService.getTestNews(); // Old News for Test
    forkJoin([stages, matches, groupsDetails, news]).subscribe(result => {
        this.stages = result[0];
        this.matches = result[1];
        this.groupsDetails = result[2];
        this.newsList = result[3];
        this.isLoading = false;
        this.newsErrorText = "";
        this.errorText = "";
        this.trimNewsDescription();
        this.initTeamsGroupsData();
        this.fillClubsData();
        this.fillStagesMatches();
        this.selectedStageId = 1;
        console.log(this.groupsDetails);
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

  trimNewsDescription(): void {
    this.newsList.results?.forEach(newsItem => {
      if (newsItem.description) {
        if (newsItem.description.length > 100) {
          newsItem.description = newsItem.description.substring(0, 100) + "...";
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

  initTeamsGroupsData() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 4; j++) {
        this.teamsGroupsData[i][j] = {
          id: 0,
          flag: '',
          name: '',
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        };
      }
    }
  }

  fillClubsData(): void {
    if (!this.isLoading) {

      //Schleift durch jede Gruppe
      this.groupsDetails.forEach((group, i) => {

        //Schleift durch jeden Verein in der Gruppe
        group.groupTeams.forEach((team, j) => {
          this.teamsGroupsData[i][j].id = team.id;
          this.teamsGroupsData[i][j].flag = team.flag;
          this.teamsGroupsData[i][j].name = team.name;
        });
        if (this.matches) {
          this.teamsGroupsData[i].forEach(team => {
              team.played = 0;
              team.won = 0;
              team.drawn = 0;
              team.lost = 0;
              team.goalsFor = 0;
              team.goalsAgainst = 0;
              team.goalDifference = 0;
              team.points = 0;
              this.matches.forEach(match => {
                if (match.firstTeamGoals != ''
                  && match.firstTeamGoals != null
                  && match.secondTeamGoals != ''
                  && match.secondTeamGoals != null
                  && match.stageId == 1
                ) {
                  //Rechnet die Daten nur wenn Spielergebnisse eingetragen sind und das Spiel in Gruppenphase ist.
                  if (team.id == match.firstTeamId) {
                    team.played += 1;
                    team.goalsFor += +match.firstTeamGoals;
                    team.goalsAgainst += +match.secondTeamGoals;
                    if (match.firstTeamGoals > match.secondTeamGoals) {
                      team.won += 1;
                      team.points += 3;
                    } else if (match.firstTeamGoals == match.secondTeamGoals) {
                      team.drawn += 1;
                      team.points += 1;
                    } else if (match.firstTeamGoals < match.secondTeamGoals) {
                      team.lost += 1;
                    }
                  } else if (team.id == match.secondTeamId) {
                    team.played += 1;
                    team.goalsFor += +match.secondTeamGoals;
                    team.goalsAgainst += +match.firstTeamGoals;
                    if (match.secondTeamGoals > match.firstTeamGoals) {
                      team.won += 1;
                      team.points += 3;
                    } else if (match.secondTeamGoals == match.firstTeamGoals) {
                      team.drawn += 1;
                      team.points += 1;
                    } else if (match.secondTeamGoals < match.firstTeamGoals) {
                      team.lost += 1;
                    }
                  }
                  let index = this.teamsGroupsData[i].indexOf(team);
                  this.teamsGroupsData[i][index].played = team.played;
                  this.teamsGroupsData[i][index].won = team.won;
                  this.teamsGroupsData[i][index].drawn = team.drawn;
                  this.teamsGroupsData[i][index].lost = team.lost;
                  this.teamsGroupsData[i][index].goalsFor = team.goalsFor;
                  this.teamsGroupsData[i][index].goalsAgainst = team.goalsAgainst;
                  this.teamsGroupsData[i][index].goalDifference = team.goalsFor - team.goalsAgainst;
                  this.teamsGroupsData[i][index].points = team.points;
                }
              });
            }
          );
        }
      });
    }
    // this.sortTable();
  }

  fillStagesMatches(): void {
    this.matches.forEach(match => {
      switch (match.stageId) {
        case 1: {
          this.groupsMatches.push(match);
          break;
        }
        case 2: {
          this.roundOf16Matches.push(match);
          break;
        }
        case 3: {
          this.quarterFinalsMatches.push(match);
          break;
        }
        case 4: {
          this.semiFinalsMatches.push(match);
          break;
        }
        case 5: {
          this.thirdPlaceMatch = match;
          break;
        }
        case 6: {
          this.finalMatch = match;
          break;
        }
      }
    });
  }

  public updateMatchScore(updatedMatch: Match): void {
    this.dataService.updateMatchByMatchId(updatedMatch).subscribe();
  }

}
