import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {NavbarComponent} from './navbar/navbar.component';
import {GroupTableComponent} from './shared/group-table/group-table.component';
import {MatchComponent} from './shared/match/match.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {NewsComponent} from './shared/news/news.component';
import {LoginComponent} from './login/login.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {BotDialogComponent} from './shared/bot-dialog/bot-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    GroupTableComponent,
    MatchComponent,
    NewsComponent,
    LoginComponent,
    BotDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
