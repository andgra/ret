import moment from "moment";
import {getInObj, isObject} from "~js/helpers";

export default {
  getIntervalString(mins) {
    let data     = {};
    data.days    = Math.floor(Math.floor(mins / 60) / 24);
    data.hours   = Math.floor((mins) / 60) - data.days * 24;
    data.minutes = mins - (data.hours + data.days * 24) * 60;
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
  getInterval(d1, d2) {
    d1 = moment(d1);
    d2 = moment(d2);
    return d1.diff(d2, 'minutes');
  },
  getValue({row, path, cols}) {
    let value   = getInObj(row, path);
    let options = cols.filter(item => {return item.id && item.id === path}).first();
    if (options) {
      value = value === undefined && options.default !== undefined ? options.default : value;
      if (options.type === 'interval') {
        value = this.getIntervalString(value)
      } else if (options.type === 'datetime' || options.type === 'date' || options.type === 'time') {
        if (value) {
          value = moment(value);
          let isDate = options.type.indexOf('date') !== -1;
          let isTime = options.type.indexOf('time') !== -1;
          let format = (isDate ? 'DD.MM.YYYY' : '') + (isDate && isTime ? ' ' : '') + (isTime ? 'HH:mm' : '');
          value = value.isValid() ? value.format(format) : '';
        }

      } else if (options.cb) {
        value = options.cb(value, row);
      }

      if (options.format) {
        value = options.format(value);
      }
    }
    return value;
  },
  getValueToInput({row, path, cols}) {
    let value   = getInObj(row, path);
    let options = cols.filter(item => {return item.id && item.id === path}).first();
    if (options) {
      if (options.cb) {
        value = options.cb(value, row);
      }

      if (options.format) {
        value = options.format(value);
      }
    }
    return value;
  },
  formattedTitle(title) {
    return title.replace(/\<br\>/, ' ').replace('\s+', ' ');
  },
}