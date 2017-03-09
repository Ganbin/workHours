import {bindable, bindingMode, observable} from 'aurelia-framework';
export class colorSwitcher {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) @observable primaryColor;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) @observable accentColor;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) @observable errorColor;
  @bindable select;

  storage = {};

  constructor() {

  }

  attached() {
    if (localStorage.getItem('colors') != null) {
      const colors = JSON.parse(localStorage.getItem('colors'));

      if (colors.primaryColor != null) {
        this.primaryColor = colors.primaryColor;
      }
      if (colors.accentColor != null) {
        this.accentColor = colors.accentColor;
      }
      if (colors.errorColor != null) {
        this.errorColor = colors.errorColor;
      }
    }
  }

  primaryColorChanged(newValue, oldValue) {
    if (oldValue != null) {
      this.storage.primaryColor = newValue;
      localStorage.setItem('colors', JSON.stringify(this.storage));
    }
  }
  accentColorChanged(newValue, oldValue) {
    if (oldValue != null) {
      this.storage.accentColor = newValue;
      localStorage.setItem('colors', JSON.stringify(this.storage));
    }
  }
  errorColorChanged(newValue, oldValue) {
    if (oldValue != null) {
      this.storage.errorColor = newValue;
      localStorage.setItem('colors', JSON.stringify(this.storage));
    }
  }
}
