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
  const idViewer = await getIdUserTwitch(token);
  const idStreamer = await getIdUserTwitch(token, "marcobrunodev");
  const url = "https://api.twitch.tv/helix/users/follows";
  const params = {
    from_id: idViewer,
    to_id: idStreamer,
  };
  const headers = {
    Authorization: `Bearer ${token}`,
    "Client-Id": CLIENT_ID,
  };
  const headersResponse = {
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const res = await axios.get(url, { params, headers });
    const { total } = res.data;
    const isAuthorized = total === 1;

    return {
      status: isAuthorized ? 200 : 401,
      headers: headersResponse,
    };
  } catch (err) {
    return {
      status: 500,
      headers: headersResponse,
    };
  }
};
