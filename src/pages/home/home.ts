import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormsPage } from '../forms/forms';
import { GlobalProvider } from '../../providers/global/global';
import { Geolocation } from '@ionic-native/geolocation';
import { BatteryStatus } from '@ionic-native/battery-status';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs';
import { HttpProvider } from '../../providers/http/http';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  email: string;
  password: string;
  formPage: any = FormsPage;
  response: string;
  name: any;

  constructor(
    public navCtrl: NavController,
    public global: GlobalProvider,
    private geolocation: Geolocation,
    private batteryStatus: BatteryStatus,
    private device: Device,
    public http: HttpProvider,
    private nativeStorage: NativeStorage,
    private alertCtrl: AlertController
  ) {
  }

  loginRequest(){
    this.http.getLogin(this.email, this.password)
    .then(data => {
      this.storeUserData()
      this.global.logedIn = true;
      this.global.serial = this.device.serial;
      this.global.operating_system = this.device.platform;
      const subscription = this.batteryStatus.onChange().subscribe(status => {
        this.global.batterylevel = status.level
      });
      Observable.interval(1000).subscribe(()=>{
        this.global.date = new Date();
        this.geolocation.getCurrentPosition().then((resp) => {
          this.global.coordinates = resp.coords
        }).catch((error) => {
          console.log('Error getting location', error.message);
        });
      });
      Observable.interval(30000).subscribe(()=>{
        this.geolocation.getCurrentPosition().then((resp) => {
          this.global.coordinates = resp.coords
          let celData = {
            date: new Date(),
            battery: this.global.batterylevel,
            serial: this.global.serial,
            OS: this.global.operating_system,
            geo:
            {
              lat: resp.coords.latitude,
              lon: resp.coords.longitude
            }
          }
          this.http.postCelData(celData)
        }).catch((error) => {
          console.log('Error getting location', error.message);
        });
      });
    })
    .catch(error => {
      console.log(error)
      this.failLogInAlert()
    });
  }

  storeUserData() {
    this.nativeStorage.setItem('user', {
      email: this.email,
      password: this.password
    })
    .then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );
  }

  ionViewDidLoad() {
    this.http.getToken()
    .then(data => {
      console.log('======  status token')
      this.http.token = JSON.parse(data.data)._csrf
      this.http.token_ready = true
      this.nativeStorage.getItem('user')
      .then(
        data => {
          this.email = data.email
          this.password = data.password
          this.loginRequest()
        },
        error => console.error(error)
      );
    })
    .catch(error => {
      console.log('error token')
      console.log(error)
      this.http.error_message = error
    });
  }

  failLogInAlert() {
    let logIn = this.alertCtrl.create({
      title: 'Log In',
      message: 'You have entered an invalid username or password',
      buttons: ['Dismiss']
    });
    logIn.present();
  }

  getToOtherPage() {
    this.navCtrl.push(this.formPage)
  }
}
