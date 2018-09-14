import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpProvider {
  token: any;
  constructor(
    public http: HttpClient,
    private http_native: HTTP
  ) {
    console.log('Hello HttpProvider Provider');
  }
  getToken() {
    this.http_native.get('http://181.143.188.106/csrfToken', {}, {})
    .then(data => {
      console.log('======  status token')
      this.token = JSON.parse(data.data)._csrf
    })
    .catch(error => {
      console.log('error token')
      console.log(error)
    });
  }
  getLogin(email, password) {
    return this.http_native.put('http://181.143.188.106/api/v1/entrance/login', {
      'emailAddress': email,
      'password': password,
      '_csrf': this.token
    }, {});
  }
}
