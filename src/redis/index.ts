import { createClient } from 'redis'

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string)
    },
    legacyMode: true
})

redisClient.on('connect', () => {
    console.log('Redis connected');
});

redisClient.on('error', (err) => {
    console.log(`Redis error : ${err}`);
});

redisClient.connect().then();
export default redisClient.v4;
