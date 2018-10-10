import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {
  logedIn: boolean = false;
  forms: any[] = [];
  cacheForms: any[] = [];
  completedForms: any[] = [];
  coordinates: any;
  operating_system: string;
  serial: string;
  batterylevel: any='No battery';
  date: any;
  pendingForms: any;

  constructor(
    private nativeStorage: NativeStorage
  ) {}

  setForms () {
    this.forms = []
    for (var i = 0; i < this.cacheForms.length; i++) {
      var completed = false
      if (this.cacheForms[i].routeGroups !== undefined) {
        for (var n = 0; n < this.completedForms.length; n++) {
          if (this.completedForms[n].formId == this.cacheForms[i].routeGroups[0].routes[0].id) {
            if (this.cacheForms[i].routeGroups[0].routes[0].places.length < 1) {
              completed = completed || (this.cacheForms[i].routeGroups[0].routes[0].places.length < 1)
            } else {
              var places = []
              for (var j = 0; j < this.cacheForms[i].routeGroups[0].routes[0].places.length; j++) {
                var id = this.cacheForms[i].routeGroups[0].routes[0].places[j].id
                var found = this.completedForms[n].pointId.find(function(element) {
                  return element == id;
                });
                if (!found) {
                  places.push(this.cacheForms[i].routeGroups[0].routes[0].places[j])
                }
              }
              if (places.length < 1) {
                completed = true
              }
              this.cacheForms[i].routeGroups[0].routes[0].places = places
            }
          }
        }
      } else {
        for (var n = 0; n < this.cacheForms.length; n++) {
          if ((n !== i) && (this.cacheForms[i].id === this.cacheForms[n].id)) {
              completed = true
          }
        }
      }
      if (!completed) {
        this.forms.push(this.cacheForms[i])
      }
    }
  }
  saveCompletedFormData () {
    console.log('completed Form Data')
    this.nativeStorage.setItem('completedForms', this.completedForms)
  }
  savePendingForms() {
    this.nativeStorage.setItem('pendingForms', this.pendingForms)
  }
}
