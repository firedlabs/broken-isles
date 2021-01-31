const axios = require("axios");
const { HOST_API, KEY_FUNC_AUTHORIZED } = process.env;

const headersResponse = {
  "Access-Control-Allow-Credentials": true,
};

const getCookie = (cookies, name) => {
  const search = new RegExp(`^ ${name}=|${name}=`);

  const findCookie = cookies.split(";").find((item) => item.match(search));

  return Boolean(findCookie) && findCookie.replace(search, "");
};

const hasAuthorized = async (context, req) => {
  try {
    const cookies = req.headers.cookie;
    const token = getCookie(cookies, "token");
    const url = `${HOST_API}/api/func/user/authorized/${token}?code=${KEY_FUNC_AUTHORIZED}`;
    await axios.get(url);

    return true;
  } catch (err) {
    context.res = {
      status: 403,
      headers: headersResponse,
    };
  }
};

const hasFields = (video) => {
  if (!video) throw { status: 400, message: "Without body" };
  if (!video.name) throw { status: 406, message: "Without name" };
  if (!video.url) throw { status: 406, message: "Without url" };
  if (!video.thumbnail) throw { status: 406, message: "Without thumbnail" };
  if (!video.description) throw { status: 406, message: "Without description" };
  if (!video.tags) throw { status: 406, message: "Without tags" };
  if (video.viewer === "") throw { status: 406, message: "Without viewer" };
  if (video.follow === "") throw { status: 406, message: "Without follow" };
  if (video.vip === "") throw { status: 406, message: "Without vip" };
  if (video.sub === "") throw { status: 406, message: "Without sub" };
  if (video.mod === "") throw { status: 406, message: "Without mod" };
};

const saveDatabaseVideo = (video, context) => {
  video.viewer = !!video.viewer;
  video.follow = !!video.follow;
  video.vip = !!video.vip;
  video.sub = !!video.sub;
  video.mod = !!video.mod;

  context.bindings.outputVideo = video;
};

const saveVideo = (context, req) => {
  try {
    const video = req.body;
    hasFields(video);

    saveDatabaseVideo(video, context);

    context.res = {
      body: {
        video,
      },
      headers: headersResponse,
    };
  } catch (err) {
    const { status, message } = err || {
      status: 500,
      message: err,
    };

    context.res = {
      status,
      body: {
        message,
      },
      headers: headersResponse,
    };
  }
};

module.exports = async function (context, req) {
  (await hasAuthorized(context, req)) && saveVideo(context, req);
};
