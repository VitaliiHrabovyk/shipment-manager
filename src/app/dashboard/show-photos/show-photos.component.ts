import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CrudService } from 'src/app/shared/crud.service';

@Component({
  selector: 'app-show-photos',
  templateUrl: './show-photos.component.html',
  styleUrls: ['./show-photos.component.scss']
})



export class ShowPhotosComponent implements OnInit {

  constructor(public crud:CrudService) { }

  @Input() shipment!:string
  photos:any
 
  @Output() skip = new EventEmitter<string>();

  ngOnInit(): void {
    let shipment = {shipment: this.shipment}
    this.crud.getPhotos(shipment)

  }

  skip_(){
    this.skip.emit()
  }





}
