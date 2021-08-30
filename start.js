const {
  WAConnection,
  MessageType
} = require("@adiwajshing/baileys");
const {
  banner,
  color
} = require("./lib/function.js");
const fs = require("fs");

require("./index.js");
nocache("./index.js", (module) => console.log(`${module} already updated`));

async function starts(client = new WAConnection()){
  client.logger.level = 'warn';
  client.version = [2, 2123, 8];
  client.browserDescription = [ 'Affis Junianto', 'linux', '3.0' ];
  console.log(banner.string);
  client.on('qr', qr => {
     console.log(
       color("[","white"),
       color("∆","red"),
       color("]","white"),
       color("scan the qr code above","purple")
       );
  });
  
  fs.existsSync('./session.json') && client.loadAuthInfo('./session.json');
  client.on('connecting', () => {
  	console.log("[ BOT ]", color("connecting....","cyan"));
  });
  
  client.on('open', (key) => {
  	console.log("[ BOT ]",color("connected","green"));
  	client.sendMessage(client.user.jid, "*[ BOT ]* bot success connected✓", MessageType.text);
  });
  
  await client.connect({timeoutMs: 30*1000});
  fs.writeFileSync('./session.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'));
  
  require("./index.js")(client);
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional>
 */
function nocache(module, cb = () => {}) {
  console.log("Module", `'${module}'`, "is now being watched for changes");
  fs.watchFile(require.resolve(module), async () => {
    await uncache(require.resolve(module));
    cb(module);
  });
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = ".") {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(module)];
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

starts();