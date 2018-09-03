window.$ = window.jQuery = require('jquery');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/widgets/button');
require('jquery-datetimepicker');
require('jquery-ui/ui/widgets/autocomplete');
$.datetimepicker.setLocale('ru');

Object.defineProperty(Array.prototype, 'last', {
  enumerable: false,
  value: function () { return this[this.length - 1]; }
});

Object.defineProperty(Array.prototype, 'first', {
  enumerable: false,
  value: function () { return this[0]; }
});

Number.prototype.round = function (places) {
  places = Math.pow(10, places);
  return Math.round(this * places) / places;
};