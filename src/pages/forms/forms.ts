import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { IndividualFormPage } from '../individual-form/individual-form';

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
  openForm(title, sections) {
    var inputs = []
    if (sections.length > 0) {
      inputs = sections[0].inputs
    }
    this.navCtrl.push(IndividualFormPage, {
      title: title,
      inputs: inputs
    })
  }

}
