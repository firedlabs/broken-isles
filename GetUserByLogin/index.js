const validationUser = (user) => {
  if (!user) throw { status: 404, message: `User ${user} not found` };
};

module.exports = async function (context, req) {
  try {
    const login = context.bindingData.login;
    const usersData = context.bindings.inputUsers;
    const user = usersData.find((user) => user.login === login);

    validationUser(user);

    const headersResponse = {
      "Access-Control-Allow-Credentials": true,
    };

    return {
      body: { login: user.login, type: user.type || "" },
      headers: headersResponse,
    };
  } catch (err) {
    const { status, message } = err || { status: 500, message: err };

    return {
      status,
      body: {
        message,
      },
      headers: headersResponse,
    };
  }
};
