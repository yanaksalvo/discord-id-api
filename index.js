const log = require("./modules/log");
const express = require("express");
const { Client } = require("discord.js");
const consoled = require("consoled.js");
const ms = require('ms');
const config = require("./config.json");
const app = express();

const token = process.env.TOKEN || config.token || "";
const port =  process.env.PORT || config.port || 80;


app.set("json spaces", 2);

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'HEAD,GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const client = new Client({
    intents: 32767,
});

client.login(token);

app.get("/", (req, res) => {
    res.render("api");
});

app.get("/api/:id", async (req, res) => {
    try {
        const startTime = new Date();
        const userid = req.params.id.trim();
        const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.socket?.remoteAddress;
        if (isNaN(Number(userid))) return res.status(400).json({
            status: "error",
            message: "id should be a number",
            code: "400",
        });
        if (userid.length !== 18 && userid.length !== 19) return res.status(400).json({
            status: "error",
            message: "id length should be equal to either 18 or 19",
            code: "400",
        });

        log(`\n${ip == "::1" ? "127.0.0.1" : ip.replace("::ffff:", "")} => ${userid} | ${new Date().toLocaleString("tr-TR")}`);
        consoled.bright.blue(`\nAPI: ${ip == "::1" ? "127.0.0.1" : ip.replace("::ffff:", "")} => ${userid} | ${new Date().toLocaleString("tr-TR")}`);

        const user = await client.users.fetch(userid);

        const bot = user.bot;
        const system = user.system;
        const username = user.username;
        const discriminator = user.discriminator;
        const tag = `${user.tag.endsWith("#0") ? user.tag.replace("#0", "") : user.tag}`;
        const pfp = user.displayAvatarURL({ dynamic: true, format: 'jpeg' });
        const date = user.createdAt.getTime();
        const createdAt = new Date(date).toLocaleString('tr-TR');
        const id = userid;
        const badges = user.flags.toArray();
        const premiumSubscriberCount = user.premiumSubscriberCount > 0 ? 1 : 0;
        const isNitro = user.premiumSubscriberCount > 0;
        const accentColor = user.accentColor;
        const bannerColor = accentColor ? `#${accentColor.toString(16)}` : null;

        res.set('Content-Type', 'application/json');

        const endTime = new Date();
        const elapsedTime = ms(endTime - startTime);

        res.json({
            status: "success",
            data: {
                id,
                username,
                discriminator,
                system,
                bot,
                tag,
                pfp,
                createdAt,
                timezone: "UTC",
                badges,
                nitro: premiumSubscriberCount,
                bannerColor
            },
            code: 200,
            elapsedTime,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            code: 500,
        });
    }
});

const listener = app.listen(port, () => {
    consoled.bright.cyan(`Port Açıldı: ${listener.address().port}`);
    consoled.bright.cyan(`127.0.0.1/api/`);
});
