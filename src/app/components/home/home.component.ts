import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BotDialogComponent} from "../shared/bot-dialog/bot-dialog.component";
import {User} from "../../types/user";
import {Time, ViewportScroller} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {Match} from "../../types/match";
import {Stage} from "../../types/stage";
import {DataService} from "../../services/data.service";
import {News} from "../../types/news";
import {forkJoin} from "rxjs";
import {TeamTable} from "../../types/team-table";
import {GroupDetails} from "../../types/group-details";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  matchToUpdate: Match = {
    id: 0,
    firstTeamId: 0,
    firstTeamGoals: '',
    firstTeamPenaltiesGoals: '',
    secondTeamId: 0,
    secondTeamGoals: '',
    secondTeamPenaltiesGoals: '',
    stageId: 0,
    date: new Date()
  };

  matches: Match[];
  selectedStageMatches: Match[] = [];
  groupsMatches: Match[] = [];
  roundOf16Matches: Match[] = [];
  quarterFinalsMatches: Match[] = [];
  semiFinalsMatches: Match[] = [];
  thirdPlaceMatch: Match;
  finalMatch: Match;
  user: User;
  stages: Stage[];
  newsList: News;
  teamsGroupsData: TeamTable[][] = [[], [], [], [], [], [], [], []];
  groupsDetails: GroupDetails[];
  newsErrorText: string;
  errorText: string;
  isLoading = true;
  groups = ["A", 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  private _selectedStageId: number;
  dummyTeamData: TeamTable;
  breakEqualPoints: any = {
    ATeamId: 0,
    ATeamPoints: 0,
    ATeamGoals: 0,
    BTeamId: 0,
    BTeamPoints: 0,
    BTeamGoals: 0
  };

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

    this.selectedStageMatches.sort((a, b) => this.sortByDate(a.date) - this.sortByDate(b.date));
    this._selectedStageId = value;
  }

  constructor(private dataService: DataService,
              public dialog: MatDialog,
              private scroll: ViewportScroller,
              private router: Router,
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
        this.fillRoundOf16();
        this.fillQuarterFinals();
        this.fillSemiFinals();
        this.fillThirdPlace();
        this.fillFinal();
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
                  //Rechnet die Daten nur, wenn Spielergebnisse eingetragen sind und das Spiel in Gruppenphase ist.
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
    this.sortTable();
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

  updateMatchResult(updatedMatch: Match): void {
    this.dataService.updateMatchResult(updatedMatch).subscribe();
    this.router.navigate(['/home']);
    // window.location.reload();
  }

  sortTable(): void {
    this.breakEqualPoints.AClubId = 0;

    this.teamsGroupsData.forEach(teamsData => {
      //Nach Punkte sortieren
      teamsData.sort(function (a, b) {
        let keyA = a.points, keyB = b.points;
        if (keyA > keyB) {
          return -1;
        }
        if (keyA < keyB) {
          return 1;
        }
        return 0;
      });

      for (let i = 0; i < teamsData.length - 1; i++) {
        if (teamsData[i].points == teamsData[i + 1].points) {
          this.breakEqualPoints.AClubId = teamsData[i].id;
          this.breakEqualPoints.BTeamId = teamsData[i + 1].id;
          this.breakEqualPoints.AClubPoints = 0;
          this.breakEqualPoints.AClubGoals = 0;
          this.breakEqualPoints.BTeamPoints = 0;
          this.breakEqualPoints.BTeamGoals = 0;
          this.matches.forEach(match => {
            if (match.stageId < 7) {
              if (match.firstTeamId == this.breakEqualPoints.AClubId
                && match.secondTeamId == this.breakEqualPoints.BTeamId) {
                this.breakEqualPoints.AClubGoals += +match.firstTeamGoals;
                this.breakEqualPoints.BTeamGoals += +match.secondTeamGoals;
                if (match.firstTeamGoals > match.secondTeamGoals) {
                  this.breakEqualPoints.AClubPoints += 3;
                } else if (match.firstTeamGoals < match.secondTeamGoals) {
                  this.breakEqualPoints.BTeamPoints += 3;
                }
              } else if (match.secondTeamId == this.breakEqualPoints.AClubId
                && match.firstTeamId == this.breakEqualPoints.BTeamId) {
                this.breakEqualPoints.AClubGoals += +match.secondTeamGoals;
                this.breakEqualPoints.BTeamGoals += +match.firstTeamGoals;
                if (match.firstTeamGoals > match.secondTeamGoals) {
                  this.breakEqualPoints.BTeamPoints += 3;
                } else if (match.firstTeamGoals < match.secondTeamGoals) {
                  this.breakEqualPoints.AClubPoints += 3;
                }
              }
            }
          });

          if (this.breakEqualPoints.AClubGoals == this.breakEqualPoints.BTeamGoals) {
            //Nach Tordifferenz in der Gruppe sortieren
            if (teamsData[i].goalDifference < teamsData[i + 1].goalDifference) {
              this.dummyTeamData = teamsData[i];
              teamsData[i] = teamsData[i + 1];
              teamsData[i + 1] = this.dummyTeamData;
            } else if (teamsData[i].goalDifference == teamsData[i + 1].goalDifference) {
              //Nach Tore sortieren
              if (teamsData[i].goalsFor < teamsData[i + 1].goalsFor) {
                this.dummyTeamData = teamsData[i];
                teamsData[i] = teamsData[i + 1];
                teamsData[i + 1] = this.dummyTeamData;
              }
            }
          }
        }
      }
    });
  }

  fillRoundOf16(): void {
    // Prüfen, ob alle Spiele in der Gruppenphase gespielt wurden.
    // und ob Achtelfinale-Spiele schon vorher eingetragen sind
    if ((this.matches[44].firstTeamGoals == null
        || this.matches[45].firstTeamGoals == null
        || this.matches[46].firstTeamGoals == null
        || this.matches[47].firstTeamGoals == null)
      || (this.matches[55].firstTeamId != 0
        && this.matches[55].firstTeamId != 0)) {
      return;
    }

    this.matchToUpdate = this.matches[48];
    this.matchToUpdate.firstTeamId = this.teamsGroupsData[0][0].id;
    this.matchToUpdate.secondTeamId = this.teamsGroupsData[1][1].id;
    this.dataService.updateMatchTeams(this.matchToUpdate).subscribe();

    this.matchToUpdate = this.matches[49];
    this.matchToUpdate.firstTeamId = this.teamsGroupsData[2][0].id;
    this.matchToUpdate.secondTeamId = this.teamsGroupsData[3][1].id;
    this.dataService.updateMatchTeams(this.matchToUpdate).subscribe();

    this.matchToUpdate = this.matches[50];
    this.matchToUpdate.firstTeamId = this.teamsGroupsData[1][0].id;
    this.matchToUpdate.secondTeamId = this.teamsGroupsData[0][1].id;
    this.dataService.updateMatchTeams(this.matchToUpdate).subscribe();

    this.matchToUpdate = this.matches[51];
    this.matchToUpdate.firstTeamId = this.teamsGroupsData[3][0].id;
    this.matchToUpdate.secondTeamId = this.teamsGroupsData[2][1].id;
    this.dataService.updateMatchTeams(this.matchToUpdate).subscribe();

    this.matchToUpdate = this.matches[52];
    this.matchToUpdate.firstTeamId = this.teamsGroupsData[4][0].id;
    this.matchToUpdate.secondTeamId = this.teamsGroupsData[5][1].id;
    this.dataService.updateMatchTeams(this.matchToUpdate).subscribe();

    this.matchToUpdate = this.matches[53];
    this.matchToUpdate.firstTeamId = this.teamsGroupsData[6][0].id;
    this.matchToUpdate.secondTeamId = this.teamsGroupsData[7][1].id;
    this.dataService.updateMatchTeams(this.matchToUpdate).subscribe();

    this.matchToUpdate = this.matches[54];
    this.matchToUpdate.firstTeamId = this.teamsGroupsData[5][0].id;
    this.matchToUpdate.secondTeamId = this.teamsGroupsData[4][1].id;
    this.dataService.updateMatchTeams(this.matchToUpdate).subscribe();

    this.matchToUpdate = this.matches[55];
    this.matchToUpdate.firstTeamId = this.teamsGroupsData[7][0].id;
    this.matchToUpdate.secondTeamId = this.teamsGroupsData[6][1].id;
    this.dataService.updateMatchTeams(this.matchToUpdate).subscribe();

  }

  fillQuarterFinals() {
    // Prüfen, ob Achtelfinale gespielt wurde
    if (this.matches[48].firstTeamGoals == null
      && this.matches[49].firstTeamGoals == null
    ) {
      return;
    }

    let j = 56; // Erstes Spiel-ID in Viertelfinale
    // Schleift durch die Spiele von Achtelfinale
    for (let i = 48; i <= 55; i++) {
      this.matchToUpdate = this.matches[j];
      //Prüfe, ob dieses Spiel schon eingetragen ist.
      if ((this.matchToUpdate.firstTeamId == 0 || this.matchToUpdate.secondTeamId == 0)) {
        this.fillMatches(i);
      }
      i++; // weil Verein "1" spiele gegen Verein "3" daher muss um 2 erhöht werden.
      j += 2; // zurück zu Verein 2 und 4
      if (j >= 60) {
        j = 57;
      }
    }
  }

  fillSemiFinals() {
    // Prüfen, ob Viertelfinale gespielt wurde
    if (this.matches[56].firstTeamGoals == null
      && this.matches[57].firstTeamGoals == null) {
      return;
    }

    let j = 60;
    for (let i = 56; i <= 59; i++) {
      this.matchToUpdate = this.matches[j];
      if (this.matchToUpdate.firstTeamId == 0 || this.matchToUpdate.secondTeamId == 0) {
        this.fillMatches(i);
      }
      i++;
      j++;
    }
  }

  fillThirdPlace() {
    // Prüfe, ob Halbfinale-Spiele gespielt wurden
    if ((this.matches[60].firstTeamGoals == null
      && this.matches[60].secondTeamGoals == null)) {
      return;
    }

    if (this.matches[63].firstTeamId == 0 || this.matches[63].secondTeamId == 0) {
      this.matchToUpdate = this.matches[62];
      this.matchToUpdate.firstTeamId = this.matches[60].secondTeamId;
      this.matchToUpdate.secondTeamId = this.matches[61].secondTeamId;
      this.dataService.updateMatchTeams(this.matchToUpdate).subscribe();
    }
  }

  fillFinal() {
    // Prüfe, ob Halbfinale-Spiele gespielt wurden
    if ((this.matches[60].firstTeamGoals == null
      && this.matches[60].secondTeamGoals == null)) {
      return;
    }

    if (this.matches[63].firstTeamId == 0 || this.matches[63].secondTeamId == 0) {
      this.matchToUpdate = this.matches[63];
      this.fillMatches(60);
    }
  }

  fillMatches(i: number) {
    if (this.matches[i].firstTeamGoals > this.matches[i].secondTeamGoals) {
      this.matchToUpdate.firstTeamId = this.matches[i].firstTeamId;
    } else if (this.matches[i].firstTeamGoals < this.matches[i].secondTeamGoals) {
      this.matchToUpdate.firstTeamId = this.matches[i].secondTeamId;
    } else {
      if (this.matches[i].firstTeamPenaltiesGoals > this.matches[i].secondTeamPenaltiesGoals) {
        this.matchToUpdate.firstTeamId = this.matches[i].firstTeamId;
      } else if (this.matches[i].firstTeamPenaltiesGoals < this.matches[i].secondTeamPenaltiesGoals) {
        this.matchToUpdate.firstTeamId = this.matches[i].secondTeamId;
      }
    }

    if (this.matches[i + 1].firstTeamGoals > this.matches[i + 1].secondTeamGoals) {
      this.matchToUpdate.secondTeamId = this.matches[i + 1].firstTeamId;
    } else if (this.matches[i + 1].firstTeamGoals < this.matches[i + 1].secondTeamGoals) {
      this.matchToUpdate.secondTeamId = this.matches[i + 1].secondTeamId;
    } else {
      if (this.matches[i + 1].firstTeamPenaltiesGoals > this.matches[i + 1].secondTeamPenaltiesGoals) {
        this.matchToUpdate.secondTeamId = this.matches[i + 1].firstTeamId;
      } else if (this.matches[i + 1].firstTeamPenaltiesGoals < this.matches[i + 1].secondTeamPenaltiesGoals) {
        this.matchToUpdate.secondTeamId = this.matches[i + 1].secondTeamId;
      }
    }

    if (this.matchToUpdate.firstTeamId != null || this.matchToUpdate.secondTeamId != null) {
      this.dataService.updateMatchTeams(this.matchToUpdate).subscribe();
    }
  }

  sortByDate(dateToConvert: Date): number {
    return new Date(dateToConvert).getTime();
  }

}
