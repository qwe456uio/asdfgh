import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpService } from './http.service';
import { URLSearchParams } from '@angular/http';


@Injectable()
export class AdminService extends HttpService {

  constructor( public http: Http, public cookie: CookieService) {
    super(cookie, http);
  }

  login(data) 
  {
    return this.http_post('/admin/login', data);
  }

  createAdmin(data) {
    return this.http_post_auth('/admin/createnewadmin', data);
  }

  changePassword(data) 
  {
    return this.http_post_auth('/admin/changepassword', data);
  }
  getUsers(data){
    // let search = new URLSearchParams();
    // search.set('user', data);
    return this.http_get_auth('/admin/users?user='+data, {});
  }
  FilterSessionRequests()
  {
     return this.http_get_auth('/admin/filterSessionRequests' , {});
  }
  RemoveSessionRequest(id){
    return this.http_delete_auth('/admin/removeSessionRequest/'+ id , {});}
  DemoteExpert(ExpertId){
    return this.http_get('/admin/DemoteExpert/'+ ExpertId,{});
  }
  RespondToExpertRequests(){
    return this.http_get_auth('/admin/respondExpertRequests' , {});
  }
  ApproveExpertRequest(sessionId){
    return this.http_post_auth('/admin/AcceptExpertRequests/'+sessionId, {});
  }
  RejectExpertRequest(sessionId){
    return this.http_post_auth('/admin/RejectExpertRequests/'+sessionId, {});
  }
}
