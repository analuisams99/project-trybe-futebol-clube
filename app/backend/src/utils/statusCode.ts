enum StatusCodes {
  OK = 200,
  BadRequest = 400,
  Unauthorized,
}

const errors = {
  emailOrPasswordInvalid: {
    code: StatusCodes.Unauthorized,
    message: 'Incorrect email or password',
  },
  fieldNotFilled: {
    code: StatusCodes.BadRequest,
    message: 'All fields must be filled',
  },
};

export default {
  StatusCodes,
  errors,
};
