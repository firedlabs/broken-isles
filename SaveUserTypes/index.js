const axios = require("axios");
const { HOST_API, KEY_FUNC_AUTHORIZED } = process.env;
const headersResponse = {
  "Access-Control-Allow-Credentials": true,
};

const errorDefault = { status: 422, message: "Without body" };

const errors = {
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

const validationType = (type, userTypesData) => {
  if (errors[type]) throw errors[type];
  if (!type.name) throw { status: 422, message: "Without name in body" };
  if (!type.description)
    throw { status: 422, message: "Without description in body" };
  if (userTypesData.some(({ name }) => type.name === name))
    throw { status: 409, message: `The ${type.name} is duplicated` };
};

const saveUserTypes = (context, req) => {
  try {
    const type = req.body;
    const userTypesData = context.bindings.inputUserTypes;
    validationType(type, userTypesData);

    context.bindings.outputUserTypes = type;

    context.res = {
      status: 201,
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
  (await hasAuthorized(context, req)) && saveUserTypes(context, req);
};
