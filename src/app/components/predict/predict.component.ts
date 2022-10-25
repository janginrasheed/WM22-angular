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
  oldPredictions: Prediction[] = [];
  userEmail = "";

  teamsGroupsData: TeamTable[][] = [[], [], [], [], [], [], [], []];
  selectedTeamsGroups: TeamTable[][] = [[], [], [], [], [], [], [], []];
  selectedTeamsSingleGroup: TeamTable[] = [];
  groupNameOfSelectedTeams: String;
  selectedWinnerRoundOf16: { teamId: number, teamName: string, matchId: number }[] = [];
  selectedWinnerQuarterFinals: { teamId: number, teamName: string, matchId: number }[] = [];
  selectedWinnerSemiFinals: { teamId: number, teamName: string, matchId: number }[] = [];
  selectedWinnerThirdPlace = {teamId: 0, teamName: "", matchId: 63};
  selectedWinnerFinal = {teamId: 0, teamName: "", matchId: 64};
  roundOf16Matches: MatchPredict[] = [];
  quarterFinalsMatches: MatchPredict[] = [];
  semiFinalsMatches: MatchPredict[] = [];
  thirdPlaceMatch: MatchPredict = {id: 63, aId: 0, bId: 0, aName: "", bName: "", stage: "Third place"};
  finalMatch: MatchPredict = {id: 64, aId: 0, bId: 0, aName: "", bName: "", stage: "Final"};
  predictions: Prediction[] = [];
  prediction: Prediction = {id: 0, groupName: "", secondTeamId: 0, firstTeamId: 0, matchNumber: 1, email: ""};

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
        this.checkAlreadyPredicted();
        this.initArrays();
        this.fillTeamsData();
      }
    );
  }

  checkAlreadyPredicted() {
    if (this.oldPredictions.length > 0) {
      this.alreadyPredicted = true;
      this.fillOldPredictions();
    }
  }

  fillOldPredictions() {
    this.oldPredictions.forEach(prediction => {
      console.log(prediction);
    });
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
      }
      this.roundOf16Matches[i] = {
        id: i + 49,
        aId: 0,
        bId: 0,
        aName: "",
        bName: "",
        stage: "Round of 16"
      }
      this.selectedWinnerRoundOf16[i] = {
        teamId: 0,
        teamName: "",
        matchId: i + 49
      }

      if (i < 4) {
        this.quarterFinalsMatches[i] = {
          id: i + 57,
          aId: 0,
          bId: 0,
          aName: "",
          bName: "",
          stage: "Quarter-Finals"
        }
        this.selectedWinnerQuarterFinals[i] = {
          teamId: 0,
          teamName: "",
          matchId: 57 + i
        }
      }

      if (i < 2) {
        this.semiFinalsMatches[i] = {
          id: i + 61,
          aId: 0,
          bId: 0,
          aName: "",
          bName: "",
          stage: "Semi-Finals"
        }
        this.selectedWinnerSemiFinals[i] = {
          teamId: 0,
          teamName: "",
          matchId: 61 + i
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
      });
    });
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

  receiveSelectedWinner({teamId, teamName, matchId}: any) {
    if (matchId < 57) {
      switch (matchId) {
        case 49: {
          this.selectedWinnerRoundOf16[0].teamId = teamId;
          this.selectedWinnerRoundOf16[0].teamName = teamName;
          this.selectedWinnerRoundOf16[0].matchId = matchId;
          break;
        }
        case 50: {
          this.selectedWinnerRoundOf16[1].teamId = teamId;
          this.selectedWinnerRoundOf16[1].teamName = teamName;
          this.selectedWinnerRoundOf16[1].matchId = matchId;
          break;
        }
        case 51: {
          this.selectedWinnerRoundOf16[2].teamId = teamId;
          this.selectedWinnerRoundOf16[2].teamName = teamName;
          this.selectedWinnerRoundOf16[2].matchId = matchId;
          break;
        }
        case 52: {
          this.selectedWinnerRoundOf16[3].teamId = teamId;
          this.selectedWinnerRoundOf16[3].teamName = teamName;
          this.selectedWinnerRoundOf16[3].matchId = matchId;
          break;
        }
        case 53: {
          this.selectedWinnerRoundOf16[4].teamId = teamId;
          this.selectedWinnerRoundOf16[4].teamName = teamName;
          this.selectedWinnerRoundOf16[4].matchId = matchId;
          break;
        }
        case 54: {
          this.selectedWinnerRoundOf16[5].teamId = teamId;
          this.selectedWinnerRoundOf16[5].teamName = teamName;
          this.selectedWinnerRoundOf16[5].matchId = matchId;
          break;
        }
        case 55: {
          this.selectedWinnerRoundOf16[6].teamId = teamId;
          this.selectedWinnerRoundOf16[6].teamName = teamName;
          this.selectedWinnerRoundOf16[6].matchId = matchId;
          break;
        }
        case 56: {
          this.selectedWinnerRoundOf16[7].teamId = teamId;
          this.selectedWinnerRoundOf16[7].teamName = teamName;
          this.selectedWinnerRoundOf16[7].matchId = matchId;
          break;
        }
      }
      this.fillQuarterFinals();
      console.log("Selected Winner in Round of 16: ", this.selectedWinnerRoundOf16);

    } else if (matchId > 56 && matchId < 61) {
      //Gewinner in Viertelfinale speichern
      switch (matchId) {
        case 57: {
          this.selectedWinnerQuarterFinals[0].teamId = teamId;
          this.selectedWinnerQuarterFinals[0].teamName = teamName;
          this.selectedWinnerQuarterFinals[0].matchId = matchId;
          break;
        }
        case 58: {
          this.selectedWinnerQuarterFinals[1].teamId = teamId;
          this.selectedWinnerQuarterFinals[1].teamName = teamName;
          this.selectedWinnerQuarterFinals[1].matchId = matchId;
          break;
        }
        case 59: {
          this.selectedWinnerQuarterFinals[2].teamId = teamId;
          this.selectedWinnerQuarterFinals[2].teamName = teamName;
          this.selectedWinnerQuarterFinals[2].matchId = matchId;
          break;
        }
        case 60: {
          this.selectedWinnerQuarterFinals[3].teamId = teamId;
          this.selectedWinnerQuarterFinals[3].teamName = teamName;
          this.selectedWinnerQuarterFinals[3].matchId = matchId;
          break;
        }

      }
      this.fillSemiFinal();
      console.log("Selected Winner in Quarter-Finals: ", this.selectedWinnerQuarterFinals);

    } else if (matchId == 61 || matchId == 62) {
      //Gewinner in Viertelfinale speichern
      switch (matchId) {
        case 61: {
          this.selectedWinnerSemiFinals[0].teamId = teamId;
          this.selectedWinnerSemiFinals[0].teamName = teamName;
          this.selectedWinnerSemiFinals[0].matchId = matchId;
          break;
        }
        case 62: {
          this.selectedWinnerSemiFinals[1].teamId = teamId;
          this.selectedWinnerSemiFinals[1].teamName = teamName;
          this.selectedWinnerSemiFinals[1].matchId = matchId;
          break;
        }
      }
      // Final match
      this.finalMatch.aId = this.selectedWinnerSemiFinals[0].teamId;
      this.finalMatch.aName = this.selectedWinnerSemiFinals[0].teamName;
      this.finalMatch.bId = this.selectedWinnerSemiFinals[1].teamId;
      this.finalMatch.bName = this.selectedWinnerSemiFinals[1].teamName;

      // Third place match
      // First Team in the match
      if (this.semiFinalsMatches[0].aId == this.selectedWinnerSemiFinals[0].teamId) {
        this.thirdPlaceMatch.aId = this.semiFinalsMatches[0].bId
        this.thirdPlaceMatch.aName = this.semiFinalsMatches[0].bName;
      }
      if (this.semiFinalsMatches[0].bId == this.selectedWinnerSemiFinals[0].teamId) {
        this.thirdPlaceMatch.aId = this.semiFinalsMatches[0].aId
        this.thirdPlaceMatch.aName = this.semiFinalsMatches[0].aName;
      }

      // Second team in the match
      if (this.semiFinalsMatches[1].aId == this.selectedWinnerSemiFinals[1].teamId) {
        this.thirdPlaceMatch.bId = this.semiFinalsMatches[1].bId
        this.thirdPlaceMatch.bName = this.semiFinalsMatches[1].bName;
      }
      if (this.semiFinalsMatches[1].bId == this.selectedWinnerSemiFinals[1].teamId) {
        this.thirdPlaceMatch.bId = this.semiFinalsMatches[1].aId
        this.thirdPlaceMatch.bName = this.semiFinalsMatches[1].aName;
      }
      console.log("Selected Winner in Semi-Finals: ", this.selectedWinnerSemiFinals);
    } else if (matchId == 63) {
      this.selectedWinnerThirdPlace.teamId = teamId;
      this.selectedWinnerThirdPlace.teamName = teamName;
      console.log("Selected Winner in Third place: ", this.selectedWinnerThirdPlace);
    } else if (matchId == 64) {
      this.selectedWinnerFinal.teamId = teamId;
      this.selectedWinnerFinal.teamName = teamName;
      console.log("Selected Winner in Final: ", this.selectedWinnerFinal);
    }

    if (this.selectedWinnerFinal.teamId != 0 && this.selectedWinnerThirdPlace.teamId != 0) {
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
        this.semiFinalsMatches[0].aId = this.selectedWinnerQuarterFinals[0].teamId;
        this.semiFinalsMatches[0].aName = this.selectedWinnerQuarterFinals[0].teamName;
        this.semiFinalsMatches[0].bId = this.selectedWinnerQuarterFinals[1].teamId;
        this.semiFinalsMatches[0].bName = this.selectedWinnerQuarterFinals[1].teamName;
      }
      if (this.selectedWinnerQuarterFinals[2] != null
        && this.selectedWinnerQuarterFinals[3] != null) {
        this.semiFinalsMatches[1].aId = this.selectedWinnerQuarterFinals[2].teamId;
        this.semiFinalsMatches[1].aName = this.selectedWinnerQuarterFinals[2].teamName;
        this.semiFinalsMatches[1].bId = this.selectedWinnerQuarterFinals[3].teamId;
        this.semiFinalsMatches[1].bName = this.selectedWinnerQuarterFinals[3].teamName;
      }
    }
  }

  fillMatches(valueA: number, valueB: number, matchNumber: number, index: number) {
    if (matchNumber < 57) {
      this.roundOf16Matches[index].aId = this.selectedTeamsGroups[valueA][0].id;
      this.roundOf16Matches[index].aName = this.selectedTeamsGroups[valueA][0].name;
      this.roundOf16Matches[index].bId = this.selectedTeamsGroups[valueB][1].id;
      this.roundOf16Matches[index].bName = this.selectedTeamsGroups[valueB][1].name;
      this.roundOf16Matches.sort(function (a, b) {
        let keyA = a.id, keyB = b.id;
        if (keyA > keyB) {
          return 1;
        }
        if (keyA < keyB) {
          return -1;
        }
        return 0;
      });
    } else if (matchNumber > 56 && matchNumber <= 60) {
      this.quarterFinalsMatches[index].aId = this.selectedWinnerRoundOf16[valueA].teamId;
      this.quarterFinalsMatches[index].aName = this.selectedWinnerRoundOf16[valueA].teamName;
      this.quarterFinalsMatches[index].bId = this.selectedWinnerRoundOf16[valueB].teamId;
      this.quarterFinalsMatches[index].bName = this.selectedWinnerRoundOf16[valueB].teamName;
      this.quarterFinalsMatches.sort(function (a, b) {
        let keyA = a.id, keyB = b.id;
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
        firstTeamId: winner.teamId,
        matchNumber: winner.matchId,
        secondTeamId: 0,
        groupName: ""
      });
    });

    this.selectedWinnerQuarterFinals.forEach(winner => {
      this.predictions.push({
        id: 0,
        email: this.userEmail,
        firstTeamId: winner.teamId,
        matchNumber: winner.matchId,
        secondTeamId: 0,
        groupName: ""
      });
    });

    this.selectedWinnerSemiFinals.forEach(winner => {
      this.predictions.push({
        id: 0,
        email: this.userEmail,
        firstTeamId: winner.teamId,
        matchNumber: winner.matchId,
        secondTeamId: 0,
        groupName: ""
      });
    });

    this.predictions.push({
      id: 0,
      email: this.userEmail,
      firstTeamId: this.selectedWinnerThirdPlace.teamId,
      matchNumber: this.selectedWinnerThirdPlace.matchId,
      secondTeamId: 0,
      groupName: ""
    });

    this.predictions.push({
      id: 0,
      email: this.userEmail,
      firstTeamId: this.selectedWinnerFinal.teamId,
      matchNumber: this.selectedWinnerFinal.matchId,
      secondTeamId: 0,
      groupName: ""
    });

    console.log(this.predictions);

    this.dataService.submitPredictions(this.predictions).subscribe();
  }

}
