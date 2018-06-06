import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-filter-requests',
  templateUrl: './filter-requests.component.html'
})
export class FilterRequestsComponent implements OnInit {
  requests=[];
  constructor(private AdminService:AdminService, private route : Router, private http :HttpClient) { 

  }
  
  async ngOnInit(){
    
    await this.AdminService.FilterSessionRequests().subscribe(
      response => {
        this.requests = response.data;
        //console.log(this.requests);
        
        
      }, error => {
        
        this.requests = [];
        
        var n = this.requests.length;
        window.onload = function(){
          var eleDiv = document.getElementById("alert");
              if(n==0){
                eleDiv.style.visibility = "visible";
                }
            }
      });
  }
  async RemoveSessionRequest(sessionId)
  {
    await this.AdminService.RemoveSessionRequest(sessionId).subscribe(msg => {
      console.log("Removed"); 
      if(this.requests.length==0){
        var eleDiv = document.getElementById("alert");
                eleDiv.style.visibility = "visible";
      }
      this.ngOnInit();
    
  }, err => {});
    
  }

}
