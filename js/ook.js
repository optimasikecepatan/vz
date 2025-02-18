! function() {
    var t, e;
    let n = window.matchMedia("(max-width: 880px)"),
        i = document.querySelector(".nav-main"),
        o = document.querySelector(".menu-trigger"),
        s = document.querySelector(".close-offcanvas");
    if (!i) return;
    let r = i.querySelector(".nav");
    if (!r) return;
    let a = r.innerHTML;
    if (n.matches) {
        let u = r.querySelectorAll("li");
        u.forEach(function(t, e) {
            t.style.transitionDelay = .03 * (e + 1) + "s"
        })
    }
    o && (o.addEventListener("click", function() {
        event.preventDefault(), document.body.classList.toggle("offcanvas-open")
    }), s.addEventListener("click", function() {
        event.preventDefault(), document.body.classList.remove("offcanvas-open")
    }), t = function(t) {
        !o.contains(t.target) && document.body.classList.contains("offcanvas-open") && document.body.classList.remove("offcanvas-open")
    }, window.addEventListener("click", t));
    let c = function() {
            if (n.matches) return;
            let t = [];
            for (; r.offsetWidth + 24 > i.offsetWidth;) {
                if (!r.lastElementChild) return;
                t.unshift(r.lastElementChild), r.lastElementChild.remove()
            }
            if (!t.length) {
                document.body.classList.add("is-dropdown-loaded");
                return
            }
            let o = document.createElement("li");
            o.setAttribute("class", "nav-more-toggle"), o.setAttribute("aria-label", "More"), o.innerHTML = '<span class="icon-svg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></span>';
            let s = document.createElement("ul");
            s.setAttribute("class", "sub-menu"), t.forEach(function(t) {
                s.appendChild(t)
            }), o.appendChild(s), r.appendChild(o), document.body.classList.add("is-dropdown-loaded"), o.addEventListener("click", function() {
                document.body.classList.toggle("is-dropdown-open")
            }), e = function(t) {
                !o.contains(t.target) && document.body.classList.contains("is-dropdown-open") && document.body.classList.remove("is-dropdown-open")
            }, window.addEventListener("click", e)
        },
        l = async t => {
            for (; null === document.querySelector(t);) await new Promise(t => requestAnimationFrame(t));
            return document.querySelector(t)
        };
    l(".site-header").then(t => {
        document.fonts.ready.then(function() {
            c()
        })
    }), window.addEventListener("resize", function() {
        setTimeout(function() {
            window.removeEventListener("click", e), r.innerHTML = a, c()
        }, 1)
    })
}(),
function() {
    let t = document.getElementsByClassName("skin-trigger"),
        e = document.querySelector(".trigger-dark"),
        n = document.querySelector(".trigger-light"),
        i = document.querySelectorAll(".is-skin:not(.nochange)"),
        o = localStorage.getItem("th90-skin"),
        s = o || "";

    function r(o) {
        let r = o || s;
        "dark" == r ? (n.style.display = "flex", e.style.display = "none") : (e.style.display = "flex", n.style.display = "none"), t.length > 0 && r && ("dark" == r ? (i.forEach(function(t) {
            t.classList.contains("bg-light") && (t.classList.remove("bg-light"), t.classList.add("bg-dark"), t.classList.add("skin-change"))
        }), document.body.classList.add("site-dark")) : (i.forEach(function(t) {
            t.classList.contains("skin-change") && (t.classList.remove("bg-dark"), t.classList.add("bg-light")), t.classList.remove("skin-change")
        }), document.body.classList.remove("site-dark"))), t.length <= 0 && localStorage.removeItem("th90-skin")
    }
    e && (e.addEventListener("click", function(t) {
        t.preventDefault(), r("dark"), localStorage.setItem("th90-skin", "dark"), n.style.display = "flex", e.style.display = "none"
    }, !1), n.addEventListener("click", function(t) {
        t.preventDefault(), r("light"), localStorage.setItem("th90-skin", "light"), e.style.display = "flex", n.style.display = "none"
    }, !1), r())
}(),
function() {
    document.getElementsByClassName("totop-fly");
    let t = document.querySelector(".totop-trigger");
    t && (window.addEventListener("scroll", function(t) {
        let e = document.querySelector(".totop-fly"),
            n = document.querySelector(".skin-fly");
        this.scrollY > 400 ? (e.classList.add("show"), n && n.classList.add("top-pos")) : (e.classList.contains("show") && e.classList.remove("show"), n && n.classList.contains("top-pos") && n.classList.remove("top-pos"))
    }), t.addEventListener("click", function(t) {
        t.preventDefault(), window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }, !1))
}(),
function(t, e) {
    "function" == typeof define && define.amd ? define(e) : "object" == typeof module && module.exports ? module.exports = e() : t.Colcade = e()
}(window, function() {
    function t(t, e) {
        if ((t = a(t)) && t.colcadeGUID) {
            var n = i[t.colcadeGUID];
            return n.option(e), n
        }
        this.element = t, this.options = {}, this.option(e), this.create()
    }
    var e = t.prototype;
    e.option = function(t) {
        this.options = function(t, e) {
            for (var n in e) t[n] = e[n];
            return t
        }(this.options, t)
    };
    var n = 0,
        i = {};

    function o(e) {
        var n = e.getAttribute("data-colcade").split(","),
            i = {};
        n.forEach(function(t) {
            var e = t.split(":"),
                n = e[0].trim(),
                o = e[1].trim();
            i[n] = o
        }), new t(e, i)
    }

    function s(t) {
        var e = [];
        if (Array.isArray(t)) e = t;
        else if (t && "number" == typeof t.length)
            for (var n = 0; n < t.length; n++) e.push(t[n]);
        else e.push(t);
        return e
    }

    function r(t, e) {
        return s((e = e || document).querySelectorAll(t))
    }

    function a(t) {
        return "string" == typeof t && (t = document.querySelector(t)), t
    }
    return e.create = function() {
            this.errorCheck();
            var t = this.guid = ++n;
            this.element.colcadeGUID = t, i[t] = this, this.reload(), this._windowResizeHandler = this.onWindowResize.bind(this), this._loadHandler = this.onLoad.bind(this), window.addEventListener("resize", this._windowResizeHandler), this.element.addEventListener("load", this._loadHandler, !0)
        }, e.errorCheck = function() {
            var t = [];
            if (this.element || t.push("Bad element: " + this.element), this.options.columns || t.push("columns option required: " + this.options.columns), this.options.items || t.push("items option required: " + this.options.items), t.length) throw Error("[Colcade error] " + t.join(". "))
        }, e.reload = function() {
            this.updateColumns(), this.updateItems(), this.layout()
        }, e.updateColumns = function() {
            this.columns = r(this.options.columns, this.element)
        }, e.updateItems = function() {
            this.items = r(this.options.items, this.element)
        }, e.getActiveColumns = function() {
            return this.columns.filter(function(t) {
                return "none" != getComputedStyle(t).display
            })
        }, e.layout = function() {
            this.activeColumns = this.getActiveColumns(), this._layout()
        }, e._layout = function() {
            this.columnHeights = this.activeColumns.map(function() {
                return 0
            }), this.layoutItems(this.items)
        }, e.layoutItems = function(t) {
            t.forEach(this.layoutItem, this)
        }, e.layoutItem = function(t) {
            var e = Math.min.apply(Math, this.columnHeights),
                n = this.columnHeights.indexOf(e);
            this.activeColumns[n].appendChild(t), this.columnHeights[n] += t.offsetHeight || 1
        }, e.append = function(t) {
            var e = this.getQueryItems(t);
            this.items = this.items.concat(e), this.layoutItems(e)
        }, e.prepend = function(t) {
            var e = this.getQueryItems(t);
            this.items = e.concat(this.items), this._layout()
        }, e.getQueryItems = function(t) {
            t = s(t);
            var e = document.createDocumentFragment();
            return t.forEach(function(t) {
                e.appendChild(t)
            }), r(this.options.items, e)
        }, e.measureColumnHeight = function(t) {
            var e = this.element.getBoundingClientRect();
            this.activeColumns.forEach(function(n, i) {
                if (!t || n.contains(t)) {
                    var o = n.lastElementChild.getBoundingClientRect();
                    this.columnHeights[i] = o.bottom - e.top
                }
            }, this)
        }, e.onWindowResize = function() {
            clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout((function() {
                this.onDebouncedResize()
            }).bind(this), 100)
        }, e.onDebouncedResize = function() {
            var t = this.getActiveColumns(),
                e = t.length == this.activeColumns.length,
                n = !0;
            this.activeColumns.forEach(function(e, i) {
                n = n && e == t[i]
            }), e && n || (this.activeColumns = t, this._layout())
        }, e.onLoad = function(t) {
            this.measureColumnHeight(t.target)
        }, e.destroy = function() {
            this.items.forEach(function(t) {
                this.element.appendChild(t)
            }, this), window.removeEventListener("resize", this._windowResizeHandler), this.element.removeEventListener("load", this._loadHandler, !0), delete this.element.colcadeGUID, delete i[this.guid]
        },
        function(t) {
            if ("complete" == document.readyState) return void t();
            document.addEventListener("DOMContentLoaded", t)
        }(function() {
            r("[data-colcade]").forEach(o)
        }), t.data = function(t) {
            var e = (t = a(t)) && t.colcadeGUID;
            return e && i[e]
        }, t.makeJQueryPlugin = function(e) {
            (e = e || window.jQuery) && (e.fn.colcade = function(n) {
                var i, o, s, r, a;
                return "string" == typeof n ? (o = this, s = n, r = Array.prototype.slice.call(arguments, 1), o.each(function(t, n) {
                    var i = e.data(n, "colcade");
                    if (i) {
                        var o = i[s].apply(i, r);
                        a = void 0 === a ? o : a
                    }
                }), void 0 !== a ? a : o) : (i = n, this.each(function(n, o) {
                    var s = e.data(o, "colcade");
                    s ? (s.option(i), s.layout()) : (s = new t(o, i), e.data(o, "colcade", s))
                }), this)
            })
        }, t.makeJQueryPlugin(), t
});
var posts_grid = document.querySelector(".posts-grid");
if (null !== posts_grid) var posts_colc = new Colcade(posts_grid, {
    columns: ".grid-col",
    items: ".post-card"
});
var tags_grid = document.querySelector(".tags-grid");
if (null !== tags_grid) var tags_colc = new Colcade(tags_grid, {
    columns: ".tags-col",
    items: ".tag-card"
});

