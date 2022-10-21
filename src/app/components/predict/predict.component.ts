import {Component, OnInit} from '@angular/core';
import {TeamTable} from "../../types/team-table";
import {forkJoin} from "rxjs";
import {DataService} from "../../services/data.service";
import {Stage} from "../../types/stage";
import {GroupDetails} from "../../types/group-details";
import {MatchPredict} from "../../types/match-predict";

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss']
})
export class PredictComponent implements OnInit {
  teamsGroupsData: TeamTable[][] = [[], [], [], [], [], [], [], []];
  selectedTeamsGroups: TeamTable[][] = [[], [], [], [], [], [], [], []];
  selectedTeamsSingleGroup: TeamTable[] = [];
  selectedWinnerRoundOf16: { teamId: number, teamName: string, matchId: number }[] = [{
    teamId: 0,
    teamName: "",
    matchId: 0
  }];
  groupOfSelectedTeams: String;
  groups = ["A", 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  isLoading = true;
  stages: Stage[];
  stage: string;
  groupsDetails: GroupDetails[];
  roundOf16Matches: MatchPredict[] = [];
  quarterFinalsMatches: MatchPredict[] = [];
  semiFinalMatches: MatchPredict[] = [];
  thirdPlaceMatch: MatchPredict[] = [];
  finalMatch: MatchPredict[] = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const stages = this.dataService.getStages();
    const groupsDetails = this.dataService.getGroupsDetails();
    forkJoin([stages, groupsDetails]).subscribe(result => {
        this.stages = result[0];
        this.groupsDetails = result[1];
        this.isLoading = false;
        this.initTeamsGroupsData();
        this.fillTeamsData();
      }
    );
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

  fillTeamsData(): void {

    //Schleift durch jede Gruppe
    this.groupsDetails.forEach((group, i) => {

      //Schleift durch jeden Verein in der Gruppe
      group.groupTeams.forEach((team, j) => {
        this.teamsGroupsData[i][j].id = team.id;
        this.teamsGroupsData[i][j].flag = team.flag;
        this.teamsGroupsData[i][j].name = team.name;
      });
    });
  }

  receiveSelectedTeamsGroups(teamsTable: Set<TeamTable>) {
    this.selectedTeamsSingleGroup = Array.from(teamsTable);
    switch (this.groupOfSelectedTeams) {
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

    // this.selectedTeamsGroups.push(this.selectedTeamsSingleGroup);
    console.log(this.selectedTeamsGroups);

    this.fillRoundOf16();

  }

  receiveSelectedWinner({teamId, teamName, matchId}: any) {
    let matchIsAvailable = false;
    this.selectedWinnerRoundOf16.forEach(match => {
      if (match.matchId == matchId) {
        match.teamId = teamId;
        match.teamName = teamName;
        matchIsAvailable = true;
      }
    });

    if (!matchIsAvailable) {
      if (this.selectedWinnerRoundOf16[0].teamId == 0) {
        this.selectedWinnerRoundOf16[0].teamId = teamId;
        this.selectedWinnerRoundOf16[0].teamName = teamName;
        this.selectedWinnerRoundOf16[0].matchId = matchId;
      } else {
        this.selectedWinnerRoundOf16.push({teamId, teamName, matchId});
      }
      this.fillQuarterFinals();
    }

    console.log(this.selectedWinnerRoundOf16);

  }

  receiveGroup(group: String) {
    this.groupOfSelectedTeams = group;
    console.log(group);
  }

  fillRoundOf16() {
    this.roundOf16Matches = [];
    this.stage = "Round of 16";

    if (this.selectedTeamsGroups[0].length > 0 && this.selectedTeamsGroups[1].length > 0) {
      this.fillMatches(0, 1, 49);
      this.fillMatches(1, 0, 51);
    }

    if (this.selectedTeamsGroups[2].length > 0 && this.selectedTeamsGroups[3].length > 0) {
      this.fillMatches(2, 3, 50);
      this.fillMatches(3, 2, 52);
    }

    if (this.selectedTeamsGroups[4].length > 0 && this.selectedTeamsGroups[5].length > 0) {
      this.fillMatches(4, 5, 53);
      this.fillMatches(5, 4, 55);
    }

    if (this.selectedTeamsGroups[6].length > 0 && this.selectedTeamsGroups[7].length > 0) {
      this.fillMatches(6, 7, 54);
      this.fillMatches(7, 6, 56);
    }

  }

  fillQuarterFinals() {
    this.quarterFinalsMatches = [];
    this.stage = "Quarter-finals"
    let j = 57; // Erste Spiel-ID in Viertelfinale TODO MatchNumber soll nach MatchId von TeamA ausgewählt werden
    // schleift durch die Spiele von Achtelfinale
    for (let i = 0; i < 7; i += 2) {
      if (this.selectedWinnerRoundOf16.length > 1) {
        if (this.selectedWinnerRoundOf16[i] != null
          && this.selectedWinnerRoundOf16[i + 1] != null) {
          this.fillMatches(i, i + 1, j);
          j += 2; // zurück zu Verein 2 und 4
          if (j >= 61) {
            j = 58;
          }
        }
      }
    }

  }

  fillMatches(valueA: number, valueB: number, matchNumber: number) {
    if (matchNumber < 57) {
      this.roundOf16Matches.push({
        aId: this.selectedTeamsGroups[valueA][0].id,
        aName: this.selectedTeamsGroups[valueA][0].name,
        bId: this.selectedTeamsGroups[valueB][1].id,
        bName: this.selectedTeamsGroups[valueB][1].name,
        id: matchNumber,
        stage: this.stage
      });
    } else if (matchNumber > 56 && matchNumber <= 60) {
      this.quarterFinalsMatches.push({
        aId: this.selectedWinnerRoundOf16[valueA].teamId,
        aName: this.selectedWinnerRoundOf16[valueA].teamName,
        bId: this.selectedWinnerRoundOf16[valueB].teamId,
        bName: this.selectedWinnerRoundOf16[valueB].teamName,
        id: matchNumber,
        stage: this.stage
      });
    }
  }

}
