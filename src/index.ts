import fastify from 'fastify'
import routes from './routes/routes'
import { initCluster, getCluster } from './cluster'
import errorHandler from './middleware/error/errorMiddleware'
import { envSchema } from './envSchema'
import fastifyEnv from '@fastify/env';
import multipart from '@fastify/multipart';

const server = fastify({

})

// send cluster to request object
server.addHook('onRequest', (request, reply, done) => {
    console.log('onRequest')
    request.cluster = getCluster();
    done();
});

//Register 3rd party plugins
server.register(multipart)

// Register custom 
server.register(errorHandler);
server.register(routes);




async function startServer() {
    await server.register(fastifyEnv, envSchema);
    await initCluster();

    try {
        const address = await server.listen({ port: Number(process.env.PORT) || 3000 });
        server.log.info(`Servers listening at ${address}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);

    }
}

startServer();