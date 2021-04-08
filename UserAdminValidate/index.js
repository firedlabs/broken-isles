const { headersResponse, hasAuthorized } = require("../hasAuthorized");

function validateUser(user) {
  if (user.type !== "admin") throw { status: 403, message: "Not authorized" };
  if (!user) throw { status: 404, message: "Not found user" };
}

function userAdminValidate(context, req) {
  try {
    const user = context.bindings.inputUser[0];

    validateUser(user);

    context.res = {
      status: 200,
      body: {
        message: true,
      },
      headers: headersResponse,
    };
  } catch (err) {
    const { status = 500, message = err } = err;

    context.res = {
      status: status,
      body: {
        message,
      },
      headers: headersResponse,
    };
  }
}

module.exports = async function (context, req) {
  (await hasAuthorized(context, req)) && userAdminValidate(context, req);
};
