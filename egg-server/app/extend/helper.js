module.exports = {
  to(promise) {
    return promise.then(function(){
      return [null, ...arguments];
    }).catch(err => {
      return [err, null];
    })
  },
  response(errno, data, msg) {
    return {
      errno,
      data,
      msg
    }
  }
}
