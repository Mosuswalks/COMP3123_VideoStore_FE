import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { FormControl,FormGroup, Validators, AbstractControl } from '@angular/forms';
import { User } from '../../interfaces/user-interface';
import { Router } from '@angular/router';
import { isNull } from 'util';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordConfirm: new FormControl('', [Validators.required])
  })

  user: User;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

  }

  registerUser(){
    if(this.registrationForm.valid){
        this.authService.registerUser(this.registrationForm.get('email').value, this.registrationForm.get('password').value).catch(function(error){
        return error.code + error.message
      });
    }
    this.router.navigate(['/movies'])
  }

  loginUser(){
    console.log("Logged in")
    return this.authService.login(this.loginForm.get("email").value,this.loginForm.get("password").value).catch(function(error){
      if(isNull(error)){
        this.router.navigate(['/movies']);
      }
      else{
        return console.log("There was an error logging in: " + error.code + error.message);
      }
    });
  }

  matchPassword(){
    this.user.password = this.registrationForm.get("password").value;
    let passwordConfirm = this.registrationForm.get("passwordConfirm").value
    if(this.user.password === passwordConfirm){
      return this.user.password;
    }
  }

  getErrorMessage() {
    return this.registrationForm.get('email').hasError('required') ? 'You must enter a value' :
        this.registrationForm.get('email').hasError('email') ? 'Not a valid email' :
            '';
  }
}
