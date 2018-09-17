import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the IndividualFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-individual-form',
  templateUrl: 'individual-form.html',
})
export class IndividualFormPage {
  formTitle: string;
  formInputs: any[]=[];
  formAnswers: any[] = []

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.formTitle = navParams.get("title")
    this.formInputs = navParams.get("inputs")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndividualFormPage');
  }

}
