enum StatusCodes {
  OK = 200,
  // Created,
  BadRequest = 400,
  Unauthorized,
  // PaymentRequired,
  // Forbidden,
  // NotFound,
  // UnprocessableEntity = 422,
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