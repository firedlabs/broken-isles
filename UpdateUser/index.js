const validationUser = (user, login) => {
  if (!user) throw { status: 404, message: `Not found ${login}` };
};

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

const updateUser = (context, req) => {
  try {
    const user = req.body;
    const usersData = context.bindings.inputUsers;
    const findUser = usersData.find(({ login }) => login === user.login);
    validationUser(findUser);
    const newUser = { ...findUser, ...user };
    context.bindings.outputUsers = newUser;

    context.res = {
      status: 200,
      body: {
        login: newUser.login,
        type: newUser.type,
      },
      headers: responseHeaders,
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
  (await hasAuthorized(context, req)) && updateUser(context, req);
};
