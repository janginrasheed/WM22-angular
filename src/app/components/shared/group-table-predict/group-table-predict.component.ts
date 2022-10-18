import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {TeamTable} from "../../../types/team-table";

@Component({
  selector: 'app-group-table-predict',
  templateUrl: './group-table-predict.component.html',
  styleUrls: ['./group-table-predict.component.scss']
})
export class GroupTablePredictComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['flag', 'name', 'played', 'won', 'drawn', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points'];
  displayedColumnsText: string[] = ['', 'Team', 'Sp.', 'S', 'U', 'N', 'T', 'GT', 'TD', 'P'];
  selectedTeams = new Set<TeamTable>();

  @Input()
  group: string;

  @Input()
  teamsGroupData: TeamTable[];

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.teamsGroupData);
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.teamsGroupData);
  }

  getDataSource(): boolean {
    this.dataSource = new MatTableDataSource(this.teamsGroupData);
    return true;
  }
}
