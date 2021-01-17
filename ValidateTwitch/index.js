const axios = require("axios");

const getCookie = (cookies, name) => {
  const search = new RegExp(`^ ${name}=|${name}=`);

  const findCookie = cookies.split(";").find((item) => item.match(search));

  return Boolean(findCookie) && findCookie.replace(search, "");
};

module.exports = async function (context, req) {
  const cookies = req.headers.cookie;
  const token = getCookie(cookies, "token");
  const url = "https://id.twitch.tv/oauth2/validate";
  const headers = {
    Authorization: `OAuth ${token}`,
  };
  const headersResponse = {
    "Access-Control-Allow-Credentials": true,
  };

  try {
    await axios.get(url, { headers });

    return {
      status: 200,
      headers: headersResponse,
    };
  } catch (err) {
    const { status, message } = err.response.data;

    return {
      status,
      body: message,
      headers: headersResponse,
    };
  }
};
