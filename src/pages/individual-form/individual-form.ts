import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  formSectionsControllers: any[]=[];
  formAnswers: any[] = [];
  validations: any[];
  submitAttempt: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder
  ) {
    this.formTitle = navParams.get("title")
    this.formSections = navParams.get("sections")
    for (var n=0; n < this.formSections.length; n++) {
      this.formSectionsControllers.push({
        controller: null,
        inputs: this.formSections[n].inputs
      })
    }
    for (var n = 0; n < this.formSectionsControllers.length; n++) {
      var formSchema = {}
      for (var i = 0; i < this.formSectionsControllers[n].inputs.length; i++) {
        this.validations = ['']
        if (this.formSectionsControllers[n].inputs[i].inputType === 'text' || this.formSectionsControllers[n].inputs[i].inputType === 'textarea' || this.formSectionsControllers[n].inputs[i].inputType === 'e-mail') {
          this.validations.push(this.createTextValidatorCompose(this.formSectionsControllers[n].inputs[i]))
        }
        if (this.formSectionsControllers[n].inputs[i].inputType === 'number' || this.formSectionsControllers[n].inputs[i].inputType === 'money' || this.formSectionsControllers[n].inputs[i].inputType === 'cellphone') {
          this.validations.push(this.createNumberValidatorCompose(this.formSectionsControllers[n].inputs[i]))
        }
        if (this.formSectionsControllers[n].inputs[i].inputType === 'only-one' || this.formSectionsControllers[n].inputs[i].inputType === 'yes-no' || this.formSectionsControllers[n].inputs[i].inputType === 'gender' || this.formSectionsControllers[n].inputs[i].inputType === 'ranking') {
          this.validations.push(this.createRequiredValidatorCompose(this.formSectionsControllers[n].inputs[i]))
        }
        var controlName = 'control' + this.formSectionsControllers[n].inputs[i].id
        formSchema[controlName] = this.validations
      }
      this.formSectionsControllers[n].controller = formBuilder.group(formSchema);
    }
  }

  createTextValidatorCompose(input) {
    var validation_compose = []
    if (input.isRequired) {
      validation_compose.push(Validators.required)
    }
    if (input.minLength !== null) {
      validation_compose.push(Validators.minLength(input.minLength))
    }
    if (input.maxLength !== null) {
      validation_compose.push(Validators.maxLength(input.maxLength))
    }
    return validation_compose
  }

  createNumberValidatorCompose(input) {
    var validation_compose = []
    if (input.isRequired) {
      validation_compose.push(Validators.required)
    }
    if (input.minValue !== null) {
      validation_compose.push(Validators.min(input.minValue))
    }
    if (input.maxValue !== null) {
      validation_compose.push(Validators.max(input.maxValue))
    }
    return validation_compose
  }

  createRequiredValidatorCompose(input) {
    var validation_compose = []
    if (input.isRequired) {
      validation_compose.push(Validators.required)
    }
    return validation_compose
  }

  ionViewDidLoad() {
    this.submitAttempt = false;
    console.log('ionViewDidLoad IndividualFormPage');
  }

  save(){
    var validation = true;
    this.submitAttempt = true;
    for (var n = 0; n < this.formSectionsControllers.length; n++) {
      validation = validation && this.formSectionsControllers[n].controller.valid
    }
    if(!validation){
        console.log("fail")
    }
    else {
        console.log("success!")
    }
  }

}
