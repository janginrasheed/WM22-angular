import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatchPredict} from "../../../types/match-predict";
import {Team} from "../../../types/team";
import {coerceNumberProperty} from "@angular/cdk/coercion";

@Component({
  selector: 'app-match-predict',
  templateUrl: './match-predict.component.html',
  styleUrls: ['./match-predict.component.scss']
})
export class MatchPredictComponent implements OnInit {
  selected1 = false;
  selected2 = false;

  @Input()
  match: MatchPredict;

  @Output()
  public selectedWinnerEmitter:
    EventEmitter<{ teamId: number, teamName: string, matchId: number }> =
    new EventEmitter<{ teamId: number, teamName: string, matchId: number }>();

  constructor() {
  }

  ngOnInit(): void {

  }

  teamClicked(teamId: number, teamName: string, aOrB: string): void {
    if (!this.selected1 && !this.selected2) {
      this.selectedWinnerEmitter.emit({teamId: teamId, teamName: teamName, matchId: this.match.id});
    }

    if (!this.selected1 && !this.selected2) {
      if (aOrB == "A") {
        this.selected1 = true;
        this.selected2 = false;
      } else {
        this.selected1 = false;
        this.selected2 = true;
      }
    }

  }

  clearSelection() {
    //this.selectedTeam = // clear
  }

}
