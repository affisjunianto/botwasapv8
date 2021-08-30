const {
  WAConnection,
	MessageType,
	Presence,
	MessageOptions,
	Mimetype,
	WALocationMessage,
	WA_MESSAGE_STUB_TYPES,
	WA_DEFAULT_EPHEMERAL,
	ReconnectMode,
	ProxyAgent,
	ChatModification,
	GroupSettingChange,
	waChatKey,
	mentionedJid,
	processTime,
	Browsers
} = require("@adiwajshing/baileys");
const { getBuffer, color, getGroupAdmins, createExif, getRandom, modStick} = require("./lib/function.js");
const { spawn, exec, execSync } = require("child_process");
const speed = require('performance-now');
const ig = require('insta-fetcher');
const hx = require("hxz-api");
const brainly = require('brainly-scraper');
const fs = require("fs");
const ffmpeg = require('fluent-ffmpeg');
const yts = require( 'yt-search');
const request = require('request');
const axios = require("axios");
const moment = require("moment-timezone");
const { jadibot, stopjadibot, listjadibot } = require('./lib/jadibot');
const { yta, ytv, igdl, upload, formatDate } = require('./lib/ytdl');

//data
mns = "```";
battery = {
  persen: "" || "tidak terdeteksi",
  charger: "" || false
};
blocked = [];

//for time
function tanggal(){
  myMonths = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
	myDays = ['Minggu','Senin','Selasa','Rabu','Kamis','Jum at','Sabtu'];
	var tgl = new Date();
	var day = tgl.getDate();
	bulan = tgl.getMonth();
	var thissDay = tgl.getDay(),
	thisDay = myDays[thissDay];
	var yy = tgl.getYear();
	var year = (yy < 1000) ? yy + 1900 : yy;
	return `${thisDay}, ${day} - ${myMonths[bulan]} - ${year}`;
}

const runtime = function (seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " hari, " : " Hari, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " jam, " : " Jam, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " menit, " : " Menit, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " detik" : " Detik") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss");
if (time2 < "24:59:00") {
  var ucapanWaktu = "Selamat malam";
}
if (time2 < "19:00:00") {
  var ucapanWaktu = "Selamat senja";
}
if (time2 < "18:00:00") {
  var ucapanWaktu = "Selamat sore";
}
if (time2 < "15:00:00") {
  var ucapanWaktu = "Selamat siang";
}
if (time2 < "11:00:00") {
  var ucapanWaktu = "Selamat pagi";
}
if (time2 < "05:00:00") {
  var ucapanWaktu = "Selamat malam";
}


