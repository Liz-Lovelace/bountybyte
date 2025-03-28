import { rpc } from './rpc.js';

export function createApiThunk(name, method, defaultArgs = {}) {
  let thunk = (args) => async (dispatch) => {
    dispatch({ type: `${name}/begin`, meta: { args }})
    const { responseType, data } = await rpc(method, { ...defaultArgs, ...args })
    assertValidResponseType(responseType)
    dispatch({ type: `${name}/${responseType}`, payload: data, meta: { args }})
    dispatch({ type: `${name}/end`, meta: { args }})
    return { responseType, data }
  }

  thunk.begin = `${name}/begin`
  thunk.happyPath = `${name}/happyPathResponse`
  thunk.validation = `${name}/validationResponse`
  thunk.catastrophicError = `${name}/catastrophicError`
  thunk.end = `${name}/end`

  return thunk
}

function assertValidResponseType(responseType) {
  if (![
    'happyPathResponse',
    'validationResponse',
    'catastrophicError',
  ].includes(responseType)) {
    throw new Error(`Unknown response type: ${responseType}`)
  }
}