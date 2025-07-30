var mailin = require('mailin')

var options = {
	port: 1025,
	webhook: 'http://pocketbase:80/api/webhook/mailin'
}

mailin.start(options)

mailin.on('message', function (connection, data, content) {
	// do something with email
})
