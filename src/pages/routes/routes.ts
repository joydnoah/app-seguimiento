import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PreFormPage } from '../pre-form/pre-form';
import { GlobalProvider } from '../../providers/global/global';
import * as moment from 'moment'
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
/**
 * Generated class for the RoutesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-routes',
  templateUrl: 'routes.html',
})
export class RoutesPage {
  formData: any;
  formSections: any[]=[];
  formRoutes: any[]=[];
  date: string;

  constructor(
    public navCtrl: NavController,
    public global: GlobalProvider,
    private launchNavigator: LaunchNavigator,
    public navParams: NavParams
  ) {
    this.formRoutes = navParams.get("routes")
    this.formData = navParams.get("formData")
    this.formSections = navParams.get("sections")
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad RoutesPage');
    this.date = moment(this.global.date).format('YYYY/MM/DD')
    var empty = true
    for (var i = 0; i < this.formRoutes.length; i++) {
      for (var n = 0; n < this.formRoutes[i].routes.length; n++) {
        empty = empty && (this.formRoutes[i].routes[n].places.length < 1)
      }
    }
    if (empty) {
      this.navCtrl.popToRoot();
    }
  }

  googleMaps (formRoutes) {
    let pointsCoordinates = []
    for (var i = 0; i < formRoutes[0].routes[0].places.length; i++) {
     pointsCoordinates.push(formRoutes[0].routes[0].places[i].coordinates)
    }
    let options: LaunchNavigatorOptions = {
     app: this.launchNavigator.APP.GOOGLE_MAPS
    };
    this.launchNavigator.navigate(pointsCoordinates.join("+to:"), options)
    .then(
     success => console.log('Launched navigator'),
    )
    .catch(
     error => console.log(error)
    );
  }

  compareDate (date) {
    return date === this.date
  }

  toSoon (date) {
    let dateObject = moment(String(date), "YYYY/MM/DD").toDate();
    let todayDate = moment(this.date, "YYYY/MM/DD").toDate();
    return dateObject > todayDate
  }

  toLate (date) {
    let dateObject = moment(String(date), "YYYY/MM/DD").toDate().getTime();
    let todayDate = moment(this.date, "YYYY/MM/DD").toDate().getTime();
    return dateObject < todayDate
  }

  openForm(point, date, valid) {
    if (valid) {
      this.navCtrl.push(PreFormPage, {
        formData: this.formData,
        sections: this.formSections,
        date: date,
        point: point
      })
    }
  }
}
