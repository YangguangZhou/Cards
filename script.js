// Original code by Xecades
// Modified code © 2021 - 2024 YangguangZhou (GitHub: YangguangZhou)
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

        social: function (e) {
            for (var i = 0; i < e.length; i++) vm.setParam(icons[i], e[i]);
        },

        image: function (newVal, oldVal) {
            this.updateImageLink();
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
            umami.track('generate', { open: this.image });
            window.open(vm.image, "_blank");
        },
        updateImageLink: function () {
            var linkElement = document.getElementById('link');
            if (linkElement) {
                linkElement.textContent = this.image;
            }
        },
        fadeIn: function (element) {
            element.classList.add('fade-in');
            setTimeout(function () {
                element.classList.remove('fade-in');
            }, 300);
        },
        fadeOut: function (element) {
            element.classList.add('fade-out');
            setTimeout(function () {
                element.classList.remove('fade-out');
            }, 300);
        },
        copyToClipboard: function () {
            var linkElement = document.getElementById('link');
            if (linkElement) {
                navigator.clipboard.writeText(linkElement.textContent).then(function () {
                    this.fadeOut(linkElement);
                    setTimeout(function () {
                        linkElement.textContent = '链接已复制到剪贴板';
                        this.fadeIn(linkElement);
                        setTimeout(function () {
                            this.fadeOut(linkElement);
                            setTimeout(function () {
                                linkElement.textContent = this.image;
                                this.fadeIn(linkElement);
                            }.bind(this), 300);
                        }.bind(this), 300);
                    }.bind(this), 300);
                }.bind(this), function (err) {
                    console.error('无法复制链接: ', err);
                });
                umami.track('generate', { copy: this.image });
            }
        },
    },
    mounted: function () {
        this.updateImageLink();
    }
});
