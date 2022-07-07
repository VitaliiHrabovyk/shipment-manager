import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http:HttpClient) { }


  getUsersMethod(){
    // return this.http.get('assets/test.json');
    return this.http.get('http://localhost:85/php/users-json.php');
    
  }
  getShipmentsMethod(){
    // return this.http.get('assets/test.json');
    return this.http.get('http://localhost:85/php/Shipments-json.php');
    
  }
  getFilesMethod(){
    // return this.http.get('assets/test.json');
    return this.http.get('http://localhost:85/php/files-json.php');
    
  }

  getPointsMethod(){
    // return this.http.get('assets/test.json');
    return this.http.get('http://localhost:85/php/points-json.php');
    
  }
  createPointSuccess = false;
  createPointFailure = false;
  CreatePoint(point:any) {
    return this.http.post("http://localhost:85/php/createpoint.php", point).subscribe(res => {
    if (res){
      this.createPointSuccess = true;
    }
     },
     error => {console.log('oops', error); this.createPointFailure = true}
     ) 
     
  }

  createShipmetnSuccess = false;
  createShipmetnFailure = false;
  CreateSipment(shipment:any) {
    return this.http.post("http://localhost:85/php/createshipment.php", shipment).subscribe(res => {
    console.log(res);
    if (res){
      this.createShipmetnSuccess = true;
    }
     },
     error => {console.log('Something goes wrong', error); this.createShipmetnFailure = true}
     ) 
     
  }

  appointSucsess= false
  appointFailure= false
  Appoint(driver:any) {
    return this.http.post("http://localhost:85/php/appoint.php", driver).subscribe(res => {
    console.log(res);
    if (res){
      this.appointSucsess = true;
    }
     },
     error => {console.log('Something goes wrong', error); this.appointFailure = true}
     ) 
     
  }

  getPhotosRes:any
  getPhotos(shipment:any) {
    this.http.post("http://localhost:85/php/photos-json.php", shipment).subscribe(res => {
    this.getPhotosRes = res;
    console.log(res);
    
  }) 
     
  }


}
