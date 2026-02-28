import fp from 'fastify-plugin';

async function responsePlugin(fastify) {
  fastify.decorateReply('success', function (messageOrData = null, dataMaybe = null, statusCode = 200) {
    let message;
    let data;

    if (typeof messageOrData === 'object' && !Array.isArray(messageOrData) && messageOrData !== null) {
      message = undefined;
      data = messageOrData;
    } else {
      message = messageOrData;
      data = dataMaybe;
    }

    const payload = {
      success: true,
      ...(message && { message }),
      ...(data && { data }),
    };

    this.code(statusCode).send(payload);
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
        ...(error.errors && { errors: error.errors }),
      });
    }

    request.log.error(error);

    return reply.code(500).send({
      success: false,
      message: 'Internal Server Error',
    });
  });
}

export default fp(responsePlugin);