function glideHandleHeight(t) {
    let e = t.querySelector(".glide__slide--active"),
        n = e ? e.offsetHeight : 0,
        i = t.querySelector(".glide__track"),
        o = i ? i.offsetHeight : 0;
    n !== o && (i.style.height = n + "px")
}! function() {
const loadMorePosts = () => {
  const loadMoreButton = document.getElementsByClassName("loadmore")[0];
  
  if (!loadMoreButton) return;

  const postsContainer = document.querySelector(".latest-posts");
  const nextLink = document.querySelector("link[rel=next]");

  if (!postsContainer || !nextLink) {
    loadMoreButton.style.display = 'none';
    return;
  }

  let currentPage = 1;
  const totalPages = parseInt(nextLink.href.match(/page=(\d+)/)[1]) || 1;
  
  const createLoader = () => {
    const loader = document.createElement('span');
    loader.className = 'loader';
    return loader;
  };

  const removeLoader = (button) => {
    const loaders = button.getElementsByClassName("loader");
    Array.from(loaders).forEach(loader => loader.remove());
  };

  const fetchPosts = async (pageUrl) => {
    try {
      const response = await fetch(pageUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      return doc.querySelectorAll(".latest-posts article");
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  };

  const appendPosts = (articles) => {
    articles.forEach(article => {
      if (postsContainer.classList.contains("posts-block")) {
        postsContainer.appendChild(article);
      } else if (typeof posts_colc !== 'undefined') {
        posts_colc.append(article);
      }
    });
  };

  loadMoreButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const baseUrl = nextLink.href.split('page=')[0];
    const pageUrl = `${baseUrl}page=${currentPage + 1}`;

    loadMoreButton.appendChild(createLoader());
    loadMoreButton.disabled = true;

    const articles = await fetchPosts(pageUrl);
    
    removeLoader(loadMoreButton);
    loadMoreButton.disabled = false;

    if (articles.length > 0) {
      appendPosts(articles);
      currentPage++;

      // Hide load more button if we've reached the last page
      if (currentPage >= totalPages) {
        loadMoreButton.style.display = 'none';
      }
    } else {
      loadMoreButton.style.display = 'none';
    }
  });
};

// Initialize the load more functionality
document.addEventListener('DOMContentLoaded', loadMorePosts);
}(),
function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).Glide = e()
}(this, function() {
    "use strict";

    function t(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(t);
            e && (i = i.filter(function(e) {
                return Object.getOwnPropertyDescriptor(t, e).enumerable
            })), n.push.apply(n, i)
        }
        return n
    }

    function e(e) {
        for (var n = 1; n < arguments.length; n++) {
            var i = null != arguments[n] ? arguments[n] : {};
            n % 2 ? t(Object(i), !0).forEach(function(t) {
                r(e, t, i[t])
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : t(Object(i)).forEach(function(t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(i, t))
            })
        }
        return e
    }

    function n(t) {
        return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        })(t)
    }

    function i(t, e) {
        if (!(t instanceof e)) throw TypeError("Cannot call a class as a function")
    }

    function o(t, e) {
        for (var n = 0; n < e.length; n++) {
            var i = e[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
        }
    }

    function s(t, e, n) {
        return e && o(t.prototype, e), n && o(t, n), t
    }

    function r(t, e, n) {
        return e in t ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : t[e] = n, t
    }

    function a(t) {
        return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        })(t)
    }

    function u(t, e) {
        return (u = Object.setPrototypeOf || function(t, e) {
            return t.__proto__ = e, t
        })(t, e)
    }

    function c() {
        return (c = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(t, e, n) {
            var i = function t(e, n) {
                for (; !Object.prototype.hasOwnProperty.call(e, n) && null !== (e = a(e)););
                return e
            }(t, e);
            if (i) {
                var o = Object.getOwnPropertyDescriptor(i, e);
                return o.get ? o.get.call(arguments.length < 3 ? t : n) : o.value
            }
        }).apply(this, arguments)
    }
    var l = {
        type: "slider",
        startAt: 0,
        perView: 1,
        focusAt: 0,
        gap: 10,
        autoplay: !1,
        hoverpause: !0,
        keyboard: !0,
        bound: !1,
        swipeThreshold: 80,
        dragThreshold: 120,
        perSwipe: "",
        touchRatio: .5,
        touchAngle: 45,
        animationDuration: 400,
        rewind: !0,
        rewindDuration: 800,
        animationTimingFunc: "cubic-bezier(.165, .840, .440, 1)",
        waitForTransition: !0,
        throttle: 10,
        direction: "ltr",
        peek: 0,
        cloningRatio: 1,
        breakpoints: {},
        classes: {
            swipeable: "glide--swipeable",
            dragging: "glide--dragging",
            direction: {
                ltr: "glide--ltr",
                rtl: "glide--rtl"
            },
            type: {
                slider: "glide--slider",
                carousel: "glide--carousel"
            },
            slide: {
                clone: "glide__slide--clone",
                active: "glide__slide--active"
            },
            arrow: {
                disabled: "glide__arrow--disabled"
            },
            nav: {
                active: "glide__bullet--active"
            }
        }
    };

    function f(t) {
        console.error("[Glide warn]: ".concat(t))
    }

    function d(t) {
        return parseInt(t)
    }

    function h(t) {
        return "string" == typeof t
    }

    function p(t) {
        var e = n(t);
        return "function" === e || "object" === e && !!t
    }

    function v(t) {
        return "function" == typeof t
    }

    function m(t) {
        return void 0 === t
    }

    function g(t) {
        return t.constructor === Array
    }

    function y(t, e, n) {
        Object.defineProperty(t, e, n)
    }

    function $(t, n) {
        var i = Object.assign({}, t, n);
        return n.hasOwnProperty("classes") && (i.classes = Object.assign({}, t.classes, n.classes), ["direction", "type", "slide", "arrow", "nav"].forEach(function(o) {
            n.classes.hasOwnProperty(o) && (i.classes[o] = e(e({}, t.classes[o]), n.classes[o]))
        })), n.hasOwnProperty("breakpoints") && (i.breakpoints = Object.assign({}, t.breakpoints, n.breakpoints)), i
    }
    var b = function() {
            function t() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                i(this, t), this.events = e, this.hop = e.hasOwnProperty
            }
            return s(t, [{
                key: "on",
                value: function(t, e) {
                    if (!g(t)) {
                        this.hop.call(this.events, t) || (this.events[t] = []);
                        var n = this.events[t].push(e) - 1;
                        return {
                            remove: function() {
                                delete this.events[t][n]
                            }
                        }
                    }
                    for (var i = 0; i < t.length; i++) this.on(t[i], e)
                }
            }, {
                key: "emit",
                value: function(t, e) {
                    if (g(t))
                        for (var n = 0; n < t.length; n++) this.emit(t[n], e);
                    else this.hop.call(this.events, t) && this.events[t].forEach(function(t) {
                        t(e || {})
                    })
                }
            }]), t
        }(),
        w = function() {
            function t(e) {
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                i(this, t), this._c = {}, this._t = [], this._e = new b, this.disabled = !1, this.selector = e, this.settings = $(l, n), this.index = this.settings.startAt
            }
            return s(t, [{
                key: "mount",
                value: function() {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    return this._e.emit("mount.before"), p(t) ? this._c = function t(e, n, i) {
                        var o = {};
                        for (var s in n) v(n[s]) ? o[s] = n[s](e, o, i) : f("Extension must be a function");
                        for (var r in o) v(o[r].mount) && o[r].mount();
                        return o
                    }(this, t, this._e) : f("You need to provide a object on `mount()`"), this._e.emit("mount.after"), this
                }
            }, {
                key: "mutate",
                value: function() {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
                    return g(t) ? this._t = t : f("You need to provide a array on `mutate()`"), this
                }
            }, {
                key: "update",
                value: function() {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    return this.settings = $(this.settings, t), t.hasOwnProperty("startAt") && (this.index = t.startAt), this._e.emit("update"), this
                }
            }, {
                key: "go",
                value: function(t) {
                    return this._c.Run.make(t), this
                }
            }, {
                key: "move",
                value: function(t) {
                    return this._c.Transition.disable(), this._c.Move.make(t), this
                }
            }, {
                key: "destroy",
                value: function() {
                    return this._e.emit("destroy"), this
                }
            }, {
                key: "play",
                value: function() {
                    var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                    return t && (this.settings.autoplay = t), this._e.emit("play"), this
                }
            }, {
                key: "pause",
                value: function() {
                    return this._e.emit("pause"), this
                }
            }, {
                key: "disable",
                value: function() {
                    return this.disabled = !0, this
                }
            }, {
                key: "enable",
                value: function() {
                    return this.disabled = !1, this
                }
            }, {
                key: "on",
                value: function(t, e) {
                    return this._e.on(t, e), this
                }
            }, {
                key: "isType",
                value: function(t) {
                    return this.settings.type === t
                }
            }, {
                key: "settings",
                get: function() {
                    return this._o
                },
                set: function(t) {
                    p(t) ? this._o = t : f("Options must be an `object` instance.")
                }
            }, {
                key: "index",
                get: function() {
                    return this._i
                },
                set: function(t) {
                    this._i = d(t)
                }
            }, {
                key: "type",
                get: function() {
                    return this.settings.type
                }
            }, {
                key: "disabled",
                get: function() {
                    return this._d
                },
                set: function(t) {
                    this._d = !!t
                }
            }]), t
        }();

    function k() {
        return (new Date).getTime()
    }

    function S(t, e) {
        var n, i, o, s, r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            a = 0,
            u = function() {
                a = !1 === r.leading ? 0 : k(), n = null, s = t.apply(i, o), n || (i = o = null)
            },
            c = function() {
                var c = k();
                a || !1 !== r.leading || (a = c);
                var l = e - (c - a);
                return i = this, o = arguments, l <= 0 || l > e ? (n && (clearTimeout(n), n = null), a = c, s = t.apply(i, o), n || (i = o = null)) : n || !1 === r.trailing || (n = setTimeout(u, l)), s
            };
        return c.cancel = function() {
            clearTimeout(n), a = 0, n = i = o = null
        }, c
    }
    var _ = {
        ltr: ["marginLeft", "marginRight"],
        rtl: ["marginRight", "marginLeft"]
    };

    function L(t) {
        if (t && t.parentNode) {
            for (var e = t.parentNode.firstChild, n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        }
        return []
    }

    function H(t) {
        return Array.prototype.slice.call(t)
    }
    var E = '[data-glide-el="track"]',
        C = function() {
            function t() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                i(this, t), this.listeners = e
            }
            return s(t, [{
                key: "on",
                value: function(t, e, n) {
                    var i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                    h(t) && (t = [t]);
                    for (var o = 0; o < t.length; o++) this.listeners[t[o]] = n, e.addEventListener(t[o], this.listeners[t[o]], i)
                }
            }, {
                key: "off",
                value: function(t, e) {
                    var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                    h(t) && (t = [t]);
                    for (var i = 0; i < t.length; i++) e.removeEventListener(t[i], this.listeners[t[i]], n)
                }
            }, {
                key: "destroy",
                value: function() {
                    delete this.listeners
                }
            }]), t
        }(),
        x = ["ltr", "rtl"],
        T = {
            ">": "<",
            "<": ">",
            "=": "="
        };

    function A(t, e) {
        return {
            modify: function(t) {
                return e.Direction.is("rtl") ? -t : t
            }
        }
    }

    function z(t, e) {
        return {
            modify: function(t) {
                var n = Math.floor(t / e.Sizes.slideWidth);
                return t + e.Gaps.value * n
            }
        }
    }

    function D(t, e) {
        return {
            modify: function(t) {
                return t + e.Clones.grow / 2
            }
        }
    }

    function q(t, e) {
        return {
            modify: function(n) {
                if (t.settings.focusAt >= 0) {
                    var i = e.Peek.value;
                    return p(i) ? n - i.before : n - i
                }
                return n
            }
        }
    }

    function P(t, e) {
        return {
            modify: function(n) {
                var i = e.Gaps.value,
                    o = e.Sizes.width,
                    s = t.settings.focusAt,
                    r = e.Sizes.slideWidth;
                return "center" === s ? n - (o / 2 - r / 2) : n - r * s - i * s
            }
        }
    }
    var R = !1;
    try {
        var O = Object.defineProperty({}, "passive", {
            get: function() {
                R = !0
            }
        });
        window.addEventListener("testPassive", null, O), window.removeEventListener("testPassive", null, O)
    } catch (I) {}
    var M = R,
        B = ["touchstart", "mousedown"],
        W = ["touchmove", "mousemove"],
        V = ["touchend", "touchcancel", "mouseup", "mouseleave"],
        j = ["mousedown", "mousemove", "mouseup", "mouseleave"],
        G = '[data-glide-el^="controls"]',
        N = "".concat(G, ' [data-glide-dir*="<"]'),
        F = "".concat(G, ' [data-glide-dir*=">"]');

    function Q(t) {
        var e;
        return p(t) ? Object.keys(e = t).sort().reduce(function(t, n) {
            return t[n] = e[n], t[n], t
        }, {}) : (f("Breakpoints option must be an object"), {})
    }
    var U = {
        Html: function(t, e, n) {
            var i = {
                mount: function() {
                    this.root = t.selector, this.track = this.root.querySelector(E), this.collectSlides()
                },
                collectSlides: function() {
                    this.slides = H(this.wrapper.children).filter(function(e) {
                        return !e.classList.contains(t.settings.classes.slide.clone)
                    })
                }
            };
            return y(i, "root", {
                get: function() {
                    return i._r
                },
                set: function(t) {
                    h(t) && (t = document.querySelector(t)), null !== t ? i._r = t : f("Root element must be a existing Html node")
                }
            }), y(i, "track", {
                get: function() {
                    return i._t
                },
                set: function(t) {
                    var e;
                    (e = t) && e instanceof window.HTMLElement ? i._t = t : f("Could not find track element. Please use ".concat(E, " attribute."))
                }
            }), y(i, "wrapper", {
                get: function() {
                    return i.track.children[0]
                }
            }), n.on("update", function() {
                i.collectSlides()
            }), i
        },
        Translate: function(t, e, n) {
            var i = {
                set: function(n) {
                    var i, o, s, r = (i = t, o = e, s = [z, D, q, P].concat(i._t, [A]), {
                            mutate: function(t) {
                                for (var e = 0; e < s.length; e++) {
                                    var n = s[e];
                                    v(n) && v(n().modify) ? t = n(i, o, void 0).modify(t) : f("Transformer should be a function that returns an object with `modify()` method")
                                }
                                return t
                            }
                        }).mutate(n),
                        a = "translate3d(".concat(-1 * r, "px, 0px, 0px)");
                    e.Html.wrapper.style.mozTransform = a, e.Html.wrapper.style.webkitTransform = a, e.Html.wrapper.style.transform = a
                },
                remove: function() {
                    e.Html.wrapper.style.transform = ""
                },
                getStartIndex: function() {
                    var n = e.Sizes.length,
                        i = t.index,
                        o = t.settings.perView;
                    return e.Run.isOffset(">") || e.Run.isOffset("|>") ? n + (i - o) : (i + o) % n
                },
                getTravelDistance: function() {
                    var n = e.Sizes.slideWidth * t.settings.perView;
                    return e.Run.isOffset(">") || e.Run.isOffset("|>") ? -1 * n : n
                }
            };
            return n.on("move", function(o) {
                if (!t.isType("carousel") || !e.Run.isOffset()) return i.set(o.movement);
                e.Transition.after(function() {
                    n.emit("translate.jump"), i.set(e.Sizes.slideWidth * t.index)
                });
                var s = e.Sizes.slideWidth * e.Translate.getStartIndex();
                return i.set(s - e.Translate.getTravelDistance())
            }), n.on("destroy", function() {
                i.remove()
            }), i
        },
        Transition: function(t, e, n) {
            var i = !1,
                o = {
                    compose: function(e) {
                        var n = t.settings;
                        return i ? "".concat(e, " 0ms ").concat(n.animationTimingFunc) : "".concat(e, " ").concat(this.duration, "ms ").concat(n.animationTimingFunc)
                    },
                    set: function() {
                        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "transform";
                        e.Html.wrapper.style.transition = this.compose(t)
                    },
                    remove: function() {
                        e.Html.wrapper.style.transition = ""
                    },
                    after: function(t) {
                        setTimeout(function() {
                            t()
                        }, this.duration)
                    },
                    enable: function() {
                        i = !1, this.set()
                    },
                    disable: function() {
                        i = !0, this.set()
                    }
                };
            return y(o, "duration", {
                get: function() {
                    var n = t.settings;
                    return t.isType("slider") && e.Run.offset ? n.rewindDuration : n.animationDuration
                }
            }), n.on("move", function() {
                o.set()
            }), n.on(["build.before", "resize", "translate.jump"], function() {
                o.disable()
            }), n.on("run", function() {
                o.enable()
            }), n.on("destroy", function() {
                o.remove()
            }), o
        },
        Direction: function(t, e, n) {
            var i = {
                mount: function() {
                    this.value = t.settings.direction
                },
                resolve: function(t) {
                    var e = t.slice(0, 1);
                    return this.is("rtl") ? t.split(e).join(T[e]) : t
                },
                is: function(t) {
                    return this.value === t
                },
                addClass: function() {
                    e.Html.root.classList.add(t.settings.classes.direction[this.value])
                },
                removeClass: function() {
                    e.Html.root.classList.remove(t.settings.classes.direction[this.value])
                }
            };
            return y(i, "value", {
                get: function() {
                    return i._v
                },
                set: function(t) {
                    x.indexOf(t) > -1 ? i._v = t : f("Direction value must be `ltr` or `rtl`")
                }
            }), n.on(["destroy", "update"], function() {
                i.removeClass()
            }), n.on("update", function() {
                i.mount()
            }), n.on(["build.before", "update"], function() {
                i.addClass()
            }), i
        },
        Peek: function(t, e, n) {
            var i = {
                mount: function() {
                    this.value = t.settings.peek
                }
            };
            return y(i, "value", {
                get: function() {
                    return i._v
                },
                set: function(t) {
                    p(t) ? (t.before = d(t.before), t.after = d(t.after)) : t = d(t), i._v = t
                }
            }), y(i, "reductor", {
                get: function() {
                    var e = i.value,
                        n = t.settings.perView;
                    return p(e) ? e.before / n + e.after / n : 2 * e / n
                }
            }), n.on(["resize", "update"], function() {
                i.mount()
            }), i
        },
        Sizes: function(t, e, n) {
            var i = {
                setupSlides: function() {
                    for (var t = "".concat(this.slideWidth, "px"), n = e.Html.slides, i = 0; i < n.length; i++) n[i].style.width = t
                },
                setupWrapper: function() {
                    e.Html.wrapper.style.width = "".concat(this.wrapperSize, "px")
                },
                remove: function() {
                    for (var t = e.Html.slides, n = 0; n < t.length; n++) t[n].style.width = "";
                    e.Html.wrapper.style.width = ""
                }
            };
            return y(i, "length", {
                get: function() {
                    return e.Html.slides.length
                }
            }), y(i, "width", {
                get: function() {
                    return e.Html.track.offsetWidth
                }
            }), y(i, "wrapperSize", {
                get: function() {
                    return i.slideWidth * i.length + e.Gaps.grow + e.Clones.grow
                }
            }), y(i, "slideWidth", {
                get: function() {
                    return i.width / t.settings.perView - e.Peek.reductor - e.Gaps.reductor
                }
            }), n.on(["build.before", "resize", "update"], function() {
                i.setupSlides(), i.setupWrapper()
            }), n.on("destroy", function() {
                i.remove()
            }), i
        },
        Gaps: function(t, e, n) {
            var i = {
                apply: function(t) {
                    for (var n = 0, i = t.length; n < i; n++) {
                        var o = t[n].style,
                            s = e.Direction.value;
                        o[_[s][0]] = 0 !== n ? "".concat(this.value / 2, "px") : "", n !== t.length - 1 ? o[_[s][1]] = "".concat(this.value / 2, "px") : o[_[s][1]] = ""
                    }
                },
                remove: function(t) {
                    for (var e = 0, n = t.length; e < n; e++) {
                        var i = t[e].style;
                        i.marginLeft = "", i.marginRight = ""
                    }
                }
            };
            return y(i, "value", {
                get: function() {
                    return d(t.settings.gap)
                }
            }), y(i, "grow", {
                get: function() {
                    return i.value * e.Sizes.length
                }
            }), y(i, "reductor", {
                get: function() {
                    var e = t.settings.perView;
                    return i.value * (e - 1) / e
                }
            }), n.on(["build.after", "update"], S(function() {
                i.apply(e.Html.wrapper.children)
            }, 30)), n.on("destroy", function() {
                i.remove(e.Html.wrapper.children)
            }), i
        },
        Move: function(t, e, n) {
            var i = {
                mount: function() {
                    this._o = 0
                },
                make: function() {
                    var t = this,
                        i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                    this.offset = i, n.emit("move", {
                        movement: this.value
                    }), e.Transition.after(function() {
                        n.emit("move.after", {
                            movement: t.value
                        })
                    })
                }
            };
            return y(i, "offset", {
                get: function() {
                    return i._o
                },
                set: function(t) {
                    i._o = m(t) ? 0 : d(t)
                }
            }), y(i, "translate", {
                get: function() {
                    return e.Sizes.slideWidth * t.index
                }
            }), y(i, "value", {
                get: function() {
                    var t = this.offset,
                        n = this.translate;
                    return e.Direction.is("rtl") ? n + t : n - t
                }
            }), n.on(["build.before", "run"], function() {
                i.make()
            }), i
        },
        Clones: function(t, e, n) {
            var i = {
                mount: function() {
                    this.items = [], t.isType("carousel") && (this.items = this.collect())
                },
                collect: function() {
                    var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
                        i = e.Html.slides,
                        o = t.settings,
                        s = o.perView,
                        r = o.classes,
                        a = o.cloningRatio;
                    if (i.length > 0)
                        for (var u = +!!t.settings.peek, c = s + u + Math.round(s / 2), l = i.slice(0, c).reverse(), f = i.slice(-1 * c), d = 0; d < Math.max(a, Math.floor(s / i.length)); d++) {
                            for (var h = 0; h < l.length; h++) {
                                var p = l[h].cloneNode(!0);
                                p.classList.add(r.slide.clone), n.push(p)
                            }
                            for (var v = 0; v < f.length; v++) {
                                var m = f[v].cloneNode(!0);
                                m.classList.add(r.slide.clone), n.unshift(m)
                            }
                        }
                    return n
                },
                append: function() {
                    for (var t = this.items, n = e.Html, i = n.wrapper, o = n.slides, s = Math.floor(t.length / 2), r = t.slice(0, s).reverse(), a = t.slice(-1 * s).reverse(), u = "".concat(e.Sizes.slideWidth, "px"), c = 0; c < a.length; c++) i.appendChild(a[c]);
                    for (var l = 0; l < r.length; l++) i.insertBefore(r[l], o[0]);
                    for (var f = 0; f < t.length; f++) t[f].style.width = u
                },
                remove: function() {
                    for (var t = this.items, n = 0; n < t.length; n++) e.Html.wrapper.removeChild(t[n])
                }
            };
            return y(i, "grow", {
                get: function() {
                    return (e.Sizes.slideWidth + e.Gaps.value) * i.items.length
                }
            }), n.on("update", function() {
                i.remove(), i.mount(), i.append()
            }), n.on("build.before", function() {
                t.isType("carousel") && i.append()
            }), n.on("destroy", function() {
                i.remove()
            }), i
        },
        Resize: function(t, e, n) {
            var i = new C,
                o = {
                    mount: function() {
                        this.bind()
                    },
                    bind: function() {
                        i.on("resize", window, S(function() {
                            n.emit("resize")
                        }, t.settings.throttle))
                    },
                    unbind: function() {
                        i.off("resize", window)
                    }
                };
            return n.on("destroy", function() {
                o.unbind(), i.destroy()
            }), o
        },
        Build: function(t, e, n) {
            var i = {
                mount: function() {
                    n.emit("build.before"), this.typeClass(), this.activeClass(), n.emit("build.after")
                },
                typeClass: function() {
                    e.Html.root.classList.add(t.settings.classes.type[t.settings.type])
                },
                activeClass: function() {
                    var n = t.settings.classes,
                        i = e.Html.slides[t.index];
                    i && (i.classList.add(n.slide.active), L(i).forEach(function(t) {
                        t.classList.remove(n.slide.active)
                    }))
                },
                removeClasses: function() {
                    var n = t.settings.classes,
                        i = n.type,
                        o = n.slide;
                    e.Html.root.classList.remove(i[t.settings.type]), e.Html.slides.forEach(function(t) {
                        t.classList.remove(o.active)
                    })
                }
            };
            return n.on(["destroy", "update"], function() {
                i.removeClasses()
            }), n.on(["resize", "update"], function() {
                i.mount()
            }), n.on("move.after", function() {
                i.activeClass()
            }), i
        },
        Run: function(t, e, n) {
            var i = {
                mount: function() {
                    this._o = !1
                },
                make: function(i) {
                    var o = this;
                    t.disabled || (t.settings.waitForTransition && t.disable(), this.move = i, n.emit("run.before", this.move), this.calculate(), n.emit("run", this.move), e.Transition.after(function() {
                        o.isStart() && n.emit("run.start", o.move), o.isEnd() && n.emit("run.end", o.move), o.isOffset() && (o._o = !1, n.emit("run.offset", o.move)), n.emit("run.after", o.move), t.enable()
                    }))
                },
                calculate: function() {
                    var e = this.move,
                        n = this.length,
                        o = e.steps,
                        s = e.direction,
                        r = 1;
                    if ("=" === s) return t.settings.bound && d(o) > n ? void(t.index = n) : void(t.index = o);
                    if (">" !== s || ">" !== o) {
                        if ("<" !== s || "<" !== o) {
                            if ("|" === s && (r = t.settings.perView || 1), ">" === s || "|" === s && ">" === o) {
                                var a, u, c, l, h, p = (a = r, u = t.index, t.isType("carousel") ? u + a : u + (a - u % a));
                                return p > n && (this._o = !0), void(t.index = (c = p, l = r, c <= (h = i.length) ? c : t.isType("carousel") ? c - (h + 1) : t.settings.rewind ? i.isBound() && !i.isEnd() ? h : 0 : i.isBound() ? h : Math.floor(h / l) * l))
                            }
                            if ("<" === s || "|" === s && "<" === o) {
                                var v, m, g, y, $, b = (v = r, m = t.index, t.isType("carousel") ? m - v : (Math.ceil(m / v) - 1) * v);
                                return b < 0 && (this._o = !0), void(t.index = (g = b, y = r, $ = i.length, g >= 0 ? g : t.isType("carousel") ? g + ($ + 1) : t.settings.rewind ? i.isBound() && i.isStart() ? $ : Math.floor($ / y) * y : 0))
                            }
                            f("Invalid direction pattern [".concat(s).concat(o, "] has been used"))
                        } else t.index = 0
                    } else t.index = n
                },
                isStart: function() {
                    return t.index <= 0
                },
                isEnd: function() {
                    return t.index >= this.length
                },
                isOffset: function() {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0;
                    return t ? !!this._o && ("|>" === t ? "|" === this.move.direction && ">" === this.move.steps : "|<" === t ? "|" === this.move.direction && "<" === this.move.steps : this.move.direction === t) : this._o
                },
                isBound: function() {
                    return t.isType("slider") && "center" !== t.settings.focusAt && t.settings.bound
                }
            };
            return y(i, "move", {
                get: function() {
                    return this._m
                },
                set: function(t) {
                    var e = t.substr(1);
                    this._m = {
                        direction: t.substr(0, 1),
                        steps: e ? d(e) ? d(e) : e : 0
                    }
                }
            }), y(i, "length", {
                get: function() {
                    var n = t.settings,
                        i = e.Html.slides.length;
                    return this.isBound() ? i - 1 - (d(n.perView) - 1) + d(n.focusAt) : i - 1
                }
            }), y(i, "offset", {
                get: function() {
                    return this._o
                }
            }), i
        },
        Swipe: function(t, e, n) {
            var i = new C,
                o = 0,
                s = 0,
                r = 0,
                a = !1,
                u = !!M && {
                    passive: !0
                },
                c = {
                    mount: function() {
                        this.bindSwipeStart()
                    },
                    start: function(e) {
                        if (!a && !t.disabled) {
                            this.disable();
                            var i = this.touches(e);
                            o = null, s = d(i.pageX), r = d(i.pageY), this.bindSwipeMove(), this.bindSwipeEnd(), n.emit("swipe.start")
                        }
                    },
                    move: function(i) {
                        if (!t.disabled) {
                            var a = t.settings,
                                u = a.touchAngle,
                                c = a.touchRatio,
                                l = a.classes,
                                f = this.touches(i),
                                h = d(f.pageX) - s,
                                p = Math.abs(d(f.pageY) - r << 2);
                            if (!(180 * (o = Math.asin(Math.sqrt(p) / Math.sqrt(Math.abs(h << 2) + p))) / Math.PI < u)) return !1;
                            i.stopPropagation(), e.Move.make(h * parseFloat(c)), e.Html.root.classList.add(l.dragging), n.emit("swipe.move")
                        }
                    },
                    end: function(i) {
                        if (!t.disabled) {
                            var r = t.settings,
                                a = r.perSwipe,
                                u = r.touchAngle,
                                c = r.classes,
                                l = this.touches(i),
                                f = this.threshold(i),
                                d = l.pageX - s,
                                h = 180 * o / Math.PI;
                            this.enable(), d > f && h < u ? e.Run.make(e.Direction.resolve("".concat(a, "<"))) : d < -f && h < u ? e.Run.make(e.Direction.resolve("".concat(a, ">"))) : e.Move.make(), e.Html.root.classList.remove(c.dragging), this.unbindSwipeMove(), this.unbindSwipeEnd(), n.emit("swipe.end")
                        }
                    },
                    bindSwipeStart: function() {
                        var n = this,
                            o = t.settings,
                            s = o.swipeThreshold,
                            r = o.dragThreshold;
                        s && i.on(B[0], e.Html.wrapper, function(t) {
                            n.start(t)
                        }, u), r && i.on(B[1], e.Html.wrapper, function(t) {
                            n.start(t)
                        }, u)
                    },
                    unbindSwipeStart: function() {
                        i.off(B[0], e.Html.wrapper, u), i.off(B[1], e.Html.wrapper, u)
                    },
                    bindSwipeMove: function() {
                        var n = this;
                        i.on(W, e.Html.wrapper, S(function(t) {
                            n.move(t)
                        }, t.settings.throttle), u)
                    },
                    unbindSwipeMove: function() {
                        i.off(W, e.Html.wrapper, u)
                    },
                    bindSwipeEnd: function() {
                        var t = this;
                        i.on(V, e.Html.wrapper, function(e) {
                            t.end(e)
                        })
                    },
                    unbindSwipeEnd: function() {
                        i.off(V, e.Html.wrapper)
                    },
                    touches: function(t) {
                        return j.indexOf(t.type) > -1 ? t : t.touches[0] || t.changedTouches[0]
                    },
                    threshold: function(e) {
                        var n = t.settings;
                        return j.indexOf(e.type) > -1 ? n.dragThreshold : n.swipeThreshold
                    },
                    enable: function() {
                        return a = !1, e.Transition.enable(), this
                    },
                    disable: function() {
                        return a = !0, e.Transition.disable(), this
                    }
                };
            return n.on("build.after", function() {
                e.Html.root.classList.add(t.settings.classes.swipeable)
            }), n.on("destroy", function() {
                c.unbindSwipeStart(), c.unbindSwipeMove(), c.unbindSwipeEnd(), i.destroy()
            }), c
        },
        Images: function(t, e, n) {
            var i = new C,
                o = {
                    mount: function() {
                        this.bind()
                    },
                    bind: function() {
                        i.on("dragstart", e.Html.wrapper, this.dragstart)
                    },
                    unbind: function() {
                        i.off("dragstart", e.Html.wrapper)
                    },
                    dragstart: function(t) {
                        t.preventDefault()
                    }
                };
            return n.on("destroy", function() {
                o.unbind(), i.destroy()
            }), o
        },
        Anchors: function(t, e, n) {
            var i = new C,
                o = !1,
                s = !1,
                r = {
                    mount: function() {
                        this._a = e.Html.wrapper.querySelectorAll("a"), this.bind()
                    },
                    bind: function() {
                        i.on("click", e.Html.wrapper, this.click)
                    },
                    unbind: function() {
                        i.off("click", e.Html.wrapper)
                    },
                    click: function(t) {
                        s && (t.stopPropagation(), t.preventDefault())
                    },
                    detach: function() {
                        if (s = !0, !o) {
                            for (var t = 0; t < this.items.length; t++) this.items[t].draggable = !1;
                            o = !0
                        }
                        return this
                    },
                    attach: function() {
                        if (s = !1, o) {
                            for (var t = 0; t < this.items.length; t++) this.items[t].draggable = !0;
                            o = !1
                        }
                        return this
                    }
                };
            return y(r, "items", {
                get: function() {
                    return r._a
                }
            }), n.on("swipe.move", function() {
                r.detach()
            }), n.on("swipe.end", function() {
                e.Transition.after(function() {
                    r.attach()
                })
            }), n.on("destroy", function() {
                r.attach(), r.unbind(), i.destroy()
            }), r
        },
        Controls: function(t, e, n) {
            var i = new C,
                o = !!M && {
                    passive: !0
                },
                s = {
                    mount: function() {
                        this._n = e.Html.root.querySelectorAll('[data-glide-el="controls[nav]"]'), this._c = e.Html.root.querySelectorAll(G), this._arrowControls = {
                            previous: e.Html.root.querySelectorAll(N),
                            next: e.Html.root.querySelectorAll(F)
                        }, this.addBindings()
                    },
                    setActive: function() {
                        for (var t = 0; t < this._n.length; t++) this.addClass(this._n[t].children)
                    },
                    removeActive: function() {
                        for (var t = 0; t < this._n.length; t++) this.removeClass(this._n[t].children)
                    },
                    addClass: function(e) {
                        var n = t.settings,
                            i = e[t.index];
                        i && (i.classList.add(n.classes.nav.active), L(i).forEach(function(t) {
                            t.classList.remove(n.classes.nav.active)
                        }))
                    },
                    removeClass: function(e) {
                        var n = e[t.index];
                        null == n || n.classList.remove(t.settings.classes.nav.active)
                    },
                    setArrowState: function() {
                        if (!t.settings.rewind) {
                            var n = s._arrowControls.next,
                                i = s._arrowControls.previous;
                            this.resetArrowState(n, i), 0 === t.index && this.disableArrow(i), t.index === e.Run.length && this.disableArrow(n)
                        }
                    },
                    resetArrowState: function() {
                        for (var e = t.settings, n = arguments.length, i = Array(n), o = 0; o < n; o++) i[o] = arguments[o];
                        i.forEach(function(t) {
                            H(t).forEach(function(t) {
                                t.classList.remove(e.classes.arrow.disabled)
                            })
                        })
                    },
                    disableArrow: function() {
                        for (var e = t.settings, n = arguments.length, i = Array(n), o = 0; o < n; o++) i[o] = arguments[o];
                        i.forEach(function(t) {
                            H(t).forEach(function(t) {
                                t.classList.add(e.classes.arrow.disabled)
                            })
                        })
                    },
                    addBindings: function() {
                        for (var t = 0; t < this._c.length; t++) this.bind(this._c[t].children)
                    },
                    removeBindings: function() {
                        for (var t = 0; t < this._c.length; t++) this.unbind(this._c[t].children)
                    },
                    bind: function(t) {
                        for (var e = 0; e < t.length; e++) i.on("click", t[e], this.click), i.on("touchstart", t[e], this.click, o)
                    },
                    unbind: function(t) {
                        for (var e = 0; e < t.length; e++) i.off(["click", "touchstart"], t[e])
                    },
                    click: function(t) {
                        M || "touchstart" !== t.type || t.preventDefault();
                        var n = t.currentTarget.getAttribute("data-glide-dir");
                        e.Run.make(e.Direction.resolve(n))
                    }
                };
            return y(s, "items", {
                get: function() {
                    return s._c
                }
            }), n.on(["mount.after", "move.after"], function() {
                s.setActive()
            }), n.on(["mount.after", "run"], function() {
                s.setArrowState()
            }), n.on("destroy", function() {
                s.removeBindings(), s.removeActive(), i.destroy()
            }), s
        },
        Keyboard: function(t, e, n) {
            var i = new C,
                o = {
                    mount: function() {
                        t.settings.keyboard && this.bind()
                    },
                    bind: function() {
                        i.on("keyup", document, this.press)
                    },
                    unbind: function() {
                        i.off("keyup", document)
                    },
                    press: function(n) {
                        var i = t.settings.perSwipe;
                        ["ArrowRight", "ArrowLeft"].includes(n.code) && e.Run.make(e.Direction.resolve("".concat(i).concat({
                            ArrowRight: ">",
                            ArrowLeft: "<"
                        }[n.code])))
                    }
                };
            return n.on(["destroy", "update"], function() {
                o.unbind()
            }), n.on("update", function() {
                o.mount()
            }), n.on("destroy", function() {
                i.destroy()
            }), o
        },
        Autoplay: function(t, e, n) {
            var i = new C,
                o = {
                    mount: function() {
                        this.enable(), this.start(), t.settings.hoverpause && this.bind()
                    },
                    enable: function() {
                        this._e = !0
                    },
                    disable: function() {
                        this._e = !1
                    },
                    start: function() {
                        var i = this;
                        this._e && (this.enable(), t.settings.autoplay && m(this._i) && (this._i = setInterval(function() {
                            i.stop(), e.Run.make(">"), i.start(), n.emit("autoplay")
                        }, this.time)))
                    },
                    stop: function() {
                        this._i = clearInterval(this._i)
                    },
                    bind: function() {
                        var t = this;
                        i.on("mouseover", e.Html.root, function() {
                            t._e && t.stop()
                        }), i.on("mouseout", e.Html.root, function() {
                            t._e && t.start()
                        })
                    },
                    unbind: function() {
                        i.off(["mouseover", "mouseout"], e.Html.root)
                    }
                };
            return y(o, "time", {
                get: function() {
                    return d(e.Html.slides[t.index].getAttribute("data-glide-autoplay") || t.settings.autoplay)
                }
            }), n.on(["destroy", "update"], function() {
                o.unbind()
            }), n.on(["run.before", "swipe.start", "update"], function() {
                o.stop()
            }), n.on(["pause", "destroy"], function() {
                o.disable(), o.stop()
            }), n.on(["run.after", "swipe.end"], function() {
                o.start()
            }), n.on(["play"], function() {
                o.enable(), o.start()
            }), n.on("update", function() {
                o.mount()
            }), n.on("destroy", function() {
                i.destroy()
            }), o
        },
        Breakpoints: function(t, e, n) {
            var i = new C,
                o = t.settings,
                s = Q(o.breakpoints),
                r = Object.assign({}, o),
                a = {
                    match: function(t) {
                        if (void 0 !== window.matchMedia) {
                            for (var e in t)
                                if (t.hasOwnProperty(e) && window.matchMedia("(max-width: ".concat(e, "px)")).matches) return t[e]
                        }
                        return r
                    }
                };
            return Object.assign(o, a.match(s)), i.on("resize", window, S(function() {
                t.settings = $(o, a.match(s))
            }, t.settings.throttle)), n.on("update", function() {
                s = Q(s), r = Object.assign({}, o)
            }), n.on("destroy", function() {
                i.off("resize", window)
            }), a
        }
    };
    return function(t) {
        ! function(t, e) {
            if ("function" != typeof e && null !== e) throw TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    writable: !0,
                    configurable: !0
                }
            }), e && u(t, e)
        }(r, t);
        var e, n, o = (e = r, n = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0
            } catch (t) {
                return !1
            }
        }(), function() {
            var t, i = a(e);
            if (n) {
                var o = a(this).constructor;
                t = Reflect.construct(i, arguments, o)
            } else t = i.apply(this, arguments);
            return function t(e, n) {
                if (n && ("object" == typeof n || "function" == typeof n)) return n;
                if (void 0 !== n) throw TypeError("Derived constructors may only return object or undefined");
                return function(t) {
                    if (void 0 === t) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return t
                }(e)
            }(this, t)
        });

        function r() {
            return i(this, r), o.apply(this, arguments)
        }
        return s(r, [{
            key: "mount",
            value: function() {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                return c(a(r.prototype), "mount", this).call(this, Object.assign({}, U, t))
            }
        }]), r
    }(w)
}),
function() {
    let t = document.querySelector(".slider1");
    if (t) {
        var e = new Glide(t, {
            type: "slider",
            direction: siteDir,
            gap: 0
        });
        e.on(["mount.after"], function() {
            t.classList.remove("pre-slider1")
        }), e.on("build.after", function() {
            glideHandleHeight(t)
        }), e.on("run.after", function() {
            glideHandleHeight(t)
        }), e.mount()
    }
}(),
function() {
    let t = document.querySelector(".slider3");
    if (t) {
        var e = new Glide(t, {
            type: "carousel",
            direction: siteDir,
            gap: 30,
            perView: 3,
            breakpoints: {
                1024: {
                    perView: 2
                },
                880: {
                    perView: 1
                }
            }
        });
        e.on(["mount.after"], function() {
            t.classList.remove("pre-slider3")
        }), e.mount()
    }
}(),
function() {
    let t = document.querySelector(".slider4");
    if (t) {
        var e = new Glide(t, {
            type: "carousel",
            direction: siteDir,
            gap: 30,
            perView: 4,
            breakpoints: {
                1024: {
                    perView: 3
                },
                880: {
                    perView: 2
                },
                575: {
                    perView: 1
                }
            }
        });
        e.on(["mount.after"], function() {
            t.classList.remove("pre-slider4")
        }), e.mount()
    }
}();
