import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatchPredict} from "../../../types/match-predict";

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
    EventEmitter<MatchPredict> = new EventEmitter<MatchPredict>();

  constructor() {
  }

  ngOnInit(): void {

  }

  teamClicked(winner: string): void {
    if (this.match.aId != 0 && this.match.bId != 0) {
      if (!this.selected1 && !this.selected2) {
        if (winner == "A") {
          this.selectedWinnerEmitter.emit(this.match);
          this.selected1 = true;
          this.selected2 = false;
        } else if (winner == "B") {
          this.selectedWinnerEmitter.emit({
            aId: this.match.bId,
            aName: this.match.bName,
            bId: this.match.aId,
            bName: this.match.aName,
            matchNumber: this.match.matchNumber,
            stage: this.match.stage
          });
          this.selected1 = false;
          this.selected2 = true;
        }
      }
    }
  }

}
