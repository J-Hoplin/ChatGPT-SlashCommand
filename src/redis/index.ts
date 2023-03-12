import { createClient } from 'redis'
import logger from '../log/index';

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string)
    },
    legacyMode: true
})

redisClient.on('connect', () => {
    logger.info('Redis connected')
});

redisClient.on('error', (err) => {
    logger.error(`Redis error : ${err}`)
});

redisClient.connect().then();
export default redisClient.v4;
