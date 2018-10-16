import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IndividualFormPage } from '../individual-form/individual-form';
// import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

/**
 * Generated class for the PreFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pre-form',
  templateUrl: 'pre-form.html',
})
export class PreFormPage {
  formData: any;
  formSections: any[]=[];
  point: any;
  date: any;

  constructor(
    public navCtrl: NavController,
    // private launchNavigator: LaunchNavigator,
    public navParams: NavParams
  ) {
    this.formData = navParams.get("formData")
    this.formSections = navParams.get("sections")
    this.point = navParams.get("point")
    this.date = navParams.get("date")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreFormPage');
  }

  googleMaps (coordinates) {
    // let options: LaunchNavigatorOptions = {
    //   app: this.launchNavigator.APP.GOOGLE_MAPS
    // };
    // this.launchNavigator.navigate(coordinates, options)
    // .then(
    //   success => console.log('Launched navigator'),
    //   error => console.log('Error launching navigator', error)
    // )
    // .catch(
    //   error => console.log(error)
    // );
    console.log("A")
  }


  openForm() {
    this.navCtrl.push(IndividualFormPage, {
      formData: this.formData,
      sections: this.formSections,
      point: this.point
    })
  }

}
