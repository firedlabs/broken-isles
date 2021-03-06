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
  const url = "https://api.twitch.tv/helix/users/follows";
  const token = getCookie(cookies, "token");
  const idViewer = await getIdUserTwitch(token);
  const idStreamer = await getIdUserTwitch(token, "marcobrunodev");
  const data = {
    from_id: idViewer,
    to_id: idStreamer,
  };
  const headers = {
    Authorization: `Bearer ${token}`,
    "Client-Id": CLIENT_ID,
    "Content-Type": "application/json",
  };
  const headersResponse = {
    "Access-Control-Allow-Credentials": true,
  };

  try {
    await axios.post(url, data, { headers });

    return {
      status: 204,
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
