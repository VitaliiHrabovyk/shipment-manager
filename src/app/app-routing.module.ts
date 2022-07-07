import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { CreatePointComponent } from './create-point/create-point.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  {path: "",  component: DashboardComponent, pathMatch:'full', canActivate:[AuthGuard]},
  {path: "add-shipment",  component: AddShipmentComponent, canActivate:[AuthGuard]},
  {path: "create-point",  component: CreatePointComponent, canActivate:[AuthGuard]},
  {path: "login",  component: LoginComponent},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
