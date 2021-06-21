import { Kafka } from 'kafkajs'

const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env
const sasl = username && password ? { username, password, mechanism: 'plain' } : null
const ssl = !!sasl

const VITE_BOOTSTRAP_SERVERS = import.meta.env.VITE_BOOTSTRAP_SERVERS;
console.log("VITE_BOOTSTRAP_SERVERS:", VITE_BOOTSTRAP_SERVERS)
let BOOTSTRAP_SERVERS = []
if(typeof VITE_BOOTSTRAP_SERVERS === 'string') {
    BOOTSTRAP_SERVERS = VITE_BOOTSTRAP_SERVERS.split(",")
}

console.log('BOOTSTRAP_SERVERS: ', BOOTSTRAP_SERVERS)

const kafka = new Kafka({
    clientId: 'orcha',
    brokers: BOOTSTRAP_SERVERS,
    ssl,
    sasl
})

export { kafka as default }