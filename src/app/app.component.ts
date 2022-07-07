import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { CrudService } from './shared/crud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public auth:AuthService){

  }
 
  isActiveNavBarBurger = false;

  BarBurgerToggle(){
    this.isActiveNavBarBurger = !this.isActiveNavBarBurger;
  }



}
