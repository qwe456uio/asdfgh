import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { UserService } from '../../services/user.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public form: FormGroup;
  username;
  password;
  errorMsg;
  constructor(private fb: FormBuilder, public cookie: CookieService, public userService: UserService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group ( {
      uname: [null , Validators.compose ( [ Validators.required ] )] , password: [null , Validators.compose ( [ Validators.required ] )]
    } );
  }

  async login() 
  {
    
    await this.userService.login({email: this.username, password: this.password}).subscribe((reply) => {
      //Saves response token in cookie      
      //Navigates to user home page    
      this.cookie.put('token', reply.data, null);
      if(!reply.isExpert) this.router.navigate ( [ '/profile/home']);
      else this.router.navigate(['/expert/experthome']);
    }, (reply) => {
      this.showAlert();
      this.saveErrorMessage(reply._body);
    });
  }

  saveErrorMessage(reply)
  {
    switch(reply)
    {
      case '{"error":"Missing Fields or Wrong Email format"}': this.errorMsg = 'Email does not exist'; break;
      case '{"error":"Wrong Password"}': this.errorMsg = 'Password is not correct'; break;
      case '{"error":"Wrong Email"}': this.errorMsg = 'Email does not exist'; break;
      default : this.errorMsg = 'Error while signing in';
    }
  }

  showAlert()
  {
    var alertDiv = document.getElementById("alert");
    alertDiv.style.visibility = "visible";
  }

  closeAlert()
  {
    var alertDiv = document.getElementById("alert");
    alertDiv.style.visibility = "hidden";
  }

}
