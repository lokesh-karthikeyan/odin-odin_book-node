import fp from 'fastify-plugin';

async function responsePlugin(fastify) {
  fastify.decorateReply('success', function (message, data = null, statusCode = 200) {
    this.code(statusCode).send({
      success: true,
      message,
      ...(data && { data }),
    });
  });

  fastify.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      const formatted = {};

      for (const err of error.validation) {
        const field = err.instancePath.replace('/', '') || err.params.missingProperty;
        formatted[field] = err.message;
      }

      return reply.code(400).send({
        success: false,
        message: 'Validation failed',
        errors: formatted,
      });
    }

    if (error.isOperational) {
      return reply.code(error.statusCode).send({
        success: false,
        message: error.message,
        ...(error.errors && { errors: error.errors })
      })
    }

    request.log.error(error);

    return reply.code(500).send({
      success: false,
      message: 'Internal Server Error',
    })
  });
}

export default fp(responsePlugin);
