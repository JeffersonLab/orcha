import kafka from '$lib/kafka'

const listRegistration = () => {
    return [{
        key: "testing"
    }]
}

let consumer;

get().catch(async error => {
    console.error(error)
    try {
        await consumer.disconnect()
    } catch (e) {
        console.error('Failed to gracefully disconnect consumer', e)
    }
})

export async function get() {
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

            console.log('Received message', {
                topic,
                partition,
                key: message.key.toString(),
                value: message.value.toString()
            })
        }
    })

    //await consumer.seek({ topic: 'registered-alarms', partition: 0, offset: 1 })

    return {
        body: listRegistration()
    };
}