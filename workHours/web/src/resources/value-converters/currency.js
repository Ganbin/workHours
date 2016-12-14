import numeral from 'numeral';

export class CurrencyValueConverter {
    toView(value, currency) {
        currency = currency || 'CHF';
        return currency + ' ' + numeral(value).format('(0,0.00)');
    }

  // fromView(value) {
  //
  // }
}
