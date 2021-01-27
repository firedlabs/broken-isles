const validationToken = (token) => {
  if (!token) throw { status: 422, message: `Without token` };
};

const validationUser = (user) => {
  if (!user) throw { status: 404, message: `Not found your user` };
  if (user.type !== "admin") throw { status: 403, message: "Not authorized" };
};

module.exports = async function (context, req) {
  const responseHeaders = {
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const tokenParam = context.bindingData.token;
    validationToken(tokenParam);
    const usersData = context.bindings.inputUsers;
    const user = usersData.find(({ token }) => token === tokenParam);
    validationUser(user);

    return {
      status: 200,
      body: {
        token,
      },
      headers: responseHeaders,
    };
  } catch (err) {
    const { status, message } = err || {
      status: 500,
      message: err,
    };

    return {
      status,
      body: {
        message,
      },
      headers: responseHeaders,
    };
  }
};
