const axios = require("axios");
const { HOST_API, KEY_FUNC_AUTHORIZED } = process.env;

const headersResponse = {
  "Access-Control-Allow-Credentials": true,
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

const getUserTypesById = (context) => {
  try {
    const { id } = context.bindingData;
    const userTypes = context.bindings.inputUserTypes;

    const userType = userTypes.find((type) => type.id === id);

    delete userType._rid;
    delete userType._self;
    delete userType._etag;
    delete userType._attachments;
    delete userType._ts;

    context.res = {
      status: 200,
      body: {
        userType,
      },
      headers: headersResponse,
    };
  } catch (err) {
    const { status, message } = err.response.data || {
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
  (await hasAuthorized(context, req)) && getUserTypesById(context);
};
