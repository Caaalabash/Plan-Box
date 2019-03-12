module.exports = app => {
  app.router.prefix('/api/plan-box')
  require('./router/sprint')(app)
  require('./router/task')(app)
  require('./router/issue')(app)
  require('./router/oauth')(app)
};
