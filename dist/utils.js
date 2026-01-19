"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTestId = exports.secondsToHms = void 0;
const secondsToHms = (d) => {
    const days = Math.floor(d / 86400);
    const hours = Math.floor((d % 86400) / 3600);
    const minutes = Math.floor((d % 3600) / 60);
    const seconds = Math.floor((d % 3600) % 60);
    const dDisplay = days > 0 ? days.toString() + (days === 1 ? ' day, ' : ' days, ') : '';
    const hDisplay = hours > 0 ? hours.toString() + (hours === 1 ? ' hour, ' : ' hours, ') : '';
    const mDisplay = minutes > 0
        ? minutes.toString() + (minutes === 1 ? ' minute, ' : ' minutes, ')
        : '';
    const sDisplay = seconds > 0
        ? seconds.toString() + (seconds === 1 ? ' second' : ' seconds')
        : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
};
exports.secondsToHms = secondsToHms;
const makeTestId = id => id;
exports.makeTestId = makeTestId;
// process.env.REACT_APP_CI != null
//   ? id
//   : Math.random()
//     .toString(36)
//     .substr(2, 9)
