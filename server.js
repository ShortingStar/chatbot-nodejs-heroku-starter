const express = require('express');
const http = require('https')
const middleware = require('@line/bot-sdk').middleware
const Client = require('@line/bot-sdk').Client

const app = express()

const config = {
    channelAccessToken: 'rgIjs2Vtfs/QcNvFv3yDmqXd8WaQYAgZsIvtk4FhqIzQ+TiygsNjAUeqViasErH7pTgAOu6VRP+66FMIVhP7qmzQOpntkV0aDbQcw1A3vmWWsBbYSkeDzqedsCEOK6mMYe0Sb/JuDFu5zaW3wKv8awdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'ccd51eb8412234c45d661fcd721de9f1'
}

const client = new Client(config)

app.get('/', function(req, res) {
    res.send('chatbot-nodejs-heroku-starter!!');
})

// app.use(middleware(config))

app.post('/webhook', middleware(config), (req, res) => {
    // console.log(req.body.events) // webhook event objects
    // console.log(req.body.destination) // user ID of the bot (optional)
    res.sendStatus(200)
    Promise.all(req.body.events.map(handleEvent))
})

app.set('port', (process.env.PORT || 4000))

app.listen(app.get('port'), function() {
    console.log('run at port', app.get('port'))
})

var neverSayHello = true
var replyName = ''
var replyAge = ''
var msg = ''

