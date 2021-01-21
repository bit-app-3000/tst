export const Healthy = (req, reply) =>
  reply
    .send({
      ip: req.ip,
      uptime: process.uptime(),
      timestamp: Date.now(),
      message: 'healthy'
    })
