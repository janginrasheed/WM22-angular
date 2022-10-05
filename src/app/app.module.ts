import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GroupTableComponent} from './components/shared/group-table/group-table.component';
import {MatchComponent} from './components/shared/match/match.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {NewsComponent} from './components/shared/news/news.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {BotDialogComponent} from './components/shared/bot-dialog/bot-dialog.component';
import {HomeComponent} from "./components/home/home.component";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {LoginComponent} from "./components/login/login.component";
import {MatTabsModule} from "@angular/material/tabs";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { TestsComponent } from './components/tests/tests.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AuthGuard} from "./guards/auth.guard";
import { PredictComponent } from './components/predict/predict.component';
import {MatMenuModule} from "@angular/material/menu";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDividerModule} from "@angular/material/divider";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    GroupTableComponent,
    MatchComponent,
    NewsComponent,
    LoginComponent,
    BotDialogComponent,
    TestsComponent,
    PredictComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTabsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressBarModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
