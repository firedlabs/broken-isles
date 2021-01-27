const validationUser = (user, login) => {
  if (!user) throw { status: 404, message: `Not found ${login}` };
};

module.exports = async function (context, req) {
  const responseHeaders = {
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const user = req.body;
    const usersData = context.bindings.inputUsers;
    const findUser = usersData.find(({ login }) => login === user.login);
    validationUser(findUser);
    const newUser = { ...findUser, ...user };
    context.bindings.outputUsers = newUser;

    return {
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

    return {
      status,
      body: {
        message,
      },
      headers: headersResponse,
    };
  }
};
