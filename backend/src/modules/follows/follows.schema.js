const followSchema = {
  body: {
    type: 'object',
    required: ['followeeId'],
    additionalProperties: false,
    properties: {
      followeeId: { type: 'string', format: 'uuid' },
    },
  }
}

const userIdParamSchema = {
  params: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: { type: 'string', format: 'uuid' },
    },
  },
};

export {
  followSchema,
  userIdParamSchema,
}
