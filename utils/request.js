import { stringify } from 'qs'

export default ({
  url,
  query,
  method,
}) => {
  const finalUrl = query ? `${url}?${stringify(query)}` : url
  const options = {
    method: method || 'GET',
  }

  fetch(finalUrl, options).then(response => (
    response.ok ? response : Promise.reject(response))
  )
}
