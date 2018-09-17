import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormsPage } from '../forms/forms';
import { HomePage } from '../home/home';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';

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
    public http: HttpProvider
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

}
