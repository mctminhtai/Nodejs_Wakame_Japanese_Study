const request = require('request');
const models = require('../models');
const PAGE_ACCESS_TOKEN = "EAASGhGZBXOZCABAB8eic8L9IMVjZAsRSJCSe90VpQZAA4HvniEGzat48BszRAMg7qZCjBe7T6BdglgkAAZCojAz1lLlKzOnqwh6UPoRKYjdoftKZCecckGrDDr620BlsJ5uhaTR17cA6HpIGbEdXi5Qpqf2YLa9ZCCqlvLdIvnLZCrCaZC5qR7p9ZCQZBZBJheAVCHYYZD"
let chatRoom = {};



let waitRoom = [];
let loadOrSave = true;
let startkey = ["ghép đôi ngẫu nhiên", "Ghép đôi ngẫu nhiên", "ghepdoingaunhien", "Ghepdoingaunhien"];
let pausekey = ["từ chối", "Từ chối", "Tuchoi", "tuchoi"];
//key kich hoat bot: ghepdoingaunhien
//key quay lai phong cho: tuchoichat
exports.get_whBackupRestore = function (req, res, next) {
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
        return res.send("OK NHA, DA LOAD ROI NHA");
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
        return res.send("OK NHA, DA LUU ROI NHA");
    }
}
exports.post_webhook = function (req, res, next) {
    let body = req.body;
    //console.log(body);
    if (body.object === 'page') {
        //console.log("check loi http 500");
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;
            console.log(sender_psid, webhook_event);
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

    // Your verify token. Should be a random string.
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
        let attachType = received_message.attachments[i].type;
        response = {
            "attachment": {
                "type": attachType,
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
    if (chuoi === undefined) {
        return false;
    } else {
        chuoi = chuoi.trim();
        let check = arr.indexOf(chuoi);
        if (check > -1) {
            return true;
        } else {
            return false;
        }
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
        } else {
            if (received_message.attachments) {
                //console.log(received_message.attachments);
                received_message.attachments.forEach((item, index) => {
                    response = genResponse(received_message, index);
                    // console.log(response);
                    return callSendAPI(PID, response);
                });
            } else {
                return callSendAPI(PID, response);
            }
        }

    } else {
        console.log('co qua day 1', waitRoom, chatRoom);
        let flag = false;
        newwaitRoom = findUIDwaitroom(UID);
        if (waitRoom.length > newwaitRoom.length) {
            flag = true;
        }
        waitRoom = newwaitRoom;
        console.log("check loi phong cho khong co ai 1", waitRoom, chatRoom);
        if (searchStr(received_message.text, startkey)) {
            console.log('co qua day 2');
            // console.log("do dai cua wairoom", waitRoom.length, waitRoom);
            console.log("check loi phong cho khong co ai 2", waitRoom, chatRoom);
            if (waitRoom.length < 1) {
                console.log('co qua day 3');
                response = genResponse(received_message, 0, "phòng chờ không có ai, App sẽ giữ bạn tại phòng chờ cho tới khi có người khác tới");
                waitRoom.push(UID);
                console.log('co qua day 4', waitRoom);
                return callSendAPI(UID, response);
            } else {
                console.log('co qua day 5', waitRoom, chatRoom);
                PID = waitRoom[Math.floor(Math.random() * waitRoom.length)];
                console.log('random PID', PID);
                chatRoom[UID] = PID;
                chatRoom[PID] = UID;
                newwaitRoom = findUIDwaitroom(UID);
                waitRoom = newwaitRoom;
                newwaitRoom = findUIDwaitroom(PID);
                waitRoom = newwaitRoom;
                response = genResponse(received_message, 0, "bạn đã được ghép thành công, chào nhau cái đi nà!!");
                callSendAPI(UID, response);
                callSendAPI(PID, response);
                console.log(waitRoom, chatRoom);
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