module.exports = (client) => {
  client.on("group-update", async(mem) => {
    metadata = await client.groupMetadata(mem.jid);
    if (mem.announce == "false") {
      client.sendMessage(metadata.id, `*[ Group Opened ]* \n\n${mns}group telah di buka oleh admin${mns}\n${mns}sekarang semua member bisa mengirim pesan${mns}`, MessageType.text);
      console.log(`[ GROUP OPENED ]\ngroup : ${metadata.subject}`);
    } else if (mem.announce == "true"){
      client.sendMessage(metadata.id, `*[ Group Closed ]* \n\n${mns}group telah di tutup oleh admin${mns}\n${mns}sekarang hanya admin yang bisa mengirim pesan${mns}`, MessageType.text);
      console.log(`[ GROUP CLOSED ]\ngroup : ${metadata.subject}`);
    } else if (!mem.desc == "") {
      tag = mem.descOwner.split("@")[0] + "@s.whatsapp.net";
      client.sendMessage(metadata.id, `*[ Group Description Change ]*\n\ndeskripsi group telah di ubah oleh owner ${mem.descOwner.split("@")[0]}\n\ndeskripsi baru: ${mem.desc}`, MessageType.text, {
        contextInfo:{mentionedJid:[tag]}
      });
      console.log(`[ DESCRIPTION CHANGE ]\ngroup : ${metadata.subject}`);
    } else if (mem.restrict == "false") {
      client.sendMessage(metadata.id, `*[ Group Setting Change ]*\n\nfitur edit group telah di buka\nsekarang semua member dapat mengedit info group`, MessageType.text);
      console.log(`[ GROUP SETTING CHANGE ]\ngroup : ${metadata.subject}`);
    } else if (mem.restrict == "true") {
      client.sendMessage(metadata.id, `*[ Group Setting Change ]*\n\nfitur edit group telah di tutup\nsekarang hanya admin yang dapat mengedit info group`, MessageType.text);
      console.log(`[ GROUP SETTING CHANGE ]\ngroup : ${metadata.subject}`);
    }
  });
  client.on("group-participants-update", async(mem) => {
    try {
      groupMetadata =await client.groupMetadata(mem.jid);
      groupMembers = groupMetadata.participants;
      groupAdmins = getGroupAdmins(groupMembers);
      anu = mem.participants[0];
      ppmem = await client.getProfilePicture(anu);
      try {
        pp_user = await client.getProfilePicture(anu);
      } catch (e) {
        pp_user =
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60";
      }
      if (mem.action == "add" ) {
        buff = await getBuffer(ppmem);
        text = `${ucapanWaktu} @${anu.split("@")[0]}\nselamat datang di group ${groupMetadata.subject}\n\n*info group*\nmember: ${groupMembers.length}/256\ndeskripsi: ${groupMetadata.desc}\n\n`;
        client.sendMessage(groupMetadata.id, buff, MessageType.image, { caption: text, contextInfo: { mentionedJid: [anu.split("@")[0] + "@s.whatsapp.net"]}});
      } else if (mem.action == "remove" ) {
        buff = await getBuffer(ppmem);
        text = `sampai jumpa @${anu.split("@")[0]}\nsemoga tenang di alam sana ya kak:)`;
        client.sendMessage(groupMetadata.id, buff, MessageType.image, { caption: text, contextInfo: { mentionedJid: [anu.split("@")[0] + "@s.whatsapp.net"]}});
      } else if (mem.action == "promote") {
        client.sendMessage(groupMetadata.id, `@${anu.split("@")[0]} telah di promote`, MessageType.text, { contextInfo: {mentionedJid: [anu.split("@")[0]+ "@s.whatsapp.net"]}});
      } else if (mem.action == "demote") {
        client.sendMessage(groupMetadata.id, `@${anu.split("@")[0]} telah di demote`, MessageType.text, { contextInfo: {mentionedJid: [anu.split("@")[0]+ "@s.whatsapp.net"]}});
      }
    } catch (e) {
      console.log("Error : %s", color(e, "red"));
    }
  });
  client.on("CB:Blocklist", (json) => {
    if (blocked.length > 2) return;
    for (let i of json[1].blocklist){
      blocked.push(i.replace("c.us","s.whatsapp.net"));
    }
  });
  client.on("CB:action,,battery", (json) => {
    const batteryLevelStr = json[2][0][1].value;
    const batteryLevel = parseInt(batteryLevelStr);
    battery.persen = `${batteryLevel}%`;
    battery.charger = json[2][0][1].live;
  });
  client.on("chat-update", async(mek) => {
    try {
      if (!mek.hasNewMessage) return;
      mek = mek.messages.all()[0];
      if (!mek.message) return
      if (mek.key.fromMe) return
      if (mek.key && mek.key.remoteJid == "status@broadcast") return;
      global.blocked;
      mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
      const content = JSON.stringify(mek.message);
      const from = mek.key.remoteJid;
      const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product, buttonsMessage } = MessageType;
      const type = Object.keys(mek.message)[0];
      const cmd =
        type === "conversation" && mek.message.conversation
          ? mek.message.conversation
          : type == "imageMessage" && mek.message.imageMessage.caption
          ? mek.message.imageMessage.caption
          : type == "videoMessage" && mek.message.videoMessage.caption
          ? mek.message.videoMessage.caption
          : type == "extendedTextMessage" && mek.message.extendedTextMessage.text
          ? mek.message.extendedTextMessage.text
          : type == "buttonsResponseMessage" && mek.message[type].selectedButtonId
          ? mek.message[type].selectedButtonId
          : "";
      const prefix = /^[°•π÷×¶∆£¢€¥®™=|~!#$%^&.?/\\©^z+*@,;]/.test(cmd) ? cmd.match(/^[°•π÷×¶∆£¢€¥®™=|~!#$%^&.?/\\©^z+*,;]/gi) : '#'
      body = 
        type === 'listResponseMessage' && mek.message.listResponseMessage.title 
          ? mek.message.listResponseMessage.title 
          : type == 'buttonsResponseMessage' && mek.message.buttonsResponseMessage.selectedButtonId
          ? mek.message.buttonsResponseMessage.selectedButtonId
          : type == "conversation" && mek.message.conversation.startsWith(prefix)
          ? mek.message.conversation
          : type == "imageMessage" &&
            mek.message.imageMessage.caption.startsWith(prefix)
          ? mek.message.imageMessage.caption
          : type == "videoMessage" &&
            mek.message.videoMessage.caption.startsWith(prefix)
          ? mek.message.videoMessage.caption
          : type == "extendedTextMessage" &&
            mek.message.extendedTextMessage.text.startsWith(prefix)
          ? mek.message.extendedTextMessage.text
          : "";
      listbut = (type == 'listResponseMessage') ? mek.message.listResponseMessage.title : ''
      const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
      const args = body.trim().split(/ +/).slice(1)
      const isCmd = body.startsWith(prefix)
      const q = args.join(' ')
      const botNumber = client.user.jid
      const isGroup = from.endsWith("@g.us")
      const sender = mek.key.fromMe
        ? client.user.jid
        : isGroup
        ? mek.participant
        : mek.key.remoteJid
      const totalchat = client.chats.all()
      const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
      const groupName = isGroup ? groupMetadata.subject : ''
      const groupId = isGroup ? groupMetadata.jid : ''
      const groupMembers = isGroup ? groupMetadata.participants : ''
      const groupDesc = isGroup ? groupMetadata.desc : ''
      const groupOwner = isGroup ? groupMetadata.owner : ''
      const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
      const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
      const isGroupAdmins = groupAdmins.includes(sender) || false
      const conts = mek.key.fromMe ? client.user.jid : client.contacts[sender] || { notify: jid.replace(/@.+/, '') }
      const pushname = mek.key.fromMe ? client.user.name : conts.notify || conts.vname || conts.name || '-'
      const more = String.fromCharCode(8206)
      const readMore = more.repeat(4001)
      const isUrl = (url) => {
        return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
      }

      const reply = (teks) => {
        client.sendMessage(from, teks, text, {quoted:mek})
      }
      const fakethumb = (teks, yes) => {
            client.sendMessage(from, teks, image, {thumbnail:fs.readFileSync('./lib/image/fake.jpeg'),quoted:mek,caption:yes})
        }
        
      const sendButtonMsg = (text, footer, but = [], options = {}) => {
        const buttonMessagek = {
          contentText: text,
          footerText: footer,
          buttons: but,
          headerType: 1
        };
        client.sendMessage(
          from,
          buttonMessagek,
          buttonsMessage,
          options
        )
      }
      
      const sendMediaURL = async(url, text="", mids=[]) =>{
        if(mids.length > 0){
          text = normalizeMention(to, text, mids)
        }
        const fn = Date.now() / 10000;
        const filename = fn.toString()
        let mime = ""
        var download = function (uri, filename, callback) {
          request.head(uri, function (err, res, body) {
            mime = res.headers['content-type']
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
          });
        };
        download(url, filename, async function () {
          console.log('done');
          let media = fs.readFileSync(filename)
          let type = mime.split("/")[0]+"Message"
          if(mime === "image/gif"){
            type = MessageType.video
            mime = Mimetype.gif
          }
          if(mime.split("/")[0] === "audio"){
            mime = Mimetype.mp4Audio
          }
          client.sendMessage(from, media, type, { quoted: mek, mimetype: mime, caption: text,contextInfo: {"mentionedJid": mids}})
                    
          fs.unlinkSync(filename)
        });
      }
      
      const isMedia = type === "imageMessage" || type === "videoMessage";
      const isQuotedImage =
        type === "extendedTextMessage" && content.includes("imageMessage");
      const isQuotedVideo =
        type === "extendedTextMessage" && content.includes("videoMessage");
      const isQuotedAudio =
        type === "extendedTextMessage" && content.includes("audioMessage");
      const isQuotedSticker =
        type === "extendedTextMessage" && content.includes("stickerMessage");
      
      
      if (isCmd && !isGroup) console.log("[",color("command","lime"),"]",time2,color(command,"lime"),"from",color(sender.split("@")[0],"cyan"))
      if (isCmd && isGroup) console.log("[",color("command","lime"),"]",time2,color(command,"lime"),"from",color(sender.split("@")[0],"cyan"),"in",color(groupName,"yellow"))
      if (listbut) console.log("[",color("command","lime"),"]",time2,color(listbut,"lime"),"from",color(sender.split("@")[0],"cyan"))
//list command
      if (listbut == 'all menu' || command == `${prefix}start`) {
        var menu = `
${ucapanWaktu} kak ${pushname}

*❏ About Bot*
├ *name* : ${client.user.name}
├ *battery* : ${battery.persen}
├ *charger* : ${battery.charger}
├ *phone* : ${client.user.phone.device_manufacturer}
└ *model* : ${client.user.phone.device_model}

*❏ About user*
├ *name* : ${pushname}
├ *nomer* : ${sender.split("@")[0]}
├ *browser* : ${client.browserDescription[0]}
├ *server* : ${client.browserDescription[1]}
├ *version* : ${client.browserDescription[2]}
└ *version Wa* : ${client.user.phone.wa_version}
${readMore}
*❏ Sticker*
└ *${prefix}sticker* _<reply image,video,sticker>_

*❏ experiment features*
├ *${prefix}jadibot*
├ *${prefix}stopjadibot*
└ *${prefix}listjadibot*

*❏ Edukasi*
├ *${prefix}lirik* _<judul lagu>_
└ *${prefix}brainly* _<soal>_

*❏ Download Yt*
├ *${prefix}play* _<judul lagu>_
├ *${prefix}ytsearch* _<judul search>_
├ *${prefix}ytmp3* _<link video>_
├ *${prefix}ytmp4* _<link video>_
└ *${prefix}video* _<judul video>_

*❏ Download Medsos*
├ *${prefix}igstalk* _<@username>_
├ *${prefix}ig* _<link post>_
├ *${prefix}fb* _<link post>_
├ *${prefix}igstory* _<@usernam>_
├ *${prefix}twitter* _<link twit>_
├ *${prefix}tiktok* _<link post>_

*❏ Group*
├ *${prefix}join* _<link group>_
├ *${prefix}linkgc*
└ *${prefix}leave*
`;
        sendButtonMsg(menu, `runtime: ${runtime(process.uptime())}`,[{
          buttonId: `${prefix}owner`,
            buttonText: {
              displayText: "owner"
            },
            type: 1
          },{
            buttonId: `${prefix}github`,
            buttonText: {
              displayText: "script bot"
            },
            type: 1
        }])
      } else if (listbut == "donasi") {
        const donate = `
*❏ Donate Pages*
├ *pulsa* : +62 823-3429-7175
├ *dana* : +62 895-7100-73737
└ *kuota* : +62 877-6182-2449 (XL)
`
        client.sendMessage(from, fs.readFileSync("./lib/image/donasi.jpeg"), image, {quoted: mek, caption:donate})
      } else if (listbut == "sosial media") {
        const medsos = `
*❏ Sosial Media*
├ *github* : http://github.com/affisjunianto
├ *Fb* : affis junianto tri saputro
├ *Ig* : @affis_saputro123
├ *Wa* : +62 823-3429-7175
└ *Yt* : comming soon
`
        client.sendMessage(from, fs.readFileSync("./lib/image/medsos.jpeg"), image, {quoted: mek, caption: medsos})
      }
//case
      switch (command) {
        case 'help':
        case 'menu':
          var menulist = client.prepareMessageFromContent(from, {
            "listMessage" :{
              "title": `${ucapanWaktu} kak ${pushname}\n\nini adalah bot ${client.user.name}\nbot ini bisa di buat menggunakan termux. untuk script nya bisa di download di github owner\ndan untuk fitur fitur nya bisa kalian add sendiri:)\n\nThanks for suports\nortu\nfadhil\nangga\nbryan\nhanz\nadiwajshing\ntermos bot maker\nmhankbarbar`,
              "description": `bot ini berjalan selama \n${runtime(process.uptime())}`,
              "buttonText": "click here👈",
              "listType": "SINGLE_SELECT",
              "sections": [{
                "title": `${tanggal()}`,
                "rows": [{
                    "title": "all menu",
                    "rowId": "0",
                    "description": ""
                  },{
                    "title": "sosial media",
                    "rowId": "1",
                    "description": ""
                  },{
                    "title": "donasi",
                    "rowId": "2",
                    "description": ""
                  }]
              }]
            }
          }, {})
          client.relayWAMessage(menulist, {waitForAck: false})
          break;
        case 'owner':
          const vacrd = `BEGIN:VCARD\n`+`VERSION:3.0\n`+
                        `FN:owner Bot\n`+
                        `ORG:Developer ${client.user.name}\n`+
                        'TEL;type=CELL;type=VOICE;waid=6282334297175' +
                        ':+6282334297175\n' + 
                        'END:VCARD'
          client.sendMessage(from, {display: "owner Bot", vcard: vacrd}, contact, {quoted: mek})
          break;
        case 'github':
          client.sendMessage(from, "*❏ My github for download this script*\n\nhttp://github.com/affisjunianto", text)
          break;
        case 'play':
          if (args.length === 0) return reply(`parameter salah\nsilahkan ketik *${prefix}play* _lagu yang ingin di cari_`)
          var srch = args.join('')
          find = await yts(srch)
          res = find.all
          var reslink = res[0].url;
          try {
            yta(reslink)
            .then((res) => {
              const { dl_link, thumb, title, filesizeF, filesize } = res
              axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
              .then(async (a) => {
                if (Number(filesize) >= 100000) return sendMediaURL(thumb, `*PLAY MUSIC*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${a.data}\n\n_Untuk durasi lebih dari batas disajikan dalam bentuk link_`)
                sendMediaURL(thumb, `*PLAY MUSIC*\n\n*Title* : ${title}\n*Ext* : MP3\n*Size* : ${filesizeF}\n*Link* : ${a.data}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`)
                await sendMediaURL(dl_link).catch(() => reply('error'))
              })
            })
          } catch (e) {
            reply(`server error`)
          }
          break;
        case 'video':
          if (args.length === 0) return reply(`Kirim perintah *${prefix}video* _Judul lagu yang akan dicari_`)
          var srch = args.join('')
          find = await yts(srch);
          res = find.all 
          var reslink = res[0].url
          try {
            ytv(reslink)
            .then((res) => {
              const { dl_link, thumb, title, filesizeF, filesize } = res
              axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
              .then(async (a) => {
                if (Number(filesize) >= 100000) return sendMediaURL(thumb, `*PLAY VIDEO*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${a.data}\n\n_Untuk durasi lebih dari batas disajikan dalam mektuk link_`)
                const captions = `*PLAY VIDEO*\n\n*Title* : ${title}\n*Ext* : MP4\n*Size* : ${filesizeF}\n*Link* : ${a.data}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                sendMediaURL(thumb, captions)
                await URL(dl_link).catch(() => reply('error'))
              })                
            })
          } catch (e) {
            reply('server error')
          }                         
          break;
        case 'swm':
        case 'stickerwm':
        case 'sticker':
          var a = "affis junianto";
          var b = "+6282334297175";
          if (isMedia && !mek.message.videoMessage || isQuotedImage ) {
          const encmedia = isQuotedImage   ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
           media = await client.downloadAndSaveMediaMessage(encmedia)
          await createExif(a,b)
          out = getRandom('.webp')
          ffmpeg(media)
          .on('error', (e) => {
          console.log(e)
          client.sendMessage(from, 'Terjadi kesalahan', 'conversation', { quoted: mek })
          fs.unlinkSync(media)
          })
          .on('end', () => {
          _out = getRandom('.webp')
          spawn('webpmux', ['-set','exif','./stick/data.exif', out, '-o', _out])
          .on('exit', () => {
          client.sendMessage(from, fs.readFileSync(_out),'stickerMessage', { quoted: mek })
          fs.unlinkSync(out)
          fs.unlinkSync(_out)
          fs.unlinkSync(media)
          })
          })
          .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
          .toFormat('webp')
          .save(out) 
          } else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
          const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
          const media = await client.downloadAndSaveMediaMessage(encmedia)
          await createExif(a,b)
          out = getRandom('.webp')
          ffmpeg(media)
          .on('error', (e) => {
          console.log(e)
          client.sendMessage(from, 'Terjadi kesalahan', 'conversation', { quoted: mek })
          fs.unlinkSync(media)
          })
          .on('end', () => {
          _out = getRandom('.webp')
          spawn('webpmux', ['-set','exif','./stick/data.exif', out, '-o', _out])
          .on('exit', () => {
          client.sendMessage(from, fs.readFileSync(_out),'stickerMessage', { quoted: mek })
          fs.unlinkSync(out)
          fs.unlinkSync(_out)
          fs.unlinkSync(media)
          })
          })
          .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
          .toFormat('webp')
          .save(out)       
          } else if (isQuotedSticker){
            const encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
            media = await client.downloadAndSaveMediaMessage(encmedia)
            createExif(a, b);
            modStick(media, client, mek, from)
          } else {
          reply(`Kirim gambar dengan caption ${prefix}swm atau tag gambar yang sudah dikirim`)
          }
          break;
        case 'join':
          if (args.length === 0 ) return reply(`please input params\n${prefix}join _link gc wa_`)
          var link = body.slice(6)
          res = link.replace("https://chat.whatsapp.com/", "");
          done = await client.acceptInvite(res)
          reply(`berhasil bergabung di ${done.gid}`)
          break;
        case 'leave':
          if (!isGroup) return reply("khusus gc")
          if (!groupAdmins) return reply("khusus group admin")
          client.groupLeave(from)
          .then((res) => {
            client.sendMessage(sender, "perintah untuk keluar berhasil di eksekusi", text)
          })
          break;
        case 'setdescgc':
          if (!isGroup)return reply("khusus gc")
          if (!isBotGroupAdmins) return reply("bot harus jadi admin")
          const newdesc = body.slice(11)
          const olddesc = groupDesc
          try {
          client.groupUpdateDescription(from, newdesc)
          reply(`berhasil mengganti description group\ndari: ${olddesc}\n\nmenjadi: ${newdesc}`)
          } catch (e) {
            reply(e)
          }
          break;
        case 'ytsearch':
          if (args.length < 1) return reply("masukan judul video")
          var search = args.join('')
          try {
            var find = await yts(search)
          } catch {
            return await reply("error")
          }
          result = find.all
          var tbuff = await getBuffer(result[0].image)
          var ytres = `*[ YT Result ]*\n*————————————————————*\n\n`
          find.all.map((video) => {
            ytres += '❏ Title: ' + video.title + '\n'
            ytres += '❏ Link: ' + video.url + '\n'
            ytres += '❏ Durasi: ' + video.timestamp + '\n'
            ytres += `❏ Upload: ` + video.ago +`\n*————————————————————*\n\n`
          })
          await fakethumb(tbuff, ytres)
          break;
        case 'igstalk':
          if (args.length < 1) return reply("masukan username")
          ig.fetchUser(args[0])
          .then(user => {
            thum = `${user.profile_pic_url_hd}`
            desc = `*ID* : ${user.profile_id}\n*Username* : ${args.join('')}\n*Full Name* : ${user.full_name}\n*Bio* : ${user.biography}\n*Followers* : ${user.followers}\n*Following* : ${user.following}\n*Private* : ${user.is_private}\n*Verified* : ${user.is_verified}\n\n*Link* : https://instagram.com/${args.join('')}`
            sendMediaURL(thum, desc)
          })
          break;
        case 'ytmp3':
          if (args.length < 1) return reply('masukan link youtube yang mau di download')
          var link = args[0].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
          if (!link) return reply("link yang anda masukan invalid")
          try {
            reply("wait....")
            yta(args[0])
            .then((res) =>{
              const { dl_link, thumb, title, filesizeF, filesize } = res
              axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
              .then((a) => {
                if (Number(filesize) >= 30000) return sendMediaURL(thumb, `*Data Berhasil Didapatkan!*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${a.data}\n\n_Untuk durasi lebih dari batas disajikan dalam mektuk link_`)
                const caption = `*YTMP3*\n\n*Title* : ${title}\n*Ext* : MP3\n*Size* : ${filesizeF}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                sendMediaURL(thumb, caption)
                sendMediaURL(dl_link).catch(() => reply("file error"))
              })
            })
          } catch (e) {
            reply("error server")
          }
          break;
        case 'ytmp4':
          if (args.length < 1) return reply('masukan link youtube yang mau di download')
          var link = args[0].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
          if (!link) return reply("link yang anda masukan invalid")
          try {
            reply("wait....")
            ytv(args[0])
            .then((res) =>{
              const { dl_link, thumb, title, filesizeF, filesize } = res
              axios.get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
              .then((a) => {
                if (Number(filesize) >= 30000) return sendMediaURL(thumb, `*Data Berhasil Didapatkan!*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${a.data}\n\n_Untuk durasi lebih dari batas disajikan dalam mektuk link_`)
                const caption = `*YTMP4*\n\n*Title* : ${title}\n*Ext* : MP3\n*Size* : ${filesizeF}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`
                sendMediaURL(thumb, caption)
                sendMediaURL(dl_link).catch(() => reply("file error"))
              })
            })
          } catch (e) {
            reply("error server")
          }
          break;
        case 'ig':
          if (!isUrl(args[0]) && !args[0].includes('instagram.com') && args.length < 1) return reply("coba check link nya")
          reply("tunggu")
          hx.igdl(args[0])
          .then(async (res) => {
            for (let i of res.medias) {
              if (i.url.includes("mp4")){
                let link = await getBuffer(i.url)
                client.sendMessage(from,link,video,{quoted: mek,caption: `Type : ${i.type}`})
              } else {
                let link = await getBuffer(i.url)
                client.sendMessage(from,link,image,{quoted: mek,caption: `Type : ${i.type}`})
              }
            }
          })
          break;
        case 'fb':
          if (!isUrl(args[0]) && !args[0].includes('facebook.com') && args.length < 1) return reply("coba check link nya")
          reply("tunggu")
          hx.fbdown(args[0])
          .then(res => {
            link = `${res.HD}`
            sendMediaURL(link, `*Link video_normal* : ${re.Normal_video}`)
          })
          break;
        case 'igstory':
          if(!q) return reply('Usernamenya?')
          hx.igstory(q)
          .then(async result => {
            for(let i of result.medias){
              if(i.url.includes('mp4')){
                let link = await getBuffer(i.url)
                client.sendMessage(from,link,video,{quoted: mek,caption: `Type : ${i.type}`})
              } else {
                let link = await getBuffer(i.url)
                client.sendMessage(from,link,image,{quoted: mek,caption: `Type : ${i.type}`})                  
              }
            }
          });
          break;
        case 'linkgc':
          if (!isGroup) return reply("command khusus group")
          if (!isBotGroupAdmins) return reply("bot harus jadi admin")
          try {
            const linkgece = await client.groupInviteCode(from)
            reply(`link group ${groupName}\nlink: http://whatsapp.com/${linkgece}`)
          } catch (e) {
            reply("link group invalid or expired")
          }
          break;
        case 'twitter':
          if (!isUrl(args[0]) && !args[0].includes('twitter.com') && !q) return reply("link Twitter?")
          var res = await hx.twitter(args[0])
          sendMediaURL(res.HD, "DONE✓")
          break;
        case 'tiktok':
          if (!isUrl(args[0]) && !args[0].includes('tiktok.com') && !q) return reply("link tiktok nya tuan")
          sek = await reply("wait ya bund")
          hx.ttdownloader(args[0])
          .then(res => {
            const {
              nowm
            } = res;
            axios.get(`https://tinyurl.com/api-create.php?url=${nowm}`)
            .then(async (a) => {
              me = `link: ${a.data}`
              salsa.sendMessage(from,{url:`${nowm}`},video,{mimetype:'video/mp4',quoted:mek,caption:me})
              setTimeout(() => {
                client.deleteMessage(from, sek.key)
              }, 10000);
            })
          })
          .catch( e => console.log(e))
          break;
        case 'brainly':
          if (args.length < 1) return reply('Pertanyaan apa')
          soal = args.join(' ')
          brainly(`${soal}`)
          .then(res => {
            let teks = `<==========================>\n`
            for (let i of res.data) {
              teks += `*[ Brainly ]*\nsoal:${i.pertanyaan}\n\njawaban:${i.jawaban[0].text}\n<==========================>\n`
            }
            client.sendMessage(from, teks, text,{quoted:mek,detectLinks: false})
          })
          break;
        case 'lirik':
          if(!q) return reply('lagu apa?')
          let song = await hx.lirik(q);
          sendMediaURL(song.thumb, song.lirik)
          break;
        case 'jadibot':
          if (mek.key.fromMe) return reply("tidak bisa menjadi bot dalam bot")
          jadibot(reply, client, from)
          break;
        case 'stopjadibot':
          if (mek.key.fromMe) return reply("```khusus Owner```")
          stopjadibot(reply)
          break;
        case 'listjadibot':
          let teks = "*[ LIST BOT ]*"
          for(let i of listjadibot) {
          teks += `*Nomor* : ${i.jid.split('@')[0]}*Nama* : ${i.name}\n*Device* : ${i.phone.device_manufacturer}\n*Model* : ${i.phone.device_model}\n\n`
          }
          reply(teks)
          break;
        case 'next':
          // code
          break;
        
        case 'eval':
          if (sender != "6282334297175@s.whatsapp.net") return reply("khusus owner")
          try {
            client.sendMessage(from, JSON.stringify(eval(body.slice(6)),null,'\t'), text, {quoted: mek})
          } catch (e) {
            reply(String(e))
          }
          break;
        
        default:
          
      }
    } catch (e) {
      console.log("Error : %s", color(e, "red"));
    }
  });
};