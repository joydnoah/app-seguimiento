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
import { Network } from '@ionic-native/network';
import { RoutesPage } from '../../pages/routes/routes';
import { IndividualFormPage } from '../individual-form/individual-form';

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
  internetConnection: string;

  constructor(
    public navCtrl: NavController,
    public global: GlobalProvider,
    private geolocation: Geolocation,
    private batteryStatus: BatteryStatus,
    private device: Device,
    public http: HttpProvider,
    private nativeStorage: NativeStorage,
    private alertCtrl: AlertController,
    private network: Network
  ) {
    console.log(this.network.type)
    if (this.network.type === 'none') {
    }
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.internetErrorAlert()
    });
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
    });
  }

  loginRequest(){
    this.http.getLogin(this.email, this.password)
    .then(data => {
      this.storeUserData()
      this.updateForms()
      this.global.logedIn = true;
      this.global.serial = this.device.serial;
      this.global.operating_system = this.device.platform;
      const subscription = this.batteryStatus.onChange().subscribe(status => {
        this.global.batterylevel = status.level
      });
      // Get coordinates
      this.timedGetCoordinates(1000)
      //Timed post of celphone data
      this.timePostCelData(15000)
      //Timed post not sent form
      Observable.interval(10000).subscribe(()=>{
        this.nativeStorage.getItem('pendingForms')
        .then(
          data => {
            console.log('Data found')
            console.log(data.length)
            this.global.pendingForms = data
            if (data.length >= 1) {
              this.http.postForm(data[0].place, data[0].celData, data[0].formJSON)
              .then(data => {
                console.log('post done')
                this.global.pendingForms.splice(0, 1)
                this.global.savePendingForms()
              })
              .catch(error => {
                console.log('post failed')
                console.log(error.error)
              });
            }
          },
          error => {
            console.log('No data')
            this.global.pendingForms = []
          }
        );
      });
    })
    .catch(error => {
      console.log(error)
      this.failLogInAlert()
    });
  }

  timedGetCoordinates(time) {
    Observable.interval(time).subscribe(()=>{
      this.global.date = new Date();
      this.geolocation.getCurrentPosition().then((resp) => {
        this.global.coordinates = resp.coords
      }).catch((error) => {
        //console.log('Error getting location', error.message);
      });
    });
  }

  timePostCelData(time) {
    Observable.interval(time).subscribe(()=>{
      let celData = {
        date: new Date(),
        battery: this.global.batterylevel,
        serial: this.global.serial,
        OS: this.global.operating_system,
        geo:
        {
          lat: '0',
          lon: '0'
        }
      }
      if (this.global.coordinates !== undefined) {
        celData.geo.lat = this.global.coordinates.latitude
        celData.geo.lon = this.global.coordinates.longitude
      }
      this.http.postCelData(celData)
      .then(data => {
        console.log('success timed post')
      })
      .catch(error => {
        console.log('Error timed post')
      });
    })
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
      title: 'Iniciar sesión',
      message: 'El nombre de usuario o contraseña es incorrecto',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    logIn.present();
  }

  internetErrorAlert() {
    let alert = this.alertCtrl.create({
      title: "Error de conexión a internet",
      message: "En estos momentos no hay una conexión a internet",
      buttons: [{
        text: "Cancelar",
        role: 'cancel',
        handler: () => {
          console.log('No internet connection');
          // this.http.networkConnection = false
          // this.navCtrl.popToRoot();
        }
      }]
    });
    alert.present();
  }

  updateForms() {
    console.log('update forms')
    this.http.getForms()
    .then(data => {
      console.log('forms updated')
      this.global.cacheForms = JSON.parse(data.data)
      this.global.setForms()
      this.nativeStorage.getItem('completedForms')
      .then(
        data => {
          console.log('completedForms')
          this.global.completedForms = data
          this.global.setForms()
        },
        error => {
          console.log('completedforms error')
          this.global.completedForms = []
          this.global.setForms()
        }
      );
    })
    .catch(error => {
      console.log(error.error)
    });
  }

  getToOtherPage() {
    this.navCtrl.push(this.formPage)
  }

  openForm(formData, sections, routes) {
    var anyPlace = false
    if (routes !== undefined) {
      for (var i = 0; i < routes.length; i++){
        for (var n = 0; n < routes[i].routes.length; n++){
          anyPlace = anyPlace || (routes[i].routes[n].places.length > 0)
        }
      }
    }
    if (anyPlace) {
      this.navCtrl.push(RoutesPage, {
        formData: formData,
        sections: sections,
        routes: routes
      })
    } else {
      this.navCtrl.push(IndividualFormPage, {
        formData: formData,
        sections: sections,
        point: {
          name: null
        }
      })
    }
  }
}
