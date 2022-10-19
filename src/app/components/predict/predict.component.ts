import {Component, OnInit} from '@angular/core';
import {TeamTable} from "../../types/team-table";
import {forkJoin} from "rxjs";
import {DataService} from "../../services/data.service";
import {Stage} from "../../types/stage";
import {GroupDetails} from "../../types/group-details";
import {Match} from "../../types/match";
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
  groupOfSelectedTeams: String;
  groups = ["A", 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  isLoading = true;
  stages: Stage[];
  groupsDetails: GroupDetails[];
  /*
  roundOf16Matches: any[] = [
    {firstTeamId: 0, secondTeamId: 0},
    {firstTeamId: 0, secondTeamId: 0},
    {firstTeamId: 0, secondTeamId: 0},
    {firstTeamId: 0, secondTeamId: 0},
    {firstTeamId: 0, secondTeamId: 0},
    {firstTeamId: 0, secondTeamId: 0},
    {firstTeamId: 0, secondTeamId: 0},
    {firstTeamId: 0, secondTeamId: 0},
  ];
  */
  tempMatch: MatchPredict = {
    id: 0,
    aId: 0,
    aName: "",
    bId: 0,
    bName: "",
    stage: ""
  };

  roundOf16Matches: MatchPredict[] = [];
  // roundOf16Matches = new Set<MatchPredict>();

  quarterFinalsMatches: Match[] = [];
  semiFinalsMatches: Match[] = [];
  thirdPlaceMatch: Match;
  finalMatch: Match;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    /*
        this.tempMatch.id = 49;
        this.roundOf16Matches.push(this.tempMatch);

        this.tempMatch.id = 50;
        this.roundOf16Matches.push(this.tempMatch);

        this.tempMatch.id = 51;
        this.roundOf16Matches.push(this.tempMatch);

        this.tempMatch.id = 52;
        this.roundOf16Matches.push(this.tempMatch);

        this.tempMatch.id = 53;
        this.roundOf16Matches.push(this.tempMatch);

        this.tempMatch.id = 54;
        this.roundOf16Matches.push(this.tempMatch);

        this.tempMatch.id = 55;
        this.roundOf16Matches.push(this.tempMatch);

        this.tempMatch.id = 56;
        this.roundOf16Matches.push(this.tempMatch);
    */
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

  receiveGroup(group: String) {
    this.groupOfSelectedTeams = group;
    console.log(group);
  }

  fillRoundOf16() {
    this.roundOf16Matches = [];
    this.tempMatch.stage = "Round of 16";

    if (this.selectedTeamsGroups[0].length > 0 && this.selectedTeamsGroups[1].length > 0) {
      this.roundOf16Matches.push({
        aId: this.selectedTeamsGroups[0][0].id,
        aName: this.selectedTeamsGroups[0][0].name,
        bId: this.selectedTeamsGroups[1][1].id,
        bName: this.selectedTeamsGroups[1][1].name,
        id: 49,
        stage: this.tempMatch.stage
      });

      this.roundOf16Matches.push({
        aId: this.selectedTeamsGroups[1][0].id,
        aName: this.selectedTeamsGroups[1][0].name,
        bId: this.selectedTeamsGroups[0][1].id,
        bName: this.selectedTeamsGroups[0][1].name,
        id: 51,
        stage: this.tempMatch.stage
      });

    }
  }
}
