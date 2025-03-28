import { isValidationObjectValid } from './validationUtils.js';
import * as authentication from '../modules/authentication.js';

export const SET_COOKIE_SYMBOL = Symbol('SET_COOKIE');

export function happyPathResponse(responseData) {
  return {
    responseType: 'happyPathResponse',
    data: responseData,
  }
}

export function validationResponse(validationData) {
  if (!isValidationObjectValid(validationData)) {
    return catastrophicError('Malformed validation response');
  }

  return {
    responseType: 'validationResponse',
    data: validationData,
  }
}

export class ErrorText extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorText';
  }
}

export function cookieResponse(cookie) {
  return {
    [SET_COOKIE_SYMBOL]: cookie,
  };
}

export function callerIdFromCookies(cookies) {
  if (!cookies) {
    return null;
  }
  return authentication.callerIdFromJWT(cookies['bountybyte-auth']);
}

export function assert(condition, errorMessage) {
  if (!condition) {
    throw new ErrorText(errorMessage);
  }
}

export function catastrophicError(errorMessage) {
  return {
    responseType: 'catastrophicError',
    data: errorMessage,
  }
}