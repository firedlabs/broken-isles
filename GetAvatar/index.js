const axios = require("axios");

const { CLIENT_ID } = process.env;
const headers = {
  "Access-Control-Allow-Credentials": true,
};

const getCookie = (cookies, name) => {
  const search = new RegExp(`^ ${name}=|${name}=`);

  const findCookie = cookies.split(";").find((item) => item.match(search));

  return Boolean(findCookie) && findCookie.replace(search, "");
};

const getUserTwitch = async (token) => {
  const url = "https://api.twitch.tv/helix/users";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Client-Id": CLIENT_ID,
  };

  try {
    const res = await axios.get(url, { headers });

    return res.data.data[0];
  } catch (err) {
    return err;
  }
};

module.exports = async function (context, req) {
  const cookies = req.headers.cookie;
  const token = Boolean(cookies) && getCookie(cookies, "token");

  if (!token) {
    return {
      status: 401,
      headers,
    };
  }

  const user = await getUserTwitch(token);

  if (!user.login) {
    return {
      status: 404,
      body: {
        message: "Usuário não encontrado",
      },
      headers,
    };
  }

  return {
    status: 200,
    body: {
      src: user.profile_image_url,
      alt: `Avatar do ${user.login}`,
    },
    headers,
  };
};
