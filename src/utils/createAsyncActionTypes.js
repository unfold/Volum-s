export default type => ({
  requestType: `${type}`,
  successType: `${type}_SUCCESS`,
  failureType: `${type}_FAILURE`,
})
