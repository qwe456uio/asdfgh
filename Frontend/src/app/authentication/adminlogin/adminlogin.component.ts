import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpService } from '../../services/http.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.scss']
})
export class AdminLoginComponent implements OnInit {

  public form: FormGroup;
  email;
  password;
  errorMsg;
  constructor(private fb: FormBuilder, public cookie: CookieService, public adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group ( {
      uname: [null , Validators.compose ( [ Validators.required ] )] , password: [null , Validators.compose ( [ Validators.required ] )]
    } );
  }

  async login() 
  {
    
    await this.adminService.login({email: this.email, password: this.password}).subscribe((reply) => {
      //Saves response token in cookie      
      //Navigates to user home page    
      this.cookie.put('token', reply.data, null);
      this.router.navigate ( [ '/admin/profile']);
    }, (reply) => {
      this.errorMsg = "Wrong Credentials!";
      this.showErrorAlert();
    });

  }

  showErrorAlert()
  {
    var alertDiv = document.getElementById("erroralert");
    alertDiv.style.visibility = "visible";
  }

  closeErrorAlert()
  {
    var alertDiv = document.getElementById("erroralert");
    alertDiv.style.visibility = "hidden";
  }

}