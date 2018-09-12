import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  formSections: any[]=[];
  formAnswers: any[] = []

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.formTitle = navParams.get("title")
    this.formSections = navParams.get("sections")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndividualFormPage');
    for (var i =0; i < this.formSections.length; i++) {
      this.formAnswers.push(
        {'answer': ''}
      )
    }
  }

}
