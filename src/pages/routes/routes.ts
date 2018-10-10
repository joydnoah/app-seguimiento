import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IndividualFormPage } from '../individual-form/individual-form';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.formRoutes = navParams.get("routes")
    this.formData = navParams.get("formData")
    this.formSections = navParams.get("sections")
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad RoutesPage');
    var empty = true
    for (var i = 0; i < this.formRoutes.length; i++) {
      for (var n = 0; n < this.formRoutes[i].routes.length; n++) {
        console.log(this.formRoutes[i].routes[n].places.length)
        empty = empty && (this.formRoutes[i].routes[n].places.length < 1)
      }
    }
    if (empty) {
      this.navCtrl.popToRoot();
    }
  }

  openForm(point) {
    this.navCtrl.push(IndividualFormPage, {
      formData: this.formData,
      sections: this.formSections,
      point: point
    })
  }
}
