const { hasAuthorized, headersResponse } = require("../hasAuthorized");

const notTeam = (context, team) => {
  const hasTeam = context.bindings.inputTeam.some(
    ({ name }) => name === team.name
  );

  if (hasTeam) throw { status: 409, message: "Team name existing" };
};

const validationTeam = (context, team) => {
  if (!team) throw { status: 400, message: "Whitout body" };
  if (!team.name) throw { status: 406, message: "Whiout name" };

  notTeam(context, team);
};

const saveTeam = (context, req) => {
  try {
    const team = req.body;

    validationTeam(context, team);

    context.bindings.outputTeam = team;

    context.res = {
      status: 200,
      body: {
        msg: "feliz, happy",
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
  (await hasAuthorized(context, req)) && saveTeam(context, req);
};
