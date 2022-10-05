import {Component, Input, OnInit} from '@angular/core';
import {ResultsEntity} from "../../../types/news";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  @Input()
  public newsItem: ResultsEntity;

  constructor() { }

  ngOnInit(): void {
  }

}
