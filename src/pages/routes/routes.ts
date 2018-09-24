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
  formTitle: string;
  formSections: any[]=[];
  formRoutes: any[]=[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.formRoutes = navParams.get("routes")
    this.formTitle = navParams.get("title")
    this.formSections = navParams.get("sections")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoutesPage');
  }
  openForm(point) {
    this.navCtrl.push(IndividualFormPage, {
      title: this.formTitle,
      sections: this.formSections,
      point: point
    })
  }
}
