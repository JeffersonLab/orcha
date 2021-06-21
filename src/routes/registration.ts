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
        eachMessage: async ({ topic, partition, message }) => {
            console.log('Received message', {
                topic,
                partition,
                key: message.key.toString(),
                value: message.value.toString()
            })
        }
    })

    return {
        body: listRegistration()
    };
}