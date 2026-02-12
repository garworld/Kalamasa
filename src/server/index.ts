import Fastify from 'fastify'
import cors from '@fastify/cors'
import { routes } from '../routes/index'

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  },
  bodyLimit: 50 * 1024 * 1024 // 50 MB
})

await fastify.register(cors, {
  origin: true
})

fastify.register(routes)

export const startServer = async (): Promise<void> => {
  try {
    fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
      if (err) {
        fastify.log.error(err)
        process.exit(1)
      }
      fastify.log.info(`server listing on ${address}`)
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

export const stopServer = async (): Promise<void> => {
  try {
    await fastify.close()
    fastify.log.info('Server Stopped')
  } catch (err) {
    fastify.log.error(err)
  }
}
