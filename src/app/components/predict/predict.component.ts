import {Component, OnInit} from '@angular/core';
import {TeamTable} from "../../types/team-table";
import {forkJoin} from "rxjs";
import {DataService} from "../../services/data.service";
import {GroupDetails} from "../../types/group-details";
import {MatchPredict} from "../../types/match-predict";
import {Prediction} from "../../types/prediction";

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss']
})
export class PredictComponent implements OnInit {
  groupsDetails: GroupDetails[];
  groups = ["A", 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  isLoading = true;
  saveDisabled = true;
  alreadyPredicted = false;
  showNewPrediction = true;
  userEmail = "";
  oldPredictions: Prediction[] = [];
  oldGroupsPrediction: TeamTable[][] = [[], [], [], [], [], [], [], []];
  oldRoundOf16Predictions: MatchPredict[] = [];
  oldQuarterFinalsPredictions: MatchPredict[] = [];
  oldSemiFinalsPredictions: MatchPredict[] = [];
  oldThirdPlacePrediction: MatchPredict = {aId: 0, aName: "", bId: 0, bName: "", matchNumber: 63, stage: "Third place"};
  oldFinalPrediction: MatchPredict = {aId: 0, aName: "", bId: 0, bName: "", matchNumber: 64, stage: "Final"};

  teamsGroupsData: TeamTable[][] = [[], [], [], [], [], [], [], []];
  selectedTeamsGroups: TeamTable[][] = [[], [], [], [], [], [], [], []];
  selectedTeamsSingleGroup: TeamTable[] = [];
  groupNameOfSelectedTeams: String;
  selectedWinnerRoundOf16: MatchPredict[] = [];
  selectedWinnerQuarterFinals: MatchPredict[] = [];
  selectedWinnerSemiFinals: MatchPredict[] = [];
  selectedWinnerThirdPlace: MatchPredict = {aId: 0, aName: "", bId: 0, bName: "", matchNumber: 63, stage: ""};
  selectedWinnerFinal: MatchPredict = {aId: 0, aName: "", bId: 0, bName: "", matchNumber: 64, stage: ""};
  roundOf16Matches: MatchPredict[] = [];
  quarterFinalsMatches: MatchPredict[] = [];
  semiFinalsMatches: MatchPredict[] = [];
  thirdPlaceMatch: MatchPredict = {matchNumber: 63, aId: 0, bId: 0, aName: "", bName: "", stage: "Third place"};
  finalMatch: MatchPredict = {matchNumber: 64, aId: 0, bId: 0, aName: "", bName: "", stage: "Final"};
  predictions: Prediction[] = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.userEmail = localStorage.getItem("token");
    this.getData();
  }

  getData() {
    const groupsDetails = this.dataService.getGroupsDetails();
    const oldPredictions = this.dataService.predictionsByEmail(this.userEmail);
    forkJoin([groupsDetails, oldPredictions]).subscribe(result => {
        this.groupsDetails = result[0];
        this.oldPredictions = result[1];
        this.isLoading = false;
        this.initArrays();
        this.checkAlreadyPredicted();
        this.fillTeamsData();
      }, error => this.isLoading = false
    );
  }

  checkAlreadyPredicted() {
    if (this.oldPredictions.length > 0) {
      this.alreadyPredicted = true;
      this.showNewPrediction = false;
      this.oldPredictions.forEach((prediction, i) => {
        if (prediction.matchNumber == 1) {
          this.oldGroupsPrediction[i][0].id = prediction.firstTeamId;
          this.oldGroupsPrediction[i][1].id = prediction.secondTeamId;
        } else if (prediction.matchNumber > 1 && prediction.matchNumber < 57) {
          this.oldRoundOf16Predictions.push({
            aId: prediction.firstTeamId,
            bId: prediction.secondTeamId,
            aName: "",
            bName: "",
            matchNumber: prediction.matchNumber,
            stage: "Round of 16"
          });
        } else if (prediction.matchNumber > 56 && prediction.matchNumber < 61) {
          this.oldQuarterFinalsPredictions.push({
            aId: prediction.firstTeamId,
            bId: prediction.secondTeamId,
            aName: "",
            bName: "",
            matchNumber: prediction.matchNumber,
            stage: "Quarter-Finals"
          });
        } else if (prediction.matchNumber == 61 || prediction.matchNumber == 62) {
          this.oldSemiFinalsPredictions.push({
            aId: prediction.firstTeamId,
            bId: prediction.secondTeamId,
            aName: "",
            bName: "",
            matchNumber: prediction.matchNumber,
            stage: "Semi-Finals"
          });
        } else if (prediction.matchNumber == 63) {
          this.oldThirdPlacePrediction.aId = prediction.firstTeamId;
          this.oldThirdPlacePrediction.bId = prediction.secondTeamId;
        } else if (prediction.matchNumber == 64) {
          this.oldFinalPrediction.aId = prediction.firstTeamId;
          this.oldFinalPrediction.bId = prediction.secondTeamId;
        }
      });
    }
  }

