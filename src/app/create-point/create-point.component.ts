import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from '../shared/crud.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-create-point',
  templateUrl: './create-point.component.html',
  styleUrls: ['./create-point.component.scss']
})
export class CreatePointComponent implements OnInit {

  constructor(
    private router:Router,
    public crud:CrudService,
    private http:HttpClient,

  ) { }



  form!: FormGroup;
  submitted = false;
  coordinates!:string
  adress!:string



  pointCoordinates(coordinates:any){
   this.coordinates = coordinates;
  }

  
  submit(){
    
    this.submitted = true;

    const point = {
      PointName: this.form.value.PointName, 
      Adress: this.form.value.Adress, 
      Coordinates: this.form.value.Coordinates, 
    }
    this.crud.CreatePoint(point)
    this.form.reset()
    this.submitted = false;
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
});
  }


  ngOnInit(): void {
    console.log("init parent");
    
    this.form = new FormGroup({
      PointName: new FormControl(null, [Validators.required]),
      Adress: new FormControl(null, [Validators.required]),
      Coordinates: new FormControl(null, [Validators.required, Validators.pattern("-?[0-9]{1,3}[.][0-9]{5,15}[,][ ]-?[0-9]{1,3}[.][0-9]{5,15}")]),
    })



   }



  }

 



