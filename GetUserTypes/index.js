const axios = require("axios");
const { HOST_API } = process.env;
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
    await axios.get(`${HOST_API}/api/func/user/auth/${token}`);

    return true;
  } catch (err) {
    context.res = {
      status: 403,
      headers: headersResponse,
    };
  }
};

const getUserTypes = (context) => {
  const userTypesData = context.bindings.inputUserTypes;

  context.res = {
    body: userTypesData,
    headers: headersResponse,
  };
};

module.exports = async function (context, req) {
  (await hasAuthorized(context, req)) && getUserTypes(context);
};
