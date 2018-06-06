import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-respond-expert-requests',
    templateUrl: './respond-expert-requests.html'
  })
  export class RespondExpertRequests implements OnInit {
    requests=[];
    notfound=false;
    constructor(private AdminService:AdminService, private route : Router, private http :HttpClient) { 
  
    }
    async ngOnInit(){
    
        await this.AdminService.RespondToExpertRequests().subscribe(
          response => {
            this.requests = response.data;
            //console.log(this.requests);
            this.notfound = (this.requests.length==0);
            
          }, error => {
            
            this.requests = [];
          });
      }
      async ApproveExpertRequest(sessionId)
      { 
        console.log(sessionId);
        await this.AdminService.ApproveExpertRequest(sessionId).subscribe(msg => {
            console.log('msg');
          this.ngOnInit();
        
      }, err => {
        console.log('err');
      });
        
      }
      async RejectExpertRequest(sessionId)
      {
        await this.AdminService.RejectExpertRequest(sessionId).subscribe(msg => {
          this.ngOnInit();
        
      }, err => {});
        
      }
      
}