const axios = require("axios");
const { CLIENT_ID } = process.env;

const getCookie = (cookies, name) => {
  const search = new RegExp(`^ ${name}=|${name}=`);

  const findCookie = cookies.split(";").find((item) => item.match(search));

  return Boolean(findCookie) && findCookie.replace(search, "");
};

module.exports = async function (context, req) {
  const cookies = req.headers.cookie;
  const token = getCookie(cookies, "token");
  const url = "https://api.twitch.tv/helix/users";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Client-Id": CLIENT_ID,
  };
  const headersResponse = {
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const res = await axios.get(url, { headers });
    const { email, login } = res.data.data[0];

    return {
      body: {
        login,
        email,
      },
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
