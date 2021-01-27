const axios = require("axios");
const { HOST_API } = process.env;

const getCookie = (cookies, name) => {
  const search = new RegExp(`^ ${name}=|${name}=`);

  const findCookie = cookies.split(";").find((item) => item.match(search));

  return Boolean(findCookie) && findCookie.replace(search, "");
};

module.exports = async function (context, req) {
  try {
    const headersResponse = {
      "Access-Control-Allow-Credentials": true,
    };
    const cookies = req.headers.cookie;
    const token = getCookie(cookies, "token");
    const res = await axios.get(`${HOST_API}/api/func/user/auth/${token}`);
    const { status, message } = res.data;

    context.res = {
      status,
      body: {
        message,
      },
      headers: headersResponse,
    };
  } catch (err) {
    context.res = {
      status: 403,
      headers: headersResponse,
    };
  }
};
