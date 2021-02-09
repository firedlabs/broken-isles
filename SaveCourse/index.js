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

const validationCourse = (course) => {
  if (!course.name) throw { status: 422, message: "Without name in body" };
  if (!course.shortName)
    throw { status: 422, message: "Without shortName in body" };
  if (!course.thumbnail)
    throw { status: 422, message: "Without thumbnail in body" };
  if (!course.description)
    throw { status: 422, message: "Without description in body" };
  if (!course.tags) throw { status: 422, message: "Without tags in body" };
  if (!course.modules)
    throw { status: 422, message: "Without modules in body" };
  if (!course.patentsTwitch)
    throw { status: 422, message: "Without patentsTwitch in body" };
};

const saveCourse = (context, req) => {
  try {
    const course = req.body;

    validationCourse(course);

    context.bindings.outputCourses = course;

    context.res = {
      status: 201,
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
  (await hasAuthorized(context, req)) && saveCourse(context, req);
};
