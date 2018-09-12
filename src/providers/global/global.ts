import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {
  logedIn: boolean = false;
  forms: any[] = [];
  coordinates: any;
  operating_system: string;
  serial: string;
  batterylevel: any='No battery';
  date: any;
}
