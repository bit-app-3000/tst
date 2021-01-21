export const Echo = (req, reply) =>
  reply
    .code(200)
    .send({label:'echo', headers: req.headers})
