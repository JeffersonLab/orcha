import { Kafka } from 'kafkajs'
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry'

const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env
const sasl = username && password ? { username, password, mechanism: 'plain' } : null
const ssl = !!sasl

const VITE_BOOTSTRAP_SERVERS = import.meta.env.VITE_BOOTSTRAP_SERVERS;
const VITE_REGISTRY_URL = import.meta.env.VITE_REGISTRY_URL;
console.log("VITE_BOOTSTRAP_SERVERS:", VITE_BOOTSTRAP_SERVERS)
console.log("VITE_REGISTRY_URL:", VITE_REGISTRY_URL)
let BOOTSTRAP_SERVERS = []
if(typeof VITE_BOOTSTRAP_SERVERS === 'string') {
    BOOTSTRAP_SERVERS = VITE_BOOTSTRAP_SERVERS.split(",")
}

console.log('BOOTSTRAP_SERVERS: ', BOOTSTRAP_SERVERS)

const kafka = new Kafka({
    clientId: 'orcha',
    brokers: BOOTSTRAP_SERVERS,
    retry: {
        retries: 0,
        restartOnFailure: async () => false
    },
    ssl,
    sasl
})

export const registry = new SchemaRegistry({host: VITE_REGISTRY_URL})

export { kafka as default }