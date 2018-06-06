import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {CookieService} from 'angular2-cookie/services/cookies.service';
import {HttpService} from './http.service';


@Injectable()
export class ExpertService extends HttpService{

  constructor(public http:Http, public cookie:CookieService) {
    super(cookie,http);
   }

   viewExpertProfile(){
     return this.http_get_auth('/expert/expertProfile',{});
   }
   viewSlots(expertId){
    return this.http_get_auth('/expert/viewSlots/'+ expertId,{});
   }
   viewSessionRequests() {
    return this.http_get_auth('/SessionRequests/viewSessionRequests',{});
  }
  acceptSessionRequests(sessionRequestId) {
    return this.http_delete_auth('/SessionRequests/acceptSessionRequests', {sessionid: sessionRequestId});
  }
  rejectSessionRequests(sessionRequestId) {
    return this.http_delete_auth('/SessionRequests/rejectSessionRequests' , {sessionid: sessionRequestId});
  }

   EditExpertProfile(fName,lName,birth,yearsOfExp,userTags,freeSlots, slotsTouched){
    return this.http_post_auth('/expert/EditExpertProfile',{firstname:fName,lastname:lName,birthdate:birth,yearsOfExp:yearsOfExp,tags:userTags,freeSlots:freeSlots, slotsTouched:slotsTouched});
  }

   changeUserPassword(oldpassword, newpassword){
    return this.http_post_auth('/expert/changeUserPassword',{oldpassword:oldpassword, newpassword:newpassword});
   }
}
