    import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { environment } from '../../environments/environment';
//import { environment } from '../../environments/environment.prod';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';

@Injectable()
export class HttpService {

    headers;

    constructor(public cookie: CookieService, public http: Http) { }

    getToken() // Getting user token from browser's cache
    {
        if (this.cookie.get('token') == undefined) 
        { 
            window.location.href = '/logout';
        }
        return this.cookie.get('token');
    }

    addTokenToHeaders()
    {
        this.headers = new Headers();
        this.headers.append('token', this.getToken());
    }

    http_get(url: string, data: any) // HTTP GET method
    { 
        return this.http.get(environment.SERVER + url, data)
        .map(res => res.json());
    }

    http_get_auth(url: string, data: any = []) // HTTP GET method with authentication (User Token included)
    { 
        //data.token = this.getToken(); // Send Token
        this.addTokenToHeaders();
        return this.http.get(environment.SERVER + url, {params: data, headers: this.headers})
        .map(res => res.json());
    }

    http_post(url: string, data: any) // HTTP POST method
    { 
        return this.http.post(environment.SERVER + url, data)
        .map(res => res.json());
    }

    http_post_auth(url: string, data: any = []) // HTTP POST method with authentication (User Token included)
    { 
        this.addTokenToHeaders();
        return this.http.post(environment.SERVER + url, data, {headers: this.headers})
        .map(res => res.json());
    }
    http_patch(url: string, data: any) // HTTP PATCH method
    { 
        return this.http.patch(environment.SERVER + url, data)
        .map(res => res.json());
    }

    http_patch_auth(url: string, data: any = []) // HTTP PATCH method with authentication (User Token included)
    { 
        this.addTokenToHeaders();
        return this.http.patch(environment.SERVER + url, data, {params: data, headers: this.headers})
        .map(res => res.json());
    }
    http_delete(url: string, data: any) // HTTP DELETE method
    { 
        return this.http.delete(environment.SERVER + url, data)
        .map(res => res.json());
    }

    http_delete_auth(url: string, data: any = []) // HTTP DELETE method with authentication (User Token included)
    { 
        this.addTokenToHeaders();
        return this.http.delete(environment.SERVER + url, {params: data, headers: this.headers})
        .map(res => res.json());
    }

}
