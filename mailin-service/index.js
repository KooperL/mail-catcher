var mailin = require('mailin')

var options = {
	port: 1025,
	webhook: 'http://pocketbase:8090/api/webhook/mailin'
}

mailin.start(options)

mailin.on('message', function (connection, data, content) {
	// do something with email
})
