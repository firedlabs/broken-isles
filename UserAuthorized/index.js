const axios = require("axios");
const { HOST_API, KEY_FUNC_AUTHORIZED } = process.env;

const getCookie = (cookies, name) => {
  const search = new RegExp(`^ ${name}=|${name}=`);

  const findCookie = cookies.split(";").find((item) => item.match(search));

  return Boolean(findCookie) && findCookie.replace(search, "");
};

module.exports = async function (context, req) {
  const headersResponse = {
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const cookies = req.headers.cookie;
    const token = getCookie(cookies, "token");
    const url = `${HOST_API}/api/func/user/authorized/${token}?code=${KEY_FUNC_AUTHORIZED}`;
    const res = await axios.get(url);
    const { status, message } = res.data;

    context.res = {
      status,
      body: {
        message,
      },
      headers: headersResponse,
    };
  } catch (err) {
    context.log("err", err);
    const {
      status,
      data: { message },
    } = err.response || {
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
