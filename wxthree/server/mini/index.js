const {
  getParams,
  dLog,
  logger,
  baseurl,
  getAccessToken,
  getComponentAccessToken
} = require('../main.js');

const request = require('request');
const querystring = require('querystring');

function run(Request, Response) {
  const Params = getParams(Request);
  if (Request.params && Request.params.name) {
    let funs = {
      wxamplinkget: wxamplinkget,
      wxamplink: wxamplink,
      wxampunlink: wxampunlink
    };
    funs[Request.params.name](Params, Request, Response);
  } else {
    Response.end('this is stub');
  }
}

/**
 * 小程序管理权限集
 * status：关联状态
 * 1：已关联；
 * 2：等待小程序管理员确认中；
 * 3：小程序管理员拒绝关联
 * 12：等到公众号管理员确认中；
 * @param {Object} Request
 * @param {Object} Response
 */
async function wxamplinkget(Params, Request, Response) {
  //测试：wx0f7ca8bfb9e0c8ec
  //生活：wxb85a1c9c779f53d6
  let Token = await getAccessToken('wx0f7ca8bfb9e0c8ec');
  dLog.info('获取的 Token 为： %s ', Token);

  const params = {};
  const apiUrl = baseurl + '/cgi-bin/wxopen/wxamplinkget?access_token=' + Token;

  request.post(
    { url: apiUrl, body: JSON.stringify(params) },
    (err, res, body) => {
      if (err) {
        logger.error(err);
        return false;
      }
      try {
        dLog.info('请求 wxamplinkget 的结果 %s', body);
        // const obj = JSON.parse(body);
        Response.setHeader('Content-Type', 'application/json; charset=utf-8');
        Response.end(body);
      } catch (error) {
        logger.error('wxamplinkget error: %s ', error);
        Response.end('wxamplinkget error: ' + error);
      }
    }
  );
}

/**
 * 关联小程序
 * 关联流程（需要公众号和小程序管理员双方确认）：
 * 1.第三方平台调用接口发起关联
 * 2 公众号管理员收到模板消息，同意关联小程序。
 * 3.小程序管理员收到模板消息，同意关联公众号。
 * 4.关联成功
 * @param {Object} Request
 * @param {Object} Response
 */
async function wxamplink(Params, Request, Response) {
  let gappid = Params.gappid;
  let mappid = Params.mappid;
  let Token = await getAccessToken(gappid);
  dLog.info('获取的 Token 为： %s ', Token);

  const params = {
    appid: mappid,
    notify_users: '1',
    show_profile: '1'
  };
  const apiUrl = baseurl + '/cgi-bin/wxopen/wxamplink?access_token=' + Token;

  request.post(
    { url: apiUrl, body: JSON.stringify(params) },
    (err, res, body) => {
      if (err) {
        logger.error(err);
        return false;
      }
      try {
        dLog.info('请求 wxamplink 的结果 %s', body);
        // const obj = JSON.parse(body);
        Response.setHeader('Content-Type', 'application/json; charset=utf-8');
        Response.end(body);
      } catch (error) {
        logger.error('wxamplink error: %s ', error);
        Response.end('wxamplink error: ' + error);
      }
    }
  );
}

/**
 * 解除已关联的小程序
 * @param {Object} Request
 * @param {Object} Response
 */
async function wxampunlink(Params, Request, Response) {
  let Token = await getAccessToken('wx0f7ca8bfb9e0c8ec');
  dLog.info('获取的 Token 为： %s ', Token);
  let appid = Params.appid;

  const params = {
    appid: appid
  };
  const apiUrl = baseurl + '/cgi-bin/wxopen/wxampunlink?access_token' + Token;

  request.post(
    { url: apiUrl, body: JSON.stringify(params) },
    (err, res, body) => {
      if (err) {
        logger.error(err);
        return false;
      }
      try {
        dLog.info('请求 wxamplink 的结果 %s', body);
        // const obj = JSON.parse(body);
        Response.setHeader('Content-Type', 'application/json; charset=utf-8');
        Response.end(body);
      } catch (error) {
        logger.error('wxamplink error: %s ', error);
        Response.end('wxamplink error: ' + error);
      }
    }
  );
}

exports.index = run;
