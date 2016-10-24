import {bindable, bindingMode, decorators} from 'aurelia-framework';

export const DatePickerCustomElement = decorators(
    bindable({ name: 'date', defaultBindingMode: bindingMode.twoWay }),
    bindable({ name: 'ID', defaultBindingMode: bindingMode.oneTime }),
    bindable({ name: 'label', defaultBindingMode: bindingMode.oneTime })
).on(class {
    constructor() {

    }
    attached() {
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 3 // Creates a dropdown of 15 years to control year
        });
    }
});
