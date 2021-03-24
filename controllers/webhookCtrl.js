const request = require('request');
const models = require('../models');
const PAGE_ACCESS_TOKEN = "EAASGhGZBXOZCABADJDr1qPE26Yh2JXHzfYeS1H8tPXc64g5TZBV2hgoEitqUZBc0ZA3ztgQRX670Rw1fKZBxN23NfqTV1zOTZA3RntZCOmubkZClQxqdqkMEntfMjW5bWV6safhxbA7IdqlwovyOKn1ZAyKdIDY8A7QdAec3sFdZA0TN0d8NA1sv3C559OJdPZAeQdEZD"
let chatRoom = {};
let waitRoom = [];

exports.post_webhook = function (req, res, next) {
    let body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;
            //console.log(typeof (sender_psid));
            //console.log('Sender PSID: ' + sender_psid);
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
    // let UID = 2463540117037048;
    // for (let i = 0; i < 10; i++) {
    //     UID = UID + 1;
    //     models.WaitingRoom.create({ UID: UID });
    // }
    // res.send('OK');
    models.WaitingRoom.findAll({ attributes: ['UID'] }).then((all) => {
        all.forEach((item) => {
            waitRoom.push(item.dataValues.UID);
        });
    });
    models.ChattingRoom.findAll({ attributes: ['UID', 'PID'] }).then((all) => {
        all.forEach((item) => {
            chatRoom[item.dataValues.UID] = item.dataValues.PID;
        });
    });
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
function findUIDchatroom(UID) {
    if (chatRoom[UID]) {
        return true;
    }
    return false;
}
function findUIDwaitroom(UID) {
    let newwaitRoom = waitRoom.filter((item) => {
        return item != UID;
    });
    return newwaitRoom;
}
function genResponse(received_message, i = 0, mess = "") {
    let response;
    //console.log(received_message.attachments[0].payload);
    if (received_message.text) {
        response = {
            "text": mess || received_message.text
        }
    } else if (received_message.attachments) {
        let attachment_url = received_message.attachments[i].payload.url;
        response = {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": attachment_url,
                    "is_reusable": true
                }
            }
        }
    }
    return response;
}
function handleMessage(UID, received_message) {
    // console.log(UID);
    // console.log(received_message);
    // console.log(waitRoom, chatRoom);
    let PID = "";
    let response = genResponse(received_message);
    if (findUIDchatroom(UID)) {
        PID = chatRoom[UID]; // lay PID cua ban chat
        if (received_message.attachments) {
            received_message.attachments.forEach((item, index) => {
                response = genResponse(received_message, index);
                return callSendAPI(PID, response);
            });
        } else {
            return callSendAPI(PID, response);
        }
    } else {
        // console.log('co qua day 1');
        newwaitRoom = findUIDwaitroom(UID);
        waitRoom = newwaitRoom;
        if (received_message.text == "bat dau chat thoi") {
            // console.log('co qua day 2');
            // console.log("do dai cua wairoom", waitRoom.length, waitRoom);
            if (waitRoom.length < 1) {
                // console.log('co qua day 3');
                response = genResponse(received_message, 0, "phong cho khong con ai");
                waitRoom.push(UID);
                // console.log('co qua day 4', waitRoom);
                return callSendAPI(UID, response);
            }
            PID = waitRoom[Math.floor(Math.random() * waitRoom.length)];
            chatRoom[UID] = PID;
            chatRoom[PID] = UID;
            console.log(waitRoom, chatRoom);
        }
    }
    callSendAPI(UID, response);
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
        "uri": "https://graph.facebook.com/v10.0/me/messages",
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