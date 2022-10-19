import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatchPredict} from "../../../types/match-predict";

@Component({
  selector: 'app-match-predict',
  templateUrl: './match-predict.component.html',
  styleUrls: ['./match-predict.component.scss']
})
export class MatchPredictComponent implements OnInit {

  @Input()
  match: MatchPredict;

  @Output()
  public selectedWinnerEmitter: EventEmitter<MatchPredict> = new EventEmitter<MatchPredict>();

  constructor() {
  }

  ngOnInit(): void {

  }

}
