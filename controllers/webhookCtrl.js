const request = require('request');
const models = require('../models');
const PAGE_ACCESS_TOKEN = "EAASGhGZBXOZCABADJDr1qPE26Yh2JXHzfYeS1H8tPXc64g5TZBV2hgoEitqUZBc0ZA3ztgQRX670Rw1fKZBxN23NfqTV1zOTZA3RntZCOmubkZClQxqdqkMEntfMjW5bWV6safhxbA7IdqlwovyOKn1ZAyKdIDY8A7QdAec3sFdZA0TN0d8NA1sv3C559OJdPZAeQdEZD"
let chatRoom = {
    '2535433796477660': '2452863994773728',
    '2452863994773728': '2535433796477660',
    '4652877738121017': '3384751941597732',
    '3384751941597732': '4652877738121017',
    '4122971771067697': '3797147943656064',
    '3797147943656064': '4122971771067697',
    '5088775587859142': '3338652242876067',
    '3338652242876067': '5088775587859142'
};



let waitRoom = ['3751444224924423', '3315225551909654'];
let loadOrSave = false;
let startkey = ["ghép đôi ngẫu nhiên"];
let pausekey = ["từ chối"];
//key kich hoat bot: ghepdoingaunhien
//key quay lai phong cho: tuchoichat
exports.post_webhook = function (req, res, next) {
    let body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;
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
    if (loadOrSave) {
        models.WaitingRoom.findAll({ attributes: ['UID'] }).then((all) => {
            all.forEach((item) => {
                waitRoom.push(item.dataValues.UID);
            });
        });
        models.ChattingRoom.findAll({ attributes: ['UID', 'PID'] }).then((all) => {
            all.forEach((item) => {
                chatRoom[item.dataValues.UID] = item.dataValues.PID;
            });
            models.WaitingRoom.sync({ force: true });
            models.ChattingRoom.sync({ force: true });
        });
        loadOrSave = false;
    } else {
        waitRoom.forEach((item) => {
            models.WaitingRoom.create({ UID: item });
        });
        Object.keys(chatRoom).forEach((item) => {
            console.log({ UID: item, PID: chatRoom[item] });
            models.ChattingRoom.create({ UID: item, PID: chatRoom[item] });
        });
        waitRoom = [];
        chatRoom = {};
        loadOrSave = true;
    }
    res.send("OK NHA");
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
function searchStr(chuoi, arr) {
    chuoi = chuoi.trim();
    let check = arr.indexOf(chuoi);
    if (check > -1) {
        return true;
    } else {
        return false;
    }
}
function handleMessage(UID, received_message) {
    // console.log(UID);
    // console.log(received_message);
    // console.log(waitRoom, chatRoom);
    let PID = "";
    let response = genResponse(received_message);
    if (findUIDchatroom(UID)) {
        PID = chatRoom[UID]; // lay PID cua ban chat
        if (searchStr(received_message.text, pausekey)) {
            waitRoom.push(UID);
            waitRoom.push(PID);
            delete chatRoom[PID];
            delete chatRoom[UID];
            console.log("kiem tra UID va PID", waitRoom, chatRoom);
            response = genResponse(received_message, 0, "bạn đã được đưa về phòng chờ");
            callSendAPI(UID, response);
            response = genResponse(received_message, 0, "bạn đã bị người kia từ chối trò chuyện, bạn sẽ phải quay lại phòng chờ");
            callSendAPI(PID, response);
        }
        if (received_message.attachments) {
            // console.log(received_message.attachments.length);
            received_message.attachments.forEach((item, index) => {
                response = genResponse(received_message, index);
                // console.log(response);
                return callSendAPI(PID, response);
            });
        } else {
            return callSendAPI(PID, response);
        }
    } else {
        // console.log('co qua day 1', waitRoom, chatRoom);
        let flag = false;
        newwaitRoom = findUIDwaitroom(UID);
        if (waitRoom.length > newwaitRoom.length) {
            flag = true;
        }
        waitRoom = newwaitRoom;
        console.log("check loi phong cho khong co ai 1", waitRoom, chatRoom);
        if (searchStr(received_message.text, startkey)) {
            // console.log('co qua day 2');
            // console.log("do dai cua wairoom", waitRoom.length, waitRoom);
            console.log("check loi phong cho khong co ai 2", waitRoom, chatRoom);
            if (waitRoom.length < 1) {
                // console.log('co qua day 3');
                response = genResponse(received_message, 0, "phòng chờ không có ai, App sẽ giữ bạn tại phòng chờ cho tới khi có người khác tới");
                waitRoom.push(UID);
                // console.log('co qua day 4', waitRoom);
                return callSendAPI(UID, response);
            } else {
                // console.log('co qua day 5', waitRoom, chatRoom);
                PID = waitRoom[Math.floor(Math.random() * waitRoom.length)];
                chatRoom[UID] = PID;
                chatRoom[PID] = UID;
                newwaitRoom = findUIDwaitroom(UID);
                waitRoom = newwaitRoom;
                newwaitRoom = findUIDwaitroom(PID);
                waitRoom = newwaitRoom;
                response = genResponse(received_message, 0, "bạn đã được ghép thành công, chào nhau cái đi nà!!");
                callSendAPI(UID, response);
                callSendAPI(PID, response);
                // console.log(waitRoom, chatRoom);
            }
        } else {
            if (flag) {
                waitRoom.push(UID);
            }
            console.log("check loi phong cho khong co ai 3", waitRoom, chatRoom);
        }
    }
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