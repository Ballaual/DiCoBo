const errors = (client) => {

client.on("error", (error) => {
    console.error("Client error:", error)
})
};

process.on("unhandledRejection", (reason, p) => {
    console.log(reason, p)
})

process.on("uncaughtException", (err, origin) => {
    console.log(err, origin)
})

module.exports = errors;