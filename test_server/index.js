'use strict';

var express = require('express');
var fs = require('fs');
var multiparty = require('multiparty');
var util = require('util');
var request = require('request')

/* Make an http server to receive the webhook. */
var server = express();

server.head('/webhook', function (req, res) {
    console.log('Received head request from webhook.');
    res.send(200);
});

server.post('/webhook', function (req, res) {
    console.log('Receiving webhook.');

    /* Respond early to avoid timouting the mailin server. */
    // res.send(200);

    /* Parse the multipart form. The attachments are parsed into fields and can
     * be huge, so set the maxFieldsSize accordingly. */
    var form = new multiparty.Form({
        maxFieldsSize: 70000000
    });

    form.on('progress', function () {
        var start = Date.now();
        var lastDisplayedPercentage = -1;
        return function (bytesReceived, bytesExpected) {
            var elapsed = Date.now() - start;
            var percentage = Math.floor(bytesReceived / bytesExpected * 100);
            if (percentage % 20 === 0 && percentage !== lastDisplayedPercentage) {
                lastDisplayedPercentage = percentage;
                console.log('Form upload progress ' +
                    percentage + '% of ' + bytesExpected / 1000000 + 'Mb. ' + elapsed + 'ms');
            }
        };
    }());

    form.parse(req, function (err, fields) {
	    	const body = fields.mailinMsg
	    	console.log(fields.mailinMsg)
	    	var username
		var html
		var text
	    	var restProps
	    	try {
			const parsed = JSON.parse(body)
			const usernameRaw = parsed.headers.to
			const emailMatch = usernameRaw.split(' ');
			var email
			if (emailMatch.length === 2) {
			  email = emailMatch[1].replace('<', '').replace('>', ''); // test@mail-catcher.net
			  username = email.split('@')[0];
			} else if (emailMatch.length === 1) {
			  email = emailMatch[0]
			  username = email.split('@')[0];
			} else {
			  console.log('No email found in the string');
			}

			html = parsed.html
			delete parsed.html
			text = parsed.text
			delete parsed.text
			restProps = JSON.stringify(parsed)
		} catch (e) {
			console.log('Error: ' + e.message)	
		}
		const data = {
			html,
			text,
			restProps,
		    "username": username.toLowerCase()
		};
	    	const url = 'https://vsandeepotp.pockethost.io';
	    	const path = '/api/collections/emails/records';
	    	const method = 'POST'
	    	request({url: url + path, json: data, method: "POST"})
    });
});

server.listen(3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Http server listening on port 3000');
    }
});
