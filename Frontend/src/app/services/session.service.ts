import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpService } from './http.service';
@Injectable()
export class SessionService extends HttpService {

  constructor( public http: Http, public cookie: CookieService) {
    super(cookie, http);
  }

  cancelRequest(data) 
  {
    return this.http_delete_auth('/sessionRequests/cancelRequest/'+data,{});
  }
  
  viewStatus() 
  {
    return this.http_get_auth('/sessionRequests/viewUserStatus');
  }

}
