import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { HttpService } from '../../services/http.service';
import { HttpModule } from '@angular/http';

@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.component.html',
  styleUrls: ['./adminprofile.component.scss']
})
export class AdminProfileComponent implements OnInit {

  public form: FormGroup;
  oldpassword;
  newpassword;
  errorMsg;
  successMsg;

  constructor(private fb: FormBuilder, public adminService: AdminService) {}

  ngOnInit() {
    this.form = this.fb.group ( {
      uname: [null , Validators.compose ( [ Validators.required ] )] , password: [null , Validators.compose ( [ Validators.required ] )]
    } );
  }

  changePassword()
  {
    this.adminService.changePassword( { oldpassword: this.oldpassword, newpassword: this.newpassword } ).subscribe((reply) => {
      this.successMsg = "Password changed successfully";
      this.showSuccessAlert();
    },(reply) => {
      this.errorMsg = "Wrong Password!";
      this.showErrorAlert();
    });
    console.log(this.newpassword);
    console.log(this.oldpassword);
  }

  showSuccessAlert()
  {
    var alertDiv = document.getElementById("successalert");
    alertDiv.style.visibility = "visible";
  }

  showErrorAlert()
  {
    var alertDiv = document.getElementById("erroralert");
    alertDiv.style.visibility = "visible";
  }

  closeSuccessAlert()
  {
    var alertDiv = document.getElementById("successalert");
    alertDiv.style.visibility = "hidden";
  }

  closeErrorAlert()
  {
    var alertDiv = document.getElementById("erroralert");
    alertDiv.style.visibility = "hidden";
  }

}