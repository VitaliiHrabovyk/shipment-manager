import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { CrudService } from '../shared/crud.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService],
})
export class LoginComponent implements OnInit {

  constructor(
    public auth:AuthService,
    private router:Router,
    public crud:CrudService

  ) { }

  form!: FormGroup;



  submitted = false;

  submit(){
    if (this.form.invalid){
      return
    }

    this.submitted = true;

    const user = {
      email: this.form.value.email, 
      password: this.form.value.password, 
    }

   this.auth.login(user)
   this.form.reset
   this.submitted = false
   console.log(this.form);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })

  }

}
