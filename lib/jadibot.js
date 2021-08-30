const { 
  WAConnection,
  MessageType,
  Mimetypeb
} = require('@adiwajshing/baileys');
let qrcode = require('qrcode');
const fs = require("fs");

listjadibot = [];

const jadibot = async (reply, client, id) => {
  conn = new WAConnection();
  conn.logger.level = 'warn';
  conn.version = [2, 2123, 8];
  conn.browserDescription = [ 'jadi bot affis', '', '3.0' ];
  conn.on('qr', async qr =>{
    let bot = await qrcode.toDataURL(qr, { scale: 8 });
    let buffer = new Buffer.from(bot.replace('data:image/png;base64,', ''), 'base64');
    bot = await client.sendMessage(id,buffer,MessageType.image,{caption:'Scan QR Untuk menjadi bot\n*Rules:*\nQR akan diganti setiap 30 detik'});
    setTimeout(() => {
     	client.deleteMessage(id, bot.key);
    },30000);
  });
  conn.on('connecting', () => {
    client.sendMessage(id, "*[ BOT ]* _connecting..._", MessageType.text);
  });
  conn.on('open', () => {
    reply("*[ BOT ]* _CONNECTED_");
    reply("```ingat ini hanya numpang dan bila bot utama mati  maka sessions mu akan hilang secara otomatis```");
  });
  await conn.connect({timeoutMs: 30 * 1000});
  listjadibot.push(conn.user);
  require('../index.js')(conn);
};

const stopjadibot = (reply) => {
	conn = new WAConnection();
	conn.close();
	reply('Sukses stop jadibot');
};

module.exports = {
	jadibot,
	stopjadibot,
	listjadibot
};