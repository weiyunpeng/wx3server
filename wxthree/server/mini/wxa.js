const {
  getParams,
  dLog,
  logger,
  baseurl,
  getAccessToken,
  getComponentAccessToken
} = require('../main.js');
const fs = require('fs');

const request = require('request');
const rp = require('request-promise');
const querystring = require('querystring');

function run(Request, Response) {
  const Params = getParams(Request);
  if (Request.params && Request.params.name) {
    let funs = {
      commit: commit,
      getQrcode: getQrcode,
      getCategory: getCategory,
      submitAudit: submitAudit,
      getPage: getPage
    };
    funs[Request.params.name](Params, Request, Response);
  } else {
    Response.end('this is stub');
  }
}

/**
 * 为授权的小程序帐号上传小程序代码
 * @param {Object} Request
 * @param {Object} Response
 */
async function commit(Params, Request, Response) {
  //测试：wx0f7ca8bfb9e0c8ec
  //生活：wxb85a1c9c779f53d6
  let appid = Params.appid;
  let Token = await getAccessToken(appid);
  dLog.info('获取的 Token 为： %s ', Token);

  let template_id = Params.template_id;
  let extJson = {
    extEnable: true,
    extAppid: 'wx3d0ed865a378ffeb',
    directCommit: false,
    ext: {
      name: 'text',
      attr: {
        host: 'tshttps.qqdayu.com',
        users: ['user_1', 'user_2']
      }
    },
    extPages: {},
    window: {
      navigationBarBackgroundColor: '#69c3aa',
      navigationBarTextStyle: 'white',
      navigationBarTitleText: '景区小程序',
      navigationStyle: 'default',
      backgroundColor: '#69c3aa',
      enablePullDownRefresh: true,
      backgroundTextStyle: 'light'
    },
    networkTimeout: {
      request: 10000,
      connectSocket: 10000,
      uploadFile: 10000,
      downloadFile: 10000
    }
  };

  const params = {
    template_id: template_id,
    ext_json: JSON.stringify(extJson), //*ext_json需为string类型，请参考下面的格式*
    user_version: 'V1.0',
    user_desc: 'test'
  };
  const apiUrl = baseurl + '/wxa/commit?access_token=' + Token;

  request.post(
    { url: apiUrl, body: JSON.stringify(params) },
    (err, res, body) => {
      if (err) {
        logger.error(err);
        return false;
      }
      try {
        dLog.info('请求 commit 的结果 %s', body);
        // const obj = JSON.parse(body);
        Response.setHeader('Content-Type', 'application/json; charset=utf-8');
        Response.end(body);
      } catch (error) {
        logger.error('commit error: %s ', error);
        Response.end('commit error: ' + error);
      }
    }
  );
}

/**
 * 获取体验小程序的体验二维码
 * @param {Object} Request
 * @param {Object} Response
 */
async function getQrcode(Params, Request, Response) {
  let appid = Params.appid;
  let Token = await getAccessToken(appid);
  dLog.info('获取的 Token 为： %s ', Token);

  const apiUrl = baseurl + '/wxa/get_qrcode?access_token=' + Token;
  const filePath = 'QRCode.jpeg';

  //   request.get(apiUrl).pipe(fs.createWriteStream(filePath));
  Response.writeHead(200, { 'Content-Type': 'image/jpeg' });
  request.get(apiUrl).pipe(Response);
}

/**
 * 将第三方提交的代码包提交审核
 * @param {Object} Request
 * @param {Object} Response
 */
async function submitAudit(Params, Request, Response) {
  let appid = Params.appid;
  let Token = await getAccessToken(appid);
  dLog.info('获取的 Token 为： %s ', Token);

  let item_list = [
    {
      address: 'pages/index/main',
      tag: '出行与交通',
      first_class: '停车',
      second_class: '停车',
      first_id: 110,
      second_id: 125,
      third_id: 126,
      title: '首页'
    }
  ];
  let getPage = await rp.get(baseurl + '/wxa/get_page?access_token=' + Token);
  const address = JSON.parse(getPage);
  dLog.info('获取的 address 为： %s ', JSON.stringify(address));
  dLog.info('获取的 page_list 为： %s ', address.page_list);

  const params = {
    item_list: item_list,
    address: address.page_list,
    tag: '出行与交通',
    first_class: '停车',
    second_class: '停车',
    first_id: 110,
    second_id: 125,
    third_id: 126
  };
  const apiUrl = baseurl + '/wxa/submit_audit?access_token=' + Token;

  request.post(
    { url: apiUrl, body: JSON.stringify(params) },
    (err, res, body) => {
      if (err) {
        logger.error(err);
        return false;
      }
      try {
        dLog.info('请求 submitAudit 的结果 %s', body);
        // const obj = JSON.parse(body);
        Response.setHeader('Content-Type', 'application/json; charset=utf-8');
        Response.end(body);
      } catch (error) {
        logger.error('submitAudit error: %s ', error);
        Response.end('submitAudit error: ' + error);
      }
    }
  );
}

/**
 * 获取授权小程序帐号的可选类目
 * @param {Object} Request
 * @param {Object} Response
 */
async function getCategory(Params, Request, Response) {
  let appid = Params.appid;
  let Token = await getAccessToken(appid);
  dLog.info('获取的 Token 为： %s ', Token);

  const apiUrl = baseurl + '/wxa/get_category?access_token=' + Token;

  request.get(apiUrl, (err, res, body) => {
    if (err) {
      logger.error(err);
      return false;
    }
    try {
      dLog.info('请求 getCategory 的结果 %s', body);
      // const obj = JSON.parse(body);
      Response.setHeader('Content-Type', 'application/json; charset=utf-8');
      Response.end(body);
    } catch (error) {
      logger.error('getCategory error: %s ', error);
      Response.end('getCategory error: ' + error);
    }
  });
}

/**
 * 获取小程序的第三方提交代码的页面配置
 * @param {Object} Request
 * @param {Object} Response
 */
async function getPage(Params, Request, Response) {
  let appid = Params.appid;
  let Token = await getAccessToken(appid);
  dLog.info('获取的 Token 为： %s ', Token);

  const apiUrl = baseurl + '/wxa/get_page?access_token=' + Token;

  request.get(apiUrl, (err, res, body) => {
    if (err) {
      logger.error(err);
      return false;
    }
    try {
      dLog.info('请求 getPage 的结果 %s', body);
      // const obj = JSON.parse(body);
      Response.setHeader('Content-Type', 'application/json; charset=utf-8');
      Response.end(body);
    } catch (error) {
      logger.error('getPage error: %s ', error);
      Response.end('getPage error: ' + error);
    }
  });
}

exports.index = run;
