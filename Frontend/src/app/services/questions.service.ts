import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpService } from './http.service';
import {UserService} from './user.service'
import { Http } from '@angular/http';
@Injectable()

export class QuestionsService extends HttpService {

  
  constructor(public http: Http, public cookie: CookieService) { 
    super(cookie, http);
  }
  getQuestions(){
      return this.http_get_auth('/questions/getQuestions/');
  
    }
  answerQuestion(questionId, answer){
    return this.http_patch_auth('/questions/answerQuestion/'+ questionId, {answer: answer});
  }
  viewQuestions(){
    return this.http_get_auth('/questions/viewQuestions/');
  }
  viewPreviousAskedQuestions() {
    return this.http_get_auth('/Question/viewPreviousAskedQuestions',{});
  }
  getQuestionsOnTag(tag){
    return this.http_get_auth('/questions/getQuestionsOnTag/'+tag,{});
  
}
}
