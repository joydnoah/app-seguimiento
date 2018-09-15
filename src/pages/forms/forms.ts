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
  example_form: any[]=[
    {
      'form': '',
      'bodySection':  '',
      'inputType': 'text',
      'label': 'Some label 1',
      'help': '',
      'isRequired': '',
      'includeInFilters': '',
      'maxLength': '',
      'minLength': '',
      'maxValue': '',
      'minValue': '',
      'is12h': '',
      'selectType': '',
      'domain': '',
      'canTypeOther': '',
      'labelCanTypeOther': '',
      'yesText': '',
      'noText': '',
      'minStep': '',
      'maxStep': '',
      'stepValue': '',
      'editableLocation': '',
      'photoSource': '',
      'imageQuality': '',
      'newDomainName': '',
      'newDomainDescription': '',
      'newDomainOptions': '',
      'selectOptions': '',
    },
    {
      'form': '',
      'bodySection':  '',
      'inputType': 'textarea',
      'label': 'Some label 2',
      'help': '',
      'isRequired': '',
      'includeInFilters': '',
      'maxLength': '',
      'minLength': '',
      'maxValue': '',
      'minValue': '',
      'is12h': '',
      'selectType': '',
      'domain': '',
      'canTypeOther': '',
      'labelCanTypeOther': '',
      'yesText': '',
      'noText': '',
      'minStep': '',
      'maxStep': '',
      'stepValue': '',
      'editableLocation': '',
      'photoSource': '',
      'imageQuality': '',
      'newDomainName': '',
      'newDomainDescription': '',
      'newDomainOptions': '',
      'selectOptions': '',
    },
    {
      'form': '',
      'bodySection':  '',
      'inputType': 'geolocation',
      'label': 'Some label 3',
      'help': '',
      'isRequired': '',
      'includeInFilters': '',
      'maxLength': '',
      'minLength': '',
      'maxValue': '',
      'minValue': '',
      'is12h': '',
      'selectType': '',
      'domain': '',
      'canTypeOther': '',
      'labelCanTypeOther': '',
      'yesText': '',
      'noText': '',
      'minStep': '',
      'maxStep': '',
      'stepValue': '',
      'editableLocation': '',
      'photoSource': '',
      'imageQuality': '',
      'newDomainName': '',
      'newDomainDescription': '',
      'newDomainOptions': '',
      'selectOptions': '',
    }
  ];

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
    this.navCtrl.push(IndividualFormPage, {
      title: title,
      sections: sections
    })
  }

}
