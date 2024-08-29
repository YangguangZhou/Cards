// Original code by Xecades
// Modified code © 2021 - 2024 YangguangZhou (GitHub: YangguangZhou)
const moment = require("moment");
const request = require("request");
const fs = require("fs");

var param;
const prefix = "http://cards.jerryz.com.cn";
const offset = [0, -0.75, 1.75, 0, 2.7, 4.8];
const icons = ["wechat", "qq", "site", "phone", "email", "github", "gitee", "coolapk", "bilibili", "zhihu", "weibo", "tiktok", "twitter", "telegram", "facebook", "instagram", "google", "microsoft", "luogu", "codeforces", "alipay", "csdn", "douban", "taobao", "linuxdo"];

function getParam(str) {
    return trans(param.get(str));
}

function trans(text) {
    if (text)
        return text
            .replace(/{%amp%}/gm, "&amp;")
            .replace(/{%lt%}/gm, "&lt;")
            .replace(/{%gt%}/gm, "&gt;")
    return text;
}

function getBG() {
    var ret = 1;
    if (getParam("img") && +getParam("img") >= 1 && +getParam("img") <= 5)
        ret = +getParam("img");
    return ret;
}

function getBGOffset() {
    return offset[getBG()];
}

function readImage(url) {
    return new Promise((resolve, reject) => {
        request({ url: url, encoding: "binary" }, function (err, resp, body) {
            if (!err && resp.statusCode == 200) resolve('data:image/png;base64,' + Buffer.from(body, 'binary').toString('base64'));
            else reject(err);
        });
    });
}

function readSVG(url) {
    return new Promise((resolve, reject) => {
        request(url, function (err, resp, body) {
            if (!err && resp.statusCode == 200) resolve('data:image/svg+xml;base64,' + Buffer.from(body, 'utf8').toString('base64'));
            else reject(err);
        });
    });
}

async function getSocial() {
    var can = [];
    var ret = "";

    for (var key of param.keys())
        if (icons.includes(key))
            can.push(key);

    var margin = 25;
    var sp = (175 - margin) / can.length;

    for (var i = 0; i < can.length; i++) {
        ret += `
        <g class="item">
            <image class="icon" transform="translate(350 ${margin + sp * i + sp / 2 - 16})" href="${await readSVG(`${prefix}/res/icon/${can[i]}.svg`)}"/>
            <text class="text" transform="translate(370 ${margin + 12 + sp * i + sp / 2 - 16})">${getParam(can[i])}</text>
        </g>`;
    }

    return ret;
}

function getDur() {
    var date = getParam("date") || "";
    if (date == "")
        date = `${moment().year()}-12-31`;
    var ret = -moment().diff(date, 'days')
    var today = moment(new Date()).format('YYYY-MM-DD')
    if (date == today) return `还有 0 天`;
    else if (ret >= 0) return `还有 ${ret + 1} 天`;
    else return `已经过去 ${-ret} 天`;
}

function getStr() {
    var date = getParam("date") || "";
    if (getParam("str"))
        return getParam("str");
    if (date == "")
        return ` ${moment().year()} 年末`;
    return "某个特殊日期";
}

function getWeekday() {
    var ret = "";
    switch (+moment().format("d")) {
        case 0: ret = "星期日"; break;
        case 1: ret = "星期一"; break;
        case 2: ret = "星期二"; break;
        case 3: ret = "星期三"; break;
        case 4: ret = "星期四"; break;
        case 5: ret = "星期五"; break;
        case 6: ret = "星期六"; break;
    }
    return ret;
}

async function getCounter(req) {
    const url = "https://counter-sever.jerryz.com.cn/counter";
    const { default: fetch } = await import('node-fetch');
    const name = getParam("counter");
    //const headers = req && req.headers ? req.headers : {};
   //const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;

    const result = await (await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    })).json();

    const counterView = result.times;
    return counterView;
}

module.exports = async (req, res) => {
    if (!req.url.includes("Jerry Zhou"))
        console.log("[Running] " + decodeURI(req.url));

    moment.locale("zh-cn");
    param = new URLSearchParams(req.url.split("/api")[1]);
    const counter = await getCounter();
    res.setHeader("Content-Type", "image/svg+xml");
    const {
        background = await readImage(`${prefix}/res/bg/${getBG()}.png`),
        bg_offset = 250 - getBGOffset(),
        socialText = await getSocial(),
        dayOfYear = moment().dayOfYear() - 1,
        year = moment().year(),
        month = moment().format('M'),
        day = moment().format('D'),
        weekday = getWeekday(),
        toStr = getStr(),
        toDur = getDur(),
        quote_ = getParam("quote") || "永远相信美好的事情即将发生✨",
        fontColor = "rgba(" + (getParam("color") || "0,0,0,1") + ")",
        bgColor = "rgba(" + (getParam("bg") || "0,0,0,0") + ")",
        welcomeText = counter ? `欢迎您，第 ${counter} 位访问本页面的朋友 🎉` : '欢迎您朋友 🎉'
    } = req.query;

    res.send(`
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 180">
    <defs>
        <style>
            svg {background-color: ${bgColor}; }
            #image .line { fill: none; stroke: ${fontColor}; opacity: .7; stroke-miterlimit: 10; stroke-width: 0.5px; stroke-linecap: round; }
            #image .bg { height: 250px; }
            #detail .text { font-size: 12px; fill: ${fontColor}; font-weight: lighter; }
            #contact .item .icon { width: 16px; height: 16px; }
            #contact .item .text { font-size: 10px; fill: ${fontColor}; font-weight: lighter; }
            #quote .text { font-size: 10px; fill: ${fontColor}; font-weight: lighter; }
        </style>
    </defs>
    <title>Cards | Jerry Zhou</title>
    <g id="image">
        <line class="line" x1="250.5" y1="20" x2="250.5" y2="170"/>
        <image class="bg" transform="translate(${bg_offset} 32) scale(0.5)" href="${background}"/>
    </g>
    
    <g id="detail">
        <text class="text" transform="translate(20 35)">${welcomeText}</text>
        <text class="text" transform="translate(20 65)">今天是 ${month} 月 ${day} 日，${weekday}</text>
        <text class="text" transform="translate(20 95)">也是 ${year} 年的第 ${dayOfYear} 天</text>
        <text class="text" transform="translate(20 125)">距离${toStr}${toDur}</text>
        <text class="text" transform="translate(20 155)">${quote_}</text>
    </g>
    
    <g id="contact">${socialText}</g>
    </svg>`);
};
