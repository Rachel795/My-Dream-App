import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';

import { environment } from "../../environments/environment"

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({providedIn:'root'})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();

 
    constructor(private http: HttpClient, private router: Router){}

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.isAuthenticated;
    }
    getUserId(){
        return this.userId;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string){
        const authData: AuthData = {
           email:email,
           password:password 
        };
        return this.http.post(BACKEND_URL + '/signup', authData).subscribe(() => {
            this.router.navigate(['/']);
          }, error => {
              this.authStatusListener.next(false);
          });
    }

    login(email: string, password: string){
        const authData: AuthData = {
            email:email,
            password:password 
         };
        this.http.post<{token: string, expiresIn: number, userId:string}>(BACKEND_URL + '/login',  authData).subscribe( response => {
            const token = response.token;
            this.token = token;
            if(token){
                const expireInDuration =  response.expiresIn;
                this.setAuthTimer(expireInDuration);
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
                this.saveAuthData(token, expirationDate, this.userId);
                this.router.navigate(['/']);
            }    
    }, error => {
        this.authStatusListener.next(false);
    });
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const expireIn = authInformation.expirationDate.getTime() - now.getTime(); 
        if(expireIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expireIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false); 
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimer);
        this.userId = null;
        this.clearAuthData();
    }

    private setAuthTimer(duration: number){

        this.tokenTimer = setTimeout(() => {
            this.logout()
        },  duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string){
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData(){
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');

        if(!token || !expirationDate){
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }
}