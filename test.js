const amqp = require('amqplib/callback_api');
const fs=require("fs");

var q = 'tx_hash';

function append(msg) {
  fs.appendFile('./test.log', msg, err => {
    if(err) throw err;
  });
}

amqp.connect('amqp://'+ process.env.MQ_HOST, (err, conn) => {
  if (err) {
    console.log(err);
  } else {
    conn.createChannel(on_open);
    function on_open(err, ch) {
      if (err) {
        console.log(err);
      } else {
        ch.assertQueue(q);
        for (let i = 0; i < 10; i ++) {
          setTimeout(function (){
            ch.sendToQueue(q, Buffer.from('do task '+i+'\n'));
          });
        }
      }
    }
  }
});

amqp.connect('amqp://'+ process.env.MQ_HOST, (err, conn) => {
  var ok = conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err) {
      console.log(err);
    } else {
      ch.assertQueue(q);
      ch.consume(q, msg => {
        if (msg) {
          append("[Worker 0] " + msg.content.toString());
          ch.ack(msg);
        }
      });
    }
  }
});

amqp.connect('amqp://'+ process.env.MQ_HOST, (err, conn) => {
  var ok = conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err) {
      console.log(err);
    } else {
      ch.assertQueue(q);
      ch.consume(q, msg => {
        if (msg) {
          append("[Worker 1] " + msg.content.toString());
          ch.ack(msg);
        }
      });
    }
  }
});
