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
    console.log(err);
    context.res = {
      status: 403,
      headers: headersResponse,
    };
  }
};

const getCourseToPlay = (context) => {
  context.res = {
    status: 200,
    body: {
      text: "deu bom",
    },
    headers: headersResponse,
  };
};

module.exports = async function (context, req) {
  (await hasAuthorized(context, req)) && getCourseToPlay(context);
};
