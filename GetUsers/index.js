module.exports = async function (context, req) {
  try {
    const users = context.bindings.inputUsers.map(
      ({ login, profileImageUrl }) => ({ login, avatar: profileImageUrl })
    );
    const hedersResponse = {
      "Access-Control-Allow-Credentials": true,
    };

    return {
      body: {
        users,
      },
      headers: hedersResponse,
    };
  } catch (err) {
    const { status, message } = err.response.data || {
      status: 500,
      message: err,
    };

    return {
      status,
      body: message,
    };
  }
};
