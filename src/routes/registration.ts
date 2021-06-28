import kafka from '$lib/kafka'
import { registry } from '$lib/kafka'

const listRegistration = () => {
    return [{
        key: "testing"
    }]
}


 const registrations = async () => {
    let consumer;

    consumer = kafka.consumer({
        groupId: 'orcha'
    })

    await consumer.connect()

    await consumer.subscribe({
        topic: 'registered-alarms',
        fromBeginning: true
    })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {

            const decodedKey = message.key.toString()
            const decodedValue = await registry.decode(message.value)

            console.log('Received message', {
                topic,
                partition,
                key: decodedKey,
                value: decodedValue
            })
        }
    })

    await consumer.seek({ topic: 'registered-alarms', partition: 0, offset: 1 })


     const errorTypes = ['unhandledRejection', 'uncaughtException']
     const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

     errorTypes.map(type => {
         process.on(type, async e => {
             try {
                 console.log(`process.on ${type}`)
                 console.error(e)
                 await consumer.disconnect()
                 process.exit(0)
             } catch (_) {
                 process.exit(1)
             }
         })
     })

     signalTraps.map(type => {
         process.once(type, async () => {
             try {
                 await consumer.disconnect()
             } finally {
                 process.kill(process.pid, type)
             }
         })
     })



    console.log('exiting run method')
}

export async function get() {
    console.log('start of get method')
    //await registrations().catch(e => console.error(`[orcha] ${e.message}`, e))

    console.log('end of get method')

    return {
        body: listRegistration()
    };
}