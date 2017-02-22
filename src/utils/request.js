import { stringify } from 'qs'
// import { formData } from 'lodash'

// const encodeFormData = values => {
//   const formData = new FormData();
//
//   forEach(values, (value, key) => formData.append(key, value))
//
//   return formData
// }

export default ({
  method,
  url,
  headers,
  query,
  data,
}) => {
  const finalUrl = query ? `${url}?${stringify(query)}` : url

  const options = {
    method: method || 'GET',
    headers: { ...headers },
  }

  if (typeof data === 'object') {
    options.body = stringify(data)
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  return fetch(finalUrl, options).then(response => (
    response.ok ? response : Promise.reject(response)),
  )
}
