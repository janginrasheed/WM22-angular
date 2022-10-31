import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {TeamTable} from "../../../types/team-table";

@Component({
  selector: 'app-group-table-predict',
  templateUrl: './group-table-predict.component.html',
  styleUrls: ['./group-table-predict.component.scss']
})
export class GroupTablePredictComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['flag', 'name', 'rank'];
  selectedTeams = new Set<TeamTable>();
  teamRanks: any = [
    {rank: 0, name: ""},
    {rank: 0, name: ""},
    {rank: 0, name: ""},
    {rank: 0, name: ""}
  ];

  @Input()
  group: string;

  @Input()
  teamsGroupData: TeamTable[];

  @Input()
  disableClick = false;

  @Output()
  public sendSelectedTeams: EventEmitter<Set<TeamTable>> = new EventEmitter<Set<TeamTable>>();

  @Output()
  public sendGroupName: EventEmitter<String> = new EventEmitter<String>();

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.teamsGroupData);
    if (this.disableClick) {
      this.teamClicked(this.teamsGroupData[0]);
      this.teamClicked(this.teamsGroupData[1]);
    }
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.teamsGroupData);
  }

  getDataSource(): boolean {
    this.dataSource = new MatTableDataSource(this.teamsGroupData);
    return true;
  }

  teamClicked(row: TeamTable): void {
    let i;
    this.selectedTeams.size == 1 ? i = 1 : i = 0;

    if (this.selectedTeams.size < 2 && !this.selectedTeams.has(row)) {
      this.selectedTeams.add(row);
      this.teamRanks[i].rank = i + 1;
      this.teamRanks[i].name = row.name;
      if (this.selectedTeams.size == 2) {
        if (!this.disableClick) {
          this.sendGroupName.emit(this.group);
          this.sendSelectedTeams.emit(this.selectedTeams);
        }
      }
    }
  }

}
