const querystring = require("querystring");
const axios = require("axios");
const { CLIENT_ID } = process.env;

const getCookie = (cookies, name) => {
  const search = new RegExp(`^ ${name}=|${name}=`);

  const findCookie = cookies.split(";").find((item) => item.match(search));

  return Boolean(findCookie) && findCookie.replace(search, "");
};

module.exports = async function (context, req) {
  const cookies = req.headers.cookie;
  const url = "https://id.twitch.tv/oauth2/revoke";
  const token = getCookie(cookies, "token");
  const headers = {
    "Access-Control-Allow-Credentials": true,
  };

  const query = {
    client_id: CLIENT_ID,
    token,
  };

  try {
    await axios.post(url, querystring.stringify(query));

    return {
      body: {
        status: 200,
      },
      headers,
    };
  } catch (err) {
    const { status, message } = err.response.data || {
      status: 500,
      message: err,
    };

    return {
      status,
      body: message,
      headers,
    };
  }
};
