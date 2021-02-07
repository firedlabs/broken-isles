const axios = require("axios");
const { HOST_API, KEY_FUNC_AUTHORIZED } = process.env;
const headersResponse = {
  "Access-Control-Allow-Credentials": true,
};

const errorDefault = { status: 422, message: "Without body" };

const erros = {
  undefined: errorDefault,
  null: errorDefault,
};

const getCookie = (cookies, name) => {
  const search = new RegExp(`^ ${name}=|${name}=`);

  const findCookie = cookies.split(";").find((item) => item.match(search));

  return Boolean(findCookie) && findCookie.replace(search, "");
};

const hasAuthorized = async (context, req) => {
  try {
    const cookies = req.headers.cookie;
    const token = getCookie(cookies, "token");
    const url = `${HOST_API}/api/func/user/authorized/${token}?code=${KEY_FUNC_AUTHORIZED}`;
    await axios.get(url);

    return true;
  } catch (err) {
    context.res = {
      status: 403,
      headers: headersResponse,
    };
  }
};

const saveModule = (context, req) => {
  try {
    const module = req.body;

    context.bindings.outputModules = module;

    context.res = {
      status: 201,
      body: {
        module,
      },
      headers: headersResponse,
    };
  } catch (err) {
    const { status, message } = err || {
      status: 500,
      message: err,
    };

    context.res = {
      status,
      body: {
        message,
      },
      headers: headersResponse,
    };
  }
};

module.exports = async function (context, req) {
  (await hasAuthorized(context, req)) && saveModule(context, req);
};
