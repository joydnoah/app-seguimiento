import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { RoutesPage } from '../../pages/routes/routes';

/**
 * Generated class for the FormsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forms',
  templateUrl: 'forms.html',
})
export class FormsPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormsPage');
  }
  openForm(title, sections, routes) {
    this.navCtrl.push(RoutesPage, {
      title: title,
      sections: sections,
      routes: routes
    })
  }

}
