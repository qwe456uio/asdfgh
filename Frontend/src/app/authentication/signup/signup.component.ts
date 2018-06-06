import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit 
{
  signupResponse = '';
  user;
  tags = [];
  
  constructor(private router: Router, private userService : UserService , private http :HttpClient) 
  {
    this.user = 
    {
      email: ''
    }
  }
  ngOnInit() {}

  addTag() 
  {
    if(this.user.tag != undefined && this.user.tag != '') 
    {
      this.tags.push(this.user.tag);
      this.user.tag = '';
    }
  }

  removeTag() 
  {
    this.tags.pop();
  }

  async signUp()
  {
    await this.userService.signUp(
      this.user.email,
      this.user.password,
      this.user.firstname,
      this.user.lastname,
      this.user.birthdate,
      this.tags
    )
    .subscribe(
      response => 
      {
        this.signupResponse = 'Signup Successful';
        this.router.navigate(['/authentication/signin']);
      },
      error => 
      {
        var eleDiv = document.getElementById("alert");
        eleDiv.style.visibility = "visible";
        switch(error._body) 
        {
          case '{"error":"Invalid email."}':
          this.signupResponse = 'Invalid email.';
              break;
          case '{"error":"Another account is already registered with this email."}':
          this.signupResponse = 'Another account is already registered with this email.';
              break;
          case '{"error":"Invalid Date."}':
          this.signupResponse = 'Invalid Date.';
              break;
          default:
          this.signupResponse = 'Signup failed, please try again';
        }
      }
    );
  }
  close() 
  {
    var eleDiv = document.getElementById("alert");
    eleDiv.style.visibility = "hidden";
  }
}