  initArrays() {
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
        if (j < 2) {
          this.oldGroupsPrediction[i][j] = {
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

      this.roundOf16Matches[i] = {
        matchNumber: i + 49,
        aId: 0,
        bId: 0,
        aName: "",
        bName: "",
        stage: "Round of 16"
      }
      this.selectedWinnerRoundOf16[i] = {
        aId: 0,
        aName: "",
        bId: 0,
        bName: "",
        matchNumber: i + 49,
        stage: ""
      }

      if (i < 4) {
        this.quarterFinalsMatches[i] = {
          matchNumber: i + 57,
          aId: 0,
          bId: 0,
          aName: "",
          bName: "",
          stage: "Quarter-Finals"
        }
        this.selectedWinnerQuarterFinals[i] = {
          aId: 0,
          aName: "",
          bId: 0,
          bName: "",
          matchNumber: i + 57,
          stage: ""
        }
      }

      if (i < 2) {
        this.semiFinalsMatches[i] = {
          matchNumber: i + 61,
          aId: 0,
          bId: 0,
          aName: "",
          bName: "",
          stage: "Semi-Finals"
        }
        this.selectedWinnerSemiFinals[i] = {
          aId: 0,
          aName: "",
          bId: 0,
          bName: "",
          matchNumber: i + 61,
          stage: ""
        }

      }
    }
  }

  fillTeamsData(): void {
    this.groupsDetails.forEach((group, i) => {

      //Schleift durch jeden Verein in der Gruppe
      group.groupTeams.forEach((team, j) => {
        this.teamsGroupsData[i][j].id = team.id;
        this.teamsGroupsData[i][j].flag = team.flag;
        this.teamsGroupsData[i][j].name = team.name;
        if (this.alreadyPredicted) {
          this.oldGroupsPrediction.forEach(group => {
            group.forEach(team2 => {
              if (team.id == team2.id) {
                team2.name = team.name;
              } else if (team.id == team2.id) {
                team2.name = team.name;
              }
            });
          });
          this.oldRoundOf16Predictions.forEach(match => {
            if (team.id == match.aId) {
              match.aName = team.name;
            } else if (team.id == match.bId) {
              match.bName = team.name;
            }
          });
          this.oldQuarterFinalsPredictions.forEach(match => {
            if (team.id == match.aId) {
              match.aName = team.name;
            } else if (team.id == match.bId) {
              match.bName = team.name;
            }
          });
          this.oldSemiFinalsPredictions.forEach(match => {
            if (team.id == match.aId) {
              match.aName = team.name;
            } else if (team.id == match.bId) {
              match.bName = team.name;
            }
          });
          if (team.id == this.oldThirdPlacePrediction.aId) {
            this.oldThirdPlacePrediction.aName = team.name;
          } else if (team.id == this.oldThirdPlacePrediction.bId) {
            this.oldThirdPlacePrediction.bName = team.name;
          }
          if (team.id == this.oldFinalPrediction.aId) {
            this.oldFinalPrediction.aName = team.name;
          } else if (team.id == this.oldFinalPrediction.bId) {
            this.oldFinalPrediction.bName = team.name;
          }
        }
      });
    });
    console.log(this.oldGroupsPrediction);
  }

  receiveGroup(group: String) {
    this.groupNameOfSelectedTeams = group;
  }

  receiveSelectedTeamsGroups(teamsTable: Set<TeamTable>) {
    this.selectedTeamsSingleGroup = Array.from(teamsTable);
    switch (this.groupNameOfSelectedTeams) {
      case "A":
        this.selectedTeamsGroups[0] = this.selectedTeamsSingleGroup;
        break;
      case "B":
        this.selectedTeamsGroups[1] = this.selectedTeamsSingleGroup;
        break;
      case "C":
        this.selectedTeamsGroups[2] = this.selectedTeamsSingleGroup;
        break;
      case "D":
        this.selectedTeamsGroups[3] = this.selectedTeamsSingleGroup;
        break;
      case "E":
        this.selectedTeamsGroups[4] = this.selectedTeamsSingleGroup;
        break;
      case "F":
        this.selectedTeamsGroups[5] = this.selectedTeamsSingleGroup;
        break;
      case "G":
        this.selectedTeamsGroups[6] = this.selectedTeamsSingleGroup;
        break;
      case "H":
        this.selectedTeamsGroups[7] = this.selectedTeamsSingleGroup;
        break;
    }

    console.log("Selected Teams in Group ", this.groupNameOfSelectedTeams, ": ", this.selectedTeamsGroups);

    this.fillRoundOf16();
  }

  receiveSelectedWinner(predictedWinner: MatchPredict) {
    if (predictedWinner.matchNumber < 57) {
      switch (predictedWinner.matchNumber) {
        case 49: {
          this.selectedWinnerRoundOf16[0] = predictedWinner;
          break;
        }
        case 50: {
          this.selectedWinnerRoundOf16[1] = predictedWinner;
          break;
        }
        case 51: {
          this.selectedWinnerRoundOf16[2] = predictedWinner;
          break;
        }
        case 52: {
          this.selectedWinnerRoundOf16[3] = predictedWinner;
          break;
        }
        case 53: {
          this.selectedWinnerRoundOf16[4] = predictedWinner;
          break;
        }
        case 54: {
          this.selectedWinnerRoundOf16[5] = predictedWinner;
          break;
        }
        case 55: {
          this.selectedWinnerRoundOf16[6] = predictedWinner;
          break;
        }
        case 56: {
          this.selectedWinnerRoundOf16[7] = predictedWinner;
          break;
        }
      }
      this.fillQuarterFinals();
      console.log("Selected Winner in Round of 16: ", this.selectedWinnerRoundOf16);

    } else if (predictedWinner.matchNumber > 56 && predictedWinner.matchNumber < 61) {
      //Gewinner in Viertelfinale speichern
      switch (predictedWinner.matchNumber) {
        case 57: {
          this.selectedWinnerQuarterFinals[0] = predictedWinner;
          break;
        }
        case 58: {
          this.selectedWinnerQuarterFinals[1] = predictedWinner;
          break;
        }
        case 59: {
          this.selectedWinnerQuarterFinals[2] = predictedWinner;
          break;
        }
        case 60: {
          this.selectedWinnerQuarterFinals[3] = predictedWinner;
          break;
        }

      }
      this.fillSemiFinal();
      console.log("Selected Winner in Quarter-Finals: ", this.selectedWinnerQuarterFinals);

    } else if (predictedWinner.matchNumber == 61 || predictedWinner.matchNumber == 62) {
      //Gewinner in Viertelfinale speichern
      switch (predictedWinner.matchNumber) {
        case 61: {
          this.selectedWinnerSemiFinals[0] = predictedWinner;
          break;
        }
        case 62: {
          this.selectedWinnerSemiFinals[1] = predictedWinner;
          break;
        }
      }
      // Final match
      this.finalMatch.aId = this.selectedWinnerSemiFinals[0].aId;
      this.finalMatch.aName = this.selectedWinnerSemiFinals[0].aName;
      this.finalMatch.bId = this.selectedWinnerSemiFinals[1].aId;
      this.finalMatch.bName = this.selectedWinnerSemiFinals[1].aName;

      // Third place match
      // First Team in the match
      if (this.semiFinalsMatches[0].aId == this.selectedWinnerSemiFinals[0].aId) {
        this.thirdPlaceMatch.aId = this.semiFinalsMatches[0].bId
        this.thirdPlaceMatch.aName = this.semiFinalsMatches[0].bName;
      }
      if (this.semiFinalsMatches[0].bId == this.selectedWinnerSemiFinals[0].aId) {
        this.thirdPlaceMatch.aId = this.semiFinalsMatches[0].aId
        this.thirdPlaceMatch.aName = this.semiFinalsMatches[0].aName;
      }

      // Second team in the match
      if (this.semiFinalsMatches[1].aId == this.selectedWinnerSemiFinals[1].aId) {
        this.thirdPlaceMatch.bId = this.semiFinalsMatches[1].bId
        this.thirdPlaceMatch.bName = this.semiFinalsMatches[1].bName;
      }
      if (this.semiFinalsMatches[1].bId == this.selectedWinnerSemiFinals[1].aId) {
        this.thirdPlaceMatch.bId = this.semiFinalsMatches[1].aId
        this.thirdPlaceMatch.bName = this.semiFinalsMatches[1].aName;
      }
      console.log("Selected Winner in Semi-Finals: ", this.selectedWinnerSemiFinals);
    } else if (predictedWinner.matchNumber == 63) {
      this.selectedWinnerThirdPlace = predictedWinner;
      console.log("Selected Winner in Third place: ", this.selectedWinnerThirdPlace);
    } else if (predictedWinner.matchNumber == 64) {
      this.selectedWinnerFinal = predictedWinner;
      console.log("Selected Winner in Final: ", this.selectedWinnerFinal);
    }

    if (this.selectedWinnerFinal.aId != 0 && this.selectedWinnerThirdPlace.aId != 0) {
      this.saveDisabled = false;
    }
  }

  fillRoundOf16() {
    if (this.selectedTeamsGroups[0].length > 0 && this.selectedTeamsGroups[1].length > 0) {
      this.fillMatches(0, 1, 49, 0);
      this.fillMatches(1, 0, 51, 2);
    }

    if (this.selectedTeamsGroups[2].length > 0 && this.selectedTeamsGroups[3].length > 0) {
      this.fillMatches(2, 3, 50, 1);
      this.fillMatches(3, 2, 52, 3);
    }

    if (this.selectedTeamsGroups[4].length > 0 && this.selectedTeamsGroups[5].length > 0) {
      this.fillMatches(4, 5, 53, 4);
      this.fillMatches(5, 4, 55, 6);
    }

    if (this.selectedTeamsGroups[6].length > 0 && this.selectedTeamsGroups[7].length > 0) {
      this.fillMatches(6, 7, 54, 5);
      this.fillMatches(7, 6, 56, 7);
    }
  }

  fillQuarterFinals() {
    let j = 57; // Erste Spiel-ID in Viertelfinale
    // schleift durch die Spiele von Achtelfinale
    for (let i = 0; i < 7; i += 2) {
      if (this.selectedWinnerRoundOf16.length > 0) {
        if (this.selectedWinnerRoundOf16[i] != null
          && this.selectedWinnerRoundOf16[i + 1] != null) {
          this.fillMatches(i, i + 1, j, j - 57);
          j += 2; // zurück zu Verein 2 und 4
          if (j >= 61) {
            j = 58;
          }
        }
      }
    }
  }

  fillSemiFinal() {
    if (this.selectedWinnerQuarterFinals.length > 1) {
      if (this.selectedWinnerQuarterFinals[0] != null
        && this.selectedWinnerQuarterFinals[1] != null) {
        this.semiFinalsMatches[0].aId = this.selectedWinnerQuarterFinals[0].aId;
        this.semiFinalsMatches[0].aName = this.selectedWinnerQuarterFinals[0].aName;
        this.semiFinalsMatches[0].bId = this.selectedWinnerQuarterFinals[1].aId;
        this.semiFinalsMatches[0].bName = this.selectedWinnerQuarterFinals[1].aName;
      }
      if (this.selectedWinnerQuarterFinals[2] != null
        && this.selectedWinnerQuarterFinals[3] != null) {
        this.semiFinalsMatches[1].aId = this.selectedWinnerQuarterFinals[2].aId;
        this.semiFinalsMatches[1].aName = this.selectedWinnerQuarterFinals[2].aName;
        this.semiFinalsMatches[1].bId = this.selectedWinnerQuarterFinals[3].aId;
        this.semiFinalsMatches[1].bName = this.selectedWinnerQuarterFinals[3].aName;
      }
    }
  }

  fillMatches(valueA: number, valueB: number, matchNumber: number, index: number) {
    if (matchNumber < 57) {
      this.roundOf16Matches[index].aId = this.selectedTeamsGroups[valueA][0].id;
      this.roundOf16Matches[index].aName = this.selectedTeamsGroups[valueA][0].name!;
      this.roundOf16Matches[index].bId = this.selectedTeamsGroups[valueB][1].id;
      this.roundOf16Matches[index].bName = this.selectedTeamsGroups[valueB][1].name!;
      this.roundOf16Matches.sort(function (a, b) {
        let keyA = a.matchNumber, keyB = b.matchNumber;
        if (keyA > keyB) {
          return 1;
        }
        if (keyA < keyB) {
          return -1;
        }
        return 0;
      });
    } else if (matchNumber > 56 && matchNumber <= 60) {
      this.quarterFinalsMatches[index].aId = this.selectedWinnerRoundOf16[valueA].aId;
      this.quarterFinalsMatches[index].aName = this.selectedWinnerRoundOf16[valueA].aName;
      this.quarterFinalsMatches[index].bId = this.selectedWinnerRoundOf16[valueB].aId;
      this.quarterFinalsMatches[index].bName = this.selectedWinnerRoundOf16[valueB].aName;
      this.quarterFinalsMatches.sort(function (a, b) {
        let keyA = a.matchNumber, keyB = b.matchNumber;
        if (keyA > keyB) {
          return 1;
        }
        if (keyA < keyB) {
          return -1;
        }
        return 0;
      });
    }
  }

  savePrediction() {
    this.predictions = [];
    console.log("Save clicked");
    this.selectedTeamsGroups.forEach((teamsInGroup, i) => {
      this.predictions.push({
        id: 0,
        email: this.userEmail,
        firstTeamId: teamsInGroup[0].id,
        matchNumber: 1,
        secondTeamId: teamsInGroup[1].id,
        groupName: this.groups[i]
      });
    });

    this.selectedWinnerRoundOf16.forEach(winner => {
      this.predictions.push({
        id: 0,
        email: this.userEmail,
        firstTeamId: winner.aId,
        matchNumber: winner.matchNumber,
        secondTeamId: winner.bId,
        groupName: ""
      });
    });

    this.selectedWinnerQuarterFinals.forEach(winner => {
      this.predictions.push({
        id: 0,
        email: this.userEmail,
        firstTeamId: winner.aId,
        matchNumber: winner.matchNumber,
        secondTeamId: winner.bId,
        groupName: ""
      });
    });

    this.selectedWinnerSemiFinals.forEach(winner => {
      this.predictions.push({
        id: 0,
        email: this.userEmail,
        firstTeamId: winner.aId,
        matchNumber: winner.matchNumber,
        secondTeamId: winner.bId,
        groupName: ""
      });
    });

    this.predictions.push({
      id: 0,
      email: this.userEmail,
      firstTeamId: this.selectedWinnerThirdPlace.aId,
      matchNumber: this.selectedWinnerThirdPlace.matchNumber,
      secondTeamId: this.selectedWinnerThirdPlace.bId,
      groupName: ""
    });

    this.predictions.push({
      id: 0,
      email: this.userEmail,
      firstTeamId: this.selectedWinnerFinal.aId,
      matchNumber: this.selectedWinnerFinal.matchNumber,
      secondTeamId: this.selectedWinnerFinal.bId,
      groupName: ""
    });

    console.log(this.predictions);

    if (this.alreadyPredicted) {
      this.dataService.deletePredictions(this.userEmail).subscribe();
    }

    this.predictions.forEach(prediction => prediction.predict_date = new Date());
    this.dataService.submitPredictions(this.predictions).subscribe(predicted => window.location.reload());
  }

  setNewPrediction() {
    this.showNewPrediction = true;
  }

  clearSelection() {
    window.location.reload();
  }

}
