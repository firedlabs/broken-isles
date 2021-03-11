const { hasAuthorized, headersResponse } = require("../hasAuthorized");

function getTeams(context) {
  try {
    const teams = context.bindings.inputTeam;

    context.res = {
      status: 200,
      headers: headersResponse,
      body: teams,
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
}

module.exports = async function (context, req) {
  (await hasAuthorized(context, req)) && getTeams(context);
};
