import moment from 'moment'
import {isNumeric} from '~js/helpers';

export default {
  NaN: value => (isNaN(value) ? 0 : value),
  per(value) {
    return isNumeric(value) ? value + '%' : value;
  },
  r0(value) {
    return isNumeric(value) ? value.round(0) : value;
  },
  r1(value) {
    return isNumeric(value) ? value.round(1) : value;
  },
  r2(value) {
    return isNumeric(value) ? value.round(2) : value;
  },
  myDate(value) {
    return moment(value).isValid() ? moment(value).format('DD.MM.YYYY') : '';
  },
  myDateTime(value) {
    return moment(value).isValid() ? moment(value).format('DD.MM.YYYY HH:mm') : '';
  },
  myInterval(value) {
    value = Math.round(value);

    let data     = {};
    data.days    = Math.floor(Math.floor(value / 60) / 24);
    data.hours   = Math.floor((value) / 60) - data.days * 24;
    data.minutes = value - (data.hours + data.days * 24) * 60;
    let result   = '';
    if (data.days && data.days > 0) {
      result += data.days + ' сут';
    }
    if (data.hours && data.hours > 0) {
      result = result + ((result.length > 0) ? ' ' : '') + data.hours + ' час';
    }
    if (data.minutes && data.minutes > 0) {
      result = result + ((result.length > 0) ? ' ' : '') + data.minutes + ' мин';
    }
    return result;
  },
};