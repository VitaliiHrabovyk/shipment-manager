import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule }   from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common'; //fix 404 reload page on server



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { CreatePointComponent } from './create-point/create-point.component';
import { LoginComponent } from './login/login.component';
import { PhotoListComponent } from './photo-list/photo-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './create-point/map/map.component';
import { ShowPhotosComponent } from './dashboard/show-photos/show-photos.component';
import { SafeHtmlPipe } from './shared/safe-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AddShipmentComponent,
    CreatePointComponent,
    LoginComponent,
    PhotoListComponent,
    NotFoundComponent,
    MapComponent,
    ShowPhotosComponent,
    SafeHtmlPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}], //fix 404 reload page on server
  bootstrap: [AppComponent]
})
export class AppModule { }
