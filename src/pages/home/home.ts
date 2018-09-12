import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormsPage } from '../forms/forms';
import { GlobalProvider } from '../../providers/global/global';
import { Geolocation } from '@ionic-native/geolocation';
import { BatteryStatus } from '@ionic-native/battery-status';
import { Device } from '@ionic-native/device';
import { Observable } from 'Rxjs/rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  email: string;
  password: string;
  formPage: any = FormsPage;

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
    private device: Device
  ) {

  }
  loginRequest(){
    var default_email='test';
    var default_password='1234';
    if (this.email == default_email && this.password == default_password) {
      this.global.logedIn = true;
      this.global.forms = this.example_forms;
      Observable.interval(1000).subscribe(()=>{
        this.global.serial = this.device.serial
        this.global.operating_system = this.device.platform
        this.global.date = new Date();
      });
    }
  }
  getToOtherPage() {
    this.navCtrl.push(this.formPage)
  }
  ionViewDidLoad() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.global.coordinates = data.coords
    });
    this.batteryStatus.onChange().subscribe(status => {
      this.global.batterylevel = status.level
    });
  }
}
