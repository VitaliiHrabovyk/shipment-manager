import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from '../shared/crud.service';

@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.scss']
})
export class AddShipmentComponent implements OnInit {

  constructor(
    public crud:CrudService,
    public router:Router
    
    ) { }

  form!: FormGroup;
  submitted = false;
  pointsList:any = this.crud.getPointsMethod().subscribe(res => this.pointsList = res)


  submit(){
    
    this.submitted = true;

    const shipment = {
      shipment: this.form.value.shipment, 
      loadPoint: this.form.value.loadPoint,
      upLoadPoint: this.form.value.upLoadPoint,
      loadDate: this.form.value.loadDate,
      loadTime: this.form.value.loadTime,
      uploadDate: this.form.value.uploadDate,
      uploadTime: this.form.value.uploadTime,
      comment: this.form.value.comment,
    }
    
    this.crud.CreateSipment(shipment)
    this.form.reset()
    this.submitted = false;
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
});
  }

  ngOnInit(): void {
    
    this.form = new FormGroup({
      shipment: new FormControl(null, [Validators.required]),
      loadPoint: new FormControl(null, [Validators.required]),
      upLoadPoint: new FormControl(null, [Validators.required]),
      loadDate: new FormControl(null, [Validators.required]),
      loadTime: new FormControl(null, [Validators.required]),
      uploadDate: new FormControl(null, [Validators.required]),
      uploadTime: new FormControl(null, [Validators.required]),
      comment: new FormControl(null),
    })

  }

}
