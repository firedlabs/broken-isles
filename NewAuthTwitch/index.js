const axios = require("axios");
const { CLIENT_ID } = process.env;

module.exports = async function (context, myQueueItem) {
  const token = myQueueItem;
  const url = "https://api.twitch.tv/helix/users";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Client-Id": CLIENT_ID,
  };

  try {
    const res = await axios.get(url, { headers });
    const {
      login,
      email,
      broadcaster_type,
      profile_image_url,
    } = res.data.data[0];

    const user = {
      login,
      email,
      token,
      brodcasterType: broadcaster_type,
      profileImageUrl: profile_image_url,
    };
    const usersDatabase = context.bindings.inputDocument;
    const findUser =
      usersDatabase.find((item) => item.email === user.email) || {};
    const newUser = { ...findUser, ...user };

    const saveUser = (userParam) =>
      (context.bindings.outputDocument = userParam);

    saveUser(newUser);
  } catch (err) {
    context.log(err);
  }
};
