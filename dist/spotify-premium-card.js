/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, B = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, D = Symbol(), F = /* @__PURE__ */ new WeakMap();
let rt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== D) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (B && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = F.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && F.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const pt = (s) => new rt(typeof s == "string" ? s : s + "", void 0, D), ft = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, o, r) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + s[r + 1], s[0]);
  return new rt(e, s, D);
}, _t = (s, t) => {
  if (B) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), o = N.litNonce;
    o !== void 0 && i.setAttribute("nonce", o), i.textContent = e.cssText, s.appendChild(i);
  }
}, J = B ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return pt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: mt, defineProperty: gt, getOwnPropertyDescriptor: $t, getOwnPropertyNames: bt, getOwnPropertySymbols: vt, getPrototypeOf: yt } = Object, b = globalThis, X = b.trustedTypes, xt = X ? X.emptyScript : "", At = b.reactiveElementPolyfillSupport, P = (s, t) => s, R = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? xt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, Z = (s, t) => !mt(s, t), G = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), b.litPropertyMetadata ?? (b.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = G) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), o = this.getPropertyDescriptor(t, i, e);
      o !== void 0 && gt(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: o, set: r } = $t(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: o, set(n) {
      const l = o?.call(this);
      r?.call(this, n), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? G;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = yt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, i = [...bt(e), ...vt(e)];
      for (const o of i) this.createProperty(o, e[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, o] of e) this.elementProperties.set(i, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const o = this._$Eu(e, i);
      o !== void 0 && this._$Eh.set(o, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const o of i) e.unshift(J(o));
    } else t !== void 0 && e.push(J(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return _t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, i);
    if (o !== void 0 && i.reflect === !0) {
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : R).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, o = i._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const r = i.getPropertyOptions(o), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : R;
      this._$Em = o;
      const l = n.fromAttribute(e, r.type);
      this[o] = l ?? this._$Ej?.get(o) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, o = !1, r) {
    if (t !== void 0) {
      const n = this.constructor;
      if (o === !1 && (r = this[t]), i ?? (i = n.getPropertyOptions(t)), !((i.hasChanged ?? Z)(r, e) || i.useDefault && i.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: o, wrapped: r }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), o === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, r] of i) {
        const { wrapped: n } = r, l = this[o];
        n !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, r, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[P("elementProperties")] = /* @__PURE__ */ new Map(), w[P("finalized")] = /* @__PURE__ */ new Map(), At?.({ ReactiveElement: w }), (b.reactiveElementVersions ?? (b.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, Y = (s) => s, j = V.trustedTypes, Q = j ? j.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, nt = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, at = "?" + $, wt = `<${at}>`, x = document, T = () => x.createComment(""), L = (s) => s === null || typeof s != "object" && typeof s != "function", q = Array.isArray, St = (s) => q(s) || typeof s?.[Symbol.iterator] == "function", I = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, tt = /-->/g, et = />/g, v = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), it = /'/g, st = /"/g, lt = /^(?:script|style|textarea|title)$/i, Et = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), C = Et(1), S = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), y = x.createTreeWalker(x, 129);
function ht(s, t) {
  if (!q(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Q !== void 0 ? Q.createHTML(t) : t;
}
const Mt = (s, t) => {
  const e = s.length - 1, i = [];
  let o, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = M;
  for (let l = 0; l < e; l++) {
    const a = s[l];
    let d, u, h = -1, p = 0;
    for (; p < a.length && (n.lastIndex = p, u = n.exec(a), u !== null); ) p = n.lastIndex, n === M ? u[1] === "!--" ? n = tt : u[1] !== void 0 ? n = et : u[2] !== void 0 ? (lt.test(u[2]) && (o = RegExp("</" + u[2], "g")), n = v) : u[3] !== void 0 && (n = v) : n === v ? u[0] === ">" ? (n = o ?? M, h = -1) : u[1] === void 0 ? h = -2 : (h = n.lastIndex - u[2].length, d = u[1], n = u[3] === void 0 ? v : u[3] === '"' ? st : it) : n === st || n === it ? n = v : n === tt || n === et ? n = M : (n = v, o = void 0);
    const f = n === v && s[l + 1].startsWith("/>") ? " " : "";
    r += n === M ? a + wt : h >= 0 ? (i.push(d), a.slice(0, h) + nt + a.slice(h) + $ + f) : a + $ + (h === -2 ? l : f);
  }
  return [ht(s, r + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class O {
  constructor({ strings: t, _$litType$: e }, i) {
    let o;
    this.parts = [];
    let r = 0, n = 0;
    const l = t.length - 1, a = this.parts, [d, u] = Mt(t, e);
    if (this.el = O.createElement(d, i), y.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = y.nextNode()) !== null && a.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const h of o.getAttributeNames()) if (h.endsWith(nt)) {
          const p = u[n++], f = o.getAttribute(h).split($), m = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: r, name: m[2], strings: f, ctor: m[1] === "." ? Pt : m[1] === "?" ? Vt : m[1] === "@" ? kt : z }), o.removeAttribute(h);
        } else h.startsWith($) && (a.push({ type: 6, index: r }), o.removeAttribute(h));
        if (lt.test(o.tagName)) {
          const h = o.textContent.split($), p = h.length - 1;
          if (p > 0) {
            o.textContent = j ? j.emptyScript : "";
            for (let f = 0; f < p; f++) o.append(h[f], T()), y.nextNode(), a.push({ type: 2, index: ++r });
            o.append(h[p], T());
          }
        }
      } else if (o.nodeType === 8) if (o.data === at) a.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = o.data.indexOf($, h + 1)) !== -1; ) a.push({ type: 7, index: r }), h += $.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = x.createElement("template");
    return i.innerHTML = t, i;
  }
}
function E(s, t, e = s, i) {
  if (t === S) return t;
  let o = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const r = L(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== r && (o?._$AO?.(!1), r === void 0 ? o = void 0 : (o = new r(s), o._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = o : e._$Cl = o), o !== void 0 && (t = E(s, o._$AS(s, t.values), o, i)), t;
}
class Ct {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, o = (t?.creationScope ?? x).importNode(e, !0);
    y.currentNode = o;
    let r = y.nextNode(), n = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new U(r, r.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (d = new Ht(r, this, t)), this._$AV.push(d), a = i[++l];
      }
      n !== a?.index && (r = y.nextNode(), n++);
    }
    return y.currentNode = x, o;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class U {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, o) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = E(this, t, e), L(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && L(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, o = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = O.createElement(ht(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === o) this._$AH.p(e);
    else {
      const r = new Ct(o, this), n = r.u(this.options);
      r.p(e), this.T(n), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = ot.get(t.strings);
    return e === void 0 && ot.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, o = 0;
    for (const r of t) o === e.length ? e.push(i = new U(this.O(T()), this.O(T()), this, this.options)) : i = e[o], i._$AI(r), o++;
    o < e.length && (this._$AR(i && i._$AB.nextSibling, o), e.length = o);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = Y(t).nextSibling;
      Y(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, o, r) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = c;
  }
  _$AI(t, e = this, i, o) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = E(this, t, e, 0), n = !L(t) || t !== this._$AH && t !== S, n && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = r[0], a = 0; a < r.length - 1; a++) d = E(this, l[i + a], e, a), d === S && (d = this._$AH[a]), n || (n = !L(d) || d !== this._$AH[a]), d === c ? t = c : t !== c && (t += (d ?? "") + r[a + 1]), this._$AH[a] = d;
    }
    n && !o && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Pt extends z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Vt extends z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class kt extends z {
  constructor(t, e, i, o, r) {
    super(t, e, i, o, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? c) === S) return;
    const i = this._$AH, o = t === c && i !== c || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== c && (i === c || o);
    o && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ht {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Tt = V.litHtmlPolyfillSupport;
Tt?.(O, U), (V.litHtmlVersions ?? (V.litHtmlVersions = [])).push("3.3.3");
const Lt = (s, t, e) => {
  const i = e?.renderBefore ?? t;
  let o = i._$litPart$;
  if (o === void 0) {
    const r = e?.renderBefore ?? null;
    i._$litPart$ = o = new U(t.insertBefore(T(), r), r, void 0, e ?? {});
  }
  return o._$AI(s), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis;
class H extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Lt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return S;
  }
}
H._$litElement$ = !0, H.finalized = !0, k.litElementHydrateSupport?.({ LitElement: H });
const Ot = k.litElementPolyfillSupport;
Ot?.({ LitElement: H });
(k.litElementVersions ?? (k.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nt = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: Z }, Rt = (s = Nt, t, e) => {
  const { kind: i, metadata: o } = e;
  let r = globalThis.litPropertyMetadata.get(o);
  if (r === void 0 && globalThis.litPropertyMetadata.set(o, r = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), r.set(e.name, s), i === "accessor") {
    const { name: n } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(n, a, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: n } = e;
    return function(l) {
      const a = this[n];
      t.call(this, l), this.requestUpdate(n, a, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ct(s) {
  return (t, e) => typeof e == "object" ? Rt(s, t, e) : ((i, o, r) => {
    const n = o.hasOwnProperty(r);
    return o.constructor.createProperty(r, i), n ? Object.getOwnPropertyDescriptor(o, r) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function A(s) {
  return ct({ ...s, state: !0, attribute: !1 });
}
var jt = Object.defineProperty, zt = Object.getOwnPropertyDescriptor, g = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? zt(t, e) : t, r = s.length - 1, n; r >= 0; r--)
    (n = s[r]) && (o = (i ? n(t, e, o) : n(o)) || o);
  return i && o && jt(t, e, o), o;
};
let _ = class extends H {
  constructor() {
    super(...arguments), this._showVolume = !1, this._localMuted = !1, this._currentPosition = 0, this._volumeBeforeMute = 0.5;
  }
  setConfig(s) {
    if (!s.entity)
      throw new Error("You need to define an entity");
    this._config = s;
  }
  getCardSize() {
    return 6;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearVolumeTimer(), this._positionTimer && (window.clearInterval(this._positionTimer), this._positionTimer = void 0);
  }
  updated() {
    const s = this._getStateObj();
    if (!s)
      return;
    const t = [
      s.attributes.media_content_id ?? "",
      s.attributes.media_title ?? "",
      s.attributes.media_artist ?? ""
    ].join("|");
    t !== this._lastTrackKey && (this._lastTrackKey = t, this._currentPosition = Number(s.attributes.media_position ?? 0), this._lastPositionUpdatedAt = String(
      s.attributes.media_position_updated_at ?? ""
    ));
    const e = Number(s.attributes.media_position ?? 0), i = String(
      s.attributes.media_position_updated_at ?? ""
    );
    i && i !== this._lastPositionUpdatedAt && (this._lastPositionUpdatedAt = i, this._currentPosition = e), s.state === "playing" && !this._positionTimer && (this._positionTimer = window.setInterval(() => {
      const o = this._getStateObj(), r = Number(
        o?.attributes.media_duration ?? 0
      );
      o?.state === "playing" && r > 0 && this._currentPosition < r && (this._currentPosition += 1);
    }, 1e3)), s.state !== "playing" && this._positionTimer && (window.clearInterval(this._positionTimer), this._positionTimer = void 0);
  }
  _getStateObj() {
    if (!(!this.hass || !this._config))
      return this.hass.states[this._config.entity];
  }
  _callMedia(s, t = {}) {
    !this.hass || !this._config || this.hass.callService("media_player", s, {
      entity_id: this._config.entity,
      ...t
    });
  }
  _formatTime(s) {
    const t = Math.max(0, Math.floor(s || 0)), e = Math.floor(t / 60), i = t % 60;
    return `${e}:${String(i).padStart(2, "0")}`;
  }
  _clearVolumeTimer() {
    this._volumeTimer && (window.clearTimeout(this._volumeTimer), this._volumeTimer = void 0);
  }
  _startVolumeTimer() {
    this._clearVolumeTimer(), this._volumeTimer = window.setTimeout(() => {
      this._showVolume = !1;
    }, 1e4);
  }
  _handleVolumeClick() {
    const s = this._getStateObj();
    if (!s)
      return;
    if (!this._showVolume) {
      this._localMuted = !1, this._showVolume = !0, this._startVolumeTimer();
      return;
    }
    const t = Number(s.attributes.volume_level ?? 0.5), e = this._localVolume ?? t;
    if (!this._localMuted && e > 0)
      this._volumeBeforeMute = e, this._localMuted = !0, this._localVolume = 0, this._callMedia("volume_set", {
        volume_level: 0
      });
    else {
      const i = Math.max(this._volumeBeforeMute, 0.05);
      this._localMuted = !1, this._localVolume = i, this._callMedia("volume_set", {
        volume_level: i
      });
    }
    this._startVolumeTimer();
  }
  _handleVolumeInput(s) {
    const t = s.target, e = Math.max(0, Math.min(1, Number(t.value) / 100));
    this._localVolume = e, this._localMuted = e === 0, e > 0 && (this._volumeBeforeMute = e), this._callMedia("volume_set", {
      volume_level: e
    }), this._startVolumeTimer();
  }
  _toggleShuffle(s) {
    const t = !s;
    this._localShuffle = t, this._callMedia("shuffle_set", {
      shuffle: t
    });
  }
  _toggleRepeat(s) {
    const t = s === "off" ? "all" : "off";
    this._localRepeat = t, this._callMedia("repeat_set", {
      repeat: t
    });
  }
  _icon(s) {
    const t = {
      volume: "M3,9V15H7L12,20V4L7,9H3M14.5,12C14.5,10.23 13.5,8.71 12,8V16C13.5,15.29 14.5,13.77 14.5,12M12,3.23V5.29C14.89,6.15 17,8.83 17,12C17,15.17 14.89,17.85 12,18.71V20.77C16,19.86 19,16.28 19,12C19,7.72 16,4.14 12,3.23Z",
      muted: "M3,9V15H7L12,20V4L7,9H3M16.59,12L19,9.59L20.41,11L18,13.41L20.41,15.83L19,17.24L16.59,14.83L14.17,17.24L12.76,15.83L15.17,13.41L12.76,11L14.17,9.59L16.59,12Z",
      shuffle: "M10.59,9.17L5.41,4L4,5.41L9.17,10.59L10.59,9.17M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4H14.5M14.83,14.83L13.42,16.24L16.55,19.37L14.5,21.41H20V15.91L17.96,17.96L14.83,14.83Z",
      previous: "M18,6V18L9.5,12L18,6M6,6V18H8V6H6Z",
      play: "M8,5.14V18.86C8,19.65 8.87,20.13 9.54,19.71L20.31,12.85C20.93,12.45 20.93,11.55 20.31,11.15L9.54,4.29C8.87,3.87 8,4.35 8,5.14Z",
      pause: "M14,19H18V5H14M6,19H10V5H6V19Z",
      next: "M4,6V18L12.5,12L4,6M14,6V18H16V6H14Z",
      repeat: "M17,17H7V14L3,18L7,22V19H19V13H17V17M7,7H17V10L21,6L17,2V5H5V11H7V7Z",
      cast: "M1,18V21H4C4,19.34 2.66,18 1,18M1,14V16C3.76,16 6,18.24 6,21H8C8,17.13 4.87,14 1,14M1,10V12C5.97,12 10,16.03 10,21H12C12,14.92 7.07,10 1,10M21,3H3C1.89,3 1,3.89 1,5V8H3V5H21V19H13V21H21C22.1,21 23,20.1 23,19V5C23,3.89 22.1,3 21,3Z"
    };
    return C`
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${t[s] ?? t.play}></path>
      </svg>
    `;
  }
  render() {
    if (!this.hass || !this._config)
      return c;
    const s = this._getStateObj();
    if (!s)
      return C`
        <ha-card>
          <div class="error">Entity not found: ${this._config.entity}</div>
        </ha-card>
      `;
    const t = s.attributes.media_title || this._config.name || s.attributes.friendly_name || "Nothing playing", e = s.attributes.media_artist || s.state || "Unknown artist", i = s.attributes.entity_picture, o = s.state === "playing", r = !!s.attributes.shuffle, n = String(s.attributes.repeat ?? "off"), l = this._localShuffle !== void 0 ? this._localShuffle : r, a = this._localRepeat !== void 0 ? this._localRepeat : n, d = a === "all" || a === "one", u = Number(s.attributes.volume_level ?? 0.5), h = this._localVolume ?? u, p = this._localMuted || !!s.attributes.is_volume_muted || h === 0, f = Math.round((p ? 0 : h) * 100), m = Number(s.attributes.media_duration ?? 0), dt = Number(s.attributes.media_position ?? 0), W = Math.min(
      this._currentPosition || dt,
      m > 0 ? m : Number.MAX_SAFE_INTEGER
    ), K = m > 0 ? Math.max(0, Math.min(100, W / m * 100)) : 0;
    return C`
      <ha-card>
        <div class="card">
          <div
            class="artwork"
            style=${i ? `background-image: url("${i}")` : ""}
          >
            ${i ? c : C`<div class="artwork-placeholder">♪</div>`}
          </div>

          <div class="progress-row">
            <span>${this._formatTime(W)}</span>

            <div class="progress-track">
              <div
                class="progress-fill"
                style=${`width: ${K}%`}
              ></div>
              <div
                class="progress-thumb"
                style=${`left: ${K}%`}
              ></div>
            </div>

            <span>${this._formatTime(m)}</span>
          </div>

          <div class="meta">
            <div class="title" title=${t}>${t}</div>
            <div class="artist" title=${e}>${e}</div>
          </div>

          <div class="controls-row">
            <div class="volume-control">
              <button
                class="icon-button"
                @click=${this._handleVolumeClick}
                aria-label=${p ? "Activar sonido" : "Control de volumen"}
              >
                ${this._icon(p ? "muted" : "volume")}
              </button>

              ${this._showVolume ? C`
                    <div class="volume-popover">
                      <div class="volume-value">${f}%</div>

                      <input
                        class="volume-slider"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        .value=${String(f)}
                        style=${`--volume-progress: ${f}%`}
                        @input=${this._handleVolumeInput}
                        aria-label="Nivel de volumen"
                      />
                    </div>
                  ` : c}
            </div>

            <button
              class=${`icon-button ${l ? "is-active" : ""}`}
              @click=${() => this._toggleShuffle(l)}
              aria-label="Reproducción aleatoria"
            >
              ${this._icon("shuffle")}
            </button>

            <button
              class="icon-button"
              @click=${() => this._callMedia("media_previous_track")}
              aria-label="Pista anterior"
            >
              ${this._icon("previous")}
            </button>

            <button
              class="play-button"
              @click=${() => this._callMedia(o ? "media_pause" : "media_play")}
              aria-label=${o ? "Pausar" : "Reproducir"}
            >
              ${this._icon(o ? "pause" : "play")}
            </button>

            <button
              class="icon-button"
              @click=${() => this._callMedia("media_next_track")}
              aria-label="Pista siguiente"
            >
              ${this._icon("next")}
            </button>

            <button
              class=${`icon-button ${d ? "is-active" : ""}`}
              @click=${() => this._toggleRepeat(a)}
              aria-label="Repetir"
            >
              ${this._icon("repeat")}
            </button>

            <button
              class="icon-button"
              aria-label="Dispositivo de reproducción"
            >
              ${this._icon("cast")}
            </button>
          </div>
          <div class="footer">
              <span>Created by Barny_II</span>
            
              <a
                href="https://revolut.me/ricardspw1"
                target="_blank"
                rel="noopener noreferrer"
                @click=${(ut) => ut.stopPropagation()}
              >
                Support the project
              </a>
          </div>
        </div>
      </ha-card>
    `;
  }
};
_.styles = ft`
    :host {
      display: block;
    }

    ha-card {
      overflow: visible;
      border-radius: 24px;
      background: #121212;
      color: #fff;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    .artwork {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      border-radius: 18px;
      background: linear-gradient(135deg, #232323, #101010);
      background-position: center;
      background-size: cover;
    }

    .artwork::after {
      position: absolute;
      inset: 0;
      content: '';
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.18),
        rgba(0, 0, 0, 0.02)
      );
    }

    .artwork-placeholder {
      display: grid;
      width: 100%;
      height: 100%;
      place-items: center;
      color: rgba(255, 255, 255, 0.45);
      font-size: 64px;
    }

    .progress-row {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 10px;
      align-items: center;
      color: rgba(255, 255, 255, 0.72);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }

    .progress-track {
      position: relative;
      height: 4px;
      overflow: visible;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
    }

    .progress-fill {
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: inherit;
      background: rgba(255, 255, 255, 0.9);
    }

    .progress-thumb {
      position: absolute;
      top: 50%;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fff;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08);
    }

    .meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .title {
      overflow: hidden;
      font-size: 20px;
      font-weight: 700;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .artist {
      overflow: hidden;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .controls-row {
      display: flex;
      width: 100%;
      min-width: 0;
      gap: 2px;
      align-items: center;
      justify-content: space-between;
      padding-top: 8px;
    }

    .volume-control {
      position: relative;
      display: flex;
      flex: 1 1 0;
      min-width: 0;
      justify-content: center;
    }

    .icon-button,
    .play-button {
      display: grid;
      border: none;
      cursor: pointer;
      place-items: center;
      transition:
        transform 180ms ease,
        color 180ms ease,
        background 180ms ease;
    }

    .icon-button {
      flex: 1 1 0;
      min-width: 30px;
      height: 38px;
      border-radius: 50%;
      background: transparent;
      color: #a7a7a7;
    }

    .icon-button:hover {
      color: #fff;
      transform: scale(1.08);
    }

    .icon-button.is-active {
      color: #1db954;
    }

    .icon-button.is-active:hover {
      color: #1ed760;
    }

    .icon-button:active,
    .play-button:active {
      transform: scale(0.95);
    }

    .play-button {
      flex: 0 0 58px;
      width: 58px;
      height: 58px;
      margin-inline: 2px;
      border-radius: 50%;
      background: #fff;
      color: #111;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
    }

    .play-button:hover {
      transform: scale(1.05);
    }

    .icon-button svg,
    .play-button svg {
      display: block;
      width: 21px;
      height: 21px;
      fill: currentColor;
    }

    .play-button svg {
      width: 28px;
      height: 28px;
    }

    .volume-popover {
      position: absolute;
      z-index: 10;
      bottom: calc(100% + 12px);
      left: 50%;
      display: flex;
      width: 54px;
      height: 182px;
      padding: 10px 8px;
      transform: translateX(-50%);
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      background: rgba(30, 30, 30, 0.98);
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.42);
    }

    .volume-value {
      position: absolute;
      top: 9px;
      color: rgba(255, 255, 255, 0.72);
      font-size: 11px;
      font-variant-numeric: tabular-nums;
    }

    .volume-slider {
      width: 132px;
      height: 22px;
      margin-top: 24px;
      cursor: pointer;
      accent-color: #1db954;
      transform: rotate(-90deg);
    }

    .volume-slider::-webkit-slider-runnable-track {
      height: 4px;
      border-radius: 999px;
      background: linear-gradient(
        to right,
        #1db954 0%,
        #1db954 var(--volume-progress, 50%),
        rgba(255, 255, 255, 0.2) var(--volume-progress, 50%),
        rgba(255, 255, 255, 0.2) 100%
      );
    }

    .volume-slider::-webkit-slider-thumb {
      width: 14px;
      height: 14px;
      margin-top: -5px;
      border: none;
      border-radius: 50%;
      appearance: none;
      background: #fff;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
    }

    .volume-slider::-moz-range-track {
      height: 4px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.2);
    }

    .volume-slider::-moz-range-progress {
      height: 4px;
      border-radius: 999px;
      background: #1db954;
    }

    .volume-slider::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border: none;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding-top: 2px;
      color: rgba(255, 255, 255, 0.42);
      font-size: 10px;
      letter-spacing: 0.01em;
    }
    
    .footer a {
      color: rgba(255, 255, 255, 0.62);
      font-weight: 600;
      text-decoration: none;
      transition: color 180ms ease;
    }
    
    .footer a:hover {
      color: #1db954;
    }
    
    .footer a:focus-visible {
      outline: 2px solid #1db954;
      outline-offset: 3px;
      border-radius: 4px;
    }

    .error {
      padding: 16px;
      color: #fff;
    }

    @media (max-width: 360px) {
      .icon-button {
        min-width: 26px;
        height: 34px;
      }

      .icon-button svg {
        width: 19px;
        height: 19px;
      }

      .play-button {
        flex-basis: 52px;
        width: 52px;
        height: 52px;
      }
    }
  `;
g([
  ct({ attribute: !1 })
], _.prototype, "hass", 2);
g([
  A()
], _.prototype, "_config", 2);
g([
  A()
], _.prototype, "_showVolume", 2);
g([
  A()
], _.prototype, "_localShuffle", 2);
g([
  A()
], _.prototype, "_localRepeat", 2);
g([
  A()
], _.prototype, "_localMuted", 2);
g([
  A()
], _.prototype, "_currentPosition", 2);
g([
  A()
], _.prototype, "_localVolume", 2);
_ = g([
  Ut("spotify-premium-card")
], _);
//# sourceMappingURL=spotify-premium-card.js.map
