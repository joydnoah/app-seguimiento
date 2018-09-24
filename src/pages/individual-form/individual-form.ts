import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GlobalProvider } from '../../providers/global/global';
import { HttpProvider } from '../../providers/http/http';
import { DomSanitizer } from '@angular/platform-browser';

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
  point: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    public global: GlobalProvider,
    public http: HttpProvider,
    private camera: Camera,
    private DomSanitizer: DomSanitizer
  ) {
    this.formTitle = navParams.get("title")
    this.formSections = navParams.get("sections")
    this.point = navParams.get("point")
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
        if (
          this.formSectionsControllers[n].inputs[i].inputType === 'only-one' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'yes-no' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'gender' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'ranking' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'photo' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'geolocation' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'address' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'hour' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'date-hour' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'date') {
          this.validations.push(this.createRequiredValidatorCompose(this.formSectionsControllers[n].inputs[i]))
        }
        var controlName = 'control' + this.formSectionsControllers[n].inputs[i].id
        formSchema[controlName] = this.validations
      }
      this.formSectionsControllers[n].controller = formBuilder.group(formSchema);
    }
    for (var n = 0; n < this.formSectionsControllers.length; n++) {
      for (var i = 0; i < this.formSectionsControllers[n].inputs.length; i++) {
        if (this.formSectionsControllers[n].inputs[i].inputType === 'geolocation') {
          if (this.global.coordinates !== undefined) {
            this.formSectionsControllers[n].controller.controls['control' + this.formSectionsControllers[n].inputs[i].id].value = this.global.coordinates.latitude + " , " + this.global.coordinates.longitude
          } else {
            this.formSectionsControllers[n].controller.controls['control' + this.formSectionsControllers[n].inputs[i].id].value = "No GPS"
          }
        }
      }
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

  alertModal(tittle, msg, button) {
    let alert = this.alertCtrl.create({
      title: tittle,
      message: msg,
      buttons: [button]
    });
    alert.present();
  }

  formatAnswers() {
    for (var n=0; n < this.formSections.length; n++) {
      for (var i=0; i < this.formSections[n].inputs.length; i++) {
        this.formSections[n].inputs[i].answer = this.formSectionsControllers[n].controller.controls['control' + this.formSectionsControllers[n].inputs[i].id].value
      }
    }
  }

  cameraButton(variable, sourceType) {
    let options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(imageData => {
      variable.value = 'data:image/jpeg;base64,' + imageData;
    })
  }

  addStreet(e, input, variable){
    variable.street = e.toString()
    this.validateSetAddress(input, variable)
  }
  addNumber(e, input, variable){
    variable.number = e._value
    this.validateSetAddress(input, variable)
  }
  validateSetAddress(input, variable) {
    if (variable.street == undefined) {
      variable.street = ""
    }
    if (variable.number == undefined) {
      variable.number = ""
    }
    variable.value = variable.street + " " + variable.number
    if (input.isRequired || true) {
      if (variable.value == " ") {
        variable.status = 'INVALID'
      } else {
        variable.status = 'INVALID'
      }
    }
  }
  save(){
    var validation = true;
    this.submitAttempt = true;
    for (var n = 0; n < this.formSectionsControllers.length; n++) {
      validation = validation && this.formSectionsControllers[n].controller.valid
    }
    if(!validation){
        console.log("fail")
        this.alertModal('Not valid form', 'some inputs may be wrong, plese verify them and try again.', 'Dismiss')
    }
    else {
        console.log("success!")
        this.formatAnswers()
        this.http.postForm(this.point, this.formSections)
        .then(data => {
          this.alertModal('Success', 'The form was sent successfully.', 'Dismiss')
        })
        .catch(error => {
          this.alertModal('Error', error.message, 'Dismiss')
        });
    }
  }

}
