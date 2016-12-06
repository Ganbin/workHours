import { inlineView, inject } from 'aurelia-framework';

@inlineView('<template><span></span></template>')
@inject(Element)
export class NoViewPort {
  constructor(element) {
    this.element = element;
  }

  attached() {
     // debugger;
    //this.element.classList.add('aurelia-hide');
  }

  detached() {
    //this.element.classList.remove('aurelia-hide');
  }
}
