module.exports = {
  to(promise) {
    return promise.then(function(){
      return [null, ...arguments];
    }).catch(err => {
      return [err, null];
    })
  }
}
