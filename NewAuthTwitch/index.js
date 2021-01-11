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
      brodcasterType: broadcaster_type,
      profileImageUrl: profile_image_url,
    };
  } catch (err) {
    console.log(err);
  }
};
