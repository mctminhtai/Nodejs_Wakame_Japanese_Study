const request = require('request');
exports.post_webhook = function (req, res, next) {
    let body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
}
exports.get_webhook = function (req, res, next) {
    let VERIFY_TOKEN = "minhtai"
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
}
const PAGE_ACCESS_TOKEN = "EAASGhGZBXOZCABADJDr1qPE26Yh2JXHzfYeS1H8tPXc64g5TZBV2hgoEitqUZBc0ZA3ztgQRX670Rw1fKZBxN23NfqTV1zOTZA3RntZCOmubkZClQxqdqkMEntfMjW5bWV6safhxbA7IdqlwovyOKn1ZAyKdIDY8A7QdAec3sFdZA0TN0d8NA1sv3C559OJdPZAeQdEZD"
function handleMessage(sender_psid, received_message) {
    let response;
    if (received_message.text) {
        response = {
            "text": "Cảm ơn bạn đã nhắn tin đến cho WAKAME, chúng mình sẽ phản hồi sớm nhất có thể."
        }
    } else if (received_message.attachments) {
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }
    callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
    let response;
    let payload = received_postback.payload;
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    request({
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}