const errorDefault = { status: 422, message: "Without body" };

const erros = {
  undefined: errorDefault,
  null: errorDefault,
};

const validationType = (type, userTypesData) => {
  if (erros[type]) throw erros[type];
  if (!type.name) throw { status: 422, message: "Without name in body" };
  if (!type.description)
    throw { status: 422, message: "Without description in body" };
  if (userTypesData.some(({ name }) => type.name === name))
    throw { status: 409, message: `The ${type.name} is duplicated` };
};

module.exports = async function (context, req) {
  const headersResponse = {
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const type = req.body;
    const userTypesData = context.bindings.inputUserTypes;
    validationType(type, userTypesData);

    context.bindings.outputUserTypes = type;

    return {
      status: 201,
      headers: headersResponse,
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
