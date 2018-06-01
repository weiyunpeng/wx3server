var MAIN = require('./main');
// 路由注册
function router_reg(app) {
    app.all('/api/demo/:name', require('./demo/index').index);
    app.all('/api/mini/:name', require('./mini/index').index);
    app.all('/api/template/:name', require('./mini/template').index);
    app.all('/api/wxa/:name', require('./mini/wxa').index);
    app.all('/api/domain/:name', require('./mini/domain').index);
}

module.exports = function(app) {
  router_reg(app);
};
