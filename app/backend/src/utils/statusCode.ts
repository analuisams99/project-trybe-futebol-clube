enum StatusCodes {
  OK = 200,
  CREATED,
  BAD_REQUEST = 400,
  UNAUTHORIZED,
  NOT_FOUND = 404,
}

const errors = {
  emailOrPasswordInvalid: {
    status: StatusCodes.UNAUTHORIZED,
    message: 'Incorrect email or password',
  },
  fieldNotFilled: {
    status: StatusCodes.BAD_REQUEST,
    message: 'All fields must be filled',
  },
  equalTeams: {
    status: StatusCodes.UNAUTHORIZED,
    message: 'It is not possible to create a match with two equal teams',
  },
  notFoundTeamById: {
    status: StatusCodes.NOT_FOUND,
    message: 'There is no team with such id!',
  },
  matchFinished: {
    status: StatusCodes.OK,
    message: 'Match finished',
  },
  matchUpdated: {
    status: StatusCodes.OK,
    message: 'Match Updated',
  },
  matchesNotFound: {
    status: StatusCodes.BAD_REQUEST,
    message: 'Matches not found',
  },
  invalidId: {
    status: StatusCodes.BAD_REQUEST,
    message: 'Invalid Id',
  },
  teamsNotFound: {
    status: StatusCodes.BAD_REQUEST,
    message: 'Teams not found',
  },
  unauthorizedUser: {
    status: StatusCodes.UNAUTHORIZED,
    message: 'Unauthorized',
  },
};

export default {
  StatusCodes,
  errors,
};
