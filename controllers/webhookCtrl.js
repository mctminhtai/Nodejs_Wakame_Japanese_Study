exports.post_webhook = function (req, res, next) {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}
exports.get_webhook = function (req, res, next) {
    let VERIFY_TOKEN = "minhtai"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}
//FB_PAGE_TOKEN = EAASGhGZBXOZCABADJDr1qPE26Yh2JXHzfYeS1H8tPXc64g5TZBV2hgoEitqUZBc0ZA3ztgQRX670Rw1fKZBxN23NfqTV1zOTZA3RntZCOmubkZClQxqdqkMEntfMjW5bWV6safhxbA7IdqlwovyOKn1ZAyKdIDY8A7QdAec3sFdZA0TN0d8NA1sv3C559OJdPZAeQdEZD


// Handles messages events
function handleMessage(sender_psid, received_message) {

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

}