export const Main = (req, reply) =>
  reply
    .code(200)
    .send(req.headers)
