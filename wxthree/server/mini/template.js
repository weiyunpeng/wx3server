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
      gettemplatedraftlist: gettemplatedraftlist,
      addtotemplate: addtotemplate,
      deletetemplate: deletetemplate,
      gettemplatelist: gettemplatelist
    };
    funs[Request.params.name](Params, Request, Response);
  } else {
    Response.end('this is stub');
  }
}

/**
 * 获取草稿箱内的所有临时代码草稿
 * @param {Object} Request
 * @param {Object} Response
 */
async function gettemplatedraftlist(Params, Request, Response) {
  let comToken = await getComponentAccessToken();
  dLog.info('获取的 comToken 为： %s ', comToken);

  const apiUrl = baseurl + '/wxa/gettemplatedraftlist?access_token=' + comToken;

  request.get(apiUrl, (err, res, body) => {
    if (err) {
      logger.error(err);
      return false;
    }
    try {
      dLog.info('请求gettemplatedraftlist的结果 %s', body);
      // const obj = JSON.parse(body);
      Response.setHeader('Content-Type', 'application/json; charset=utf-8');
      Response.end(body);
    } catch (error) {
      logger.error('gettemplatedraftlist error: %s ', error);
      Response.end('gettemplatedraftlist error: ' + error);
    }
  });
}

/**
 * 获取代码模版库中的所有小程序代码模版
 * @param {Object} Request
 * @param {Object} Response
 */
async function gettemplatelist(Params, Request, Response) {
  let comToken = await getComponentAccessToken();
  dLog.info('获取的 comToken 为： %s ', comToken);

  const apiUrl = baseurl + '/wxa/gettemplatelist?access_token=' + comToken;

  request.get(apiUrl, (err, res, body) => {
    if (err) {
      logger.error(err);
      return false;
    }
    try {
      dLog.info('请求 gettemplatelist 的结果 %s', body);
      // const obj = JSON.parse(body);
      Response.setHeader('Content-Type', 'application/json; charset=utf-8');
      Response.end(body);
    } catch (error) {
      logger.error('gettemplatelist error: %s ', error);
      Response.end('gettemplatelist error: ' + error);
    }
  });
}

/**
 * 将草稿箱的草稿选为小程序代码模版
 * @param {Object} Request
 * @param {Object} Response
 */
async function addtotemplate(Params, Request, Response) {
  let comToken = await getComponentAccessToken();
  dLog.info('获取的 comToken 为： %s ', comToken);
  let draft_id = Params.draft_id;

  const apiUrl = baseurl + '/wxa/addtotemplate?access_token=' + comToken;

  const params = {
    draft_id: draft_id
  };

  request.post(
    { url: apiUrl, body: JSON.stringify(params) },
    (err, res, body) => {
      if (err) {
        logger.error(err);
        return false;
      }
      try {
        dLog.info('请求 addtotemplate 的结果 %s', body);
        // const obj = JSON.parse(body);
        Response.setHeader('Content-Type', 'application/json; charset=utf-8');
        Response.end(body);
      } catch (error) {
        logger.error('addtotemplate error: %s ', error);
        Response.end('addtotemplate error: ' + error);
      }
    }
  );
}

/**
 * 删除指定小程序代码模版
 * @param {Object} Request
 * @param {Object} Response
 */
async function deletetemplate(Params, Request, Response) {
    let comToken = await getComponentAccessToken();
    dLog.info('获取的 comToken 为： %s ', comToken);
    let template_id = Params.template_id;
  
    const apiUrl = baseurl + '/wxa/deletetemplate?access_token=' + comToken;
  
    const params = {
        template_id: template_id
    };
  
    request.post(
      { url: apiUrl, body: JSON.stringify(params) },
      (err, res, body) => {
        if (err) {
          logger.error(err);
          return false;
        }
        try {
          dLog.info('请求 deletetemplate 的结果 %s', body);
          // const obj = JSON.parse(body);
          Response.setHeader('Content-Type', 'application/json; charset=utf-8');
          Response.end(body);
        } catch (error) {
          logger.error('deletetemplate error: %s ', error);
          Response.end('deletetemplate error: ' + error);
        }
      }
    );
  }

exports.index = run;
