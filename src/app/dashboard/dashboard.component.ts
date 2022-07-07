import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { CrudService } from '../shared/crud.service';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  shipments:any = []
  users:any = []
  form!:FormGroup


 
  showPhotos!:string

  constructor(
    public crud: CrudService,
    public auth: AuthService,
    private http:HttpClient
    ) { }


    skip(){
      this.showPhotos = "";
    }
  
   

  ngOnInit(): void {
    this.crud.getShipmentsMethod().subscribe(res => {
      this.shipments = res;
      
      
    })

    this.crud.getUsersMethod().subscribe(res => {
      this.users = res;
      console.log(this.users);
      
    })


    this.form = new FormGroup({
      driver: new FormControl(null),

  });

 


  }


  appointSucsess = false
  appointFailure = false

  appoint(){
    let driver_ = this.form.value.driver.split(",", 3);

    const driver = {
      driver_id: driver_[0],
      current_shipment: driver_[1],
      driver_full_name: driver_[2]
    }
    this.http.post("http://localhost:85/php/appoint.php", driver).subscribe(res => {
    console.log(res);
    if (res){
      this.appointSucsess = true;
      this.ngOnInit();
    }
     },
     error => {console.log('Something goes wrong', error); this.appointFailure = true}
     )

    const index = this.users.map(object => object.full_name).indexOf(this.form.value.driver); // find index of driver string
    this.users.splice(index, 1); // delete from array

    

  }

  }




