import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';


@Injectable()
export class SearchService extends HttpService {

  constructor(public http: Http, public cookie: CookieService ) {
    super(cookie,http);
   }
  SearchForExpert(input)
  {
     return this.http_get_auth('/expert/searchForExpert/'+ input  , {});
     
  }
  SearchForUser(input){
    return this.http_get_auth('/admin/searchForUser/'+input,{});
  }
}
