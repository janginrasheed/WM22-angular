import {Component, Input, OnInit} from '@angular/core';
import {TeamTable} from "../../../types/team-table";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss']
})
/**
 * Dieses Komponent dient nur zum Anzeigen von Daten die es von Parent Komponente bekommt
 */
export class GroupTableComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['flag', 'name', 'played', 'won', 'drawn', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points'];
  displayedColumnsText: string[] = ['', 'team', 'played', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDiff', 'points'];

  @Input()
  group: string;

  @Input()
  teamsGroupData: TeamTable[];

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.teamsGroupData);
  }

  /**
   * Die Daten neu in der Tabelle speichern damit die geänderten Input-Werte aktualiseirt werden
   */
  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.teamsGroupData);
  }

  /**
   * Die Daten neu in der Tabelle speichern damit die geänderten Input-Werte aktualiseirt werden
   */
  getDataSource(): boolean {
    this.dataSource = new MatTableDataSource(this.teamsGroupData);
    return true;
  }
}
