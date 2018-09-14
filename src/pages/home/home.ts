import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormsPage } from '../forms/forms';
import { GlobalProvider } from '../../providers/global/global';
import { Geolocation } from '@ionic-native/geolocation';
import { BatteryStatus } from '@ionic-native/battery-status';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs';
import { HttpProvider } from '../../providers/http/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  email: string;
  password: string;
  formPage: any = FormsPage;
  response: string;
  example_forms: any[]=[
    {
      'id': '1',
      'name': 'form1',
      'version': 'v1'
    },
    {
      'id': '2',
      'name': 'form2',
      'version': 'v1'
    }
  ];

  constructor(
    public navCtrl: NavController,
    public global: GlobalProvider,
    private geolocation: Geolocation,
    private batteryStatus: BatteryStatus,
    private device: Device,
    public http: HttpProvider
  ) {

  }

  loginRequest(){
    this.http.getLogin(this.email, this.password)
    .then(data => {
      this.global.logedIn = true;
      this.global.forms = this.example_forms;
      this.global.serial = this.device.serial;
      this.global.operating_system = this.device.platform;
      Observable.interval(1000).subscribe(()=>{
        this.global.date = new Date();
      });
    })
    .catch(error => {
      console.log(error)
    });
  }

  ionViewDidLoad() {
    this.http.getToken()
  }

  getToOtherPage() {
    this.navCtrl.push(this.formPage)
  }
}
