export async function rpc(method, args = {}) {
  try {
    const response = await fetch('/rpc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        method,
        args,
      }),
    });

    let result = await response.json();

    if (!response.ok) {
      let data = `Something went wrong. Error code ${response.status}`
      if (result.responseType == 'catastrophicError') {
        data = result.data
      }
      return {
        responseType: 'catastrophicError',
        data: data
      }
    }

    return result;
  } catch (error) {
    return {
      data: 'Something went very wrong',
      responseType: 'catastrophicError',
    }
  }
}