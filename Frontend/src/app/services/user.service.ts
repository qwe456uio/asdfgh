import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpService } from './http.service';


@Injectable()
export class UserService extends HttpService {

  constructor( public http: Http, public cookie: CookieService) {
    super(cookie, http);
  }

  login(data) {
    return this.http_post('/user/login', data);
  }
  signUp(email, password, firstname, lastname, birthdate, tags)
  {
    return this.http_post('/user/signUp', {email: email, password: password, firstname: firstname, lastname: lastname, birthdate: birthdate, tags: tags});
  }
  viewUserProfile()
  {
    //return this.http_get_auth('/user/viewUserProfile');
    return this.http_get_auth('/user/viewUserProfile',{});
    
  }

  editUserProfile(fName,lName,birth,userTags, phone){
    return this.http_post_auth('/user/editUserProfile',{firstname: fName, lastname: lName, birthdate: birth,tags:userTags,phone: phone});
  }
 

  getQuestionsSuggestions()
  {
      return this.http_get_auth('/questions/getSuggestions', {});
  }

  getExpertSuggestions()
  {
      return this.http_get_auth('/expert/getsuggestions', {});
  }
  
  RequestToBeAnExpert(yearsOfExp, cvLink, tags, proposal) {
    return this.http_post_auth('/expertRequest/requestToBeAnExpert', { yearsOfExp: yearsOfExp, cvLink: cvLink, tags: tags, proposal: proposal });
  }
  ReservePrivateSession(expertId, requestQues, slot){
    return this.http_post_auth('/sessionRequest/reservePrivateSession', {expert: expertId, requestQues: requestQues, slot: slot});
  }
  changeUserPassword(data) 
  {
    return this.http_post_auth('/user/changeUserPassword', data);
  }
  isExpertOrUser(){
    return this.http_get_auth('/user/isExpertOrUser',{});
  }
}
