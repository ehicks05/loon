module.exports = async (fastify, opts) => {
  fastify.get("/", async (request, reply) => ({ root: true }));
};
