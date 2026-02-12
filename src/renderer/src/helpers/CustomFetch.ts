/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomFetch = async (
  url: string,
  method?: string,
  data?: any,
  isXendit?: boolean,
  isUpload?: boolean,
  changePreviousController?: any
): Promise<Response> => {
  const headers = {
    Accept: '',
    'Content-Type': ''
  }
  // Setup header khusus kalau isXendit
  if (isXendit) {
    const encodedApiKey = btoa(import.meta.env.VITE_BASIC_API_KEY)
    headers['api-version'] = '2022-07-31'
    headers['Authorization'] = 'Basic ' + encodedApiKey
  }
  // console.log(headers)
  const controller = new AbortController()
  const signal = controller.signal
  changePreviousController && changePreviousController(controller)

  if (isUpload) {
    headers['Accept'] = 'multipart/form-data'
    // headers['Content-Type'] = 'application/x-www-form-urlencoded';
  } else {
    headers['Accept'] = 'application/json; charset=utf-8'
    headers['Content-Type'] = 'application/json; charset=utf-8'
  }

  try {
    const base_url = isXendit ? import.meta.env.VITE_XENDIT_API_URL : import.meta.env.VITE_BASE_URL
    const response = await fetch(base_url + url, {
      method: method,
      body: isUpload ? data : method !== 'GET' ? JSON.stringify(data) : undefined,
      mode: 'cors',
      headers,
      signal: changePreviousController ? signal : null
    })

    switch (response.status) {
      case 500:
        console.error(response)
        throw `${response.status}: ${response.statusText}`

      case 404:
        console.error(response)
        throw `${response.status}: ${response.statusText}`

      case 403:
        console.error(response)
        throw `${response.status}: ${response.statusText}`

      case 401:
        console.error(response)
        throw `${response.status}: ${response.statusText}`

      case 400:
        console.error(response)
        return response

      default:
        return response
    }
  } catch (err) {
    console.log('err', err)
    throw err
  }
}

export default CustomFetch
