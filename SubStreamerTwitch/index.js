const axios = require("axios");
const { CLIENT_ID } = process.env;

const getCookie = (cookies, name) => {
  const search = new RegExp(`^ ${name}=|${name}=`);

  const findCookie = cookies.split(";").find((item) => item.match(search));

  return Boolean(findCookie) && findCookie.replace(search, "");
};

const getIdUserTwitch = async (token, login) => {
  const url = "https://api.twitch.tv/helix/users";
  const params = {
    login: login || "",
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Client-Id": CLIENT_ID,
  };

  const options = login ? { params, headers } : { headers };

  const res = await axios.get(url, options);
  const { id } = res.data.data[0];

  return id;
};

module.exports = async function (context, req) {
  const cookies = req.headers.cookie;
  const token = getCookie(cookies, "token");
  const streamerId = await getIdUserTwitch(token, "marcobrunodev");
  const viewerId = await getIdUserTwitch(token);
  const url = "https://api.twitch.tv/helix/subscriptions";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Client-Id": CLIENT_ID,
  };
  const params = {
    broadcaster_id: streamerId,
    user_id: viewerId,
  };
  const headersResponse = {
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const res = await axios.get(url, { params, headers });
    const { status } = res;

    return {
      status,
      headers: headersResponse,
    };
  } catch (err) {
    const { status, message } = err.response.data || {
      status: 500,
      message: err,
    };

    return {
      status,
      body: message,
    };
  }
};