function handleEvent(event) {
    if (event.message.type === 'location') {
        let msg = {
            "type": "location",
            "title": "my location",
            "address": "〒150-0002 東京都渋谷区渋谷２丁目２１−１",
            "latitude": 35.65910807942215,
            "longitude": 139.70372892916203
        }
        var url = 'https://fathomless-reaches-36581.herokuapp.com/api?lat=' + event.message.latitude + '&long=' + event.message.longitude

        console.log(url)
        http.get(url, function(res) {
            var body = '';

            res.on('data', function(chunk) {
                body += chunk;
            });

            res.on('end', function() {
                var response = JSON.parse(body);
                let msg = {
                    "type": "template",
                    "altText": "this is a carousel template",
                    "template": {
                        "type": "carousel",
                        "columns": [],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                    }
                }
                console.log(typeof(msg))
                var obj = {
                    thumbnailImageUrl: '',
                    imageBackgroundColor: '#000000',
                    title: "this is menu",
                    text: "description",
                    defaultAction: {
                        "type": "uri",
                        "label": "View detail",
                        "uri": "http://example.com/page/222"
                    },
                    actions: [{
                            "type": "postback",
                            "label": "Buy",
                            "data": "action=buy&itemid=222"
                        },
                        {
                            "type": "postback",
                            "label": "Add to cart",
                            "data": "action=add&itemid=222"
                        },
                        {
                            "type": "uri",
                            "label": "View detail",
                            "uri": "http://example.com/page/222"
                        }
                    ]
                }
                response.forEach((val, index) => {
                    console.log(val.aqi.icon)
                    obj.thumbnailImageUrl = val.aqi.icon
                    obj.title = val.nameTH
                    obj.text = val.updated

                    msg.template.columns.push(obj)

                });
                console.log(msg.template.columns[0])
                return client.pushMessage(event.source.userId, msg)
            });
        }).on('error', function(e) {
            console.log("Got an error: ", e);
        });

        // return client.replyMessage(event.replyToken, msg)
    }


    //----------------------------------------------------------------------------------------

    // if (event.message.type === 'text' && event.message.text === 'สวัสดี') {
    //     if (neverSayHello) {
    //         msg = {
    //             type: "text",
    //             text: 'สวัสดีครับ คุณชื่ออะไร?'
    //         }
    //         neverSayHello = false
    //     } else {
    //         if (replyName === '') {
    //             msg = {
    //                 type: "text",
    //                 text: 'สวัสดีอีกครั้งครับ คุณยังไม่ได้บอกชื่อเลย'
    //             }
    //         } else {
    //             msg = {
    //                 type: "text",
    //                 text: 'สวัสดีครับ คุณ' + replyName
    //             }
    //         }
    //     }
    //     client.replyMessage(event.replyToken, msg)
    // } else if (event.message.type === 'text' && event.message.text === 'reset') {
    //     let reset = {
    //         type: "text",
    //         text: 'เริ่มต้นระบบลบความทรงจำ...เสร็จสมบูรณ์'
    //     }
    //     neverSayHello = true
    //     replyName = ''
    //     replyAge = ''
    //     msg = ''
    //     client.replyMessage(event.replyToken, reset)
    // } else if (event.message.type === 'text') {
    //     if (replyName === '') {
    //         replyName = event.message.text
    //         msg = {
    //             type: "text",
    //             text: 'สวัสดีครับ คุณ' + replyName + ' คุณอายุเท่าไหร่'
    //         }
    //         client.replyMessage(event.replyToken, msg)
    //     } else if (replyAge === '') {
    //         replyAge = event.message.text
    //         msg = {
    //             type: "text",
    //             text: 'คุณ' + replyName + ' อายุ ' + replyAge + ' เองเหรอครับ...'
    //         }
    //         client.replyMessage(event.replyToken, msg)
    //     } else {
    //         reset = {
    //             type: "text",
    //             text: 'ขอบคุณมากครับ ระบบจะปิดตัวลงแล้ว'
    //         }
    //         neverSayHello = true
    //         replyName = ''
    //         replyAge = ''
    //         msg = ''
    //         client.replyMessage(event.replyToken, reset)
    //     }
    // }

    // --------------------------------------------------------------------------------------

    // if (event.message.type === 'text' && event.message.text === 'สวัสดี') {
    //     var messageText = event.message.text
    //     var messageSplit = messageText.split('x')
    //     if (messageSplit[0].trim() === 'สวัสดี') {
    //         let msg = {
    //             type: "text",
    //             text: 'สวัสดี'
    //         }

    //         for (var i = 0; i < parseInt(messageSplit[1].trim()); i++) {
    //             client.pushMessage(event.source.userId, msg)
    //         }
    //     }
    // } else if (event.message.type === 'text' && event.message.text === 'location') {
    //     let msg = {
    //         "type": "location",
    //         "title": "my location",
    //         "address": "〒150-0002 東京都渋谷区渋谷２丁目２１−１",
    //         "latitude": 35.65910807942215,
    //         "longitude": 139.70372892916203
    //     }
    //     return client.replyMessage(event.replyToken, msg)
    // } else if (event.message.type === 'text' && event.message.text === 'menu') {
    //     let msg = {
    //         "type": "template",
    //         "altText": "this is a carousel template",
    //         "template": {
    //             "type": "carousel",
    //             "columns": [{
    //                     "thumbnailImageUrl": "https://google.com",
    //                     "imageBackgroundColor": "#ffffff",
    //                     "title": "this is menu",
    //                     "text": "description",
    //                     "defaultAction": {
    //                         "type": "uri",
    //                         "label": "View detail",
    //                         "uri": "http://example.com/page/123"
    //                     },
    //                     "actions": [{
    //                             "type": "postback",
    //                             "label": "Buy",
    //                             "data": "action=buy&itemid=111"
    //                         },
    //                         {
    //                             "type": "postback",
    //                             "label": "Add to cart",
    //                             "data": "action=add&itemid=111"
    //                         },
    //                         {
    //                             "type": "uri",
    //                             "label": "View detail",
    //                             "uri": "http://example.com/page/111"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "thumbnailImageUrl": "https://static1.squarespace.com/static/572cd66e4d088e89334e497a/t/5b0f1087758d46a041f4e0f5/1527867788438/Day+4+Nawal+I%27x.jpg",
    //                     "imageBackgroundColor": "#82a066",
    //                     "title": "this is menu",
    //                     "text": "description",
    //                     "defaultAction": {
    //                         "type": "uri",
    //                         "label": "View detail",
    //                         "uri": "http://example.com/page/222"
    //                     },
    //                     "actions": [{
    //                             "type": "postback",
    //                             "label": "Buy",
    //                             "data": "action=buy&itemid=222"
    //                         },
    //                         {
    //                             "type": "postback",
    //                             "label": "Add to cart",
    //                             "data": "action=add&itemid=222"
    //                         },
    //                         {
    //                             "type": "uri",
    //                             "label": "View detail",
    //                             "uri": "http://example.com/page/222"
    //                         }
    //                     ]
    //                 }
    //             ],
    //             "imageAspectRatio": "rectangle",
    //             "imageSize": "cover"
    //         }
    //     }

    //     return client.replyMessage(event.replyToken, msg)
    // }
}