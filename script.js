const baseURL = "https://cards.jerryz.com.cn/api";
const icons = ["wechat", "qq", "site", "phone", "email", "github", "gitee", "coolapk", "bilibili", "zhihu", "weibo", "tiktok", "twitter", "telegram", "facebook", "instagram", "google", "microsoft", "luogu", "codeforces", "alipay", "csdn", "douban", "taobao"];

function toggleBorder() {
    !window.TOG &&
        document.body.appendChild(
            (window.TOG = document.createElement("style"))
        );
    (window.CHK = !window.CHK)
        ? (TOG.innerHTML = `*{box-shadow: 0 0 0 1px cyan}`)
        : (TOG.innerHTML = "");
}

var vm = new Vue({
    el: "#app",
    data: {
        icon: icons,
        image: baseURL,
        params: "",
        background: "#1",
        text_color: "rgba(0, 0, 0, 1)",
        bg_color: "rgba(0, 0, 0, 0)",
        date: new Date().getFullYear() + "-12-31",
        str: "",
        str_placeholder: new Date().getFullYear() + " 年末",
        quote: "",
        counter: "",
        social: [],
    },
    watch: {
        background: function (e) {
            vm.setParam("img", e.slice(1));
        },

        params: function (e) {
            vm.image = baseURL + (e ? "?" + e : "");
        },

        text_color: function (e) {
            vm.setParam("color", e.slice(5, e.length - 1).replaceAll(" ", ""));
        },

        bg_color: function (e) {
            vm.setParam("bg", e.slice(5, e.length - 1).replaceAll(" ", ""));
        },

        date: function (e) {
            vm.setParam("date", e);
        },

        str: function (e) {
            vm.setParam("str", e);
        },

        quote: function (e) {
            vm.setParam("quote", e);
        },

        counter: function (e) {
            vm.setParam("counter", e);
        },

        social: function (e) {
            for (var i = 0; i < e.length; i++) vm.setParam(icons[i], e[i]);
        },
    },
    methods: {
        setParam: function (key, value) {
            var tmp = new URLSearchParams(vm.params);
            if (!value) tmp.delete(key);
            else tmp.set(key, value
                .replace(/\&/gm, "{%amp%}")
                .replace(/\</gm, "{%lt%}")
                .replace(/\>/gm, "{%gt%}"));
            vm.params = tmp.toString();
        },

        open: function () {
            window.open(vm.image, "_blank");
        }
    },
});
