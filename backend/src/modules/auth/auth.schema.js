const signupSchema = {
  body: {
    type: 'object',
    required: ['fullName', 'email', 'password'],
    properties: {
      fullName: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
    }
  }
};

const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    }
  }
};

export {
  signupSchema,
  loginSchema,
}
