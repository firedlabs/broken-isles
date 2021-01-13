const getCookie = (cookies, name) => {
  const search = new RegExp(`^ ${name}=|${name}=`);

  return cookies
    .split(";")
    .find((item) => item.match(search))
    .replace(search, "");
};

module.exports = async function (context, req) {
  const token = getCookie(req.headers.cookie, "token");

  const user =
    context.bindings.usersDocument.find((user) => user.token === token) ||
    false;

  context.res = {
    status: 200,
    body: {
      src: user.profileImageUrl,
      alt: `Avatar do ${user.login}`,
    },
    headers: {
      "Access-Control-Allow-Credentials": true,
    },
  };
};
