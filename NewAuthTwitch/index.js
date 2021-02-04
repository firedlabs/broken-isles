const axios = require("axios");
const { CLIENT_ID } = process.env;

const getUserTwitch = async (token) => {
  const url = "https://api.twitch.tv/helix/users";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Client-Id": CLIENT_ID,
  };

  const res = await axios.get(url, { headers });

  return res.data.data[0];
};

module.exports = async function (context, req) {
  const token = req.body;

  try {
    const {
      id,
      login,
      email,
      broadcaster_type,
      profile_image_url,
    } = await getUserTwitch(token);

    const user = {
      idTwitch: id,
      login,
      email,
      token,
      brodcasterType: broadcaster_type,
      profileImageUrl: profile_image_url,
    };
    const usersDatabase = context.bindings.inputUsers;
    const findUser =
      usersDatabase.find((item) => item.email === user.email) || {};
    const newUser = { ...findUser, ...user };

    const saveAndUpdateUser = (userParam) =>
      (context.bindings.outputUsers = userParam);

    saveAndUpdateUser(newUser);

    context.res = {
      status: 200,
      body: {
        token,
      },
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: {
        message: err,
      },
    };
    context.log(err);
  }
};
