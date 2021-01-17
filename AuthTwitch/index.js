const querystring = require("querystring");
const axios = require("axios");
const { CLIENT_SECRET, CLIENT_ID, HOST_API, HOST_FRONTEND } = process.env;
const scope = "user:read:email";

const getCodeRedirect = (context) => {
  const query = {
    client_id: CLIENT_ID,
    redirect_uri: `${HOST_API}/api/auth/twitch`,
    response_type: "code",
    scope,
  };
  const url = "https://id.twitch.tv/oauth2/authorize";

  context.res = {
    status: 302,
    headers: {
      location: `${url}?${querystring.stringify(query, "&")}`,
    },
  };
};

const getToken = async (context, code) => {
  const url = "https://id.twitch.tv/oauth2/token";
  const query = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: `${HOST_FRONTEND}`,
    code,
    grant_type: "authorization_code",
  };
  let res = false;

  try {
    res = await axios.post(url, querystring.stringify(query));
    context.bindings.newAuthTwitch = res.data.access_token;
  } catch (err) {
    const { status, message } = err.response.data;

    context.res = {
      status,
      body: {
        message,
      },
    };
  }

  if (res.data.access_token) {
    const { access_token, expires_in } = res.data;

    context.res = {
      status: 302,
      headers: {
        location: HOST_FRONTEND,
      },
      cookies: [
        {
          name: "token",
          value: access_token,
          path: "/",
          maxAge: expires_in,
          sameSite: "none",
          secure: true,
        },
      ],
    };
  }
};

module.exports = async function (context, req) {
  const code = req.query.code || false;

  if (code) {
    await getToken(context, code);
  } else {
    getCodeRedirect(context);
  }
};
