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
  formData: any;
  formSections: any[]=[];
  formSectionsControllers: any[]=[];
  formAnswers: any[] = [];
  validations: any[];
  submitAttempt: boolean;
  point: any;
  streets: string[]=[
    "Calle",
    "Carrera",
    "Transversal",
    "Diagonal",
    "Avenida"
  ]

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
    this.formData = navParams.get("formData")
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
          this.formSectionsControllers[n].inputs[i].inputType === 'multiple' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'yes-no' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'gender' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'ranking' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'geolocation' ||
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
        this.formSections[n].inputs[i].invalid = false
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

  alertModal(tittle, msg, button, goBack) {
    let alert = this.alertCtrl.create({
      title: tittle,
      message: msg,
      buttons: [{
        text: button,
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          if (goBack) {
            this.goback()
          }
        }
      }]
    });
    alert.present();
  }

  formatAnswers() {
    for (var n=0; n < this.formSections.length; n++) {
      for (var i=0; i < this.formSections[n].inputs.length; i++) {
        if (!(this.formSectionsControllers[n].inputs[i].inputType === 'address' ||
          this.formSectionsControllers[n].inputs[i].inputType === 'photo')) {
            this.formSections[n].inputs[i].answer = JSON.stringify(this.formSectionsControllers[n].controller.controls['control' + this.formSectionsControllers[n].inputs[i].id].value)
          }
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
      variable.answer = 'data:image/jpeg;base64,' + imageData;
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

  setStreet (input, event, value) {
    if (value == "street_name") {
      input[value] = event
    } else {
      input[value] = event._value
    }
    input.answer = input.street_name + " " + input.street + " #" + input.number1 + " " + input.number2
  }

  validateExtraInputs() {
    console.log("VALIDATE EXTRA")
    var validation = true;
    for (var n=0; n < this.formSections.length; n++) {
      for (var i=0; i < this.formSections[n].inputs.length; i++) {
        if (this.formSectionsControllers[n].inputs[i].inputType === 'photo') {
            if (this.formSectionsControllers[n].inputs[i].isRequired) {
              if (this.formSectionsControllers[n].inputs[i].answer == '' ||
              this.formSectionsControllers[n].inputs[i].answer == null ||
              this.formSectionsControllers[n].inputs[i].answer == undefined) {
                this.formSections[n].inputs[i].invalid = true
                validation = validation && false
              }
            }
        }
        if (this.formSectionsControllers[n].inputs[i].inputType === 'address') {
            if (this.formSectionsControllers[n].inputs[i].isRequired) {
              if (this.formSectionsControllers[n].inputs[i].answer == '' ||
              this.formSectionsControllers[n].inputs[i].answer == null ||
              this.formSectionsControllers[n].inputs[i].answer == undefined ||
              this.formSectionsControllers[n].inputs[i].street_name == undefined ||
              this.formSectionsControllers[n].inputs[i].street == undefined ||
              this.formSectionsControllers[n].inputs[i].number1 == undefined ||
              this.formSectionsControllers[n].inputs[i].number2 == undefined) {
                this.formSections[n].inputs[i].invalid = true
                validation = validation && false
              }
            } else {
              var testUndefined = function(element) {
                return element === undefined;
              };
              var toTest = [
                this.formSectionsControllers[n].inputs[i].street_name,
                this.formSectionsControllers[n].inputs[i].street,
                this.formSectionsControllers[n].inputs[i].number1,
                this.formSectionsControllers[n].inputs[i].number2
              ]
              if (!toTest.every(testUndefined) && toTest.some(testUndefined)) {
                this.formSections[n].inputs[i].invalid = true
                validation = validation && false
              }
            }
        }
      }
    }
    console.log(validation)
    return validation
  }
  validateNormalInputs() {
    console.log("VALIDATE NORMAL")
    var validation = true;
    for (var n = 0; n < this.formSectionsControllers.length; n++) {
      validation = validation && this.formSectionsControllers[n].controller.valid
    }
    return validation
  }
  setCompletedFormData() {
    var alreadyOnList = false;
    for (var i = 0; i < this.global.completedForms.length; i++) {
      if (this.global.completedForms[i].formId == this.formData.routeGroups[0].routes[0].id) {
        this.global.completedForms[i].pointId.push(
          this.point.id
        )
        alreadyOnList = alreadyOnList || true
      }
    }
    if (!alreadyOnList) {
      this.global.completedForms.push(
        {
          formId: this.formData.routeGroups[0].routes[0].id,
          pointId: [this.point.id]
        }
      )
    }
  }
  save(){
    this.submitAttempt = true;
    var validation = true;
    validation = this.validateNormalInputs() && true && validation
    validation = this.validateExtraInputs() && true && validation
    if(!validation){
        console.log("fail")
        this.alertModal('Formulario invalido', 'Algunos campos pueden estar mal, por favor verifíquelos e intente de nuevo.', 'Cerrar', false)
    }
    else {
        console.log("success!")
        this.formatAnswers()
        let celData = {
          date: new Date(),
          battery: this.global.batterylevel,
          serial: this.global.serial,
          OS: this.global.operating_system,
          geo:
          {
            lat: '0',
            lon: '0'
          }
        }
        if (this.global.coordinates !== undefined) {
          celData.geo.lat = this.global.coordinates.latitude
          celData.geo.lon = this.global.coordinates.longitude
        }
        this.http.postForm(this.point, celData, this.formSections)
        .then(data => {
          if (this.formData.routeGroups !== undefined) {
            this.setCompletedFormData()
            this.global.saveCompletedFormData()
            this.global.setForms()
          }
          this.alertModal('Exito', 'El formulario ha sido enviado con éxito.', 'Cerrar', true)
        })
        .catch(error => {
          console.log(error)
          console.log(error.error)
          this.global.pendingForms.push({
            place: this.point,
            celData: celData,
            formJSON: this.formSections
          })
          this.setCompletedFormData()
          this.global.saveCompletedFormData()
          this.global.setForms()
          this.global.savePendingForms()
          this.alertModal('Error', error.message, 'Cerrar', true)
        });
    }
  }
  goback() {
    this.navCtrl.pop();
    console.log('Click on button Test Console Log');
  }
}
