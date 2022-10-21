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

  teamClicked(teamId: number, teamName: string): void {
    this.selectedWinnerEmitter.emit({teamId: teamId, teamName: teamName,matchId: this.match.id});
  }

  clearSelection() {
    //this.selectedTeam = // clear
  }


}
