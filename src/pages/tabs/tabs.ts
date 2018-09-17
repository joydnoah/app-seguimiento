import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormsPage } from '../forms/forms';
import { HomePage } from '../home/home';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  formPage: any = FormsPage;
  homePage: any = HomePage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public http: HttpProvider,
    private nativeStorage: NativeStorage,
    private alertCtrl: AlertController
  ) {
  }

  updateForms() {
    console.log('update forms')
    this.http.getForms()
    .then(data => {
      this.global.forms = JSON.parse(data.data)
    })
    .catch(error => {
      console.log(error.error)
    });
  }

  logOutAlert() {
  let logOut = this.alertCtrl.create({
      title: 'Log Out',
      message: 'Do you want to log out?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.logOut()
          }
        }
      ]
    });
    logOut.present();
}

  logOut () {
    console.log('logOut')
    this.nativeStorage.remove('user')
    .then(
      ()=>{
        console.log('User removed')
        this.global.logedIn = false;
      }
    )
  }

}
