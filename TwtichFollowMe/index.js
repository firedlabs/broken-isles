const axios = require("axios");

const getInfosViewer = async () => {
  let res = false;

  try {
    res = await axios.get("/auth/twitch");
  } catch (err) {
    const { status, message } = err.response.data;

    context.res = {
      status,
      body: {
        message,
      },
    };
  }

  context.res = {
    body: {
      teste: "ainda não terminei",
    },
  };
};

module.exports = async function (context, req) {
  context.res = {
    headers: {
      "Access-Control-Allow-Credentials": "true",
    },
  };
};
