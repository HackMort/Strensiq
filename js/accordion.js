/**
 * van11y-accessible-accordion-aria - ES2015 accessible accordion system, using ARIA (compatible IE9+ when transpiled)
 * @version v3.0.1
 * @link https://van11y.net/accessible-accordion/
 * @license MIT : https://github.com/nico3333fr/van11y-accessible-accordion-aria/blob/master/LICENSE
 */

(function () {
  "use strict"; function _defineProperty(e, t, r) { return t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e } var _extends = Object.assign || function (e) { for (var t = 1; t < arguments.length; t++) { var r = arguments[t]; for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]) } return e }, loadConfig = function () { var e = {}, t = function (t, r) { e[t] = r }, r = function (t) { return e[t] }, n = function (t) { return e[t] }; return { set: t, get: r, remove: n } }, DATA_HASH_ID = "data-hashaccordion-id", pluginConfig = loadConfig(), findById = function (e, t) { return document.querySelector("#" + e + "[" + DATA_HASH_ID + '="' + t + '"]') }, addClass = function (e, t) { e.classList ? e.classList.add(t) : e.className += " " + t }, removeClass = function (e, t) { e.classList ? e.classList.remove(t) : e.className = e.className.replace(new RegExp("(^|\\b)" + t.split(" ").join("|") + "(\\b|$)", "gi"), " ") }, hasClass = function (e, t) { return e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) }, setAttributes = function (e, t) { Object.keys(t).forEach(function (r) { e.setAttribute(r, t[r]) }) }, searchParentHashId = function (e, t) { for (var r = !1, n = e; 1 === n.nodeType && n && r === !1;)n.hasAttribute(t) === !0 ? r = !0 : n = n.parentNode; return r === !0 ? n.getAttribute(t) : "" }, searchParent = function (e, t, r) { for (var n = !1, A = e; A && n === !1;)hasClass(A, t) === !0 && A.getAttribute(DATA_HASH_ID) === r ? n = !0 : A = A.parentNode; return n === !0 ? A.getAttribute("id") : "" }, unSelectHeaders = function (e, t) { e.forEach(function (e) { setAttributes(e, _defineProperty({}, t, "false")) }) }, selectHeader = function (e, t) { e.setAttribute(t, !0) }, selectHeaderInList = function (e, t, r) { var n = void 0; e.forEach(function (e, t) { "true" === e.getAttribute(r) && (n = t) }), "next" === t && (selectHeader(e[n + 1]), setTimeout(function () { e[n + 1].focus() }, 0)), "prev" === t && (selectHeader(e[n - 1]), setTimeout(function () { e[n - 1].focus() }, 0)) }, plugin = function () { var e = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0], t = _extends({ ACCORDION_JS: "js-accordion", ACCORDION_JS_HEADER: "js-accordion__header", ACCORDION_JS_PANEL: "js-accordion__panel", ACCORDION_DATA_PREFIX_CLASS: "data-accordion-prefix-classes", ACCORDION_DATA_OPENED: "data-accordion-opened", ACCORDION_DATA_MULTISELECTABLE: "data-accordion-multiselectable", ACCORDION_DATA_COOL_SELECTORS: "data-accordion-cool-selectors", ACCORDION_PREFIX_IDS: "accordion", ACCORDION_BUTTON_ID: "_tab", ACCORDION_PANEL_ID: "_panel", ACCORDION_STYLE: "accordion", ACCORDION_TITLE_STYLE: "accordion__title", ACCORDION_HEADER_STYLE: "accordion__header", ACCORDION_PANEL_STYLE: "accordion__panel", ACCORDION_ROLE_TABLIST: "tablist", ACCORDION_ROLE_TAB: "tab", ACCORDION_ROLE_TABPANEL: "tabpanel", ATTR_ROLE: "role", ATTR_MULTISELECTABLE: "aria-multiselectable", ATTR_EXPANDED: "aria-expanded", ATTR_LABELLEDBY: "aria-labelledby", ATTR_HIDDEN: "aria-hidden", ATTR_CONTROLS: "aria-controls", ATTR_SELECTED: "aria-selected" }, e), r = Math.random().toString(32).slice(2, 12); pluginConfig.set(r, t); var n = function () { var e = arguments.length <= 0 || void 0 === arguments[0] ? document : arguments[0]; return [].slice.call(e.querySelectorAll("." + t.ACCORDION_JS)) }, A = function (e) { n(e).forEach(function (e) { var n = "z" + Math.random().toString(32).slice(2, 12), A = e.hasAttribute(t.ACCORDION_DATA_PREFIX_CLASS) === !0 ? e.getAttribute(t.ACCORDION_DATA_PREFIX_CLASS) + "-" : "", a = e.hasAttribute(t.ACCORDION_DATA_COOL_SELECTORS) === !0; "none" === e.getAttribute(t.ACCORDION_DATA_MULTISELECTABLE) ? e.setAttribute(t.ATTR_MULTISELECTABLE, "false") : e.setAttribute(t.ATTR_MULTISELECTABLE, "true"), e.setAttribute(t.ATTR_ROLE, t.ACCORDION_ROLE_TABLIST), e.setAttribute("id", n), e.setAttribute(DATA_HASH_ID, r), addClass(e, A + t.ACCORDION_STYLE); var i = [].slice.call(e.querySelectorAll("." + t.ACCORDION_JS_HEADER)); i.forEach(function (i, _) { var o, T; if (i.parentNode === e || a !== !1) { var E = _ + 1, s = i.nextElementSibling, C = i.innerHTML, c = document.createElement("BUTTON"), D = i.hasAttribute(t.ACCORDION_DATA_OPENED) === !0 ? i.getAttribute(t.ACCORDION_DATA_OPENED) : ""; c.innerHTML = C, addClass(c, t.ACCORDION_JS_HEADER), addClass(c, A + t.ACCORDION_HEADER_STYLE), setAttributes(c, (o = {}, _defineProperty(o, t.ATTR_ROLE, t.ACCORDION_ROLE_TAB), _defineProperty(o, "id", t.ACCORDION_PREFIX_IDS + n + t.ACCORDION_BUTTON_ID + E), _defineProperty(o, t.ATTR_CONTROLS, t.ACCORDION_PREFIX_IDS + n + t.ACCORDION_PANEL_ID + E), _defineProperty(o, t.ATTR_SELECTED, "false"), _defineProperty(o, "type", "button"), _defineProperty(o, DATA_HASH_ID, r), o)), i.innerHTML = "", i.appendChild(c), addClass(i, A + t.ACCORDION_TITLE_STYLE), removeClass(i, t.ACCORDION_JS_HEADER), addClass(s, A + t.ACCORDION_PANEL_STYLE), setAttributes(s, (T = {}, _defineProperty(T, t.ATTR_ROLE, t.ACCORDION_ROLE_TABPANEL), _defineProperty(T, t.ATTR_LABELLEDBY, t.ACCORDION_PREFIX_IDS + n + t.ACCORDION_BUTTON_ID + E), _defineProperty(T, "id", t.ACCORDION_PREFIX_IDS + n + t.ACCORDION_PANEL_ID + E), _defineProperty(T, DATA_HASH_ID, r), T)), "true" === D ? (c.setAttribute(t.ATTR_EXPANDED, "true"), i.removeAttribute(t.ACCORDION_DATA_OPENED), s.setAttribute(t.ATTR_HIDDEN, "false")) : (c.setAttribute(t.ATTR_EXPANDED, "false"), s.setAttribute(t.ATTR_HIDDEN, "true")) } }) }) }; return { attach: A } }, main = function () { return ["click", "keydown", "focus"].forEach(function (e) { document.body.addEventListener(e, function (t) { var r = searchParentHashId(t.target, DATA_HASH_ID); "" !== r && !function () { var n = pluginConfig.get(r); hasClass(t.target, n.ACCORDION_JS_HEADER) === !0 && "focus" === e && !function () { var e = t.target, A = findById(searchParent(e, n.ACCORDION_JS, r), r), a = A.hasAttribute(n.ACCORDION_DATA_COOL_SELECTORS) === !0, i = [].slice.call(A.querySelectorAll("." + n.ACCORDION_JS_HEADER)); a === !1 && (i = i.filter(function (e) { return e.parentNode.parentNode === A })), unSelectHeaders(i, n.ATTR_SELECTED), selectHeader(e, n.ATTR_SELECTED) }(), hasClass(t.target, n.ACCORDION_JS_HEADER) === !0 && "click" === e && !function () { var e = t.target, A = findById(searchParent(e, n.ACCORDION_JS, r), r), a = A.hasAttribute(n.ACCORDION_DATA_COOL_SELECTORS) === !0, i = [].slice.call(A.querySelectorAll("." + n.ACCORDION_JS_HEADER)), _ = A.getAttribute(n.ATTR_MULTISELECTABLE), o = findById(e.getAttribute(n.ATTR_CONTROLS), r), T = e.getAttribute(n.ATTR_EXPANDED); a === !1 && (i = i.filter(function (e) { return e.parentNode.parentNode === A })), "false" === T ? (e.setAttribute(n.ATTR_EXPANDED, !0), o.removeAttribute(n.ATTR_HIDDEN)) : (e.setAttribute(n.ATTR_EXPANDED, !1), o.setAttribute(n.ATTR_HIDDEN, !0)), "false" === _ && i.forEach(function (t) { var A = findById(t.getAttribute(n.ATTR_CONTROLS), r); t !== e ? (t.setAttribute(n.ATTR_SELECTED, !1), t.setAttribute(n.ATTR_EXPANDED, !1), A.setAttribute(n.ATTR_HIDDEN, !0)) : t.setAttribute(n.ATTR_SELECTED, !0) }), setTimeout(function () { e.focus() }, 0), t.preventDefault() }(), hasClass(t.target, n.ACCORDION_JS_HEADER) === !0 && "keydown" === e && !function () { var e = t.target, A = searchParent(e, n.ACCORDION_JS, r), a = findById(A, r), i = a.hasAttribute(n.ACCORDION_DATA_COOL_SELECTORS) === !0, _ = [].slice.call(a.querySelectorAll("." + n.ACCORDION_JS_HEADER)); i === !1 && (_ = _.filter(function (e) { return e.parentNode.parentNode === a })), 36 === t.keyCode ? (unSelectHeaders(_, n.ATTR_SELECTED), selectHeader(_[0], n.ATTR_SELECTED), setTimeout(function () { _[0].focus() }, 0), t.preventDefault()) : 35 === t.keyCode ? (unSelectHeaders(_, n.ATTR_SELECTED), selectHeader(_[_.length - 1], n.ATTR_SELECTED), setTimeout(function () { _[_.length - 1].focus() }, 0), t.preventDefault()) : 37 !== t.keyCode && 38 !== t.keyCode || t.ctrlKey ? 40 !== t.keyCode && 39 !== t.keyCode || t.ctrlKey || ("true" === _[_.length - 1].getAttribute(n.ATTR_SELECTED) ? (unSelectHeaders(_, n.ATTR_SELECTED), selectHeader(_[0], n.ATTR_SELECTED), setTimeout(function () { _[0].focus() }, 0), t.preventDefault()) : (selectHeaderInList(_, "next", n.ATTR_SELECTED), t.preventDefault())) : "true" === _[0].getAttribute(n.ATTR_SELECTED) ? (unSelectHeaders(_, n.ATTR_SELECTED), selectHeader(_[_.length - 1], n.ATTR_SELECTED), setTimeout(function () { _[_.length - 1].focus() }, 0), t.preventDefault()) : (selectHeaderInList(_, "prev", n.ATTR_SELECTED), t.preventDefault()) }() }() }, !0) }), plugin }; window.van11yAccessibleAccordionAria = main(); var onLoad = function e() { var t = window.van11yAccessibleAccordionAria(); t.attach(), document.removeEventListener("DOMContentLoaded", e) }; document.addEventListener("DOMContentLoaded", onLoad);
})()