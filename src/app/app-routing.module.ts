import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {TestsComponent} from "./components/tests/tests.component";
import {AuthGuard} from "./guards/auth.guard";
import {PredictComponent} from "./components/predict/predict.component";
import {AdminComponent} from "./components/admin/admin.component";
import {AdminGuard} from "./guards/admin.guard";
import {AboutComponent} from "./components/about/about.component";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'predict',
    component: PredictComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
