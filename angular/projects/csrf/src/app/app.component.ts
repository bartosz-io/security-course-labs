import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  readonly API = 'http://127.0.0.1';
  view: 'LOADING' | 'LOGGED' | 'NOT_LOGGED' = 'LOADING';
  loggedUser = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(`${this.API}/user`)
      .subscribe((data: any) => {
        if (data.user) {
          this.loggedUser = data.user;
          this.view = 'LOGGED';
        } else {
          this.view = 'NOT_LOGGED';
        }
      });
  }

  doLogin(login: string) {
    if (!login) {
      alert('Login is required');
      return;
    }

    this.http.post(`${this.API}/login`, { login })
      .subscribe(() => {
        this.loggedUser = login;
        this.view = 'LOGGED';
      });
  }

  logout() {
    this.http.get(`${this.API}/logout`)
      .subscribe(() => {
        this.loggedUser = null;
        this.view = 'NOT_LOGGED';
      });
  }

  transferMoneyGET(receiver: string, amount: string) {
    this.http.get(`${this.API}/transfer/${receiver}/${amount}`)
      .subscribe((data) => {
        console.log(data);
      });
  }

  transferMoneyPOST(receiver: string, amount: string) {
    this.http.post(`${this.API}/transfer/`, { receiver, amount })
      .subscribe((data) => {
        console.log(data);
      });
  }
}
