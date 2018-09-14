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
    var default_email='test';
    var default_password='1234';
    if (this.email == default_email && this.password == default_password) {
      this.global.logedIn = true;
      this.global.forms = this.example_forms;
      this.global.serial = this.device.serial;
      this.global.operating_system = this.device.platform;
      Observable.interval(1000).subscribe(()=>{
        this.global.date = new Date();
      });
    }
  }

  ionViewDidLoad() {
    this.http.getLogin()
    .subscribe(
      (data) => { // Success
        console.log('Success')
        console.log(data)
        this.response = 'Success'
      },
      (error) =>{
        console.log('Error')
        console.log(Object.keys(error));
        console.log(error.error)
        console.log(error.message)
        this.response = 'Error'
      }
    )
  }

  getToOtherPage() {
    this.navCtrl.push(this.formPage)
  }
}
