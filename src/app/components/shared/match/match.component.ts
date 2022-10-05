import {Component, Input, OnInit} from '@angular/core';
import {Match} from "../../../types/match";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  @Input()
  match: Match;

  constructor() { }

  ngOnInit(): void {
  }

}
