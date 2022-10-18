import {Component, OnInit} from '@angular/core';
import {TeamTable} from "../../types/team-table";
import {forkJoin} from "rxjs";
import {DataService} from "../../services/data.service";
import {Stage} from "../../types/stage";
import {GroupDetails} from "../../types/group-details";

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss']
})
export class PredictComponent implements OnInit {
  teamsGroupsData: TeamTable[][] = [[], [], [], [], [], [], [], []];
  groups = ["A", 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  isLoading = true;
  stages: Stage[];
  groupsDetails: GroupDetails[];

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
        console.log("Prediction*** ", this.groupsDetails);
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

}
