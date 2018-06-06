import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { HttpService } from '../../services/http.service';
import { HttpModule } from '@angular/http';

@Component({
  selector: 'app-addadmin',
  templateUrl: './addadmin.component.html',
  styleUrls: ['./addadmin.component.scss']
})
 export class AddAdminComponent implements OnInit {

   email;
   password;
   response;


  constructor(public adminService: AdminService) {}

  ngOnInit() {}

  //function to call the admin service
  async createAdmin(email : string, password : string){
    this.email= email;
    this.password= password;

    await this.adminService.createAdmin({email: this.email, password: this.password}).subscribe(
    (reply) => { this.response = 'Admin account created successfully!' }, 
    (reply) => { this.saveResponse(reply._body) });
  }

  //saving the response in the variable
  saveResponse(reply){
    switch(reply)
    {
      case '{"msg":"Please fill out all the fields."}': this.response = 'Please fill out all the fields.'; break;
      case '{"msg":"Please enter the email in correct format."}': this.response = 'Please enter a valid email address.'; break;
      case '{"msg":"An admin is already created with this email."}': this.response = 'An admin account is already created with this email.'; break;
    }
  }

}