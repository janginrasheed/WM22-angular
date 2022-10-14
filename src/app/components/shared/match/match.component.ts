import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Match} from "../../../types/match";
import {GroupDetails} from "../../../types/group-details";
import {Stage} from "../../../types/stage";
import {MatchDetails} from "../../../types/match-details";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  @Input()
  match: Match;

  @Input()
  groupsDetails: GroupDetails[];

  @Input()
  stages: Stage[];

  @Input()
  small: boolean;

  @Output()
  public updatedMatchEmitter: EventEmitter<Match> = new EventEmitter<Match>();

  isDisabled = true;
  isAdmin = false;

  matchDetails: MatchDetails = {
    fistTeam: {
      name: "",
      id: 0,
      goals: "",
      penaltyGoals: "",
      flag: ""
    },
    secondTeam: {
      name: "",
      id: 0,
      goals: "",
      penaltyGoals: "",
      flag: ""
    },
    date: new Date(),
    stage: "",
    group: ""
  };

  constructor() {
  }

  ngOnInit(): void {
    // @ts-ignore
    if (localStorage.getItem("roleId") == 1) {
      this.isAdmin = true;
    }

      this.groupsDetails.forEach(value => {
        value.groupTeams.forEach(value1 => {
          if (value1.id == this.match.firstTeamId) {
            this.matchDetails.fistTeam.name = value1.name;
            this.matchDetails.fistTeam.id = value1.id;
            this.matchDetails.fistTeam.flag = value1.flag;

          } else if (value1.id == this.match.secondTeamId) {
            this.matchDetails.secondTeam.name = value1.name;
            this.matchDetails.secondTeam.id = value1.id;
            this.matchDetails.secondTeam.flag = value1.flag;
          }

        });
      });

      this.groupsDetails.forEach(group => {
        group.groupTeams.forEach(club => {
          if (club.name == this.matchDetails.fistTeam.name || club.name == this.matchDetails.secondTeam.name) {
            this.matchDetails.group = club.groupName;
          }
        })
      });

      this.matchDetails.fistTeam.goals = this.match.firstTeamGoals;
      this.matchDetails.secondTeam.goals = this.match.secondTeamGoals;
      this.matchDetails.date = this.match.date;

      this.stages.forEach(stage => {
        if (this.match.stageId == stage.id) {
          this.matchDetails.stage = stage.stage;
        }
      });

  }

  public saveClicked(): void {
    this.match.firstTeamGoals = this.matchDetails.fistTeam.goals;
    this.match.secondTeamGoals = this.matchDetails.secondTeam.goals;
    this.updatedMatchEmitter.emit(this.match);
    this.isDisabled = true;
  }

  public editClicked(): void {
    this.isDisabled = false;
  }

  public deleteResult(): void {
    this.match.firstTeamGoals = "";
    this.match.secondTeamGoals = "";
    this.updatedMatchEmitter.emit(this.match);
  }

}
