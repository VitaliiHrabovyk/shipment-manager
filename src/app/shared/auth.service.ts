import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})



export class AuthService {

constructor(
  private http:HttpClient,
  private route:Router
  ) { }




response:any
noResponse:boolean | undefined | null;

login(user:any){
  console.log(user);
  return this.http.post("http://localhost:85/php/auth.php", user).subscribe(res => {
    if (res){
      this.response = res;
      localStorage.setItem('auth-status', this.response.auth);
      localStorage.setItem('token', this.response.token);
      localStorage.setItem('tokenExp', this.response.tokenExpDate);
      this.route.navigate(['/'])

    } else {localStorage.clear(); this.noResponse = true}

  })
}


logOut(){
localStorage.clear();
this.route.navigate(['/login'])
}

token:string | null = "";

isAuthentificated(){
  if(Date.now()/1000 > Number(localStorage.getItem('tokenExp'))){
    return false
  }
  this.token = localStorage.getItem('token')
  return !!localStorage.getItem('token')

}



}


