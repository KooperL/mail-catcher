var mailin = require('mailin')

var options = {
	port: 1025,
	webhook: 'http://example.com/webhook'
}

mailin.start(options)

mailin.on('message', function (connection, data, content) {
	// do something with email
})
