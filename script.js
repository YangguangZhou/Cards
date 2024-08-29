// Original code by Xecades
// Modified code © 2021 - 2024 YangguangZhou (GitHub: YangguangZhou)
const baseURL = "https://cards.jerryz.com.cn/api";
const icons = ["wechat", "qq", "site", "phone", "email", "github", "gitee", "coolapk", "bilibili", "zhihu", "weibo", "tiktok", "twitter", "telegram", "facebook", "instagram", "google", "microsoft", "luogu", "codeforces", "alipay", "csdn", "douban", "taobao", "linuxdo"];

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
        debounceTimer: null,
    },
    watch: {
        background: function (e) {
            this.debouncedSetParam("img", e.slice(1));
        },

        params: function (e) {
            this.debouncedUpdateImage();
        },

        text_color: function (e) {
            this.debouncedSetParam("color", e.slice(5, e.length - 1).replaceAll(" ", ""));
        },

        bg_color: function (e) {
            this.debouncedSetParam("bg", e.slice(5, e.length - 1).replaceAll(" ", ""));
        },

        date: function (e) {
            this.debouncedSetParam("date", e);
        },

        str: function (e) {
            this.debouncedSetParam("str", e);
        },

        quote: function (e) {
            this.debouncedSetParam("quote", e);
        },

        counter: function (e) {
            const regex = /^[a-zA-Z0-9_\-\.!@#$%^&*()+=\[\]{}|;:,<>?]+$/;
            if (regex.test(e) || e === "") {
                this.debouncedSetParam("counter", e);
            } else {
                alert("输入不合法！合法字符包括：英文字母、数字、下划线、连字符、点号以及常见的特殊字符（如 !@#$%^&*()+=[]{}|;:,<>?）");
                this.counter = ""; // 清空输入
            }
        },

        social: function (e) {
            for (var i = 0; i < e.length; i++) this.debouncedSetParam(icons[i], e[i]);
        },
    },
    methods: {
        setParam: function (key, value) {
            var tmp = new URLSearchParams(this.params);
            if (!value) tmp.delete(key);
            else tmp.set(key, value
                .replace(/\&/gm, "{%amp%}")
                .replace(/\</gm, "{%lt%}")
                .replace(/\>/gm, "{%gt%}"));
            this.params = tmp.toString();
        },

        debouncedSetParam: function(key, value) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.setParam(key, value);
            }, 300);
        },

        debouncedUpdateImage: function() {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.image = baseURL + (this.params ? "?" + this.params : "");
                this.updateImageLink();
            }, 300);
        },

        open: function () {
            umami.track('generate', { open: this.image });
            window.open(this.image, "_blank");
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