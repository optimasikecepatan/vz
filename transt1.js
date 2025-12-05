  /*! js-cookie v3.0.0-rc.4 | MIT */
  !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var n=e.Cookies,r=e.Cookies=t();r.noConflict=function(){return e.Cookies=n,r}}())}(this,function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)e[r]=n[r]}return e}var t={read:function(e){return e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}};return function n(r,o){function i(t,n,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),n=r.write(n,t);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n+c}}return Object.create({set:i,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var n=document.cookie?document.cookie.split("; "):[],o={},i=0;i<n.length;i++){var c=n[i].split("="),u=c.slice(1).join("=");'"'===u[0]&&(u=u.slice(1,-1));try{var f=t.read(c[0]);if(o[f]=r.read(u,f),e===f)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){i(t,"",e({},n,{expires:-1}))},withAttributes:function(t){return n(this.converter,e({},this.attributes,t))},withConverter:function(t){return n(e({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(r)}})}(t,{path:"/"})});
  const googleTranslateConfig = { lang: "id" };
  function TranslateWidgetIsLoaded() {
    TranslateInit(googleTranslateConfig);
  }
  function TranslateInit(a) {
    a.langFirstVisit && !Cookies.get("googtrans") && TranslateCookieHandler("/auto/" + a.langFirstVisit);
    let e = TranslateGetCode(a);
    TranslateHtmlHandler(e),
        e == a.lang && TranslateCookieHandler(null, a.domain),
        new google.translate.TranslateElement({ pageLanguage: a.lang, multilanguagePage: !0 }),
        TranslateEventHandler("click", "[data-google-lang]", function (e) {
            TranslateCookieHandler("/" + a.lang + "/" + e.getAttribute("data-google-lang"), a.domain), window.location.reload();
        });
  }
  function TranslateGetCode(a) {
    return (void 0 != Cookies.get("googtrans") && "null" != Cookies.get("googtrans") ? Cookies.get("googtrans") : a.lang).match(/[^\/]*$/)[0];
  }
  function TranslateCookieHandler(a, e) {
    let t = window.location.hostname.match(/^(?:.*?.)?([a-zA-Z0-9-_]{3,}.(?:[a-zA-Z]{2,8}|[a-zA-Z]{2,4}.[a-zA-Z]{2,4}))$/);
    if (t && t[1]) {
        Cookies.set("googtrans", a);
        Cookies.set("googtrans", a, { domain: "." + document.domain });
        Cookies.remove("googtrans", { domain: "." + t[1] });
        if (typeof e !== "undefined") {
            Cookies.set("googtrans", a, { domain: e });
            Cookies.set("googtrans", a, { domain: "." + e });
        }
    } else {
        console.error("Failed to parse hostname for TranslateCookieHandler");
    }
  }
  function TranslateEventHandler(a, e, t) {
    document.addEventListener(a, function (a) {
        let n = a.target.closest(e);
        n && t(n);
    });
  }
  function TranslateHtmlHandler(a) {
    null !== document.querySelector('[data-google-lang="' + a + '"]') && document.querySelector('[data-google-lang="' + a + '"]').classList.add("active");
  }

    let e = document.createElement("script");
    (e.src = "//translate.google.com/translate_a/element.js?cb=TranslateWidgetIsLoaded"), document.getElementsByTagName("head")[0].appendChild(e);
