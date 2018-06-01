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
      modifyDomain: modifyDomain,
      setwebviewdomain: setwebviewdomain
    };
    funs[Request.params.name](Params, Request, Response);
  } else {
    Response.end('this is stub');
  }
}

/**
 * 设置小程序服务器域名
 * action	add添加, delete删除, set覆盖, get获取。当参数是get时不需要填四个域名字段
 * @param {Object} Request
 * @param {Object} Response
 */
async function modifyDomain(Params, Request, Response) {
  let appid = Params.appid;
  let action = Params.action;
  let requestdomain = new Array(),
    wsrequestdomain = new Array(),
    uploaddomain = new Array(),
    downloaddomain = new Array();
  requestdomain = Params.requestdomain.split(';');
  wsrequestdomain = Params.wsrequestdomain.split(';');
  uploaddomain = Params.uploaddomain.split(';');
  downloaddomain = Params.downloaddomain.split(';');
  let Token = await getAccessToken(appid);
  dLog.info('获取的 requestdomain[0] 为： %s ', requestdomain[0]);
  dLog.info('获取的 Token 为： %s ', Token);

  const apiUrl = baseurl + '/wxa/modify_domain?access_token=' + Token;

  const params = {
    action: action
  };

  if (action != 'get') {
    params['requestdomain'] = requestdomain;
    params['wsrequestdomain'] = wsrequestdomain;
    params['uploaddomain'] = uploaddomain;
    params['downloaddomain'] = downloaddomain;
  }
  dLog.info('获取的 params 为： %s ', JSON.stringify(params));

  request.post(
    { url: apiUrl, body: JSON.stringify(params) },
    (err, res, body) => {
      if (err) {
        logger.error(err);
        return false;
      }
      try {
        dLog.info('请求 modifyDomain 的结果 %s', body);
        // const obj = JSON.parse(body);
        Response.setHeader('Content-Type', 'application/json; charset=utf-8');
        Response.end(body);
      } catch (error) {
        logger.error('modifyDomain error: %s ', error);
        Response.end('modifyDomain error: ' + error);
      }
    }
  );
}

/**
 * 设置小程序业务域名
 * action	add添加, delete删除, set覆盖, get获取。当参数是get时不需要填四个域名字段
 * @param {Object} Request
 * @param {Object} Response
 */
async function setwebviewdomain(Params, Request, Response) {
  let appid = Params.appid;
  let action = Params.action;
  let webviewdomain = Params.webviewdomain.split(';');
  let Token = await getAccessToken(appid);
  dLog.info('获取的 Token 为： %s ', Token);

  const apiUrl = baseurl + '/wxa/setwebviewdomain?access_token=' + Token;

  const params = {
    action: action
  };

  if (action != 'get') {
    params['webviewdomain'] = webviewdomain;
  }

  request.post(
    { url: apiUrl, body: JSON.stringify(params) },
    (err, res, body) => {
      if (err) {
        logger.error(err);
        return false;
      }
      try {
        dLog.info('请求 modifyDomain 的结果 %s', body);
        // const obj = JSON.parse(body);
        Response.setHeader('Content-Type', 'application/json; charset=utf-8');
        Response.end(body);
      } catch (error) {
        logger.error('modifyDomain error: %s ', error);
        Response.end('modifyDomain error: ' + error);
      }
    }
  );
}

exports.index = run;
