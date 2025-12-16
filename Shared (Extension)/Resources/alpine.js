(() => {
  // Shared (Extension)/Resources/alpine.js
  (() => {
    var nt = false, it = false, W = [], ot = -1;
    function Ut(e) {
      Nn(e);
    }
    function Nn(e) {
      W.includes(e) || W.push(e), kn();
    }
    function Wt(e) {
      let t = W.indexOf(e);
      t !== -1 && t > ot && W.splice(t, 1);
    }
    function kn() {
      !it && !nt && (nt = true, queueMicrotask(Dn));
    }
    function Dn() {
      nt = false, it = true;
      for (let e = 0; e < W.length; e++)
        W[e](), ot = e;
      W.length = 0, ot = -1, it = false;
    }
    var T, N, $, at, st = true;
    function Gt(e) {
      st = false, e(), st = true;
    }
    function Jt(e) {
      T = e.reactive, $ = e.release, N = (t) => e.effect(t, { scheduler: (r) => {
        st ? Ut(r) : r();
      } }), at = e.raw;
    }
    function ct(e) {
      N = e;
    }
    function Yt(e) {
      let t = () => {
      };
      return [(n) => {
        let i = N(n);
        return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
          e._x_effects.forEach((o) => o());
        }), e._x_effects.add(i), t = () => {
          i !== void 0 && (e._x_effects.delete(i), $(i));
        }, i;
      }, () => {
        t();
      }];
    }
    function ve(e, t) {
      let r = true, n, i = N(() => {
        let o = e();
        JSON.stringify(o), r ? n = o : queueMicrotask(() => {
          t(o, n), n = o;
        }), r = false;
      });
      return () => $(i);
    }
    var Xt = [], Zt = [], Qt = [];
    function er(e) {
      Qt.push(e);
    }
    function te(e, t) {
      typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Zt.push(t));
    }
    function Ae(e) {
      Xt.push(e);
    }
    function Oe(e, t, r) {
      e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(r);
    }
    function lt(e, t) {
      e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([r, n]) => {
        (t === void 0 || t.includes(r)) && (n.forEach((i) => i()), delete e._x_attributeCleanups[r]);
      });
    }
    function tr(e) {
      for (e._x_effects?.forEach(Wt); e._x_cleanups?.length; )
        e._x_cleanups.pop()();
    }
    var ut = new MutationObserver(mt), ft = false;
    function ue() {
      ut.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true }), ft = true;
    }
    function dt() {
      Pn(), ut.disconnect(), ft = false;
    }
    var le = [];
    function Pn() {
      let e = ut.takeRecords();
      le.push(() => e.length > 0 && mt(e));
      let t = le.length;
      queueMicrotask(() => {
        if (le.length === t)
          for (; le.length > 0; )
            le.shift()();
      });
    }
    function m(e) {
      if (!ft)
        return e();
      dt();
      let t = e();
      return ue(), t;
    }
    var pt = false, Se = [];
    function rr() {
      pt = true;
    }
    function nr() {
      pt = false, mt(Se), Se = [];
    }
    function mt(e) {
      if (pt) {
        Se = Se.concat(e);
        return;
      }
      let t = [], r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
      for (let o = 0; o < e.length; o++)
        if (!e[o].target._x_ignoreMutationObserver && (e[o].type === "childList" && (e[o].removedNodes.forEach((s) => {
          s.nodeType === 1 && s._x_marker && r.add(s);
        }), e[o].addedNodes.forEach((s) => {
          if (s.nodeType === 1) {
            if (r.has(s)) {
              r.delete(s);
              return;
            }
            s._x_marker || t.push(s);
          }
        })), e[o].type === "attributes")) {
          let s = e[o].target, a = e[o].attributeName, c = e[o].oldValue, l = () => {
            n.has(s) || n.set(s, []), n.get(s).push({ name: a, value: s.getAttribute(a) });
          }, u = () => {
            i.has(s) || i.set(s, []), i.get(s).push(a);
          };
          s.hasAttribute(a) && c === null ? l() : s.hasAttribute(a) ? (u(), l()) : u();
        }
      i.forEach((o, s) => {
        lt(s, o);
      }), n.forEach((o, s) => {
        Xt.forEach((a) => a(s, o));
      });
      for (let o of r)
        t.some((s) => s.contains(o)) || Zt.forEach((s) => s(o));
      for (let o of t)
        o.isConnected && Qt.forEach((s) => s(o));
      t = null, r = null, n = null, i = null;
    }
    function Ce(e) {
      return z(B(e));
    }
    function k(e, t, r) {
      return e._x_dataStack = [t, ...B(r || e)], () => {
        e._x_dataStack = e._x_dataStack.filter((n) => n !== t);
      };
    }
    function B(e) {
      return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? B(e.host) : e.parentNode ? B(e.parentNode) : [];
    }
    function z(e) {
      return new Proxy({ objects: e }, In);
    }
    var In = { ownKeys({ objects: e }) {
      return Array.from(new Set(e.flatMap((t) => Object.keys(t))));
    }, has({ objects: e }, t) {
      return t == Symbol.unscopables ? false : e.some((r) => Object.prototype.hasOwnProperty.call(r, t) || Reflect.has(r, t));
    }, get({ objects: e }, t, r) {
      return t == "toJSON" ? Ln : Reflect.get(e.find((n) => Reflect.has(n, t)) || {}, t, r);
    }, set({ objects: e }, t, r, n) {
      let i = e.find((s) => Object.prototype.hasOwnProperty.call(s, t)) || e[e.length - 1], o = Object.getOwnPropertyDescriptor(i, t);
      return o?.set && o?.get ? o.set.call(n, r) || true : Reflect.set(i, t, r);
    } };
    function Ln() {
      return Reflect.ownKeys(this).reduce((t, r) => (t[r] = Reflect.get(this, r), t), {});
    }
    function Te(e) {
      let t = (n) => typeof n == "object" && !Array.isArray(n) && n !== null, r = (n, i = "") => {
        Object.entries(Object.getOwnPropertyDescriptors(n)).forEach(([o, { value: s, enumerable: a }]) => {
          if (a === false || s === void 0 || typeof s == "object" && s !== null && s.__v_skip)
            return;
          let c = i === "" ? o : `${i}.${o}`;
          typeof s == "object" && s !== null && s._x_interceptor ? n[o] = s.initialize(e, c, o) : t(s) && s !== n && !(s instanceof Element) && r(s, c);
        });
      };
      return r(e);
    }
    function Re(e, t = () => {
    }) {
      let r = { initialValue: void 0, _x_interceptor: true, initialize(n, i, o) {
        return e(this.initialValue, () => $n(n, i), (s) => ht(n, i, s), i, o);
      } };
      return t(r), (n) => {
        if (typeof n == "object" && n !== null && n._x_interceptor) {
          let i = r.initialize.bind(r);
          r.initialize = (o, s, a) => {
            let c = n.initialize(o, s, a);
            return r.initialValue = c, i(o, s, a);
          };
        } else
          r.initialValue = n;
        return r;
      };
    }
    function $n(e, t) {
      return t.split(".").reduce((r, n) => r[n], e);
    }
    function ht(e, t, r) {
      if (typeof t == "string" && (t = t.split(".")), t.length === 1)
        e[t[0]] = r;
      else {
        if (t.length === 0)
          throw error;
        return e[t[0]] || (e[t[0]] = {}), ht(e[t[0]], t.slice(1), r);
      }
    }
    var ir = {};
    function y(e, t) {
      ir[e] = t;
    }
    function fe(e, t) {
      let r = jn(t);
      return Object.entries(ir).forEach(([n, i]) => {
        Object.defineProperty(e, `$${n}`, { get() {
          return i(t, r);
        }, enumerable: false });
      }), e;
    }
    function jn(e) {
      let [t, r] = _t(e), n = { interceptor: Re, ...t };
      return te(e, r), n;
    }
    function or(e, t, r, ...n) {
      try {
        return r(...n);
      } catch (i) {
        re(i, e, t);
      }
    }
    function re(...e) {
      return sr(...e);
    }
    var sr = Fn;
    function ar(e) {
      sr = e;
    }
    function Fn(e, t, r = void 0) {
      e = Object.assign(e ?? { message: "No error message given." }, { el: t, expression: r }), console.warn(`Alpine Expression Error: ${e.message}

${r ? 'Expression: "' + r + `"

` : ""}`, t), setTimeout(() => {
        throw e;
      }, 0);
    }
    var Me = true;
    function ke(e) {
      let t = Me;
      Me = false;
      let r = e();
      return Me = t, r;
    }
    function R(e, t, r = {}) {
      let n;
      return x(e, t)((i) => n = i, r), n;
    }
    function x(...e) {
      return cr(...e);
    }
    var cr = xt;
    function lr(e) {
      cr = e;
    }
    function xt(e, t) {
      let r = {};
      fe(r, e);
      let n = [r, ...B(e)], i = typeof t == "function" ? Bn(n, t) : Hn(n, t, e);
      return or.bind(null, e, t, i);
    }
    function Bn(e, t) {
      return (r = () => {
      }, { scope: n = {}, params: i = [], context: o } = {}) => {
        let s = t.apply(z([n, ...e]), i);
        Ne(r, s);
      };
    }
    var gt = {};
    function zn(e, t) {
      if (gt[e])
        return gt[e];
      let r = Object.getPrototypeOf(async function() {
      }).constructor, n = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e, o = (() => {
        try {
          let s = new r(["__self", "scope"], `with (scope) { __self.result = ${n} }; __self.finished = true; return __self.result;`);
          return Object.defineProperty(s, "name", { value: `[Alpine] ${e}` }), s;
        } catch (s) {
          return re(s, t, e), Promise.resolve();
        }
      })();
      return gt[e] = o, o;
    }
    function Hn(e, t, r) {
      let n = zn(t, r);
      return (i = () => {
      }, { scope: o = {}, params: s = [], context: a } = {}) => {
        n.result = void 0, n.finished = false;
        let c = z([o, ...e]);
        if (typeof n == "function") {
          let l = n.call(a, n, c).catch((u) => re(u, r, t));
          n.finished ? (Ne(i, n.result, c, s, r), n.result = void 0) : l.then((u) => {
            Ne(i, u, c, s, r);
          }).catch((u) => re(u, r, t)).finally(() => n.result = void 0);
        }
      };
    }
    function Ne(e, t, r, n, i) {
      if (Me && typeof t == "function") {
        let o = t.apply(r, n);
        o instanceof Promise ? o.then((s) => Ne(e, s, r, n)).catch((s) => re(s, i, t)) : e(o);
      } else
        typeof t == "object" && t instanceof Promise ? t.then((o) => e(o)) : e(t);
    }
    var wt = "x-";
    function C(e = "") {
      return wt + e;
    }
    function ur(e) {
      wt = e;
    }
    var De = {};
    function d(e, t) {
      return De[e] = t, { before(r) {
        if (!De[r]) {
          console.warn(String.raw`Cannot find directive \`${r}\`. \`${e}\` will use the default order of execution`);
          return;
        }
        let n = G.indexOf(r);
        G.splice(n >= 0 ? n : G.indexOf("DEFAULT"), 0, e);
      } };
    }
    function fr(e) {
      return Object.keys(De).includes(e);
    }
    function pe(e, t, r) {
      if (t = Array.from(t), e._x_virtualDirectives) {
        let o = Object.entries(e._x_virtualDirectives).map(([a, c]) => ({ name: a, value: c })), s = Et(o);
        o = o.map((a) => s.find((c) => c.name === a.name) ? { name: `x-bind:${a.name}`, value: `"${a.value}"` } : a), t = t.concat(o);
      }
      let n = {};
      return t.map(mr((o, s) => n[o] = s)).filter(_r).map(Vn(n, r)).sort(qn).map((o) => Kn(e, o));
    }
    function Et(e) {
      return Array.from(e).map(mr()).filter((t) => !_r(t));
    }
    var yt = false, de = /* @__PURE__ */ new Map(), dr = Symbol();
    function pr(e) {
      yt = true;
      let t = Symbol();
      dr = t, de.set(t, []);
      let r = () => {
        for (; de.get(t).length; )
          de.get(t).shift()();
        de.delete(t);
      }, n = () => {
        yt = false, r();
      };
      e(r), n();
    }
    function _t(e) {
      let t = [], r = (a) => t.push(a), [n, i] = Yt(e);
      return t.push(i), [{ Alpine: H, effect: n, cleanup: r, evaluateLater: x.bind(x, e), evaluate: R.bind(R, e) }, () => t.forEach((a) => a())];
    }
    function Kn(e, t) {
      let r = () => {
      }, n = De[t.type] || r, [i, o] = _t(e);
      Oe(e, t.original, o);
      let s = () => {
        e._x_ignore || e._x_ignoreSelf || (n.inline && n.inline(e, t, i), n = n.bind(n, e, t, i), yt ? de.get(dr).push(n) : n());
      };
      return s.runCleanups = o, s;
    }
    var Pe = (e, t) => ({ name: r, value: n }) => (r.startsWith(e) && (r = r.replace(e, t)), { name: r, value: n }), Ie = (e) => e;
    function mr(e = () => {
    }) {
      return ({ name: t, value: r }) => {
        let { name: n, value: i } = hr.reduce((o, s) => s(o), { name: t, value: r });
        return n !== t && e(n, t), { name: n, value: i };
      };
    }
    var hr = [];
    function ne(e) {
      hr.push(e);
    }
    function _r({ name: e }) {
      return gr().test(e);
    }
    var gr = () => new RegExp(`^${wt}([^:^.]+)\\b`);
    function Vn(e, t) {
      return ({ name: r, value: n }) => {
        let i = r.match(gr()), o = r.match(/:([a-zA-Z0-9\-_:]+)/), s = r.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[r] || r;
        return { type: i ? i[1] : null, value: o ? o[1] : null, modifiers: s.map((c) => c.replace(".", "")), expression: n, original: a };
      };
    }
    var bt = "DEFAULT", G = ["ignore", "ref", "data", "id", "anchor", "bind", "init", "for", "model", "modelable", "transition", "show", "if", bt, "teleport"];
    function qn(e, t) {
      let r = G.indexOf(e.type) === -1 ? bt : e.type, n = G.indexOf(t.type) === -1 ? bt : t.type;
      return G.indexOf(r) - G.indexOf(n);
    }
    function J(e, t, r = {}) {
      e.dispatchEvent(new CustomEvent(t, { detail: r, bubbles: true, composed: true, cancelable: true }));
    }
    function D(e, t) {
      if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
        Array.from(e.children).forEach((i) => D(i, t));
        return;
      }
      let r = false;
      if (t(e, () => r = true), r)
        return;
      let n = e.firstElementChild;
      for (; n; )
        D(n, t, false), n = n.nextElementSibling;
    }
    function E(e, ...t) {
      console.warn(`Alpine Warning: ${e}`, ...t);
    }
    var xr = false;
    function yr() {
      xr && E("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), xr = true, document.body || E("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), J(document, "alpine:init"), J(document, "alpine:initializing"), ue(), er((t) => S(t, D)), te((t) => P(t)), Ae((t, r) => {
        pe(t, r).forEach((n) => n());
      });
      let e = (t) => !Y(t.parentElement, true);
      Array.from(document.querySelectorAll(Er().join(","))).filter(e).forEach((t) => {
        S(t);
      }), J(document, "alpine:initialized"), setTimeout(() => {
        Wn();
      });
    }
    var vt = [], br = [];
    function wr() {
      return vt.map((e) => e());
    }
    function Er() {
      return vt.concat(br).map((e) => e());
    }
    function Le(e) {
      vt.push(e);
    }
    function $e(e) {
      br.push(e);
    }
    function Y(e, t = false) {
      return j(e, (r) => {
        if ((t ? Er() : wr()).some((i) => r.matches(i)))
          return true;
      });
    }
    function j(e, t) {
      if (e) {
        if (t(e))
          return e;
        if (e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)
          return j(e.parentElement, t);
      }
    }
    function vr(e) {
      return wr().some((t) => e.matches(t));
    }
    var Sr = [];
    function Ar(e) {
      Sr.push(e);
    }
    var Un = 1;
    function S(e, t = D, r = () => {
    }) {
      j(e, (n) => n._x_ignore) || pr(() => {
        t(e, (n, i) => {
          n._x_marker || (r(n, i), Sr.forEach((o) => o(n, i)), pe(n, n.attributes).forEach((o) => o()), n._x_ignore || (n._x_marker = Un++), n._x_ignore && i());
        });
      });
    }
    function P(e, t = D) {
      t(e, (r) => {
        tr(r), lt(r), delete r._x_marker;
      });
    }
    function Wn() {
      [["ui", "dialog", ["[x-dialog], [x-popover]"]], ["anchor", "anchor", ["[x-anchor]"]], ["sort", "sort", ["[x-sort]"]]].forEach(([t, r, n]) => {
        fr(r) || n.some((i) => {
          if (document.querySelector(i))
            return E(`found "${i}", but missing ${t} plugin`), true;
        });
      });
    }
    var St = [], At = false;
    function ie(e = () => {
    }) {
      return queueMicrotask(() => {
        At || setTimeout(() => {
          je();
        });
      }), new Promise((t) => {
        St.push(() => {
          e(), t();
        });
      });
    }
    function je() {
      for (At = false; St.length; )
        St.shift()();
    }
    function Or() {
      At = true;
    }
    function me(e, t) {
      return Array.isArray(t) ? Cr(e, t.join(" ")) : typeof t == "object" && t !== null ? Gn(e, t) : typeof t == "function" ? me(e, t()) : Cr(e, t);
    }
    function Cr(e, t) {
      let r = (o) => o.split(" ").filter(Boolean), n = (o) => o.split(" ").filter((s) => !e.classList.contains(s)).filter(Boolean), i = (o) => (e.classList.add(...o), () => {
        e.classList.remove(...o);
      });
      return t = t === true ? t = "" : t || "", i(n(t));
    }
    function Gn(e, t) {
      let r = (a) => a.split(" ").filter(Boolean), n = Object.entries(t).flatMap(([a, c]) => c ? r(a) : false).filter(Boolean), i = Object.entries(t).flatMap(([a, c]) => c ? false : r(a)).filter(Boolean), o = [], s = [];
      return i.forEach((a) => {
        e.classList.contains(a) && (e.classList.remove(a), s.push(a));
      }), n.forEach((a) => {
        e.classList.contains(a) || (e.classList.add(a), o.push(a));
      }), () => {
        s.forEach((a) => e.classList.add(a)), o.forEach((a) => e.classList.remove(a));
      };
    }
    function X(e, t) {
      return typeof t == "object" && t !== null ? Jn(e, t) : Yn(e, t);
    }
    function Jn(e, t) {
      let r = {};
      return Object.entries(t).forEach(([n, i]) => {
        r[n] = e.style[n], n.startsWith("--") || (n = Xn(n)), e.style.setProperty(n, i);
      }), setTimeout(() => {
        e.style.length === 0 && e.removeAttribute("style");
      }), () => {
        X(e, r);
      };
    }
    function Yn(e, t) {
      let r = e.getAttribute("style", t);
      return e.setAttribute("style", t), () => {
        e.setAttribute("style", r || "");
      };
    }
    function Xn(e) {
      return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    }
    function he(e, t = () => {
    }) {
      let r = false;
      return function() {
        r ? t.apply(this, arguments) : (r = true, e.apply(this, arguments));
      };
    }
    d("transition", (e, { value: t, modifiers: r, expression: n }, { evaluate: i }) => {
      typeof n == "function" && (n = i(n)), n !== false && (!n || typeof n == "boolean" ? Qn(e, r, t) : Zn(e, n, t));
    });
    function Zn(e, t, r) {
      Tr(e, me, ""), { enter: (i) => {
        e._x_transition.enter.during = i;
      }, "enter-start": (i) => {
        e._x_transition.enter.start = i;
      }, "enter-end": (i) => {
        e._x_transition.enter.end = i;
      }, leave: (i) => {
        e._x_transition.leave.during = i;
      }, "leave-start": (i) => {
        e._x_transition.leave.start = i;
      }, "leave-end": (i) => {
        e._x_transition.leave.end = i;
      } }[r](t);
    }
    function Qn(e, t, r) {
      Tr(e, X);
      let n = !t.includes("in") && !t.includes("out") && !r, i = n || t.includes("in") || ["enter"].includes(r), o = n || t.includes("out") || ["leave"].includes(r);
      t.includes("in") && !n && (t = t.filter((g, b) => b < t.indexOf("out"))), t.includes("out") && !n && (t = t.filter((g, b) => b > t.indexOf("out")));
      let s = !t.includes("opacity") && !t.includes("scale"), a = s || t.includes("opacity"), c = s || t.includes("scale"), l = a ? 0 : 1, u = c ? _e(t, "scale", 95) / 100 : 1, p = _e(t, "delay", 0) / 1e3, h = _e(t, "origin", "center"), w = "opacity, transform", F = _e(t, "duration", 150) / 1e3, Ee = _e(t, "duration", 75) / 1e3, f = "cubic-bezier(0.4, 0.0, 0.2, 1)";
      i && (e._x_transition.enter.during = { transformOrigin: h, transitionDelay: `${p}s`, transitionProperty: w, transitionDuration: `${F}s`, transitionTimingFunction: f }, e._x_transition.enter.start = { opacity: l, transform: `scale(${u})` }, e._x_transition.enter.end = { opacity: 1, transform: "scale(1)" }), o && (e._x_transition.leave.during = { transformOrigin: h, transitionDelay: `${p}s`, transitionProperty: w, transitionDuration: `${Ee}s`, transitionTimingFunction: f }, e._x_transition.leave.start = { opacity: 1, transform: "scale(1)" }, e._x_transition.leave.end = { opacity: l, transform: `scale(${u})` });
    }
    function Tr(e, t, r = {}) {
      e._x_transition || (e._x_transition = { enter: { during: r, start: r, end: r }, leave: { during: r, start: r, end: r }, in(n = () => {
      }, i = () => {
      }) {
        Fe(e, t, { during: this.enter.during, start: this.enter.start, end: this.enter.end }, n, i);
      }, out(n = () => {
      }, i = () => {
      }) {
        Fe(e, t, { during: this.leave.during, start: this.leave.start, end: this.leave.end }, n, i);
      } });
    }
    window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, r, n) {
      let i = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout, o = () => i(r);
      if (t) {
        e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(r) : o() : e._x_transition ? e._x_transition.in(r) : o();
        return;
      }
      e._x_hidePromise = e._x_transition ? new Promise((s, a) => {
        e._x_transition.out(() => {
        }, () => s(n)), e._x_transitioning && e._x_transitioning.beforeCancel(() => a({ isFromCancelledTransition: true }));
      }) : Promise.resolve(n), queueMicrotask(() => {
        let s = Rr(e);
        s ? (s._x_hideChildren || (s._x_hideChildren = []), s._x_hideChildren.push(e)) : i(() => {
          let a = (c) => {
            let l = Promise.all([c._x_hidePromise, ...(c._x_hideChildren || []).map(a)]).then(([u]) => u?.());
            return delete c._x_hidePromise, delete c._x_hideChildren, l;
          };
          a(e).catch((c) => {
            if (!c.isFromCancelledTransition)
              throw c;
          });
        });
      });
    };
    function Rr(e) {
      let t = e.parentNode;
      if (t)
        return t._x_hidePromise ? t : Rr(t);
    }
    function Fe(e, t, { during: r, start: n, end: i } = {}, o = () => {
    }, s = () => {
    }) {
      if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(r).length === 0 && Object.keys(n).length === 0 && Object.keys(i).length === 0) {
        o(), s();
        return;
      }
      let a, c, l;
      ei(e, { start() {
        a = t(e, n);
      }, during() {
        c = t(e, r);
      }, before: o, end() {
        a(), l = t(e, i);
      }, after: s, cleanup() {
        c(), l();
      } });
    }
    function ei(e, t) {
      let r, n, i, o = he(() => {
        m(() => {
          r = true, n || t.before(), i || (t.end(), je()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
        });
      });
      e._x_transitioning = { beforeCancels: [], beforeCancel(s) {
        this.beforeCancels.push(s);
      }, cancel: he(function() {
        for (; this.beforeCancels.length; )
          this.beforeCancels.shift()();
        o();
      }), finish: o }, m(() => {
        t.start(), t.during();
      }), Or(), requestAnimationFrame(() => {
        if (r)
          return;
        let s = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
        s === 0 && (s = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), m(() => {
          t.before();
        }), n = true, requestAnimationFrame(() => {
          r || (m(() => {
            t.end();
          }), je(), setTimeout(e._x_transitioning.finish, s + a), i = true);
        });
      });
    }
    function _e(e, t, r) {
      if (e.indexOf(t) === -1)
        return r;
      let n = e[e.indexOf(t) + 1];
      if (!n || t === "scale" && isNaN(n))
        return r;
      if (t === "duration" || t === "delay") {
        let i = n.match(/([0-9]+)ms/);
        if (i)
          return i[1];
      }
      return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [n, e[e.indexOf(t) + 2]].join(" ") : n;
    }
    var I = false;
    function A(e, t = () => {
    }) {
      return (...r) => I ? t(...r) : e(...r);
    }
    function Mr(e) {
      return (...t) => I && e(...t);
    }
    var Nr = [];
    function K(e) {
      Nr.push(e);
    }
    function kr(e, t) {
      Nr.forEach((r) => r(e, t)), I = true, Pr(() => {
        S(t, (r, n) => {
          n(r, () => {
          });
        });
      }), I = false;
    }
    var Be = false;
    function Dr(e, t) {
      t._x_dataStack || (t._x_dataStack = e._x_dataStack), I = true, Be = true, Pr(() => {
        ti(t);
      }), I = false, Be = false;
    }
    function ti(e) {
      let t = false;
      S(e, (n, i) => {
        D(n, (o, s) => {
          if (t && vr(o))
            return s();
          t = true, i(o, s);
        });
      });
    }
    function Pr(e) {
      let t = N;
      ct((r, n) => {
        let i = t(r);
        return $(i), () => {
        };
      }), e(), ct(t);
    }
    function ge(e, t, r, n = []) {
      switch (e._x_bindings || (e._x_bindings = T({})), e._x_bindings[t] = r, t = n.includes("camel") ? li(t) : t, t) {
        case "value":
          ri(e, r);
          break;
        case "style":
          ii(e, r);
          break;
        case "class":
          ni(e, r);
          break;
        case "selected":
        case "checked":
          oi(e, t, r);
          break;
        default:
          Lr(e, t, r);
          break;
      }
    }
    function ri(e, t) {
      if (Ot(e))
        e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = xe(e.value) === t : e.checked = Ir(e.value, t));
      else if (ze(e))
        Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((r) => Ir(r, e.value)) : e.checked = !!t;
      else if (e.tagName === "SELECT")
        ci(e, t);
      else {
        if (e.value === t)
          return;
        e.value = t === void 0 ? "" : t;
      }
    }
    function ni(e, t) {
      e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = me(e, t);
    }
    function ii(e, t) {
      e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = X(e, t);
    }
    function oi(e, t, r) {
      Lr(e, t, r), ai(e, t, r);
    }
    function Lr(e, t, r) {
      [null, void 0, false].includes(r) && fi(t) ? e.removeAttribute(t) : ($r(t) && (r = t), si(e, t, r));
    }
    function si(e, t, r) {
      e.getAttribute(t) != r && e.setAttribute(t, r);
    }
    function ai(e, t, r) {
      e[t] !== r && (e[t] = r);
    }
    function ci(e, t) {
      let r = [].concat(t).map((n) => n + "");
      Array.from(e.options).forEach((n) => {
        n.selected = r.includes(n.value);
      });
    }
    function li(e) {
      return e.toLowerCase().replace(/-(\w)/g, (t, r) => r.toUpperCase());
    }
    function Ir(e, t) {
      return e == t;
    }
    function xe(e) {
      return [1, "1", "true", "on", "yes", true].includes(e) ? true : [0, "0", "false", "off", "no", false].includes(e) ? false : e ? Boolean(e) : null;
    }
    var ui = /* @__PURE__ */ new Set(["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "defer", "disabled", "formnovalidate", "inert", "ismap", "itemscope", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "selected", "shadowrootclonable", "shadowrootdelegatesfocus", "shadowrootserializable"]);
    function $r(e) {
      return ui.has(e);
    }
    function fi(e) {
      return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
    }
    function jr(e, t, r) {
      return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : Br(e, t, r);
    }
    function Fr(e, t, r, n = true) {
      if (e._x_bindings && e._x_bindings[t] !== void 0)
        return e._x_bindings[t];
      if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
        let i = e._x_inlineBindings[t];
        return i.extract = n, ke(() => R(e, i.expression));
      }
      return Br(e, t, r);
    }
    function Br(e, t, r) {
      let n = e.getAttribute(t);
      return n === null ? typeof r == "function" ? r() : r : n === "" ? true : $r(t) ? !![t, "true"].includes(n) : n;
    }
    function ze(e) {
      return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
    }
    function Ot(e) {
      return e.type === "radio" || e.localName === "ui-radio";
    }
    function He(e, t) {
      let r;
      return function() {
        let n = this, i = arguments, o = function() {
          r = null, e.apply(n, i);
        };
        clearTimeout(r), r = setTimeout(o, t);
      };
    }
    function Ke(e, t) {
      let r;
      return function() {
        let n = this, i = arguments;
        r || (e.apply(n, i), r = true, setTimeout(() => r = false, t));
      };
    }
    function Ve({ get: e, set: t }, { get: r, set: n }) {
      let i = true, o, s, a = N(() => {
        let c = e(), l = r();
        if (i)
          n(Ct(c)), i = false;
        else {
          let u = JSON.stringify(c), p = JSON.stringify(l);
          u !== o ? n(Ct(c)) : u !== p && t(Ct(l));
        }
        o = JSON.stringify(e()), s = JSON.stringify(r());
      });
      return () => {
        $(a);
      };
    }
    function Ct(e) {
      return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
    }
    function zr(e) {
      (Array.isArray(e) ? e : [e]).forEach((r) => r(H));
    }
    var Z = {}, Hr = false;
    function Kr(e, t) {
      if (Hr || (Z = T(Z), Hr = true), t === void 0)
        return Z[e];
      Z[e] = t, Te(Z[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && Z[e].init();
    }
    function Vr() {
      return Z;
    }
    var qr = {};
    function Ur(e, t) {
      let r = typeof t != "function" ? () => t : t;
      return e instanceof Element ? Tt(e, r()) : (qr[e] = r, () => {
      });
    }
    function Wr(e) {
      return Object.entries(qr).forEach(([t, r]) => {
        Object.defineProperty(e, t, { get() {
          return (...n) => r(...n);
        } });
      }), e;
    }
    function Tt(e, t, r) {
      let n = [];
      for (; n.length; )
        n.pop()();
      let i = Object.entries(t).map(([s, a]) => ({ name: s, value: a })), o = Et(i);
      return i = i.map((s) => o.find((a) => a.name === s.name) ? { name: `x-bind:${s.name}`, value: `"${s.value}"` } : s), pe(e, i, r).map((s) => {
        n.push(s.runCleanups), s();
      }), () => {
        for (; n.length; )
          n.pop()();
      };
    }
    var Gr = {};
    function Jr(e, t) {
      Gr[e] = t;
    }
    function Yr(e, t) {
      return Object.entries(Gr).forEach(([r, n]) => {
        Object.defineProperty(e, r, { get() {
          return (...i) => n.bind(t)(...i);
        }, enumerable: false });
      }), e;
    }
    var di = { get reactive() {
      return T;
    }, get release() {
      return $;
    }, get effect() {
      return N;
    }, get raw() {
      return at;
    }, version: "3.15.2", flushAndStopDeferringMutations: nr, dontAutoEvaluateFunctions: ke, disableEffectScheduling: Gt, startObservingMutations: ue, stopObservingMutations: dt, setReactivityEngine: Jt, onAttributeRemoved: Oe, onAttributesAdded: Ae, closestDataStack: B, skipDuringClone: A, onlyDuringClone: Mr, addRootSelector: Le, addInitSelector: $e, setErrorHandler: ar, interceptClone: K, addScopeToNode: k, deferMutations: rr, mapAttributes: ne, evaluateLater: x, interceptInit: Ar, setEvaluator: lr, mergeProxies: z, extractProp: Fr, findClosest: j, onElRemoved: te, closestRoot: Y, destroyTree: P, interceptor: Re, transition: Fe, setStyles: X, mutateDom: m, directive: d, entangle: Ve, throttle: Ke, debounce: He, evaluate: R, initTree: S, nextTick: ie, prefixed: C, prefix: ur, plugin: zr, magic: y, store: Kr, start: yr, clone: Dr, cloneNode: kr, bound: jr, $data: Ce, watch: ve, walk: D, data: Jr, bind: Ur }, H = di;
    function Rt(e, t) {
      let r = /* @__PURE__ */ Object.create(null), n = e.split(",");
      for (let i = 0; i < n.length; i++)
        r[n[i]] = true;
      return t ? (i) => !!r[i.toLowerCase()] : (i) => !!r[i];
    }
    var pi = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly";
    var Bs = Rt(pi + ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected");
    var Xr = Object.freeze({}), zs = Object.freeze([]);
    var mi = Object.prototype.hasOwnProperty, ye = (e, t) => mi.call(e, t), V = Array.isArray, oe = (e) => Zr(e) === "[object Map]";
    var hi = (e) => typeof e == "string", qe = (e) => typeof e == "symbol", be = (e) => e !== null && typeof e == "object";
    var _i = Object.prototype.toString, Zr = (e) => _i.call(e), Mt = (e) => Zr(e).slice(8, -1);
    var Ue = (e) => hi(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e;
    var We = (e) => {
      let t = /* @__PURE__ */ Object.create(null);
      return (r) => t[r] || (t[r] = e(r));
    }, gi = /-(\w)/g, Hs = We((e) => e.replace(gi, (t, r) => r ? r.toUpperCase() : "")), xi = /\B([A-Z])/g, Ks = We((e) => e.replace(xi, "-$1").toLowerCase()), Nt = We((e) => e.charAt(0).toUpperCase() + e.slice(1)), Vs = We((e) => e ? `on${Nt(e)}` : ""), kt = (e, t) => e !== t && (e === e || t === t);
    var Dt = /* @__PURE__ */ new WeakMap(), we = [], L, Q = Symbol("iterate"), Pt = Symbol("Map key iterate");
    function yi(e) {
      return e && e._isEffect === true;
    }
    function on(e, t = Xr) {
      yi(e) && (e = e.raw);
      let r = wi(e, t);
      return t.lazy || r(), r;
    }
    function sn(e) {
      e.active && (an(e), e.options.onStop && e.options.onStop(), e.active = false);
    }
    var bi = 0;
    function wi(e, t) {
      let r = function() {
        if (!r.active)
          return e();
        if (!we.includes(r)) {
          an(r);
          try {
            return vi(), we.push(r), L = r, e();
          } finally {
            we.pop(), cn(), L = we[we.length - 1];
          }
        }
      };
      return r.id = bi++, r.allowRecurse = !!t.allowRecurse, r._isEffect = true, r.active = true, r.raw = e, r.deps = [], r.options = t, r;
    }
    function an(e) {
      let { deps: t } = e;
      if (t.length) {
        for (let r = 0; r < t.length; r++)
          t[r].delete(e);
        t.length = 0;
      }
    }
    var se = true, Lt = [];
    function Ei() {
      Lt.push(se), se = false;
    }
    function vi() {
      Lt.push(se), se = true;
    }
    function cn() {
      let e = Lt.pop();
      se = e === void 0 ? true : e;
    }
    function M(e, t, r) {
      if (!se || L === void 0)
        return;
      let n = Dt.get(e);
      n || Dt.set(e, n = /* @__PURE__ */ new Map());
      let i = n.get(r);
      i || n.set(r, i = /* @__PURE__ */ new Set()), i.has(L) || (i.add(L), L.deps.push(i), L.options.onTrack && L.options.onTrack({ effect: L, target: e, type: t, key: r }));
    }
    function U(e, t, r, n, i, o) {
      let s = Dt.get(e);
      if (!s)
        return;
      let a = /* @__PURE__ */ new Set(), c = (u) => {
        u && u.forEach((p) => {
          (p !== L || p.allowRecurse) && a.add(p);
        });
      };
      if (t === "clear")
        s.forEach(c);
      else if (r === "length" && V(e))
        s.forEach((u, p) => {
          (p === "length" || p >= n) && c(u);
        });
      else
        switch (r !== void 0 && c(s.get(r)), t) {
          case "add":
            V(e) ? Ue(r) && c(s.get("length")) : (c(s.get(Q)), oe(e) && c(s.get(Pt)));
            break;
          case "delete":
            V(e) || (c(s.get(Q)), oe(e) && c(s.get(Pt)));
            break;
          case "set":
            oe(e) && c(s.get(Q));
            break;
        }
      let l = (u) => {
        u.options.onTrigger && u.options.onTrigger({ effect: u, target: e, key: r, type: t, newValue: n, oldValue: i, oldTarget: o }), u.options.scheduler ? u.options.scheduler(u) : u();
      };
      a.forEach(l);
    }
    var Si = Rt("__proto__,__v_isRef,__isVue"), ln = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(qe)), Ai = un();
    var Oi = un(true);
    var Qr = Ci();
    function Ci() {
      let e = {};
      return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
        e[t] = function(...r) {
          let n = _(this);
          for (let o = 0, s = this.length; o < s; o++)
            M(n, "get", o + "");
          let i = n[t](...r);
          return i === -1 || i === false ? n[t](...r.map(_)) : i;
        };
      }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
        e[t] = function(...r) {
          Ei();
          let n = _(this)[t].apply(this, r);
          return cn(), n;
        };
      }), e;
    }
    function un(e = false, t = false) {
      return function(n, i, o) {
        if (i === "__v_isReactive")
          return !e;
        if (i === "__v_isReadonly")
          return e;
        if (i === "__v_raw" && o === (e ? t ? Ki : mn : t ? Hi : pn).get(n))
          return n;
        let s = V(n);
        if (!e && s && ye(Qr, i))
          return Reflect.get(Qr, i, o);
        let a = Reflect.get(n, i, o);
        return (qe(i) ? ln.has(i) : Si(i)) || (e || M(n, "get", i), t) ? a : It(a) ? !s || !Ue(i) ? a.value : a : be(a) ? e ? hn(a) : et(a) : a;
      };
    }
    var Ti = Ri();
    function Ri(e = false) {
      return function(r, n, i, o) {
        let s = r[n];
        if (!e && (i = _(i), s = _(s), !V(r) && It(s) && !It(i)))
          return s.value = i, true;
        let a = V(r) && Ue(n) ? Number(n) < r.length : ye(r, n), c = Reflect.set(r, n, i, o);
        return r === _(o) && (a ? kt(i, s) && U(r, "set", n, i, s) : U(r, "add", n, i)), c;
      };
    }
    function Mi(e, t) {
      let r = ye(e, t), n = e[t], i = Reflect.deleteProperty(e, t);
      return i && r && U(e, "delete", t, void 0, n), i;
    }
    function Ni(e, t) {
      let r = Reflect.has(e, t);
      return (!qe(t) || !ln.has(t)) && M(e, "has", t), r;
    }
    function ki(e) {
      return M(e, "iterate", V(e) ? "length" : Q), Reflect.ownKeys(e);
    }
    var Di = { get: Ai, set: Ti, deleteProperty: Mi, has: Ni, ownKeys: ki }, Pi = { get: Oi, set(e, t) {
      return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), true;
    }, deleteProperty(e, t) {
      return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), true;
    } };
    var $t = (e) => be(e) ? et(e) : e, jt = (e) => be(e) ? hn(e) : e, Ft = (e) => e, Qe = (e) => Reflect.getPrototypeOf(e);
    function Ge(e, t, r = false, n = false) {
      e = e.__v_raw;
      let i = _(e), o = _(t);
      t !== o && !r && M(i, "get", t), !r && M(i, "get", o);
      let { has: s } = Qe(i), a = n ? Ft : r ? jt : $t;
      if (s.call(i, t))
        return a(e.get(t));
      if (s.call(i, o))
        return a(e.get(o));
      e !== i && e.get(t);
    }
    function Je(e, t = false) {
      let r = this.__v_raw, n = _(r), i = _(e);
      return e !== i && !t && M(n, "has", e), !t && M(n, "has", i), e === i ? r.has(e) : r.has(e) || r.has(i);
    }
    function Ye(e, t = false) {
      return e = e.__v_raw, !t && M(_(e), "iterate", Q), Reflect.get(e, "size", e);
    }
    function en(e) {
      e = _(e);
      let t = _(this);
      return Qe(t).has.call(t, e) || (t.add(e), U(t, "add", e, e)), this;
    }
    function tn(e, t) {
      t = _(t);
      let r = _(this), { has: n, get: i } = Qe(r), o = n.call(r, e);
      o ? dn(r, n, e) : (e = _(e), o = n.call(r, e));
      let s = i.call(r, e);
      return r.set(e, t), o ? kt(t, s) && U(r, "set", e, t, s) : U(r, "add", e, t), this;
    }
    function rn(e) {
      let t = _(this), { has: r, get: n } = Qe(t), i = r.call(t, e);
      i ? dn(t, r, e) : (e = _(e), i = r.call(t, e));
      let o = n ? n.call(t, e) : void 0, s = t.delete(e);
      return i && U(t, "delete", e, void 0, o), s;
    }
    function nn() {
      let e = _(this), t = e.size !== 0, r = oe(e) ? new Map(e) : new Set(e), n = e.clear();
      return t && U(e, "clear", void 0, void 0, r), n;
    }
    function Xe(e, t) {
      return function(n, i) {
        let o = this, s = o.__v_raw, a = _(s), c = t ? Ft : e ? jt : $t;
        return !e && M(a, "iterate", Q), s.forEach((l, u) => n.call(i, c(l), c(u), o));
      };
    }
    function Ze(e, t, r) {
      return function(...n) {
        let i = this.__v_raw, o = _(i), s = oe(o), a = e === "entries" || e === Symbol.iterator && s, c = e === "keys" && s, l = i[e](...n), u = r ? Ft : t ? jt : $t;
        return !t && M(o, "iterate", c ? Pt : Q), { next() {
          let { value: p, done: h } = l.next();
          return h ? { value: p, done: h } : { value: a ? [u(p[0]), u(p[1])] : u(p), done: h };
        }, [Symbol.iterator]() {
          return this;
        } };
      };
    }
    function q(e) {
      return function(...t) {
        {
          let r = t[0] ? `on key "${t[0]}" ` : "";
          console.warn(`${Nt(e)} operation ${r}failed: target is readonly.`, _(this));
        }
        return e === "delete" ? false : this;
      };
    }
    function Ii() {
      let e = { get(o) {
        return Ge(this, o);
      }, get size() {
        return Ye(this);
      }, has: Je, add: en, set: tn, delete: rn, clear: nn, forEach: Xe(false, false) }, t = { get(o) {
        return Ge(this, o, false, true);
      }, get size() {
        return Ye(this);
      }, has: Je, add: en, set: tn, delete: rn, clear: nn, forEach: Xe(false, true) }, r = { get(o) {
        return Ge(this, o, true);
      }, get size() {
        return Ye(this, true);
      }, has(o) {
        return Je.call(this, o, true);
      }, add: q("add"), set: q("set"), delete: q("delete"), clear: q("clear"), forEach: Xe(true, false) }, n = { get(o) {
        return Ge(this, o, true, true);
      }, get size() {
        return Ye(this, true);
      }, has(o) {
        return Je.call(this, o, true);
      }, add: q("add"), set: q("set"), delete: q("delete"), clear: q("clear"), forEach: Xe(true, true) };
      return ["keys", "values", "entries", Symbol.iterator].forEach((o) => {
        e[o] = Ze(o, false, false), r[o] = Ze(o, true, false), t[o] = Ze(o, false, true), n[o] = Ze(o, true, true);
      }), [e, r, t, n];
    }
    var [Li, $i, ji, Fi] = Ii();
    function fn(e, t) {
      let r = t ? e ? Fi : ji : e ? $i : Li;
      return (n, i, o) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? n : Reflect.get(ye(r, i) && i in n ? r : n, i, o);
    }
    var Bi = { get: fn(false, false) };
    var zi = { get: fn(true, false) };
    function dn(e, t, r) {
      let n = _(r);
      if (n !== r && t.call(e, n)) {
        let i = Mt(e);
        console.warn(`Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
      }
    }
    var pn = /* @__PURE__ */ new WeakMap(), Hi = /* @__PURE__ */ new WeakMap(), mn = /* @__PURE__ */ new WeakMap(), Ki = /* @__PURE__ */ new WeakMap();
    function Vi(e) {
      switch (e) {
        case "Object":
        case "Array":
          return 1;
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet":
          return 2;
        default:
          return 0;
      }
    }
    function qi(e) {
      return e.__v_skip || !Object.isExtensible(e) ? 0 : Vi(Mt(e));
    }
    function et(e) {
      return e && e.__v_isReadonly ? e : _n(e, false, Di, Bi, pn);
    }
    function hn(e) {
      return _n(e, true, Pi, zi, mn);
    }
    function _n(e, t, r, n, i) {
      if (!be(e))
        return console.warn(`value cannot be made reactive: ${String(e)}`), e;
      if (e.__v_raw && !(t && e.__v_isReactive))
        return e;
      let o = i.get(e);
      if (o)
        return o;
      let s = qi(e);
      if (s === 0)
        return e;
      let a = new Proxy(e, s === 2 ? n : r);
      return i.set(e, a), a;
    }
    function _(e) {
      return e && _(e.__v_raw) || e;
    }
    function It(e) {
      return Boolean(e && e.__v_isRef === true);
    }
    y("nextTick", () => ie);
    y("dispatch", (e) => J.bind(J, e));
    y("watch", (e, { evaluateLater: t, cleanup: r }) => (n, i) => {
      let o = t(n), a = ve(() => {
        let c;
        return o((l) => c = l), c;
      }, i);
      r(a);
    });
    y("store", Vr);
    y("data", (e) => Ce(e));
    y("root", (e) => Y(e));
    y("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = z(Ui(e))), e._x_refs_proxy));
    function Ui(e) {
      let t = [];
      return j(e, (r) => {
        r._x_refs && t.push(r._x_refs);
      }), t;
    }
    var Bt = {};
    function zt(e) {
      return Bt[e] || (Bt[e] = 0), ++Bt[e];
    }
    function gn(e, t) {
      return j(e, (r) => {
        if (r._x_ids && r._x_ids[t])
          return true;
      });
    }
    function xn(e, t) {
      e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = zt(t));
    }
    y("id", (e, { cleanup: t }) => (r, n = null) => {
      let i = `${r}${n ? `-${n}` : ""}`;
      return Wi(e, i, t, () => {
        let o = gn(e, r), s = o ? o._x_ids[r] : zt(r);
        return n ? `${r}-${s}-${n}` : `${r}-${s}`;
      });
    });
    K((e, t) => {
      e._x_id && (t._x_id = e._x_id);
    });
    function Wi(e, t, r, n) {
      if (e._x_id || (e._x_id = {}), e._x_id[t])
        return e._x_id[t];
      let i = n();
      return e._x_id[t] = i, r(() => {
        delete e._x_id[t];
      }), i;
    }
    y("el", (e) => e);
    yn("Focus", "focus", "focus");
    yn("Persist", "persist", "persist");
    function yn(e, t, r) {
      y(t, (n) => E(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${r}`, n));
    }
    d("modelable", (e, { expression: t }, { effect: r, evaluateLater: n, cleanup: i }) => {
      let o = n(t), s = () => {
        let u;
        return o((p) => u = p), u;
      }, a = n(`${t} = __placeholder`), c = (u) => a(() => {
      }, { scope: { __placeholder: u } }), l = s();
      c(l), queueMicrotask(() => {
        if (!e._x_model)
          return;
        e._x_removeModelListeners.default();
        let u = e._x_model.get, p = e._x_model.set, h = Ve({ get() {
          return u();
        }, set(w) {
          p(w);
        } }, { get() {
          return s();
        }, set(w) {
          c(w);
        } });
        i(h);
      });
    });
    d("teleport", (e, { modifiers: t, expression: r }, { cleanup: n }) => {
      e.tagName.toLowerCase() !== "template" && E("x-teleport can only be used on a <template> tag", e);
      let i = bn(r), o = e.content.cloneNode(true).firstElementChild;
      e._x_teleport = o, o._x_teleportBack = e, e.setAttribute("data-teleport-template", true), o.setAttribute("data-teleport-target", true), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
        o.addEventListener(a, (c) => {
          c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c));
        });
      }), k(o, {}, e);
      let s = (a, c, l) => {
        l.includes("prepend") ? c.parentNode.insertBefore(a, c) : l.includes("append") ? c.parentNode.insertBefore(a, c.nextSibling) : c.appendChild(a);
      };
      m(() => {
        s(o, i, t), A(() => {
          S(o);
        })();
      }), e._x_teleportPutBack = () => {
        let a = bn(r);
        m(() => {
          s(e._x_teleport, a, t);
        });
      }, n(() => m(() => {
        o.remove(), P(o);
      }));
    });
    var Gi = document.createElement("div");
    function bn(e) {
      let t = A(() => document.querySelector(e), () => Gi)();
      return t || E(`Cannot find x-teleport element for selector: "${e}"`), t;
    }
    var wn = () => {
    };
    wn.inline = (e, { modifiers: t }, { cleanup: r }) => {
      t.includes("self") ? e._x_ignoreSelf = true : e._x_ignore = true, r(() => {
        t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
      });
    };
    d("ignore", wn);
    d("effect", A((e, { expression: t }, { effect: r }) => {
      r(x(e, t));
    }));
    function ae(e, t, r, n) {
      let i = e, o = (c) => n(c), s = {}, a = (c, l) => (u) => l(c, u);
      if (r.includes("dot") && (t = Ji(t)), r.includes("camel") && (t = Yi(t)), r.includes("passive") && (s.passive = true), r.includes("capture") && (s.capture = true), r.includes("window") && (i = window), r.includes("document") && (i = document), r.includes("debounce")) {
        let c = r[r.indexOf("debounce") + 1] || "invalid-wait", l = tt(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250;
        o = He(o, l);
      }
      if (r.includes("throttle")) {
        let c = r[r.indexOf("throttle") + 1] || "invalid-wait", l = tt(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250;
        o = Ke(o, l);
      }
      return r.includes("prevent") && (o = a(o, (c, l) => {
        l.preventDefault(), c(l);
      })), r.includes("stop") && (o = a(o, (c, l) => {
        l.stopPropagation(), c(l);
      })), r.includes("once") && (o = a(o, (c, l) => {
        c(l), i.removeEventListener(t, o, s);
      })), (r.includes("away") || r.includes("outside")) && (i = document, o = a(o, (c, l) => {
        e.contains(l.target) || l.target.isConnected !== false && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== false && c(l));
      })), r.includes("self") && (o = a(o, (c, l) => {
        l.target === e && c(l);
      })), (Zi(t) || vn(t)) && (o = a(o, (c, l) => {
        Qi(l, r) || c(l);
      })), i.addEventListener(t, o, s), () => {
        i.removeEventListener(t, o, s);
      };
    }
    function Ji(e) {
      return e.replace(/-/g, ".");
    }
    function Yi(e) {
      return e.toLowerCase().replace(/-(\w)/g, (t, r) => r.toUpperCase());
    }
    function tt(e) {
      return !Array.isArray(e) && !isNaN(e);
    }
    function Xi(e) {
      return [" ", "_"].includes(e) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
    }
    function Zi(e) {
      return ["keydown", "keyup"].includes(e);
    }
    function vn(e) {
      return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
    }
    function Qi(e, t) {
      let r = t.filter((o) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(o));
      if (r.includes("debounce")) {
        let o = r.indexOf("debounce");
        r.splice(o, tt((r[o + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
      }
      if (r.includes("throttle")) {
        let o = r.indexOf("throttle");
        r.splice(o, tt((r[o + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
      }
      if (r.length === 0 || r.length === 1 && En(e.key).includes(r[0]))
        return false;
      let i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((o) => r.includes(o));
      return r = r.filter((o) => !i.includes(o)), !(i.length > 0 && i.filter((s) => ((s === "cmd" || s === "super") && (s = "meta"), e[`${s}Key`])).length === i.length && (vn(e.type) || En(e.key).includes(r[0])));
    }
    function En(e) {
      if (!e)
        return [];
      e = Xi(e);
      let t = { ctrl: "control", slash: "/", space: " ", spacebar: " ", cmd: "meta", esc: "escape", up: "arrow-up", down: "arrow-down", left: "arrow-left", right: "arrow-right", period: ".", comma: ",", equal: "=", minus: "-", underscore: "_" };
      return t[e] = e, Object.keys(t).map((r) => {
        if (t[r] === e)
          return r;
      }).filter((r) => r);
    }
    d("model", (e, { modifiers: t, expression: r }, { effect: n, cleanup: i }) => {
      let o = e;
      t.includes("parent") && (o = e.parentNode);
      let s = x(o, r), a;
      typeof r == "string" ? a = x(o, `${r} = __placeholder`) : typeof r == "function" && typeof r() == "string" ? a = x(o, `${r()} = __placeholder`) : a = () => {
      };
      let c = () => {
        let h;
        return s((w) => h = w), Sn(h) ? h.get() : h;
      }, l = (h) => {
        let w;
        s((F) => w = F), Sn(w) ? w.set(h) : a(() => {
        }, { scope: { __placeholder: h } });
      };
      typeof r == "string" && e.type === "radio" && m(() => {
        e.hasAttribute("name") || e.setAttribute("name", r);
      });
      let u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input", p = I ? () => {
      } : ae(e, u, t, (h) => {
        l(Ht(e, t, h, c()));
      });
      if (t.includes("fill") && ([void 0, null, ""].includes(c()) || ze(e) && Array.isArray(c()) || e.tagName.toLowerCase() === "select" && e.multiple) && l(Ht(e, t, { target: e }, c())), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = p, i(() => e._x_removeModelListeners.default()), e.form) {
        let h = ae(e.form, "reset", [], (w) => {
          ie(() => e._x_model && e._x_model.set(Ht(e, t, { target: e }, c())));
        });
        i(() => h());
      }
      e._x_model = { get() {
        return c();
      }, set(h) {
        l(h);
      } }, e._x_forceModelUpdate = (h) => {
        h === void 0 && typeof r == "string" && r.match(/\./) && (h = ""), window.fromModel = true, m(() => ge(e, "value", h)), delete window.fromModel;
      }, n(() => {
        let h = c();
        t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(h);
      });
    });
    function Ht(e, t, r, n) {
      return m(() => {
        if (r instanceof CustomEvent && r.detail !== void 0)
          return r.detail !== null && r.detail !== void 0 ? r.detail : r.target.value;
        if (ze(e))
          if (Array.isArray(n)) {
            let i = null;
            return t.includes("number") ? i = Kt(r.target.value) : t.includes("boolean") ? i = xe(r.target.value) : i = r.target.value, r.target.checked ? n.includes(i) ? n : n.concat([i]) : n.filter((o) => !eo(o, i));
          } else
            return r.target.checked;
        else {
          if (e.tagName.toLowerCase() === "select" && e.multiple)
            return t.includes("number") ? Array.from(r.target.selectedOptions).map((i) => {
              let o = i.value || i.text;
              return Kt(o);
            }) : t.includes("boolean") ? Array.from(r.target.selectedOptions).map((i) => {
              let o = i.value || i.text;
              return xe(o);
            }) : Array.from(r.target.selectedOptions).map((i) => i.value || i.text);
          {
            let i;
            return Ot(e) ? r.target.checked ? i = r.target.value : i = n : i = r.target.value, t.includes("number") ? Kt(i) : t.includes("boolean") ? xe(i) : t.includes("trim") ? i.trim() : i;
          }
        }
      });
    }
    function Kt(e) {
      let t = e ? parseFloat(e) : null;
      return to(t) ? t : e;
    }
    function eo(e, t) {
      return e == t;
    }
    function to(e) {
      return !Array.isArray(e) && !isNaN(e);
    }
    function Sn(e) {
      return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
    }
    d("cloak", (e) => queueMicrotask(() => m(() => e.removeAttribute(C("cloak")))));
    $e(() => `[${C("init")}]`);
    d("init", A((e, { expression: t }, { evaluate: r }) => typeof t == "string" ? !!t.trim() && r(t, {}, false) : r(t, {}, false)));
    d("text", (e, { expression: t }, { effect: r, evaluateLater: n }) => {
      let i = n(t);
      r(() => {
        i((o) => {
          m(() => {
            e.textContent = o;
          });
        });
      });
    });
    d("html", (e, { expression: t }, { effect: r, evaluateLater: n }) => {
      let i = n(t);
      r(() => {
        i((o) => {
          m(() => {
            e.innerHTML = o, e._x_ignoreSelf = true, S(e), delete e._x_ignoreSelf;
          });
        });
      });
    });
    ne(Pe(":", Ie(C("bind:"))));
    var An = (e, { value: t, modifiers: r, expression: n, original: i }, { effect: o, cleanup: s }) => {
      if (!t) {
        let c = {};
        Wr(c), x(e, n)((u) => {
          Tt(e, u, i);
        }, { scope: c });
        return;
      }
      if (t === "key")
        return ro(e, n);
      if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
        return;
      let a = x(e, n);
      o(() => a((c) => {
        c === void 0 && typeof n == "string" && n.match(/\./) && (c = ""), m(() => ge(e, t, c, r));
      })), s(() => {
        e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
      });
    };
    An.inline = (e, { value: t, modifiers: r, expression: n }) => {
      t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: n, extract: false });
    };
    d("bind", An);
    function ro(e, t) {
      e._x_keyExpression = t;
    }
    Le(() => `[${C("data")}]`);
    d("data", (e, { expression: t }, { cleanup: r }) => {
      if (no(e))
        return;
      t = t === "" ? "{}" : t;
      let n = {};
      fe(n, e);
      let i = {};
      Yr(i, n);
      let o = R(e, t, { scope: i });
      (o === void 0 || o === true) && (o = {}), fe(o, e);
      let s = T(o);
      Te(s);
      let a = k(e, s);
      s.init && R(e, s.init), r(() => {
        s.destroy && R(e, s.destroy), a();
      });
    });
    K((e, t) => {
      e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", true));
    });
    function no(e) {
      return I ? Be ? true : e.hasAttribute("data-has-alpine-state") : false;
    }
    d("show", (e, { modifiers: t, expression: r }, { effect: n }) => {
      let i = x(e, r);
      e._x_doHide || (e._x_doHide = () => {
        m(() => {
          e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
        });
      }), e._x_doShow || (e._x_doShow = () => {
        m(() => {
          e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
        });
      });
      let o = () => {
        e._x_doHide(), e._x_isShown = false;
      }, s = () => {
        e._x_doShow(), e._x_isShown = true;
      }, a = () => setTimeout(s), c = he((p) => p ? s() : o(), (p) => {
        typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, p, s, o) : p ? a() : o();
      }), l, u = true;
      n(() => i((p) => {
        !u && p === l || (t.includes("immediate") && (p ? a() : o()), c(p), l = p, u = false);
      }));
    });
    d("for", (e, { expression: t }, { effect: r, cleanup: n }) => {
      let i = oo(t), o = x(e, i.items), s = x(e, e._x_keyExpression || "index");
      e._x_prevKeys = [], e._x_lookup = {}, r(() => io(e, i, o, s)), n(() => {
        Object.values(e._x_lookup).forEach((a) => m(() => {
          P(a), a.remove();
        })), delete e._x_prevKeys, delete e._x_lookup;
      });
    });
    function io(e, t, r, n) {
      let i = (s) => typeof s == "object" && !Array.isArray(s), o = e;
      r((s) => {
        so(s) && s >= 0 && (s = Array.from(Array(s).keys(), (f) => f + 1)), s === void 0 && (s = []);
        let a = e._x_lookup, c = e._x_prevKeys, l = [], u = [];
        if (i(s))
          s = Object.entries(s).map(([f, g]) => {
            let b = On(t, g, f, s);
            n((v) => {
              u.includes(v) && E("Duplicate key on x-for", e), u.push(v);
            }, { scope: { index: f, ...b } }), l.push(b);
          });
        else
          for (let f = 0; f < s.length; f++) {
            let g = On(t, s[f], f, s);
            n((b) => {
              u.includes(b) && E("Duplicate key on x-for", e), u.push(b);
            }, { scope: { index: f, ...g } }), l.push(g);
          }
        let p = [], h = [], w = [], F = [];
        for (let f = 0; f < c.length; f++) {
          let g = c[f];
          u.indexOf(g) === -1 && w.push(g);
        }
        c = c.filter((f) => !w.includes(f));
        let Ee = "template";
        for (let f = 0; f < u.length; f++) {
          let g = u[f], b = c.indexOf(g);
          if (b === -1)
            c.splice(f, 0, g), p.push([Ee, f]);
          else if (b !== f) {
            let v = c.splice(f, 1)[0], O = c.splice(b - 1, 1)[0];
            c.splice(f, 0, O), c.splice(b, 0, v), h.push([v, O]);
          } else
            F.push(g);
          Ee = g;
        }
        for (let f = 0; f < w.length; f++) {
          let g = w[f];
          g in a && (m(() => {
            P(a[g]), a[g].remove();
          }), delete a[g]);
        }
        for (let f = 0; f < h.length; f++) {
          let [g, b] = h[f], v = a[g], O = a[b], ee = document.createElement("div");
          m(() => {
            O || E('x-for ":key" is undefined or invalid', o, b, a), O.after(ee), v.after(O), O._x_currentIfEl && O.after(O._x_currentIfEl), ee.before(v), v._x_currentIfEl && v.after(v._x_currentIfEl), ee.remove();
          }), O._x_refreshXForScope(l[u.indexOf(b)]);
        }
        for (let f = 0; f < p.length; f++) {
          let [g, b] = p[f], v = g === "template" ? o : a[g];
          v._x_currentIfEl && (v = v._x_currentIfEl);
          let O = l[b], ee = u[b], ce = document.importNode(o.content, true).firstElementChild, qt = T(O);
          k(ce, qt, o), ce._x_refreshXForScope = (Tn) => {
            Object.entries(Tn).forEach(([Rn, Mn]) => {
              qt[Rn] = Mn;
            });
          }, m(() => {
            v.after(ce), A(() => S(ce))();
          }), typeof ee == "object" && E("x-for key cannot be an object, it must be a string or an integer", o), a[ee] = ce;
        }
        for (let f = 0; f < F.length; f++)
          a[F[f]]._x_refreshXForScope(l[u.indexOf(F[f])]);
        o._x_prevKeys = u;
      });
    }
    function oo(e) {
      let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, r = /^\s*\(|\)\s*$/g, n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, i = e.match(n);
      if (!i)
        return;
      let o = {};
      o.items = i[2].trim();
      let s = i[1].replace(r, "").trim(), a = s.match(t);
      return a ? (o.item = s.replace(t, "").trim(), o.index = a[1].trim(), a[2] && (o.collection = a[2].trim())) : o.item = s, o;
    }
    function On(e, t, r, n) {
      let i = {};
      return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((s) => s.trim()).forEach((s, a) => {
        i[s] = t[a];
      }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((s) => s.trim()).forEach((s) => {
        i[s] = t[s];
      }) : i[e.item] = t, e.index && (i[e.index] = r), e.collection && (i[e.collection] = n), i;
    }
    function so(e) {
      return !Array.isArray(e) && !isNaN(e);
    }
    function Cn() {
    }
    Cn.inline = (e, { expression: t }, { cleanup: r }) => {
      let n = Y(e);
      n._x_refs || (n._x_refs = {}), n._x_refs[t] = e, r(() => delete n._x_refs[t]);
    };
    d("ref", Cn);
    d("if", (e, { expression: t }, { effect: r, cleanup: n }) => {
      e.tagName.toLowerCase() !== "template" && E("x-if can only be used on a <template> tag", e);
      let i = x(e, t), o = () => {
        if (e._x_currentIfEl)
          return e._x_currentIfEl;
        let a = e.content.cloneNode(true).firstElementChild;
        return k(a, {}, e), m(() => {
          e.after(a), A(() => S(a))();
        }), e._x_currentIfEl = a, e._x_undoIf = () => {
          m(() => {
            P(a), a.remove();
          }), delete e._x_currentIfEl;
        }, a;
      }, s = () => {
        e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
      };
      r(() => i((a) => {
        a ? o() : s();
      })), n(() => e._x_undoIf && e._x_undoIf());
    });
    d("id", (e, { expression: t }, { evaluate: r }) => {
      r(t).forEach((i) => xn(e, i));
    });
    K((e, t) => {
      e._x_ids && (t._x_ids = e._x_ids);
    });
    ne(Pe("@", Ie(C("on:"))));
    d("on", A((e, { value: t, modifiers: r, expression: n }, { cleanup: i }) => {
      let o = n ? x(e, n) : () => {
      };
      e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
      let s = ae(e, t, r, (a) => {
        o(() => {
        }, { scope: { $event: a }, params: [a] });
      });
      i(() => s());
    }));
    rt("Collapse", "collapse", "collapse");
    rt("Intersect", "intersect", "intersect");
    rt("Focus", "trap", "focus");
    rt("Mask", "mask", "mask");
    function rt(e, t, r) {
      d(t, (n) => E(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${r}`, n));
    }
    H.setEvaluator(xt);
    H.setReactivityEngine({ reactive: et, effect: on, release: sn, raw: _ });
    var Vt = H;
    window.Alpine = Vt;
    queueMicrotask(() => {
      Vt.start();
    });
  })();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYWxwaW5lLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIoKCk9Pnt2YXIgbnQ9ITEsaXQ9ITEsVz1bXSxvdD0tMTtmdW5jdGlvbiBVdChlKXtObihlKX1mdW5jdGlvbiBObihlKXtXLmluY2x1ZGVzKGUpfHxXLnB1c2goZSksa24oKX1mdW5jdGlvbiBXdChlKXtsZXQgdD1XLmluZGV4T2YoZSk7dCE9PS0xJiZ0Pm90JiZXLnNwbGljZSh0LDEpfWZ1bmN0aW9uIGtuKCl7IWl0JiYhbnQmJihudD0hMCxxdWV1ZU1pY3JvdGFzayhEbikpfWZ1bmN0aW9uIERuKCl7bnQ9ITEsaXQ9ITA7Zm9yKGxldCBlPTA7ZTxXLmxlbmd0aDtlKyspV1tlXSgpLG90PWU7Vy5sZW5ndGg9MCxvdD0tMSxpdD0hMX12YXIgVCxOLCQsYXQsc3Q9ITA7ZnVuY3Rpb24gR3QoZSl7c3Q9ITEsZSgpLHN0PSEwfWZ1bmN0aW9uIEp0KGUpe1Q9ZS5yZWFjdGl2ZSwkPWUucmVsZWFzZSxOPXQ9PmUuZWZmZWN0KHQse3NjaGVkdWxlcjpyPT57c3Q/VXQocik6cigpfX0pLGF0PWUucmF3fWZ1bmN0aW9uIGN0KGUpe049ZX1mdW5jdGlvbiBZdChlKXtsZXQgdD0oKT0+e307cmV0dXJuW249PntsZXQgaT1OKG4pO3JldHVybiBlLl94X2VmZmVjdHN8fChlLl94X2VmZmVjdHM9bmV3IFNldCxlLl94X3J1bkVmZmVjdHM9KCk9PntlLl94X2VmZmVjdHMuZm9yRWFjaChvPT5vKCkpfSksZS5feF9lZmZlY3RzLmFkZChpKSx0PSgpPT57aSE9PXZvaWQgMCYmKGUuX3hfZWZmZWN0cy5kZWxldGUoaSksJChpKSl9LGl9LCgpPT57dCgpfV19ZnVuY3Rpb24gdmUoZSx0KXtsZXQgcj0hMCxuLGk9TigoKT0+e2xldCBvPWUoKTtKU09OLnN0cmluZ2lmeShvKSxyP249bzpxdWV1ZU1pY3JvdGFzaygoKT0+e3QobyxuKSxuPW99KSxyPSExfSk7cmV0dXJuKCk9PiQoaSl9dmFyIFh0PVtdLFp0PVtdLFF0PVtdO2Z1bmN0aW9uIGVyKGUpe1F0LnB1c2goZSl9ZnVuY3Rpb24gdGUoZSx0KXt0eXBlb2YgdD09XCJmdW5jdGlvblwiPyhlLl94X2NsZWFudXBzfHwoZS5feF9jbGVhbnVwcz1bXSksZS5feF9jbGVhbnVwcy5wdXNoKHQpKToodD1lLFp0LnB1c2godCkpfWZ1bmN0aW9uIEFlKGUpe1h0LnB1c2goZSl9ZnVuY3Rpb24gT2UoZSx0LHIpe2UuX3hfYXR0cmlidXRlQ2xlYW51cHN8fChlLl94X2F0dHJpYnV0ZUNsZWFudXBzPXt9KSxlLl94X2F0dHJpYnV0ZUNsZWFudXBzW3RdfHwoZS5feF9hdHRyaWJ1dGVDbGVhbnVwc1t0XT1bXSksZS5feF9hdHRyaWJ1dGVDbGVhbnVwc1t0XS5wdXNoKHIpfWZ1bmN0aW9uIGx0KGUsdCl7ZS5feF9hdHRyaWJ1dGVDbGVhbnVwcyYmT2JqZWN0LmVudHJpZXMoZS5feF9hdHRyaWJ1dGVDbGVhbnVwcykuZm9yRWFjaCgoW3Isbl0pPT57KHQ9PT12b2lkIDB8fHQuaW5jbHVkZXMocikpJiYobi5mb3JFYWNoKGk9PmkoKSksZGVsZXRlIGUuX3hfYXR0cmlidXRlQ2xlYW51cHNbcl0pfSl9ZnVuY3Rpb24gdHIoZSl7Zm9yKGUuX3hfZWZmZWN0cz8uZm9yRWFjaChXdCk7ZS5feF9jbGVhbnVwcz8ubGVuZ3RoOyllLl94X2NsZWFudXBzLnBvcCgpKCl9dmFyIHV0PW5ldyBNdXRhdGlvbk9ic2VydmVyKG10KSxmdD0hMTtmdW5jdGlvbiB1ZSgpe3V0Lm9ic2VydmUoZG9jdW1lbnQse3N1YnRyZWU6ITAsY2hpbGRMaXN0OiEwLGF0dHJpYnV0ZXM6ITAsYXR0cmlidXRlT2xkVmFsdWU6ITB9KSxmdD0hMH1mdW5jdGlvbiBkdCgpe1BuKCksdXQuZGlzY29ubmVjdCgpLGZ0PSExfXZhciBsZT1bXTtmdW5jdGlvbiBQbigpe2xldCBlPXV0LnRha2VSZWNvcmRzKCk7bGUucHVzaCgoKT0+ZS5sZW5ndGg+MCYmbXQoZSkpO2xldCB0PWxlLmxlbmd0aDtxdWV1ZU1pY3JvdGFzaygoKT0+e2lmKGxlLmxlbmd0aD09PXQpZm9yKDtsZS5sZW5ndGg+MDspbGUuc2hpZnQoKSgpfSl9ZnVuY3Rpb24gbShlKXtpZighZnQpcmV0dXJuIGUoKTtkdCgpO2xldCB0PWUoKTtyZXR1cm4gdWUoKSx0fXZhciBwdD0hMSxTZT1bXTtmdW5jdGlvbiBycigpe3B0PSEwfWZ1bmN0aW9uIG5yKCl7cHQ9ITEsbXQoU2UpLFNlPVtdfWZ1bmN0aW9uIG10KGUpe2lmKHB0KXtTZT1TZS5jb25jYXQoZSk7cmV0dXJufWxldCB0PVtdLHI9bmV3IFNldCxuPW5ldyBNYXAsaT1uZXcgTWFwO2ZvcihsZXQgbz0wO288ZS5sZW5ndGg7bysrKWlmKCFlW29dLnRhcmdldC5feF9pZ25vcmVNdXRhdGlvbk9ic2VydmVyJiYoZVtvXS50eXBlPT09XCJjaGlsZExpc3RcIiYmKGVbb10ucmVtb3ZlZE5vZGVzLmZvckVhY2gocz0+e3Mubm9kZVR5cGU9PT0xJiZzLl94X21hcmtlciYmci5hZGQocyl9KSxlW29dLmFkZGVkTm9kZXMuZm9yRWFjaChzPT57aWYocy5ub2RlVHlwZT09PTEpe2lmKHIuaGFzKHMpKXtyLmRlbGV0ZShzKTtyZXR1cm59cy5feF9tYXJrZXJ8fHQucHVzaChzKX19KSksZVtvXS50eXBlPT09XCJhdHRyaWJ1dGVzXCIpKXtsZXQgcz1lW29dLnRhcmdldCxhPWVbb10uYXR0cmlidXRlTmFtZSxjPWVbb10ub2xkVmFsdWUsbD0oKT0+e24uaGFzKHMpfHxuLnNldChzLFtdKSxuLmdldChzKS5wdXNoKHtuYW1lOmEsdmFsdWU6cy5nZXRBdHRyaWJ1dGUoYSl9KX0sdT0oKT0+e2kuaGFzKHMpfHxpLnNldChzLFtdKSxpLmdldChzKS5wdXNoKGEpfTtzLmhhc0F0dHJpYnV0ZShhKSYmYz09PW51bGw/bCgpOnMuaGFzQXR0cmlidXRlKGEpPyh1KCksbCgpKTp1KCl9aS5mb3JFYWNoKChvLHMpPT57bHQocyxvKX0pLG4uZm9yRWFjaCgobyxzKT0+e1h0LmZvckVhY2goYT0+YShzLG8pKX0pO2ZvcihsZXQgbyBvZiByKXQuc29tZShzPT5zLmNvbnRhaW5zKG8pKXx8WnQuZm9yRWFjaChzPT5zKG8pKTtmb3IobGV0IG8gb2YgdClvLmlzQ29ubmVjdGVkJiZRdC5mb3JFYWNoKHM9PnMobykpO3Q9bnVsbCxyPW51bGwsbj1udWxsLGk9bnVsbH1mdW5jdGlvbiBDZShlKXtyZXR1cm4geihCKGUpKX1mdW5jdGlvbiBrKGUsdCxyKXtyZXR1cm4gZS5feF9kYXRhU3RhY2s9W3QsLi4uQihyfHxlKV0sKCk9PntlLl94X2RhdGFTdGFjaz1lLl94X2RhdGFTdGFjay5maWx0ZXIobj0+biE9PXQpfX1mdW5jdGlvbiBCKGUpe3JldHVybiBlLl94X2RhdGFTdGFjaz9lLl94X2RhdGFTdGFjazp0eXBlb2YgU2hhZG93Um9vdD09XCJmdW5jdGlvblwiJiZlIGluc3RhbmNlb2YgU2hhZG93Um9vdD9CKGUuaG9zdCk6ZS5wYXJlbnROb2RlP0IoZS5wYXJlbnROb2RlKTpbXX1mdW5jdGlvbiB6KGUpe3JldHVybiBuZXcgUHJveHkoe29iamVjdHM6ZX0sSW4pfXZhciBJbj17b3duS2V5cyh7b2JqZWN0czplfSl7cmV0dXJuIEFycmF5LmZyb20obmV3IFNldChlLmZsYXRNYXAodD0+T2JqZWN0LmtleXModCkpKSl9LGhhcyh7b2JqZWN0czplfSx0KXtyZXR1cm4gdD09U3ltYm9sLnVuc2NvcGFibGVzPyExOmUuc29tZShyPT5PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocix0KXx8UmVmbGVjdC5oYXMocix0KSl9LGdldCh7b2JqZWN0czplfSx0LHIpe3JldHVybiB0PT1cInRvSlNPTlwiP0xuOlJlZmxlY3QuZ2V0KGUuZmluZChuPT5SZWZsZWN0LmhhcyhuLHQpKXx8e30sdCxyKX0sc2V0KHtvYmplY3RzOmV9LHQscixuKXtsZXQgaT1lLmZpbmQocz0+T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsdCkpfHxlW2UubGVuZ3RoLTFdLG89T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpLHQpO3JldHVybiBvPy5zZXQmJm8/LmdldD9vLnNldC5jYWxsKG4scil8fCEwOlJlZmxlY3Quc2V0KGksdCxyKX19O2Z1bmN0aW9uIExuKCl7cmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0aGlzKS5yZWR1Y2UoKHQscik9Pih0W3JdPVJlZmxlY3QuZ2V0KHRoaXMsciksdCkse30pfWZ1bmN0aW9uIFRlKGUpe2xldCB0PW49PnR5cGVvZiBuPT1cIm9iamVjdFwiJiYhQXJyYXkuaXNBcnJheShuKSYmbiE9PW51bGwscj0obixpPVwiXCIpPT57T2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobikpLmZvckVhY2goKFtvLHt2YWx1ZTpzLGVudW1lcmFibGU6YX1dKT0+e2lmKGE9PT0hMXx8cz09PXZvaWQgMHx8dHlwZW9mIHM9PVwib2JqZWN0XCImJnMhPT1udWxsJiZzLl9fdl9za2lwKXJldHVybjtsZXQgYz1pPT09XCJcIj9vOmAke2l9LiR7b31gO3R5cGVvZiBzPT1cIm9iamVjdFwiJiZzIT09bnVsbCYmcy5feF9pbnRlcmNlcHRvcj9uW29dPXMuaW5pdGlhbGl6ZShlLGMsbyk6dChzKSYmcyE9PW4mJiEocyBpbnN0YW5jZW9mIEVsZW1lbnQpJiZyKHMsYyl9KX07cmV0dXJuIHIoZSl9ZnVuY3Rpb24gUmUoZSx0PSgpPT57fSl7bGV0IHI9e2luaXRpYWxWYWx1ZTp2b2lkIDAsX3hfaW50ZXJjZXB0b3I6ITAsaW5pdGlhbGl6ZShuLGksbyl7cmV0dXJuIGUodGhpcy5pbml0aWFsVmFsdWUsKCk9PiRuKG4saSkscz0+aHQobixpLHMpLGksbyl9fTtyZXR1cm4gdChyKSxuPT57aWYodHlwZW9mIG49PVwib2JqZWN0XCImJm4hPT1udWxsJiZuLl94X2ludGVyY2VwdG9yKXtsZXQgaT1yLmluaXRpYWxpemUuYmluZChyKTtyLmluaXRpYWxpemU9KG8scyxhKT0+e2xldCBjPW4uaW5pdGlhbGl6ZShvLHMsYSk7cmV0dXJuIHIuaW5pdGlhbFZhbHVlPWMsaShvLHMsYSl9fWVsc2Ugci5pbml0aWFsVmFsdWU9bjtyZXR1cm4gcn19ZnVuY3Rpb24gJG4oZSx0KXtyZXR1cm4gdC5zcGxpdChcIi5cIikucmVkdWNlKChyLG4pPT5yW25dLGUpfWZ1bmN0aW9uIGh0KGUsdCxyKXtpZih0eXBlb2YgdD09XCJzdHJpbmdcIiYmKHQ9dC5zcGxpdChcIi5cIikpLHQubGVuZ3RoPT09MSllW3RbMF1dPXI7ZWxzZXtpZih0Lmxlbmd0aD09PTApdGhyb3cgZXJyb3I7cmV0dXJuIGVbdFswXV18fChlW3RbMF1dPXt9KSxodChlW3RbMF1dLHQuc2xpY2UoMSkscil9fXZhciBpcj17fTtmdW5jdGlvbiB5KGUsdCl7aXJbZV09dH1mdW5jdGlvbiBmZShlLHQpe2xldCByPWpuKHQpO3JldHVybiBPYmplY3QuZW50cmllcyhpcikuZm9yRWFjaCgoW24saV0pPT57T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsYCQke259YCx7Z2V0KCl7cmV0dXJuIGkodCxyKX0sZW51bWVyYWJsZTohMX0pfSksZX1mdW5jdGlvbiBqbihlKXtsZXRbdCxyXT1fdChlKSxuPXtpbnRlcmNlcHRvcjpSZSwuLi50fTtyZXR1cm4gdGUoZSxyKSxufWZ1bmN0aW9uIG9yKGUsdCxyLC4uLm4pe3RyeXtyZXR1cm4gciguLi5uKX1jYXRjaChpKXtyZShpLGUsdCl9fWZ1bmN0aW9uIHJlKC4uLmUpe3JldHVybiBzciguLi5lKX12YXIgc3I9Rm47ZnVuY3Rpb24gYXIoZSl7c3I9ZX1mdW5jdGlvbiBGbihlLHQscj12b2lkIDApe2U9T2JqZWN0LmFzc2lnbihlPz97bWVzc2FnZTpcIk5vIGVycm9yIG1lc3NhZ2UgZ2l2ZW4uXCJ9LHtlbDp0LGV4cHJlc3Npb246cn0pLGNvbnNvbGUud2FybihgQWxwaW5lIEV4cHJlc3Npb24gRXJyb3I6ICR7ZS5tZXNzYWdlfVxuXG4ke3I/J0V4cHJlc3Npb246IFwiJytyK2BcIlxuXG5gOlwiXCJ9YCx0KSxzZXRUaW1lb3V0KCgpPT57dGhyb3cgZX0sMCl9dmFyIE1lPSEwO2Z1bmN0aW9uIGtlKGUpe2xldCB0PU1lO01lPSExO2xldCByPWUoKTtyZXR1cm4gTWU9dCxyfWZ1bmN0aW9uIFIoZSx0LHI9e30pe2xldCBuO3JldHVybiB4KGUsdCkoaT0+bj1pLHIpLG59ZnVuY3Rpb24geCguLi5lKXtyZXR1cm4gY3IoLi4uZSl9dmFyIGNyPXh0O2Z1bmN0aW9uIGxyKGUpe2NyPWV9ZnVuY3Rpb24geHQoZSx0KXtsZXQgcj17fTtmZShyLGUpO2xldCBuPVtyLC4uLkIoZSldLGk9dHlwZW9mIHQ9PVwiZnVuY3Rpb25cIj9CbihuLHQpOkhuKG4sdCxlKTtyZXR1cm4gb3IuYmluZChudWxsLGUsdCxpKX1mdW5jdGlvbiBCbihlLHQpe3JldHVybihyPSgpPT57fSx7c2NvcGU6bj17fSxwYXJhbXM6aT1bXSxjb250ZXh0Om99PXt9KT0+e2xldCBzPXQuYXBwbHkoeihbbiwuLi5lXSksaSk7TmUocixzKX19dmFyIGd0PXt9O2Z1bmN0aW9uIHpuKGUsdCl7aWYoZ3RbZV0pcmV0dXJuIGd0W2VdO2xldCByPU9iamVjdC5nZXRQcm90b3R5cGVPZihhc3luYyBmdW5jdGlvbigpe30pLmNvbnN0cnVjdG9yLG49L15bXFxuXFxzXSppZi4qXFwoLipcXCkvLnRlc3QoZS50cmltKCkpfHwvXihsZXR8Y29uc3QpXFxzLy50ZXN0KGUudHJpbSgpKT9gKGFzeW5jKCk9PnsgJHtlfSB9KSgpYDplLG89KCgpPT57dHJ5e2xldCBzPW5ldyByKFtcIl9fc2VsZlwiLFwic2NvcGVcIl0sYHdpdGggKHNjb3BlKSB7IF9fc2VsZi5yZXN1bHQgPSAke259IH07IF9fc2VsZi5maW5pc2hlZCA9IHRydWU7IHJldHVybiBfX3NlbGYucmVzdWx0O2ApO3JldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocyxcIm5hbWVcIix7dmFsdWU6YFtBbHBpbmVdICR7ZX1gfSksc31jYXRjaChzKXtyZXR1cm4gcmUocyx0LGUpLFByb21pc2UucmVzb2x2ZSgpfX0pKCk7cmV0dXJuIGd0W2VdPW8sb31mdW5jdGlvbiBIbihlLHQscil7bGV0IG49em4odCxyKTtyZXR1cm4oaT0oKT0+e30se3Njb3BlOm89e30scGFyYW1zOnM9W10sY29udGV4dDphfT17fSk9PntuLnJlc3VsdD12b2lkIDAsbi5maW5pc2hlZD0hMTtsZXQgYz16KFtvLC4uLmVdKTtpZih0eXBlb2Ygbj09XCJmdW5jdGlvblwiKXtsZXQgbD1uLmNhbGwoYSxuLGMpLmNhdGNoKHU9PnJlKHUscix0KSk7bi5maW5pc2hlZD8oTmUoaSxuLnJlc3VsdCxjLHMsciksbi5yZXN1bHQ9dm9pZCAwKTpsLnRoZW4odT0+e05lKGksdSxjLHMscil9KS5jYXRjaCh1PT5yZSh1LHIsdCkpLmZpbmFsbHkoKCk9Pm4ucmVzdWx0PXZvaWQgMCl9fX1mdW5jdGlvbiBOZShlLHQscixuLGkpe2lmKE1lJiZ0eXBlb2YgdD09XCJmdW5jdGlvblwiKXtsZXQgbz10LmFwcGx5KHIsbik7byBpbnN0YW5jZW9mIFByb21pc2U/by50aGVuKHM9Pk5lKGUscyxyLG4pKS5jYXRjaChzPT5yZShzLGksdCkpOmUobyl9ZWxzZSB0eXBlb2YgdD09XCJvYmplY3RcIiYmdCBpbnN0YW5jZW9mIFByb21pc2U/dC50aGVuKG89PmUobykpOmUodCl9dmFyIHd0PVwieC1cIjtmdW5jdGlvbiBDKGU9XCJcIil7cmV0dXJuIHd0K2V9ZnVuY3Rpb24gdXIoZSl7d3Q9ZX12YXIgRGU9e307ZnVuY3Rpb24gZChlLHQpe3JldHVybiBEZVtlXT10LHtiZWZvcmUocil7aWYoIURlW3JdKXtjb25zb2xlLndhcm4oU3RyaW5nLnJhd2BDYW5ub3QgZmluZCBkaXJlY3RpdmUgXFxgJHtyfVxcYC4gXFxgJHtlfVxcYCB3aWxsIHVzZSB0aGUgZGVmYXVsdCBvcmRlciBvZiBleGVjdXRpb25gKTtyZXR1cm59bGV0IG49Ry5pbmRleE9mKHIpO0cuc3BsaWNlKG4+PTA/bjpHLmluZGV4T2YoXCJERUZBVUxUXCIpLDAsZSl9fX1mdW5jdGlvbiBmcihlKXtyZXR1cm4gT2JqZWN0LmtleXMoRGUpLmluY2x1ZGVzKGUpfWZ1bmN0aW9uIHBlKGUsdCxyKXtpZih0PUFycmF5LmZyb20odCksZS5feF92aXJ0dWFsRGlyZWN0aXZlcyl7bGV0IG89T2JqZWN0LmVudHJpZXMoZS5feF92aXJ0dWFsRGlyZWN0aXZlcykubWFwKChbYSxjXSk9Pih7bmFtZTphLHZhbHVlOmN9KSkscz1FdChvKTtvPW8ubWFwKGE9PnMuZmluZChjPT5jLm5hbWU9PT1hLm5hbWUpP3tuYW1lOmB4LWJpbmQ6JHthLm5hbWV9YCx2YWx1ZTpgXCIke2EudmFsdWV9XCJgfTphKSx0PXQuY29uY2F0KG8pfWxldCBuPXt9O3JldHVybiB0Lm1hcChtcigobyxzKT0+bltvXT1zKSkuZmlsdGVyKF9yKS5tYXAoVm4obixyKSkuc29ydChxbikubWFwKG89PktuKGUsbykpfWZ1bmN0aW9uIEV0KGUpe3JldHVybiBBcnJheS5mcm9tKGUpLm1hcChtcigpKS5maWx0ZXIodD0+IV9yKHQpKX12YXIgeXQ9ITEsZGU9bmV3IE1hcCxkcj1TeW1ib2woKTtmdW5jdGlvbiBwcihlKXt5dD0hMDtsZXQgdD1TeW1ib2woKTtkcj10LGRlLnNldCh0LFtdKTtsZXQgcj0oKT0+e2Zvcig7ZGUuZ2V0KHQpLmxlbmd0aDspZGUuZ2V0KHQpLnNoaWZ0KCkoKTtkZS5kZWxldGUodCl9LG49KCk9Pnt5dD0hMSxyKCl9O2UociksbigpfWZ1bmN0aW9uIF90KGUpe2xldCB0PVtdLHI9YT0+dC5wdXNoKGEpLFtuLGldPVl0KGUpO3JldHVybiB0LnB1c2goaSksW3tBbHBpbmU6SCxlZmZlY3Q6bixjbGVhbnVwOnIsZXZhbHVhdGVMYXRlcjp4LmJpbmQoeCxlKSxldmFsdWF0ZTpSLmJpbmQoUixlKX0sKCk9PnQuZm9yRWFjaChhPT5hKCkpXX1mdW5jdGlvbiBLbihlLHQpe2xldCByPSgpPT57fSxuPURlW3QudHlwZV18fHIsW2ksb109X3QoZSk7T2UoZSx0Lm9yaWdpbmFsLG8pO2xldCBzPSgpPT57ZS5feF9pZ25vcmV8fGUuX3hfaWdub3JlU2VsZnx8KG4uaW5saW5lJiZuLmlubGluZShlLHQsaSksbj1uLmJpbmQobixlLHQsaSkseXQ/ZGUuZ2V0KGRyKS5wdXNoKG4pOm4oKSl9O3JldHVybiBzLnJ1bkNsZWFudXBzPW8sc312YXIgUGU9KGUsdCk9Pih7bmFtZTpyLHZhbHVlOm59KT0+KHIuc3RhcnRzV2l0aChlKSYmKHI9ci5yZXBsYWNlKGUsdCkpLHtuYW1lOnIsdmFsdWU6bn0pLEllPWU9PmU7ZnVuY3Rpb24gbXIoZT0oKT0+e30pe3JldHVybih7bmFtZTp0LHZhbHVlOnJ9KT0+e2xldHtuYW1lOm4sdmFsdWU6aX09aHIucmVkdWNlKChvLHMpPT5zKG8pLHtuYW1lOnQsdmFsdWU6cn0pO3JldHVybiBuIT09dCYmZShuLHQpLHtuYW1lOm4sdmFsdWU6aX19fXZhciBocj1bXTtmdW5jdGlvbiBuZShlKXtoci5wdXNoKGUpfWZ1bmN0aW9uIF9yKHtuYW1lOmV9KXtyZXR1cm4gZ3IoKS50ZXN0KGUpfXZhciBncj0oKT0+bmV3IFJlZ0V4cChgXiR7d3R9KFteOl4uXSspXFxcXGJgKTtmdW5jdGlvbiBWbihlLHQpe3JldHVybih7bmFtZTpyLHZhbHVlOm59KT0+e2xldCBpPXIubWF0Y2goZ3IoKSksbz1yLm1hdGNoKC86KFthLXpBLVowLTlcXC1fOl0rKS8pLHM9ci5tYXRjaCgvXFwuW14uXFxdXSsoPz1bXlxcXV0qJCkvZyl8fFtdLGE9dHx8ZVtyXXx8cjtyZXR1cm57dHlwZTppP2lbMV06bnVsbCx2YWx1ZTpvP29bMV06bnVsbCxtb2RpZmllcnM6cy5tYXAoYz0+Yy5yZXBsYWNlKFwiLlwiLFwiXCIpKSxleHByZXNzaW9uOm4sb3JpZ2luYWw6YX19fXZhciBidD1cIkRFRkFVTFRcIixHPVtcImlnbm9yZVwiLFwicmVmXCIsXCJkYXRhXCIsXCJpZFwiLFwiYW5jaG9yXCIsXCJiaW5kXCIsXCJpbml0XCIsXCJmb3JcIixcIm1vZGVsXCIsXCJtb2RlbGFibGVcIixcInRyYW5zaXRpb25cIixcInNob3dcIixcImlmXCIsYnQsXCJ0ZWxlcG9ydFwiXTtmdW5jdGlvbiBxbihlLHQpe2xldCByPUcuaW5kZXhPZihlLnR5cGUpPT09LTE/YnQ6ZS50eXBlLG49Ry5pbmRleE9mKHQudHlwZSk9PT0tMT9idDp0LnR5cGU7cmV0dXJuIEcuaW5kZXhPZihyKS1HLmluZGV4T2Yobil9ZnVuY3Rpb24gSihlLHQscj17fSl7ZS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCh0LHtkZXRhaWw6cixidWJibGVzOiEwLGNvbXBvc2VkOiEwLGNhbmNlbGFibGU6ITB9KSl9ZnVuY3Rpb24gRChlLHQpe2lmKHR5cGVvZiBTaGFkb3dSb290PT1cImZ1bmN0aW9uXCImJmUgaW5zdGFuY2VvZiBTaGFkb3dSb290KXtBcnJheS5mcm9tKGUuY2hpbGRyZW4pLmZvckVhY2goaT0+RChpLHQpKTtyZXR1cm59bGV0IHI9ITE7aWYodChlLCgpPT5yPSEwKSxyKXJldHVybjtsZXQgbj1lLmZpcnN0RWxlbWVudENoaWxkO2Zvcig7bjspRChuLHQsITEpLG49bi5uZXh0RWxlbWVudFNpYmxpbmd9ZnVuY3Rpb24gRShlLC4uLnQpe2NvbnNvbGUud2FybihgQWxwaW5lIFdhcm5pbmc6ICR7ZX1gLC4uLnQpfXZhciB4cj0hMTtmdW5jdGlvbiB5cigpe3hyJiZFKFwiQWxwaW5lIGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWQgb24gdGhpcyBwYWdlLiBDYWxsaW5nIEFscGluZS5zdGFydCgpIG1vcmUgdGhhbiBvbmNlIGNhbiBjYXVzZSBwcm9ibGVtcy5cIikseHI9ITAsZG9jdW1lbnQuYm9keXx8RShcIlVuYWJsZSB0byBpbml0aWFsaXplLiBUcnlpbmcgdG8gbG9hZCBBbHBpbmUgYmVmb3JlIGA8Ym9keT5gIGlzIGF2YWlsYWJsZS4gRGlkIHlvdSBmb3JnZXQgdG8gYWRkIGBkZWZlcmAgaW4gQWxwaW5lJ3MgYDxzY3JpcHQ+YCB0YWc/XCIpLEooZG9jdW1lbnQsXCJhbHBpbmU6aW5pdFwiKSxKKGRvY3VtZW50LFwiYWxwaW5lOmluaXRpYWxpemluZ1wiKSx1ZSgpLGVyKHQ9PlModCxEKSksdGUodD0+UCh0KSksQWUoKHQscik9PntwZSh0LHIpLmZvckVhY2gobj0+bigpKX0pO2xldCBlPXQ9PiFZKHQucGFyZW50RWxlbWVudCwhMCk7QXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKEVyKCkuam9pbihcIixcIikpKS5maWx0ZXIoZSkuZm9yRWFjaCh0PT57Uyh0KX0pLEooZG9jdW1lbnQsXCJhbHBpbmU6aW5pdGlhbGl6ZWRcIiksc2V0VGltZW91dCgoKT0+e1duKCl9KX12YXIgdnQ9W10sYnI9W107ZnVuY3Rpb24gd3IoKXtyZXR1cm4gdnQubWFwKGU9PmUoKSl9ZnVuY3Rpb24gRXIoKXtyZXR1cm4gdnQuY29uY2F0KGJyKS5tYXAoZT0+ZSgpKX1mdW5jdGlvbiBMZShlKXt2dC5wdXNoKGUpfWZ1bmN0aW9uICRlKGUpe2JyLnB1c2goZSl9ZnVuY3Rpb24gWShlLHQ9ITEpe3JldHVybiBqKGUscj0+e2lmKCh0P0VyKCk6d3IoKSkuc29tZShpPT5yLm1hdGNoZXMoaSkpKXJldHVybiEwfSl9ZnVuY3Rpb24gaihlLHQpe2lmKGUpe2lmKHQoZSkpcmV0dXJuIGU7aWYoZS5feF90ZWxlcG9ydEJhY2smJihlPWUuX3hfdGVsZXBvcnRCYWNrKSwhIWUucGFyZW50RWxlbWVudClyZXR1cm4gaihlLnBhcmVudEVsZW1lbnQsdCl9fWZ1bmN0aW9uIHZyKGUpe3JldHVybiB3cigpLnNvbWUodD0+ZS5tYXRjaGVzKHQpKX12YXIgU3I9W107ZnVuY3Rpb24gQXIoZSl7U3IucHVzaChlKX12YXIgVW49MTtmdW5jdGlvbiBTKGUsdD1ELHI9KCk9Pnt9KXtqKGUsbj0+bi5feF9pZ25vcmUpfHxwcigoKT0+e3QoZSwobixpKT0+e24uX3hfbWFya2VyfHwocihuLGkpLFNyLmZvckVhY2gobz0+byhuLGkpKSxwZShuLG4uYXR0cmlidXRlcykuZm9yRWFjaChvPT5vKCkpLG4uX3hfaWdub3JlfHwobi5feF9tYXJrZXI9VW4rKyksbi5feF9pZ25vcmUmJmkoKSl9KX0pfWZ1bmN0aW9uIFAoZSx0PUQpe3QoZSxyPT57dHIociksbHQociksZGVsZXRlIHIuX3hfbWFya2VyfSl9ZnVuY3Rpb24gV24oKXtbW1widWlcIixcImRpYWxvZ1wiLFtcIlt4LWRpYWxvZ10sIFt4LXBvcG92ZXJdXCJdXSxbXCJhbmNob3JcIixcImFuY2hvclwiLFtcIlt4LWFuY2hvcl1cIl1dLFtcInNvcnRcIixcInNvcnRcIixbXCJbeC1zb3J0XVwiXV1dLmZvckVhY2goKFt0LHIsbl0pPT57ZnIocil8fG4uc29tZShpPT57aWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpKSlyZXR1cm4gRShgZm91bmQgXCIke2l9XCIsIGJ1dCBtaXNzaW5nICR7dH0gcGx1Z2luYCksITB9KX0pfXZhciBTdD1bXSxBdD0hMTtmdW5jdGlvbiBpZShlPSgpPT57fSl7cmV0dXJuIHF1ZXVlTWljcm90YXNrKCgpPT57QXR8fHNldFRpbWVvdXQoKCk9PntqZSgpfSl9KSxuZXcgUHJvbWlzZSh0PT57U3QucHVzaCgoKT0+e2UoKSx0KCl9KX0pfWZ1bmN0aW9uIGplKCl7Zm9yKEF0PSExO1N0Lmxlbmd0aDspU3Quc2hpZnQoKSgpfWZ1bmN0aW9uIE9yKCl7QXQ9ITB9ZnVuY3Rpb24gbWUoZSx0KXtyZXR1cm4gQXJyYXkuaXNBcnJheSh0KT9DcihlLHQuam9pbihcIiBcIikpOnR5cGVvZiB0PT1cIm9iamVjdFwiJiZ0IT09bnVsbD9HbihlLHQpOnR5cGVvZiB0PT1cImZ1bmN0aW9uXCI/bWUoZSx0KCkpOkNyKGUsdCl9ZnVuY3Rpb24gQ3IoZSx0KXtsZXQgcj1vPT5vLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbiksbj1vPT5vLnNwbGl0KFwiIFwiKS5maWx0ZXIocz0+IWUuY2xhc3NMaXN0LmNvbnRhaW5zKHMpKS5maWx0ZXIoQm9vbGVhbiksaT1vPT4oZS5jbGFzc0xpc3QuYWRkKC4uLm8pLCgpPT57ZS5jbGFzc0xpc3QucmVtb3ZlKC4uLm8pfSk7cmV0dXJuIHQ9dD09PSEwP3Q9XCJcIjp0fHxcIlwiLGkobih0KSl9ZnVuY3Rpb24gR24oZSx0KXtsZXQgcj1hPT5hLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbiksbj1PYmplY3QuZW50cmllcyh0KS5mbGF0TWFwKChbYSxjXSk9PmM/cihhKTohMSkuZmlsdGVyKEJvb2xlYW4pLGk9T2JqZWN0LmVudHJpZXModCkuZmxhdE1hcCgoW2EsY10pPT5jPyExOnIoYSkpLmZpbHRlcihCb29sZWFuKSxvPVtdLHM9W107cmV0dXJuIGkuZm9yRWFjaChhPT57ZS5jbGFzc0xpc3QuY29udGFpbnMoYSkmJihlLmNsYXNzTGlzdC5yZW1vdmUoYSkscy5wdXNoKGEpKX0pLG4uZm9yRWFjaChhPT57ZS5jbGFzc0xpc3QuY29udGFpbnMoYSl8fChlLmNsYXNzTGlzdC5hZGQoYSksby5wdXNoKGEpKX0pLCgpPT57cy5mb3JFYWNoKGE9PmUuY2xhc3NMaXN0LmFkZChhKSksby5mb3JFYWNoKGE9PmUuY2xhc3NMaXN0LnJlbW92ZShhKSl9fWZ1bmN0aW9uIFgoZSx0KXtyZXR1cm4gdHlwZW9mIHQ9PVwib2JqZWN0XCImJnQhPT1udWxsP0puKGUsdCk6WW4oZSx0KX1mdW5jdGlvbiBKbihlLHQpe2xldCByPXt9O3JldHVybiBPYmplY3QuZW50cmllcyh0KS5mb3JFYWNoKChbbixpXSk9PntyW25dPWUuc3R5bGVbbl0sbi5zdGFydHNXaXRoKFwiLS1cIil8fChuPVhuKG4pKSxlLnN0eWxlLnNldFByb3BlcnR5KG4saSl9KSxzZXRUaW1lb3V0KCgpPT57ZS5zdHlsZS5sZW5ndGg9PT0wJiZlLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpfSksKCk9PntYKGUscil9fWZ1bmN0aW9uIFluKGUsdCl7bGV0IHI9ZS5nZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLHQpO3JldHVybiBlLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsdCksKCk9PntlLnNldEF0dHJpYnV0ZShcInN0eWxlXCIscnx8XCJcIil9fWZ1bmN0aW9uIFhuKGUpe3JldHVybiBlLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csXCIkMS0kMlwiKS50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIGhlKGUsdD0oKT0+e30pe2xldCByPSExO3JldHVybiBmdW5jdGlvbigpe3I/dC5hcHBseSh0aGlzLGFyZ3VtZW50cyk6KHI9ITAsZS5hcHBseSh0aGlzLGFyZ3VtZW50cykpfX1kKFwidHJhbnNpdGlvblwiLChlLHt2YWx1ZTp0LG1vZGlmaWVyczpyLGV4cHJlc3Npb246bn0se2V2YWx1YXRlOml9KT0+e3R5cGVvZiBuPT1cImZ1bmN0aW9uXCImJihuPWkobikpLG4hPT0hMSYmKCFufHx0eXBlb2Ygbj09XCJib29sZWFuXCI/UW4oZSxyLHQpOlpuKGUsbix0KSl9KTtmdW5jdGlvbiBabihlLHQscil7VHIoZSxtZSxcIlwiKSx7ZW50ZXI6aT0+e2UuX3hfdHJhbnNpdGlvbi5lbnRlci5kdXJpbmc9aX0sXCJlbnRlci1zdGFydFwiOmk9PntlLl94X3RyYW5zaXRpb24uZW50ZXIuc3RhcnQ9aX0sXCJlbnRlci1lbmRcIjppPT57ZS5feF90cmFuc2l0aW9uLmVudGVyLmVuZD1pfSxsZWF2ZTppPT57ZS5feF90cmFuc2l0aW9uLmxlYXZlLmR1cmluZz1pfSxcImxlYXZlLXN0YXJ0XCI6aT0+e2UuX3hfdHJhbnNpdGlvbi5sZWF2ZS5zdGFydD1pfSxcImxlYXZlLWVuZFwiOmk9PntlLl94X3RyYW5zaXRpb24ubGVhdmUuZW5kPWl9fVtyXSh0KX1mdW5jdGlvbiBRbihlLHQscil7VHIoZSxYKTtsZXQgbj0hdC5pbmNsdWRlcyhcImluXCIpJiYhdC5pbmNsdWRlcyhcIm91dFwiKSYmIXIsaT1ufHx0LmluY2x1ZGVzKFwiaW5cIil8fFtcImVudGVyXCJdLmluY2x1ZGVzKHIpLG89bnx8dC5pbmNsdWRlcyhcIm91dFwiKXx8W1wibGVhdmVcIl0uaW5jbHVkZXMocik7dC5pbmNsdWRlcyhcImluXCIpJiYhbiYmKHQ9dC5maWx0ZXIoKGcsYik9PmI8dC5pbmRleE9mKFwib3V0XCIpKSksdC5pbmNsdWRlcyhcIm91dFwiKSYmIW4mJih0PXQuZmlsdGVyKChnLGIpPT5iPnQuaW5kZXhPZihcIm91dFwiKSkpO2xldCBzPSF0LmluY2x1ZGVzKFwib3BhY2l0eVwiKSYmIXQuaW5jbHVkZXMoXCJzY2FsZVwiKSxhPXN8fHQuaW5jbHVkZXMoXCJvcGFjaXR5XCIpLGM9c3x8dC5pbmNsdWRlcyhcInNjYWxlXCIpLGw9YT8wOjEsdT1jP19lKHQsXCJzY2FsZVwiLDk1KS8xMDA6MSxwPV9lKHQsXCJkZWxheVwiLDApLzFlMyxoPV9lKHQsXCJvcmlnaW5cIixcImNlbnRlclwiKSx3PVwib3BhY2l0eSwgdHJhbnNmb3JtXCIsRj1fZSh0LFwiZHVyYXRpb25cIiwxNTApLzFlMyxFZT1fZSh0LFwiZHVyYXRpb25cIiw3NSkvMWUzLGY9XCJjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuMiwgMSlcIjtpJiYoZS5feF90cmFuc2l0aW9uLmVudGVyLmR1cmluZz17dHJhbnNmb3JtT3JpZ2luOmgsdHJhbnNpdGlvbkRlbGF5OmAke3B9c2AsdHJhbnNpdGlvblByb3BlcnR5OncsdHJhbnNpdGlvbkR1cmF0aW9uOmAke0Z9c2AsdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOmZ9LGUuX3hfdHJhbnNpdGlvbi5lbnRlci5zdGFydD17b3BhY2l0eTpsLHRyYW5zZm9ybTpgc2NhbGUoJHt1fSlgfSxlLl94X3RyYW5zaXRpb24uZW50ZXIuZW5kPXtvcGFjaXR5OjEsdHJhbnNmb3JtOlwic2NhbGUoMSlcIn0pLG8mJihlLl94X3RyYW5zaXRpb24ubGVhdmUuZHVyaW5nPXt0cmFuc2Zvcm1PcmlnaW46aCx0cmFuc2l0aW9uRGVsYXk6YCR7cH1zYCx0cmFuc2l0aW9uUHJvcGVydHk6dyx0cmFuc2l0aW9uRHVyYXRpb246YCR7RWV9c2AsdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOmZ9LGUuX3hfdHJhbnNpdGlvbi5sZWF2ZS5zdGFydD17b3BhY2l0eToxLHRyYW5zZm9ybTpcInNjYWxlKDEpXCJ9LGUuX3hfdHJhbnNpdGlvbi5sZWF2ZS5lbmQ9e29wYWNpdHk6bCx0cmFuc2Zvcm06YHNjYWxlKCR7dX0pYH0pfWZ1bmN0aW9uIFRyKGUsdCxyPXt9KXtlLl94X3RyYW5zaXRpb258fChlLl94X3RyYW5zaXRpb249e2VudGVyOntkdXJpbmc6cixzdGFydDpyLGVuZDpyfSxsZWF2ZTp7ZHVyaW5nOnIsc3RhcnQ6cixlbmQ6cn0saW4obj0oKT0+e30saT0oKT0+e30pe0ZlKGUsdCx7ZHVyaW5nOnRoaXMuZW50ZXIuZHVyaW5nLHN0YXJ0OnRoaXMuZW50ZXIuc3RhcnQsZW5kOnRoaXMuZW50ZXIuZW5kfSxuLGkpfSxvdXQobj0oKT0+e30saT0oKT0+e30pe0ZlKGUsdCx7ZHVyaW5nOnRoaXMubGVhdmUuZHVyaW5nLHN0YXJ0OnRoaXMubGVhdmUuc3RhcnQsZW5kOnRoaXMubGVhdmUuZW5kfSxuLGkpfX0pfXdpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5feF90b2dnbGVBbmRDYXNjYWRlV2l0aFRyYW5zaXRpb25zPWZ1bmN0aW9uKGUsdCxyLG4pe2xldCBpPWRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZT09PVwidmlzaWJsZVwiP3JlcXVlc3RBbmltYXRpb25GcmFtZTpzZXRUaW1lb3V0LG89KCk9Pmkocik7aWYodCl7ZS5feF90cmFuc2l0aW9uJiYoZS5feF90cmFuc2l0aW9uLmVudGVyfHxlLl94X3RyYW5zaXRpb24ubGVhdmUpP2UuX3hfdHJhbnNpdGlvbi5lbnRlciYmKE9iamVjdC5lbnRyaWVzKGUuX3hfdHJhbnNpdGlvbi5lbnRlci5kdXJpbmcpLmxlbmd0aHx8T2JqZWN0LmVudHJpZXMoZS5feF90cmFuc2l0aW9uLmVudGVyLnN0YXJ0KS5sZW5ndGh8fE9iamVjdC5lbnRyaWVzKGUuX3hfdHJhbnNpdGlvbi5lbnRlci5lbmQpLmxlbmd0aCk/ZS5feF90cmFuc2l0aW9uLmluKHIpOm8oKTplLl94X3RyYW5zaXRpb24/ZS5feF90cmFuc2l0aW9uLmluKHIpOm8oKTtyZXR1cm59ZS5feF9oaWRlUHJvbWlzZT1lLl94X3RyYW5zaXRpb24/bmV3IFByb21pc2UoKHMsYSk9PntlLl94X3RyYW5zaXRpb24ub3V0KCgpPT57fSwoKT0+cyhuKSksZS5feF90cmFuc2l0aW9uaW5nJiZlLl94X3RyYW5zaXRpb25pbmcuYmVmb3JlQ2FuY2VsKCgpPT5hKHtpc0Zyb21DYW5jZWxsZWRUcmFuc2l0aW9uOiEwfSkpfSk6UHJvbWlzZS5yZXNvbHZlKG4pLHF1ZXVlTWljcm90YXNrKCgpPT57bGV0IHM9UnIoZSk7cz8ocy5feF9oaWRlQ2hpbGRyZW58fChzLl94X2hpZGVDaGlsZHJlbj1bXSkscy5feF9oaWRlQ2hpbGRyZW4ucHVzaChlKSk6aSgoKT0+e2xldCBhPWM9PntsZXQgbD1Qcm9taXNlLmFsbChbYy5feF9oaWRlUHJvbWlzZSwuLi4oYy5feF9oaWRlQ2hpbGRyZW58fFtdKS5tYXAoYSldKS50aGVuKChbdV0pPT51Py4oKSk7cmV0dXJuIGRlbGV0ZSBjLl94X2hpZGVQcm9taXNlLGRlbGV0ZSBjLl94X2hpZGVDaGlsZHJlbixsfTthKGUpLmNhdGNoKGM9PntpZighYy5pc0Zyb21DYW5jZWxsZWRUcmFuc2l0aW9uKXRocm93IGN9KX0pfSl9O2Z1bmN0aW9uIFJyKGUpe2xldCB0PWUucGFyZW50Tm9kZTtpZih0KXJldHVybiB0Ll94X2hpZGVQcm9taXNlP3Q6UnIodCl9ZnVuY3Rpb24gRmUoZSx0LHtkdXJpbmc6cixzdGFydDpuLGVuZDppfT17fSxvPSgpPT57fSxzPSgpPT57fSl7aWYoZS5feF90cmFuc2l0aW9uaW5nJiZlLl94X3RyYW5zaXRpb25pbmcuY2FuY2VsKCksT2JqZWN0LmtleXMocikubGVuZ3RoPT09MCYmT2JqZWN0LmtleXMobikubGVuZ3RoPT09MCYmT2JqZWN0LmtleXMoaSkubGVuZ3RoPT09MCl7bygpLHMoKTtyZXR1cm59bGV0IGEsYyxsO2VpKGUse3N0YXJ0KCl7YT10KGUsbil9LGR1cmluZygpe2M9dChlLHIpfSxiZWZvcmU6byxlbmQoKXthKCksbD10KGUsaSl9LGFmdGVyOnMsY2xlYW51cCgpe2MoKSxsKCl9fSl9ZnVuY3Rpb24gZWkoZSx0KXtsZXQgcixuLGksbz1oZSgoKT0+e20oKCk9PntyPSEwLG58fHQuYmVmb3JlKCksaXx8KHQuZW5kKCksamUoKSksdC5hZnRlcigpLGUuaXNDb25uZWN0ZWQmJnQuY2xlYW51cCgpLGRlbGV0ZSBlLl94X3RyYW5zaXRpb25pbmd9KX0pO2UuX3hfdHJhbnNpdGlvbmluZz17YmVmb3JlQ2FuY2VsczpbXSxiZWZvcmVDYW5jZWwocyl7dGhpcy5iZWZvcmVDYW5jZWxzLnB1c2gocyl9LGNhbmNlbDpoZShmdW5jdGlvbigpe2Zvcig7dGhpcy5iZWZvcmVDYW5jZWxzLmxlbmd0aDspdGhpcy5iZWZvcmVDYW5jZWxzLnNoaWZ0KCkoKTtvKCl9KSxmaW5pc2g6b30sbSgoKT0+e3Quc3RhcnQoKSx0LmR1cmluZygpfSksT3IoKSxyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PntpZihyKXJldHVybjtsZXQgcz1OdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlKS50cmFuc2l0aW9uRHVyYXRpb24ucmVwbGFjZSgvLC4qLyxcIlwiKS5yZXBsYWNlKFwic1wiLFwiXCIpKSoxZTMsYT1OdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlKS50cmFuc2l0aW9uRGVsYXkucmVwbGFjZSgvLC4qLyxcIlwiKS5yZXBsYWNlKFwic1wiLFwiXCIpKSoxZTM7cz09PTAmJihzPU51bWJlcihnZXRDb21wdXRlZFN0eWxlKGUpLmFuaW1hdGlvbkR1cmF0aW9uLnJlcGxhY2UoXCJzXCIsXCJcIikpKjFlMyksbSgoKT0+e3QuYmVmb3JlKCl9KSxuPSEwLHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+e3J8fChtKCgpPT57dC5lbmQoKX0pLGplKCksc2V0VGltZW91dChlLl94X3RyYW5zaXRpb25pbmcuZmluaXNoLHMrYSksaT0hMCl9KX0pfWZ1bmN0aW9uIF9lKGUsdCxyKXtpZihlLmluZGV4T2YodCk9PT0tMSlyZXR1cm4gcjtsZXQgbj1lW2UuaW5kZXhPZih0KSsxXTtpZighbnx8dD09PVwic2NhbGVcIiYmaXNOYU4obikpcmV0dXJuIHI7aWYodD09PVwiZHVyYXRpb25cInx8dD09PVwiZGVsYXlcIil7bGV0IGk9bi5tYXRjaCgvKFswLTldKyltcy8pO2lmKGkpcmV0dXJuIGlbMV19cmV0dXJuIHQ9PT1cIm9yaWdpblwiJiZbXCJ0b3BcIixcInJpZ2h0XCIsXCJsZWZ0XCIsXCJjZW50ZXJcIixcImJvdHRvbVwiXS5pbmNsdWRlcyhlW2UuaW5kZXhPZih0KSsyXSk/W24sZVtlLmluZGV4T2YodCkrMl1dLmpvaW4oXCIgXCIpOm59dmFyIEk9ITE7ZnVuY3Rpb24gQShlLHQ9KCk9Pnt9KXtyZXR1cm4oLi4ucik9Pkk/dCguLi5yKTplKC4uLnIpfWZ1bmN0aW9uIE1yKGUpe3JldHVybiguLi50KT0+SSYmZSguLi50KX12YXIgTnI9W107ZnVuY3Rpb24gSyhlKXtOci5wdXNoKGUpfWZ1bmN0aW9uIGtyKGUsdCl7TnIuZm9yRWFjaChyPT5yKGUsdCkpLEk9ITAsUHIoKCk9PntTKHQsKHIsbik9PntuKHIsKCk9Pnt9KX0pfSksST0hMX12YXIgQmU9ITE7ZnVuY3Rpb24gRHIoZSx0KXt0Ll94X2RhdGFTdGFja3x8KHQuX3hfZGF0YVN0YWNrPWUuX3hfZGF0YVN0YWNrKSxJPSEwLEJlPSEwLFByKCgpPT57dGkodCl9KSxJPSExLEJlPSExfWZ1bmN0aW9uIHRpKGUpe2xldCB0PSExO1MoZSwobixpKT0+e0QobiwobyxzKT0+e2lmKHQmJnZyKG8pKXJldHVybiBzKCk7dD0hMCxpKG8scyl9KX0pfWZ1bmN0aW9uIFByKGUpe2xldCB0PU47Y3QoKHIsbik9PntsZXQgaT10KHIpO3JldHVybiAkKGkpLCgpPT57fX0pLGUoKSxjdCh0KX1mdW5jdGlvbiBnZShlLHQscixuPVtdKXtzd2l0Y2goZS5feF9iaW5kaW5nc3x8KGUuX3hfYmluZGluZ3M9VCh7fSkpLGUuX3hfYmluZGluZ3NbdF09cix0PW4uaW5jbHVkZXMoXCJjYW1lbFwiKT9saSh0KTp0LHQpe2Nhc2VcInZhbHVlXCI6cmkoZSxyKTticmVhaztjYXNlXCJzdHlsZVwiOmlpKGUscik7YnJlYWs7Y2FzZVwiY2xhc3NcIjpuaShlLHIpO2JyZWFrO2Nhc2VcInNlbGVjdGVkXCI6Y2FzZVwiY2hlY2tlZFwiOm9pKGUsdCxyKTticmVhaztkZWZhdWx0OkxyKGUsdCxyKTticmVha319ZnVuY3Rpb24gcmkoZSx0KXtpZihPdChlKSllLmF0dHJpYnV0ZXMudmFsdWU9PT12b2lkIDAmJihlLnZhbHVlPXQpLHdpbmRvdy5mcm9tTW9kZWwmJih0eXBlb2YgdD09XCJib29sZWFuXCI/ZS5jaGVja2VkPXhlKGUudmFsdWUpPT09dDplLmNoZWNrZWQ9SXIoZS52YWx1ZSx0KSk7ZWxzZSBpZih6ZShlKSlOdW1iZXIuaXNJbnRlZ2VyKHQpP2UudmFsdWU9dDohQXJyYXkuaXNBcnJheSh0KSYmdHlwZW9mIHQhPVwiYm9vbGVhblwiJiYhW251bGwsdm9pZCAwXS5pbmNsdWRlcyh0KT9lLnZhbHVlPVN0cmluZyh0KTpBcnJheS5pc0FycmF5KHQpP2UuY2hlY2tlZD10LnNvbWUocj0+SXIocixlLnZhbHVlKSk6ZS5jaGVja2VkPSEhdDtlbHNlIGlmKGUudGFnTmFtZT09PVwiU0VMRUNUXCIpY2koZSx0KTtlbHNle2lmKGUudmFsdWU9PT10KXJldHVybjtlLnZhbHVlPXQ9PT12b2lkIDA/XCJcIjp0fX1mdW5jdGlvbiBuaShlLHQpe2UuX3hfdW5kb0FkZGVkQ2xhc3NlcyYmZS5feF91bmRvQWRkZWRDbGFzc2VzKCksZS5feF91bmRvQWRkZWRDbGFzc2VzPW1lKGUsdCl9ZnVuY3Rpb24gaWkoZSx0KXtlLl94X3VuZG9BZGRlZFN0eWxlcyYmZS5feF91bmRvQWRkZWRTdHlsZXMoKSxlLl94X3VuZG9BZGRlZFN0eWxlcz1YKGUsdCl9ZnVuY3Rpb24gb2koZSx0LHIpe0xyKGUsdCxyKSxhaShlLHQscil9ZnVuY3Rpb24gTHIoZSx0LHIpe1tudWxsLHZvaWQgMCwhMV0uaW5jbHVkZXMocikmJmZpKHQpP2UucmVtb3ZlQXR0cmlidXRlKHQpOigkcih0KSYmKHI9dCksc2koZSx0LHIpKX1mdW5jdGlvbiBzaShlLHQscil7ZS5nZXRBdHRyaWJ1dGUodCkhPXImJmUuc2V0QXR0cmlidXRlKHQscil9ZnVuY3Rpb24gYWkoZSx0LHIpe2VbdF0hPT1yJiYoZVt0XT1yKX1mdW5jdGlvbiBjaShlLHQpe2xldCByPVtdLmNvbmNhdCh0KS5tYXAobj0+bitcIlwiKTtBcnJheS5mcm9tKGUub3B0aW9ucykuZm9yRWFjaChuPT57bi5zZWxlY3RlZD1yLmluY2x1ZGVzKG4udmFsdWUpfSl9ZnVuY3Rpb24gbGkoZSl7cmV0dXJuIGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tKFxcdykvZywodCxyKT0+ci50b1VwcGVyQ2FzZSgpKX1mdW5jdGlvbiBJcihlLHQpe3JldHVybiBlPT10fWZ1bmN0aW9uIHhlKGUpe3JldHVyblsxLFwiMVwiLFwidHJ1ZVwiLFwib25cIixcInllc1wiLCEwXS5pbmNsdWRlcyhlKT8hMDpbMCxcIjBcIixcImZhbHNlXCIsXCJvZmZcIixcIm5vXCIsITFdLmluY2x1ZGVzKGUpPyExOmU/Qm9vbGVhbihlKTpudWxsfXZhciB1aT1uZXcgU2V0KFtcImFsbG93ZnVsbHNjcmVlblwiLFwiYXN5bmNcIixcImF1dG9mb2N1c1wiLFwiYXV0b3BsYXlcIixcImNoZWNrZWRcIixcImNvbnRyb2xzXCIsXCJkZWZhdWx0XCIsXCJkZWZlclwiLFwiZGlzYWJsZWRcIixcImZvcm1ub3ZhbGlkYXRlXCIsXCJpbmVydFwiLFwiaXNtYXBcIixcIml0ZW1zY29wZVwiLFwibG9vcFwiLFwibXVsdGlwbGVcIixcIm11dGVkXCIsXCJub21vZHVsZVwiLFwibm92YWxpZGF0ZVwiLFwib3BlblwiLFwicGxheXNpbmxpbmVcIixcInJlYWRvbmx5XCIsXCJyZXF1aXJlZFwiLFwicmV2ZXJzZWRcIixcInNlbGVjdGVkXCIsXCJzaGFkb3dyb290Y2xvbmFibGVcIixcInNoYWRvd3Jvb3RkZWxlZ2F0ZXNmb2N1c1wiLFwic2hhZG93cm9vdHNlcmlhbGl6YWJsZVwiXSk7ZnVuY3Rpb24gJHIoZSl7cmV0dXJuIHVpLmhhcyhlKX1mdW5jdGlvbiBmaShlKXtyZXR1cm4hW1wiYXJpYS1wcmVzc2VkXCIsXCJhcmlhLWNoZWNrZWRcIixcImFyaWEtZXhwYW5kZWRcIixcImFyaWEtc2VsZWN0ZWRcIl0uaW5jbHVkZXMoZSl9ZnVuY3Rpb24ganIoZSx0LHIpe3JldHVybiBlLl94X2JpbmRpbmdzJiZlLl94X2JpbmRpbmdzW3RdIT09dm9pZCAwP2UuX3hfYmluZGluZ3NbdF06QnIoZSx0LHIpfWZ1bmN0aW9uIEZyKGUsdCxyLG49ITApe2lmKGUuX3hfYmluZGluZ3MmJmUuX3hfYmluZGluZ3NbdF0hPT12b2lkIDApcmV0dXJuIGUuX3hfYmluZGluZ3NbdF07aWYoZS5feF9pbmxpbmVCaW5kaW5ncyYmZS5feF9pbmxpbmVCaW5kaW5nc1t0XSE9PXZvaWQgMCl7bGV0IGk9ZS5feF9pbmxpbmVCaW5kaW5nc1t0XTtyZXR1cm4gaS5leHRyYWN0PW4sa2UoKCk9PlIoZSxpLmV4cHJlc3Npb24pKX1yZXR1cm4gQnIoZSx0LHIpfWZ1bmN0aW9uIEJyKGUsdCxyKXtsZXQgbj1lLmdldEF0dHJpYnV0ZSh0KTtyZXR1cm4gbj09PW51bGw/dHlwZW9mIHI9PVwiZnVuY3Rpb25cIj9yKCk6cjpuPT09XCJcIj8hMDokcih0KT8hIVt0LFwidHJ1ZVwiXS5pbmNsdWRlcyhuKTpufWZ1bmN0aW9uIHplKGUpe3JldHVybiBlLnR5cGU9PT1cImNoZWNrYm94XCJ8fGUubG9jYWxOYW1lPT09XCJ1aS1jaGVja2JveFwifHxlLmxvY2FsTmFtZT09PVwidWktc3dpdGNoXCJ9ZnVuY3Rpb24gT3QoZSl7cmV0dXJuIGUudHlwZT09PVwicmFkaW9cInx8ZS5sb2NhbE5hbWU9PT1cInVpLXJhZGlvXCJ9ZnVuY3Rpb24gSGUoZSx0KXtsZXQgcjtyZXR1cm4gZnVuY3Rpb24oKXtsZXQgbj10aGlzLGk9YXJndW1lbnRzLG89ZnVuY3Rpb24oKXtyPW51bGwsZS5hcHBseShuLGkpfTtjbGVhclRpbWVvdXQocikscj1zZXRUaW1lb3V0KG8sdCl9fWZ1bmN0aW9uIEtlKGUsdCl7bGV0IHI7cmV0dXJuIGZ1bmN0aW9uKCl7bGV0IG49dGhpcyxpPWFyZ3VtZW50cztyfHwoZS5hcHBseShuLGkpLHI9ITAsc2V0VGltZW91dCgoKT0+cj0hMSx0KSl9fWZ1bmN0aW9uIFZlKHtnZXQ6ZSxzZXQ6dH0se2dldDpyLHNldDpufSl7bGV0IGk9ITAsbyxzLGE9TigoKT0+e2xldCBjPWUoKSxsPXIoKTtpZihpKW4oQ3QoYykpLGk9ITE7ZWxzZXtsZXQgdT1KU09OLnN0cmluZ2lmeShjKSxwPUpTT04uc3RyaW5naWZ5KGwpO3UhPT1vP24oQ3QoYykpOnUhPT1wJiZ0KEN0KGwpKX1vPUpTT04uc3RyaW5naWZ5KGUoKSkscz1KU09OLnN0cmluZ2lmeShyKCkpfSk7cmV0dXJuKCk9PnskKGEpfX1mdW5jdGlvbiBDdChlKXtyZXR1cm4gdHlwZW9mIGU9PVwib2JqZWN0XCI/SlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlKSk6ZX1mdW5jdGlvbiB6cihlKXsoQXJyYXkuaXNBcnJheShlKT9lOltlXSkuZm9yRWFjaChyPT5yKEgpKX12YXIgWj17fSxIcj0hMTtmdW5jdGlvbiBLcihlLHQpe2lmKEhyfHwoWj1UKFopLEhyPSEwKSx0PT09dm9pZCAwKXJldHVybiBaW2VdO1pbZV09dCxUZShaW2VdKSx0eXBlb2YgdD09XCJvYmplY3RcIiYmdCE9PW51bGwmJnQuaGFzT3duUHJvcGVydHkoXCJpbml0XCIpJiZ0eXBlb2YgdC5pbml0PT1cImZ1bmN0aW9uXCImJlpbZV0uaW5pdCgpfWZ1bmN0aW9uIFZyKCl7cmV0dXJuIFp9dmFyIHFyPXt9O2Z1bmN0aW9uIFVyKGUsdCl7bGV0IHI9dHlwZW9mIHQhPVwiZnVuY3Rpb25cIj8oKT0+dDp0O3JldHVybiBlIGluc3RhbmNlb2YgRWxlbWVudD9UdChlLHIoKSk6KHFyW2VdPXIsKCk9Pnt9KX1mdW5jdGlvbiBXcihlKXtyZXR1cm4gT2JqZWN0LmVudHJpZXMocXIpLmZvckVhY2goKFt0LHJdKT0+e09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLHQse2dldCgpe3JldHVybiguLi5uKT0+ciguLi5uKX19KX0pLGV9ZnVuY3Rpb24gVHQoZSx0LHIpe2xldCBuPVtdO2Zvcig7bi5sZW5ndGg7KW4ucG9wKCkoKTtsZXQgaT1PYmplY3QuZW50cmllcyh0KS5tYXAoKFtzLGFdKT0+KHtuYW1lOnMsdmFsdWU6YX0pKSxvPUV0KGkpO3JldHVybiBpPWkubWFwKHM9Pm8uZmluZChhPT5hLm5hbWU9PT1zLm5hbWUpP3tuYW1lOmB4LWJpbmQ6JHtzLm5hbWV9YCx2YWx1ZTpgXCIke3MudmFsdWV9XCJgfTpzKSxwZShlLGkscikubWFwKHM9PntuLnB1c2gocy5ydW5DbGVhbnVwcykscygpfSksKCk9Pntmb3IoO24ubGVuZ3RoOyluLnBvcCgpKCl9fXZhciBHcj17fTtmdW5jdGlvbiBKcihlLHQpe0dyW2VdPXR9ZnVuY3Rpb24gWXIoZSx0KXtyZXR1cm4gT2JqZWN0LmVudHJpZXMoR3IpLmZvckVhY2goKFtyLG5dKT0+e09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLHIse2dldCgpe3JldHVybiguLi5pKT0+bi5iaW5kKHQpKC4uLmkpfSxlbnVtZXJhYmxlOiExfSl9KSxlfXZhciBkaT17Z2V0IHJlYWN0aXZlKCl7cmV0dXJuIFR9LGdldCByZWxlYXNlKCl7cmV0dXJuICR9LGdldCBlZmZlY3QoKXtyZXR1cm4gTn0sZ2V0IHJhdygpe3JldHVybiBhdH0sdmVyc2lvbjpcIjMuMTUuMlwiLGZsdXNoQW5kU3RvcERlZmVycmluZ011dGF0aW9uczpucixkb250QXV0b0V2YWx1YXRlRnVuY3Rpb25zOmtlLGRpc2FibGVFZmZlY3RTY2hlZHVsaW5nOkd0LHN0YXJ0T2JzZXJ2aW5nTXV0YXRpb25zOnVlLHN0b3BPYnNlcnZpbmdNdXRhdGlvbnM6ZHQsc2V0UmVhY3Rpdml0eUVuZ2luZTpKdCxvbkF0dHJpYnV0ZVJlbW92ZWQ6T2Usb25BdHRyaWJ1dGVzQWRkZWQ6QWUsY2xvc2VzdERhdGFTdGFjazpCLHNraXBEdXJpbmdDbG9uZTpBLG9ubHlEdXJpbmdDbG9uZTpNcixhZGRSb290U2VsZWN0b3I6TGUsYWRkSW5pdFNlbGVjdG9yOiRlLHNldEVycm9ySGFuZGxlcjphcixpbnRlcmNlcHRDbG9uZTpLLGFkZFNjb3BlVG9Ob2RlOmssZGVmZXJNdXRhdGlvbnM6cnIsbWFwQXR0cmlidXRlczpuZSxldmFsdWF0ZUxhdGVyOngsaW50ZXJjZXB0SW5pdDpBcixzZXRFdmFsdWF0b3I6bHIsbWVyZ2VQcm94aWVzOnosZXh0cmFjdFByb3A6RnIsZmluZENsb3Nlc3Q6aixvbkVsUmVtb3ZlZDp0ZSxjbG9zZXN0Um9vdDpZLGRlc3Ryb3lUcmVlOlAsaW50ZXJjZXB0b3I6UmUsdHJhbnNpdGlvbjpGZSxzZXRTdHlsZXM6WCxtdXRhdGVEb206bSxkaXJlY3RpdmU6ZCxlbnRhbmdsZTpWZSx0aHJvdHRsZTpLZSxkZWJvdW5jZTpIZSxldmFsdWF0ZTpSLGluaXRUcmVlOlMsbmV4dFRpY2s6aWUscHJlZml4ZWQ6QyxwcmVmaXg6dXIscGx1Z2luOnpyLG1hZ2ljOnksc3RvcmU6S3Isc3RhcnQ6eXIsY2xvbmU6RHIsY2xvbmVOb2RlOmtyLGJvdW5kOmpyLCRkYXRhOkNlLHdhdGNoOnZlLHdhbGs6RCxkYXRhOkpyLGJpbmQ6VXJ9LEg9ZGk7ZnVuY3Rpb24gUnQoZSx0KXtsZXQgcj1PYmplY3QuY3JlYXRlKG51bGwpLG49ZS5zcGxpdChcIixcIik7Zm9yKGxldCBpPTA7aTxuLmxlbmd0aDtpKyspcltuW2ldXT0hMDtyZXR1cm4gdD9pPT4hIXJbaS50b0xvd2VyQ2FzZSgpXTppPT4hIXJbaV19dmFyIHBpPVwiaXRlbXNjb3BlLGFsbG93ZnVsbHNjcmVlbixmb3Jtbm92YWxpZGF0ZSxpc21hcCxub21vZHVsZSxub3ZhbGlkYXRlLHJlYWRvbmx5XCI7dmFyIEJzPVJ0KHBpK1wiLGFzeW5jLGF1dG9mb2N1cyxhdXRvcGxheSxjb250cm9scyxkZWZhdWx0LGRlZmVyLGRpc2FibGVkLGhpZGRlbixsb29wLG9wZW4scmVxdWlyZWQscmV2ZXJzZWQsc2NvcGVkLHNlYW1sZXNzLGNoZWNrZWQsbXV0ZWQsbXVsdGlwbGUsc2VsZWN0ZWRcIik7dmFyIFhyPU9iamVjdC5mcmVlemUoe30pLHpzPU9iamVjdC5mcmVlemUoW10pO3ZhciBtaT1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LHllPShlLHQpPT5taS5jYWxsKGUsdCksVj1BcnJheS5pc0FycmF5LG9lPWU9PlpyKGUpPT09XCJbb2JqZWN0IE1hcF1cIjt2YXIgaGk9ZT0+dHlwZW9mIGU9PVwic3RyaW5nXCIscWU9ZT0+dHlwZW9mIGU9PVwic3ltYm9sXCIsYmU9ZT0+ZSE9PW51bGwmJnR5cGVvZiBlPT1cIm9iamVjdFwiO3ZhciBfaT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFpyPWU9Pl9pLmNhbGwoZSksTXQ9ZT0+WnIoZSkuc2xpY2UoOCwtMSk7dmFyIFVlPWU9PmhpKGUpJiZlIT09XCJOYU5cIiYmZVswXSE9PVwiLVwiJiZcIlwiK3BhcnNlSW50KGUsMTApPT09ZTt2YXIgV2U9ZT0+e2xldCB0PU9iamVjdC5jcmVhdGUobnVsbCk7cmV0dXJuIHI9PnRbcl18fCh0W3JdPWUocikpfSxnaT0vLShcXHcpL2csSHM9V2UoZT0+ZS5yZXBsYWNlKGdpLCh0LHIpPT5yP3IudG9VcHBlckNhc2UoKTpcIlwiKSkseGk9L1xcQihbQS1aXSkvZyxLcz1XZShlPT5lLnJlcGxhY2UoeGksXCItJDFcIikudG9Mb3dlckNhc2UoKSksTnQ9V2UoZT0+ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKStlLnNsaWNlKDEpKSxWcz1XZShlPT5lP2BvbiR7TnQoZSl9YDpcIlwiKSxrdD0oZSx0KT0+ZSE9PXQmJihlPT09ZXx8dD09PXQpO3ZhciBEdD1uZXcgV2Vha01hcCx3ZT1bXSxMLFE9U3ltYm9sKFwiaXRlcmF0ZVwiKSxQdD1TeW1ib2woXCJNYXAga2V5IGl0ZXJhdGVcIik7ZnVuY3Rpb24geWkoZSl7cmV0dXJuIGUmJmUuX2lzRWZmZWN0PT09ITB9ZnVuY3Rpb24gb24oZSx0PVhyKXt5aShlKSYmKGU9ZS5yYXcpO2xldCByPXdpKGUsdCk7cmV0dXJuIHQubGF6eXx8cigpLHJ9ZnVuY3Rpb24gc24oZSl7ZS5hY3RpdmUmJihhbihlKSxlLm9wdGlvbnMub25TdG9wJiZlLm9wdGlvbnMub25TdG9wKCksZS5hY3RpdmU9ITEpfXZhciBiaT0wO2Z1bmN0aW9uIHdpKGUsdCl7bGV0IHI9ZnVuY3Rpb24oKXtpZighci5hY3RpdmUpcmV0dXJuIGUoKTtpZighd2UuaW5jbHVkZXMocikpe2FuKHIpO3RyeXtyZXR1cm4gdmkoKSx3ZS5wdXNoKHIpLEw9cixlKCl9ZmluYWxseXt3ZS5wb3AoKSxjbigpLEw9d2Vbd2UubGVuZ3RoLTFdfX19O3JldHVybiByLmlkPWJpKyssci5hbGxvd1JlY3Vyc2U9ISF0LmFsbG93UmVjdXJzZSxyLl9pc0VmZmVjdD0hMCxyLmFjdGl2ZT0hMCxyLnJhdz1lLHIuZGVwcz1bXSxyLm9wdGlvbnM9dCxyfWZ1bmN0aW9uIGFuKGUpe2xldHtkZXBzOnR9PWU7aWYodC5sZW5ndGgpe2ZvcihsZXQgcj0wO3I8dC5sZW5ndGg7cisrKXRbcl0uZGVsZXRlKGUpO3QubGVuZ3RoPTB9fXZhciBzZT0hMCxMdD1bXTtmdW5jdGlvbiBFaSgpe0x0LnB1c2goc2UpLHNlPSExfWZ1bmN0aW9uIHZpKCl7THQucHVzaChzZSksc2U9ITB9ZnVuY3Rpb24gY24oKXtsZXQgZT1MdC5wb3AoKTtzZT1lPT09dm9pZCAwPyEwOmV9ZnVuY3Rpb24gTShlLHQscil7aWYoIXNlfHxMPT09dm9pZCAwKXJldHVybjtsZXQgbj1EdC5nZXQoZSk7bnx8RHQuc2V0KGUsbj1uZXcgTWFwKTtsZXQgaT1uLmdldChyKTtpfHxuLnNldChyLGk9bmV3IFNldCksaS5oYXMoTCl8fChpLmFkZChMKSxMLmRlcHMucHVzaChpKSxMLm9wdGlvbnMub25UcmFjayYmTC5vcHRpb25zLm9uVHJhY2soe2VmZmVjdDpMLHRhcmdldDplLHR5cGU6dCxrZXk6cn0pKX1mdW5jdGlvbiBVKGUsdCxyLG4saSxvKXtsZXQgcz1EdC5nZXQoZSk7aWYoIXMpcmV0dXJuO2xldCBhPW5ldyBTZXQsYz11PT57dSYmdS5mb3JFYWNoKHA9PnsocCE9PUx8fHAuYWxsb3dSZWN1cnNlKSYmYS5hZGQocCl9KX07aWYodD09PVwiY2xlYXJcIilzLmZvckVhY2goYyk7ZWxzZSBpZihyPT09XCJsZW5ndGhcIiYmVihlKSlzLmZvckVhY2goKHUscCk9PnsocD09PVwibGVuZ3RoXCJ8fHA+PW4pJiZjKHUpfSk7ZWxzZSBzd2l0Y2gociE9PXZvaWQgMCYmYyhzLmdldChyKSksdCl7Y2FzZVwiYWRkXCI6VihlKT9VZShyKSYmYyhzLmdldChcImxlbmd0aFwiKSk6KGMocy5nZXQoUSkpLG9lKGUpJiZjKHMuZ2V0KFB0KSkpO2JyZWFrO2Nhc2VcImRlbGV0ZVwiOlYoZSl8fChjKHMuZ2V0KFEpKSxvZShlKSYmYyhzLmdldChQdCkpKTticmVhaztjYXNlXCJzZXRcIjpvZShlKSYmYyhzLmdldChRKSk7YnJlYWt9bGV0IGw9dT0+e3Uub3B0aW9ucy5vblRyaWdnZXImJnUub3B0aW9ucy5vblRyaWdnZXIoe2VmZmVjdDp1LHRhcmdldDplLGtleTpyLHR5cGU6dCxuZXdWYWx1ZTpuLG9sZFZhbHVlOmksb2xkVGFyZ2V0Om99KSx1Lm9wdGlvbnMuc2NoZWR1bGVyP3Uub3B0aW9ucy5zY2hlZHVsZXIodSk6dSgpfTthLmZvckVhY2gobCl9dmFyIFNpPVJ0KFwiX19wcm90b19fLF9fdl9pc1JlZixfX2lzVnVlXCIpLGxuPW5ldyBTZXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoU3ltYm9sKS5tYXAoZT0+U3ltYm9sW2VdKS5maWx0ZXIocWUpKSxBaT11bigpO3ZhciBPaT11bighMCk7dmFyIFFyPUNpKCk7ZnVuY3Rpb24gQ2koKXtsZXQgZT17fTtyZXR1cm5bXCJpbmNsdWRlc1wiLFwiaW5kZXhPZlwiLFwibGFzdEluZGV4T2ZcIl0uZm9yRWFjaCh0PT57ZVt0XT1mdW5jdGlvbiguLi5yKXtsZXQgbj1fKHRoaXMpO2ZvcihsZXQgbz0wLHM9dGhpcy5sZW5ndGg7bzxzO28rKylNKG4sXCJnZXRcIixvK1wiXCIpO2xldCBpPW5bdF0oLi4ucik7cmV0dXJuIGk9PT0tMXx8aT09PSExP25bdF0oLi4uci5tYXAoXykpOml9fSksW1wicHVzaFwiLFwicG9wXCIsXCJzaGlmdFwiLFwidW5zaGlmdFwiLFwic3BsaWNlXCJdLmZvckVhY2godD0+e2VbdF09ZnVuY3Rpb24oLi4ucil7RWkoKTtsZXQgbj1fKHRoaXMpW3RdLmFwcGx5KHRoaXMscik7cmV0dXJuIGNuKCksbn19KSxlfWZ1bmN0aW9uIHVuKGU9ITEsdD0hMSl7cmV0dXJuIGZ1bmN0aW9uKG4saSxvKXtpZihpPT09XCJfX3ZfaXNSZWFjdGl2ZVwiKXJldHVybiFlO2lmKGk9PT1cIl9fdl9pc1JlYWRvbmx5XCIpcmV0dXJuIGU7aWYoaT09PVwiX192X3Jhd1wiJiZvPT09KGU/dD9LaTptbjp0P0hpOnBuKS5nZXQobikpcmV0dXJuIG47bGV0IHM9VihuKTtpZighZSYmcyYmeWUoUXIsaSkpcmV0dXJuIFJlZmxlY3QuZ2V0KFFyLGksbyk7bGV0IGE9UmVmbGVjdC5nZXQobixpLG8pO3JldHVybihxZShpKT9sbi5oYXMoaSk6U2koaSkpfHwoZXx8TShuLFwiZ2V0XCIsaSksdCk/YTpJdChhKT8hc3x8IVVlKGkpP2EudmFsdWU6YTpiZShhKT9lP2huKGEpOmV0KGEpOmF9fXZhciBUaT1SaSgpO2Z1bmN0aW9uIFJpKGU9ITEpe3JldHVybiBmdW5jdGlvbihyLG4saSxvKXtsZXQgcz1yW25dO2lmKCFlJiYoaT1fKGkpLHM9XyhzKSwhVihyKSYmSXQocykmJiFJdChpKSkpcmV0dXJuIHMudmFsdWU9aSwhMDtsZXQgYT1WKHIpJiZVZShuKT9OdW1iZXIobik8ci5sZW5ndGg6eWUocixuKSxjPVJlZmxlY3Quc2V0KHIsbixpLG8pO3JldHVybiByPT09XyhvKSYmKGE/a3QoaSxzKSYmVShyLFwic2V0XCIsbixpLHMpOlUocixcImFkZFwiLG4saSkpLGN9fWZ1bmN0aW9uIE1pKGUsdCl7bGV0IHI9eWUoZSx0KSxuPWVbdF0saT1SZWZsZWN0LmRlbGV0ZVByb3BlcnR5KGUsdCk7cmV0dXJuIGkmJnImJlUoZSxcImRlbGV0ZVwiLHQsdm9pZCAwLG4pLGl9ZnVuY3Rpb24gTmkoZSx0KXtsZXQgcj1SZWZsZWN0LmhhcyhlLHQpO3JldHVybighcWUodCl8fCFsbi5oYXModCkpJiZNKGUsXCJoYXNcIix0KSxyfWZ1bmN0aW9uIGtpKGUpe3JldHVybiBNKGUsXCJpdGVyYXRlXCIsVihlKT9cImxlbmd0aFwiOlEpLFJlZmxlY3Qub3duS2V5cyhlKX12YXIgRGk9e2dldDpBaSxzZXQ6VGksZGVsZXRlUHJvcGVydHk6TWksaGFzOk5pLG93bktleXM6a2l9LFBpPXtnZXQ6T2ksc2V0KGUsdCl7cmV0dXJuIGNvbnNvbGUud2FybihgU2V0IG9wZXJhdGlvbiBvbiBrZXkgXCIke1N0cmluZyh0KX1cIiBmYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLGUpLCEwfSxkZWxldGVQcm9wZXJ0eShlLHQpe3JldHVybiBjb25zb2xlLndhcm4oYERlbGV0ZSBvcGVyYXRpb24gb24ga2V5IFwiJHtTdHJpbmcodCl9XCIgZmFpbGVkOiB0YXJnZXQgaXMgcmVhZG9ubHkuYCxlKSwhMH19O3ZhciAkdD1lPT5iZShlKT9ldChlKTplLGp0PWU9PmJlKGUpP2huKGUpOmUsRnQ9ZT0+ZSxRZT1lPT5SZWZsZWN0LmdldFByb3RvdHlwZU9mKGUpO2Z1bmN0aW9uIEdlKGUsdCxyPSExLG49ITEpe2U9ZS5fX3ZfcmF3O2xldCBpPV8oZSksbz1fKHQpO3QhPT1vJiYhciYmTShpLFwiZ2V0XCIsdCksIXImJk0oaSxcImdldFwiLG8pO2xldHtoYXM6c309UWUoaSksYT1uP0Z0OnI/anQ6JHQ7aWYocy5jYWxsKGksdCkpcmV0dXJuIGEoZS5nZXQodCkpO2lmKHMuY2FsbChpLG8pKXJldHVybiBhKGUuZ2V0KG8pKTtlIT09aSYmZS5nZXQodCl9ZnVuY3Rpb24gSmUoZSx0PSExKXtsZXQgcj10aGlzLl9fdl9yYXcsbj1fKHIpLGk9XyhlKTtyZXR1cm4gZSE9PWkmJiF0JiZNKG4sXCJoYXNcIixlKSwhdCYmTShuLFwiaGFzXCIsaSksZT09PWk/ci5oYXMoZSk6ci5oYXMoZSl8fHIuaGFzKGkpfWZ1bmN0aW9uIFllKGUsdD0hMSl7cmV0dXJuIGU9ZS5fX3ZfcmF3LCF0JiZNKF8oZSksXCJpdGVyYXRlXCIsUSksUmVmbGVjdC5nZXQoZSxcInNpemVcIixlKX1mdW5jdGlvbiBlbihlKXtlPV8oZSk7bGV0IHQ9Xyh0aGlzKTtyZXR1cm4gUWUodCkuaGFzLmNhbGwodCxlKXx8KHQuYWRkKGUpLFUodCxcImFkZFwiLGUsZSkpLHRoaXN9ZnVuY3Rpb24gdG4oZSx0KXt0PV8odCk7bGV0IHI9Xyh0aGlzKSx7aGFzOm4sZ2V0Oml9PVFlKHIpLG89bi5jYWxsKHIsZSk7bz9kbihyLG4sZSk6KGU9XyhlKSxvPW4uY2FsbChyLGUpKTtsZXQgcz1pLmNhbGwocixlKTtyZXR1cm4gci5zZXQoZSx0KSxvP2t0KHQscykmJlUocixcInNldFwiLGUsdCxzKTpVKHIsXCJhZGRcIixlLHQpLHRoaXN9ZnVuY3Rpb24gcm4oZSl7bGV0IHQ9Xyh0aGlzKSx7aGFzOnIsZ2V0Om59PVFlKHQpLGk9ci5jYWxsKHQsZSk7aT9kbih0LHIsZSk6KGU9XyhlKSxpPXIuY2FsbCh0LGUpKTtsZXQgbz1uP24uY2FsbCh0LGUpOnZvaWQgMCxzPXQuZGVsZXRlKGUpO3JldHVybiBpJiZVKHQsXCJkZWxldGVcIixlLHZvaWQgMCxvKSxzfWZ1bmN0aW9uIG5uKCl7bGV0IGU9Xyh0aGlzKSx0PWUuc2l6ZSE9PTAscj1vZShlKT9uZXcgTWFwKGUpOm5ldyBTZXQoZSksbj1lLmNsZWFyKCk7cmV0dXJuIHQmJlUoZSxcImNsZWFyXCIsdm9pZCAwLHZvaWQgMCxyKSxufWZ1bmN0aW9uIFhlKGUsdCl7cmV0dXJuIGZ1bmN0aW9uKG4saSl7bGV0IG89dGhpcyxzPW8uX192X3JhdyxhPV8ocyksYz10P0Z0OmU/anQ6JHQ7cmV0dXJuIWUmJk0oYSxcIml0ZXJhdGVcIixRKSxzLmZvckVhY2goKGwsdSk9Pm4uY2FsbChpLGMobCksYyh1KSxvKSl9fWZ1bmN0aW9uIFplKGUsdCxyKXtyZXR1cm4gZnVuY3Rpb24oLi4ubil7bGV0IGk9dGhpcy5fX3ZfcmF3LG89XyhpKSxzPW9lKG8pLGE9ZT09PVwiZW50cmllc1wifHxlPT09U3ltYm9sLml0ZXJhdG9yJiZzLGM9ZT09PVwia2V5c1wiJiZzLGw9aVtlXSguLi5uKSx1PXI/RnQ6dD9qdDokdDtyZXR1cm4hdCYmTShvLFwiaXRlcmF0ZVwiLGM/UHQ6USkse25leHQoKXtsZXR7dmFsdWU6cCxkb25lOmh9PWwubmV4dCgpO3JldHVybiBoP3t2YWx1ZTpwLGRvbmU6aH06e3ZhbHVlOmE/W3UocFswXSksdShwWzFdKV06dShwKSxkb25lOmh9fSxbU3ltYm9sLml0ZXJhdG9yXSgpe3JldHVybiB0aGlzfX19fWZ1bmN0aW9uIHEoZSl7cmV0dXJuIGZ1bmN0aW9uKC4uLnQpe3tsZXQgcj10WzBdP2BvbiBrZXkgXCIke3RbMF19XCIgYDpcIlwiO2NvbnNvbGUud2FybihgJHtOdChlKX0gb3BlcmF0aW9uICR7cn1mYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLF8odGhpcykpfXJldHVybiBlPT09XCJkZWxldGVcIj8hMTp0aGlzfX1mdW5jdGlvbiBJaSgpe2xldCBlPXtnZXQobyl7cmV0dXJuIEdlKHRoaXMsbyl9LGdldCBzaXplKCl7cmV0dXJuIFllKHRoaXMpfSxoYXM6SmUsYWRkOmVuLHNldDp0bixkZWxldGU6cm4sY2xlYXI6bm4sZm9yRWFjaDpYZSghMSwhMSl9LHQ9e2dldChvKXtyZXR1cm4gR2UodGhpcyxvLCExLCEwKX0sZ2V0IHNpemUoKXtyZXR1cm4gWWUodGhpcyl9LGhhczpKZSxhZGQ6ZW4sc2V0OnRuLGRlbGV0ZTpybixjbGVhcjpubixmb3JFYWNoOlhlKCExLCEwKX0scj17Z2V0KG8pe3JldHVybiBHZSh0aGlzLG8sITApfSxnZXQgc2l6ZSgpe3JldHVybiBZZSh0aGlzLCEwKX0saGFzKG8pe3JldHVybiBKZS5jYWxsKHRoaXMsbywhMCl9LGFkZDpxKFwiYWRkXCIpLHNldDpxKFwic2V0XCIpLGRlbGV0ZTpxKFwiZGVsZXRlXCIpLGNsZWFyOnEoXCJjbGVhclwiKSxmb3JFYWNoOlhlKCEwLCExKX0sbj17Z2V0KG8pe3JldHVybiBHZSh0aGlzLG8sITAsITApfSxnZXQgc2l6ZSgpe3JldHVybiBZZSh0aGlzLCEwKX0saGFzKG8pe3JldHVybiBKZS5jYWxsKHRoaXMsbywhMCl9LGFkZDpxKFwiYWRkXCIpLHNldDpxKFwic2V0XCIpLGRlbGV0ZTpxKFwiZGVsZXRlXCIpLGNsZWFyOnEoXCJjbGVhclwiKSxmb3JFYWNoOlhlKCEwLCEwKX07cmV0dXJuW1wia2V5c1wiLFwidmFsdWVzXCIsXCJlbnRyaWVzXCIsU3ltYm9sLml0ZXJhdG9yXS5mb3JFYWNoKG89PntlW29dPVplKG8sITEsITEpLHJbb109WmUobywhMCwhMSksdFtvXT1aZShvLCExLCEwKSxuW29dPVplKG8sITAsITApfSksW2Uscix0LG5dfXZhcltMaSwkaSxqaSxGaV09SWkoKTtmdW5jdGlvbiBmbihlLHQpe2xldCByPXQ/ZT9GaTpqaTplPyRpOkxpO3JldHVybihuLGksbyk9Pmk9PT1cIl9fdl9pc1JlYWN0aXZlXCI/IWU6aT09PVwiX192X2lzUmVhZG9ubHlcIj9lOmk9PT1cIl9fdl9yYXdcIj9uOlJlZmxlY3QuZ2V0KHllKHIsaSkmJmkgaW4gbj9yOm4saSxvKX12YXIgQmk9e2dldDpmbighMSwhMSl9O3ZhciB6aT17Z2V0OmZuKCEwLCExKX07ZnVuY3Rpb24gZG4oZSx0LHIpe2xldCBuPV8ocik7aWYobiE9PXImJnQuY2FsbChlLG4pKXtsZXQgaT1NdChlKTtjb25zb2xlLndhcm4oYFJlYWN0aXZlICR7aX0gY29udGFpbnMgYm90aCB0aGUgcmF3IGFuZCByZWFjdGl2ZSB2ZXJzaW9ucyBvZiB0aGUgc2FtZSBvYmplY3Qke2k9PT1cIk1hcFwiP1wiIGFzIGtleXNcIjpcIlwifSwgd2hpY2ggY2FuIGxlYWQgdG8gaW5jb25zaXN0ZW5jaWVzLiBBdm9pZCBkaWZmZXJlbnRpYXRpbmcgYmV0d2VlbiB0aGUgcmF3IGFuZCByZWFjdGl2ZSB2ZXJzaW9ucyBvZiBhbiBvYmplY3QgYW5kIG9ubHkgdXNlIHRoZSByZWFjdGl2ZSB2ZXJzaW9uIGlmIHBvc3NpYmxlLmApfX12YXIgcG49bmV3IFdlYWtNYXAsSGk9bmV3IFdlYWtNYXAsbW49bmV3IFdlYWtNYXAsS2k9bmV3IFdlYWtNYXA7ZnVuY3Rpb24gVmkoZSl7c3dpdGNoKGUpe2Nhc2VcIk9iamVjdFwiOmNhc2VcIkFycmF5XCI6cmV0dXJuIDE7Y2FzZVwiTWFwXCI6Y2FzZVwiU2V0XCI6Y2FzZVwiV2Vha01hcFwiOmNhc2VcIldlYWtTZXRcIjpyZXR1cm4gMjtkZWZhdWx0OnJldHVybiAwfX1mdW5jdGlvbiBxaShlKXtyZXR1cm4gZS5fX3Zfc2tpcHx8IU9iamVjdC5pc0V4dGVuc2libGUoZSk/MDpWaShNdChlKSl9ZnVuY3Rpb24gZXQoZSl7cmV0dXJuIGUmJmUuX192X2lzUmVhZG9ubHk/ZTpfbihlLCExLERpLEJpLHBuKX1mdW5jdGlvbiBobihlKXtyZXR1cm4gX24oZSwhMCxQaSx6aSxtbil9ZnVuY3Rpb24gX24oZSx0LHIsbixpKXtpZighYmUoZSkpcmV0dXJuIGNvbnNvbGUud2FybihgdmFsdWUgY2Fubm90IGJlIG1hZGUgcmVhY3RpdmU6ICR7U3RyaW5nKGUpfWApLGU7aWYoZS5fX3ZfcmF3JiYhKHQmJmUuX192X2lzUmVhY3RpdmUpKXJldHVybiBlO2xldCBvPWkuZ2V0KGUpO2lmKG8pcmV0dXJuIG87bGV0IHM9cWkoZSk7aWYocz09PTApcmV0dXJuIGU7bGV0IGE9bmV3IFByb3h5KGUscz09PTI/bjpyKTtyZXR1cm4gaS5zZXQoZSxhKSxhfWZ1bmN0aW9uIF8oZSl7cmV0dXJuIGUmJl8oZS5fX3ZfcmF3KXx8ZX1mdW5jdGlvbiBJdChlKXtyZXR1cm4gQm9vbGVhbihlJiZlLl9fdl9pc1JlZj09PSEwKX15KFwibmV4dFRpY2tcIiwoKT0+aWUpO3koXCJkaXNwYXRjaFwiLGU9PkouYmluZChKLGUpKTt5KFwid2F0Y2hcIiwoZSx7ZXZhbHVhdGVMYXRlcjp0LGNsZWFudXA6cn0pPT4obixpKT0+e2xldCBvPXQobiksYT12ZSgoKT0+e2xldCBjO3JldHVybiBvKGw9PmM9bCksY30saSk7cihhKX0pO3koXCJzdG9yZVwiLFZyKTt5KFwiZGF0YVwiLGU9PkNlKGUpKTt5KFwicm9vdFwiLGU9PlkoZSkpO3koXCJyZWZzXCIsZT0+KGUuX3hfcmVmc19wcm94eXx8KGUuX3hfcmVmc19wcm94eT16KFVpKGUpKSksZS5feF9yZWZzX3Byb3h5KSk7ZnVuY3Rpb24gVWkoZSl7bGV0IHQ9W107cmV0dXJuIGooZSxyPT57ci5feF9yZWZzJiZ0LnB1c2goci5feF9yZWZzKX0pLHR9dmFyIEJ0PXt9O2Z1bmN0aW9uIHp0KGUpe3JldHVybiBCdFtlXXx8KEJ0W2VdPTApLCsrQnRbZV19ZnVuY3Rpb24gZ24oZSx0KXtyZXR1cm4gaihlLHI9PntpZihyLl94X2lkcyYmci5feF9pZHNbdF0pcmV0dXJuITB9KX1mdW5jdGlvbiB4bihlLHQpe2UuX3hfaWRzfHwoZS5feF9pZHM9e30pLGUuX3hfaWRzW3RdfHwoZS5feF9pZHNbdF09enQodCkpfXkoXCJpZFwiLChlLHtjbGVhbnVwOnR9KT0+KHIsbj1udWxsKT0+e2xldCBpPWAke3J9JHtuP2AtJHtufWA6XCJcIn1gO3JldHVybiBXaShlLGksdCwoKT0+e2xldCBvPWduKGUscikscz1vP28uX3hfaWRzW3JdOnp0KHIpO3JldHVybiBuP2Ake3J9LSR7c30tJHtufWA6YCR7cn0tJHtzfWB9KX0pO0soKGUsdCk9PntlLl94X2lkJiYodC5feF9pZD1lLl94X2lkKX0pO2Z1bmN0aW9uIFdpKGUsdCxyLG4pe2lmKGUuX3hfaWR8fChlLl94X2lkPXt9KSxlLl94X2lkW3RdKXJldHVybiBlLl94X2lkW3RdO2xldCBpPW4oKTtyZXR1cm4gZS5feF9pZFt0XT1pLHIoKCk9PntkZWxldGUgZS5feF9pZFt0XX0pLGl9eShcImVsXCIsZT0+ZSk7eW4oXCJGb2N1c1wiLFwiZm9jdXNcIixcImZvY3VzXCIpO3luKFwiUGVyc2lzdFwiLFwicGVyc2lzdFwiLFwicGVyc2lzdFwiKTtmdW5jdGlvbiB5bihlLHQscil7eSh0LG49PkUoYFlvdSBjYW4ndCB1c2UgWyQke3R9XSB3aXRob3V0IGZpcnN0IGluc3RhbGxpbmcgdGhlIFwiJHtlfVwiIHBsdWdpbiBoZXJlOiBodHRwczovL2FscGluZWpzLmRldi9wbHVnaW5zLyR7cn1gLG4pKX1kKFwibW9kZWxhYmxlXCIsKGUse2V4cHJlc3Npb246dH0se2VmZmVjdDpyLGV2YWx1YXRlTGF0ZXI6bixjbGVhbnVwOml9KT0+e2xldCBvPW4odCkscz0oKT0+e2xldCB1O3JldHVybiBvKHA9PnU9cCksdX0sYT1uKGAke3R9ID0gX19wbGFjZWhvbGRlcmApLGM9dT0+YSgoKT0+e30se3Njb3BlOntfX3BsYWNlaG9sZGVyOnV9fSksbD1zKCk7YyhsKSxxdWV1ZU1pY3JvdGFzaygoKT0+e2lmKCFlLl94X21vZGVsKXJldHVybjtlLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzLmRlZmF1bHQoKTtsZXQgdT1lLl94X21vZGVsLmdldCxwPWUuX3hfbW9kZWwuc2V0LGg9VmUoe2dldCgpe3JldHVybiB1KCl9LHNldCh3KXtwKHcpfX0se2dldCgpe3JldHVybiBzKCl9LHNldCh3KXtjKHcpfX0pO2koaCl9KX0pO2QoXCJ0ZWxlcG9ydFwiLChlLHttb2RpZmllcnM6dCxleHByZXNzaW9uOnJ9LHtjbGVhbnVwOm59KT0+e2UudGFnTmFtZS50b0xvd2VyQ2FzZSgpIT09XCJ0ZW1wbGF0ZVwiJiZFKFwieC10ZWxlcG9ydCBjYW4gb25seSBiZSB1c2VkIG9uIGEgPHRlbXBsYXRlPiB0YWdcIixlKTtsZXQgaT1ibihyKSxvPWUuY29udGVudC5jbG9uZU5vZGUoITApLmZpcnN0RWxlbWVudENoaWxkO2UuX3hfdGVsZXBvcnQ9byxvLl94X3RlbGVwb3J0QmFjaz1lLGUuc2V0QXR0cmlidXRlKFwiZGF0YS10ZWxlcG9ydC10ZW1wbGF0ZVwiLCEwKSxvLnNldEF0dHJpYnV0ZShcImRhdGEtdGVsZXBvcnQtdGFyZ2V0XCIsITApLGUuX3hfZm9yd2FyZEV2ZW50cyYmZS5feF9mb3J3YXJkRXZlbnRzLmZvckVhY2goYT0+e28uYWRkRXZlbnRMaXN0ZW5lcihhLGM9PntjLnN0b3BQcm9wYWdhdGlvbigpLGUuZGlzcGF0Y2hFdmVudChuZXcgYy5jb25zdHJ1Y3RvcihjLnR5cGUsYykpfSl9KSxrKG8se30sZSk7bGV0IHM9KGEsYyxsKT0+e2wuaW5jbHVkZXMoXCJwcmVwZW5kXCIpP2MucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSxjKTpsLmluY2x1ZGVzKFwiYXBwZW5kXCIpP2MucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSxjLm5leHRTaWJsaW5nKTpjLmFwcGVuZENoaWxkKGEpfTttKCgpPT57cyhvLGksdCksQSgoKT0+e1Mobyl9KSgpfSksZS5feF90ZWxlcG9ydFB1dEJhY2s9KCk9PntsZXQgYT1ibihyKTttKCgpPT57cyhlLl94X3RlbGVwb3J0LGEsdCl9KX0sbigoKT0+bSgoKT0+e28ucmVtb3ZlKCksUChvKX0pKX0pO3ZhciBHaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2Z1bmN0aW9uIGJuKGUpe2xldCB0PUEoKCk9PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZSksKCk9PkdpKSgpO3JldHVybiB0fHxFKGBDYW5ub3QgZmluZCB4LXRlbGVwb3J0IGVsZW1lbnQgZm9yIHNlbGVjdG9yOiBcIiR7ZX1cImApLHR9dmFyIHduPSgpPT57fTt3bi5pbmxpbmU9KGUse21vZGlmaWVyczp0fSx7Y2xlYW51cDpyfSk9Pnt0LmluY2x1ZGVzKFwic2VsZlwiKT9lLl94X2lnbm9yZVNlbGY9ITA6ZS5feF9pZ25vcmU9ITAscigoKT0+e3QuaW5jbHVkZXMoXCJzZWxmXCIpP2RlbGV0ZSBlLl94X2lnbm9yZVNlbGY6ZGVsZXRlIGUuX3hfaWdub3JlfSl9O2QoXCJpZ25vcmVcIix3bik7ZChcImVmZmVjdFwiLEEoKGUse2V4cHJlc3Npb246dH0se2VmZmVjdDpyfSk9PntyKHgoZSx0KSl9KSk7ZnVuY3Rpb24gYWUoZSx0LHIsbil7bGV0IGk9ZSxvPWM9Pm4oYykscz17fSxhPShjLGwpPT51PT5sKGMsdSk7aWYoci5pbmNsdWRlcyhcImRvdFwiKSYmKHQ9SmkodCkpLHIuaW5jbHVkZXMoXCJjYW1lbFwiKSYmKHQ9WWkodCkpLHIuaW5jbHVkZXMoXCJwYXNzaXZlXCIpJiYocy5wYXNzaXZlPSEwKSxyLmluY2x1ZGVzKFwiY2FwdHVyZVwiKSYmKHMuY2FwdHVyZT0hMCksci5pbmNsdWRlcyhcIndpbmRvd1wiKSYmKGk9d2luZG93KSxyLmluY2x1ZGVzKFwiZG9jdW1lbnRcIikmJihpPWRvY3VtZW50KSxyLmluY2x1ZGVzKFwiZGVib3VuY2VcIikpe2xldCBjPXJbci5pbmRleE9mKFwiZGVib3VuY2VcIikrMV18fFwiaW52YWxpZC13YWl0XCIsbD10dChjLnNwbGl0KFwibXNcIilbMF0pP051bWJlcihjLnNwbGl0KFwibXNcIilbMF0pOjI1MDtvPUhlKG8sbCl9aWYoci5pbmNsdWRlcyhcInRocm90dGxlXCIpKXtsZXQgYz1yW3IuaW5kZXhPZihcInRocm90dGxlXCIpKzFdfHxcImludmFsaWQtd2FpdFwiLGw9dHQoYy5zcGxpdChcIm1zXCIpWzBdKT9OdW1iZXIoYy5zcGxpdChcIm1zXCIpWzBdKToyNTA7bz1LZShvLGwpfXJldHVybiByLmluY2x1ZGVzKFwicHJldmVudFwiKSYmKG89YShvLChjLGwpPT57bC5wcmV2ZW50RGVmYXVsdCgpLGMobCl9KSksci5pbmNsdWRlcyhcInN0b3BcIikmJihvPWEobywoYyxsKT0+e2wuc3RvcFByb3BhZ2F0aW9uKCksYyhsKX0pKSxyLmluY2x1ZGVzKFwib25jZVwiKSYmKG89YShvLChjLGwpPT57YyhsKSxpLnJlbW92ZUV2ZW50TGlzdGVuZXIodCxvLHMpfSkpLChyLmluY2x1ZGVzKFwiYXdheVwiKXx8ci5pbmNsdWRlcyhcIm91dHNpZGVcIikpJiYoaT1kb2N1bWVudCxvPWEobywoYyxsKT0+e2UuY29udGFpbnMobC50YXJnZXQpfHxsLnRhcmdldC5pc0Nvbm5lY3RlZCE9PSExJiYoZS5vZmZzZXRXaWR0aDwxJiZlLm9mZnNldEhlaWdodDwxfHxlLl94X2lzU2hvd24hPT0hMSYmYyhsKSl9KSksci5pbmNsdWRlcyhcInNlbGZcIikmJihvPWEobywoYyxsKT0+e2wudGFyZ2V0PT09ZSYmYyhsKX0pKSwoWmkodCl8fHZuKHQpKSYmKG89YShvLChjLGwpPT57UWkobCxyKXx8YyhsKX0pKSxpLmFkZEV2ZW50TGlzdGVuZXIodCxvLHMpLCgpPT57aS5yZW1vdmVFdmVudExpc3RlbmVyKHQsbyxzKX19ZnVuY3Rpb24gSmkoZSl7cmV0dXJuIGUucmVwbGFjZSgvLS9nLFwiLlwiKX1mdW5jdGlvbiBZaShlKXtyZXR1cm4gZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLy0oXFx3KS9nLCh0LHIpPT5yLnRvVXBwZXJDYXNlKCkpfWZ1bmN0aW9uIHR0KGUpe3JldHVybiFBcnJheS5pc0FycmF5KGUpJiYhaXNOYU4oZSl9ZnVuY3Rpb24gWGkoZSl7cmV0dXJuW1wiIFwiLFwiX1wiXS5pbmNsdWRlcyhlKT9lOmUucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZyxcIiQxLSQyXCIpLnJlcGxhY2UoL1tfXFxzXS8sXCItXCIpLnRvTG93ZXJDYXNlKCl9ZnVuY3Rpb24gWmkoZSl7cmV0dXJuW1wia2V5ZG93blwiLFwia2V5dXBcIl0uaW5jbHVkZXMoZSl9ZnVuY3Rpb24gdm4oZSl7cmV0dXJuW1wiY29udGV4dG1lbnVcIixcImNsaWNrXCIsXCJtb3VzZVwiXS5zb21lKHQ9PmUuaW5jbHVkZXModCkpfWZ1bmN0aW9uIFFpKGUsdCl7bGV0IHI9dC5maWx0ZXIobz0+IVtcIndpbmRvd1wiLFwiZG9jdW1lbnRcIixcInByZXZlbnRcIixcInN0b3BcIixcIm9uY2VcIixcImNhcHR1cmVcIixcInNlbGZcIixcImF3YXlcIixcIm91dHNpZGVcIixcInBhc3NpdmVcIixcInByZXNlcnZlLXNjcm9sbFwiXS5pbmNsdWRlcyhvKSk7aWYoci5pbmNsdWRlcyhcImRlYm91bmNlXCIpKXtsZXQgbz1yLmluZGV4T2YoXCJkZWJvdW5jZVwiKTtyLnNwbGljZShvLHR0KChyW28rMV18fFwiaW52YWxpZC13YWl0XCIpLnNwbGl0KFwibXNcIilbMF0pPzI6MSl9aWYoci5pbmNsdWRlcyhcInRocm90dGxlXCIpKXtsZXQgbz1yLmluZGV4T2YoXCJ0aHJvdHRsZVwiKTtyLnNwbGljZShvLHR0KChyW28rMV18fFwiaW52YWxpZC13YWl0XCIpLnNwbGl0KFwibXNcIilbMF0pPzI6MSl9aWYoci5sZW5ndGg9PT0wfHxyLmxlbmd0aD09PTEmJkVuKGUua2V5KS5pbmNsdWRlcyhyWzBdKSlyZXR1cm4hMTtsZXQgaT1bXCJjdHJsXCIsXCJzaGlmdFwiLFwiYWx0XCIsXCJtZXRhXCIsXCJjbWRcIixcInN1cGVyXCJdLmZpbHRlcihvPT5yLmluY2x1ZGVzKG8pKTtyZXR1cm4gcj1yLmZpbHRlcihvPT4haS5pbmNsdWRlcyhvKSksIShpLmxlbmd0aD4wJiZpLmZpbHRlcihzPT4oKHM9PT1cImNtZFwifHxzPT09XCJzdXBlclwiKSYmKHM9XCJtZXRhXCIpLGVbYCR7c31LZXlgXSkpLmxlbmd0aD09PWkubGVuZ3RoJiYodm4oZS50eXBlKXx8RW4oZS5rZXkpLmluY2x1ZGVzKHJbMF0pKSl9ZnVuY3Rpb24gRW4oZSl7aWYoIWUpcmV0dXJuW107ZT1YaShlKTtsZXQgdD17Y3RybDpcImNvbnRyb2xcIixzbGFzaDpcIi9cIixzcGFjZTpcIiBcIixzcGFjZWJhcjpcIiBcIixjbWQ6XCJtZXRhXCIsZXNjOlwiZXNjYXBlXCIsdXA6XCJhcnJvdy11cFwiLGRvd246XCJhcnJvdy1kb3duXCIsbGVmdDpcImFycm93LWxlZnRcIixyaWdodDpcImFycm93LXJpZ2h0XCIscGVyaW9kOlwiLlwiLGNvbW1hOlwiLFwiLGVxdWFsOlwiPVwiLG1pbnVzOlwiLVwiLHVuZGVyc2NvcmU6XCJfXCJ9O3JldHVybiB0W2VdPWUsT2JqZWN0LmtleXModCkubWFwKHI9PntpZih0W3JdPT09ZSlyZXR1cm4gcn0pLmZpbHRlcihyPT5yKX1kKFwibW9kZWxcIiwoZSx7bW9kaWZpZXJzOnQsZXhwcmVzc2lvbjpyfSx7ZWZmZWN0Om4sY2xlYW51cDppfSk9PntsZXQgbz1lO3QuaW5jbHVkZXMoXCJwYXJlbnRcIikmJihvPWUucGFyZW50Tm9kZSk7bGV0IHM9eChvLHIpLGE7dHlwZW9mIHI9PVwic3RyaW5nXCI/YT14KG8sYCR7cn0gPSBfX3BsYWNlaG9sZGVyYCk6dHlwZW9mIHI9PVwiZnVuY3Rpb25cIiYmdHlwZW9mIHIoKT09XCJzdHJpbmdcIj9hPXgobyxgJHtyKCl9ID0gX19wbGFjZWhvbGRlcmApOmE9KCk9Pnt9O2xldCBjPSgpPT57bGV0IGg7cmV0dXJuIHModz0+aD13KSxTbihoKT9oLmdldCgpOmh9LGw9aD0+e2xldCB3O3MoRj0+dz1GKSxTbih3KT93LnNldChoKTphKCgpPT57fSx7c2NvcGU6e19fcGxhY2Vob2xkZXI6aH19KX07dHlwZW9mIHI9PVwic3RyaW5nXCImJmUudHlwZT09PVwicmFkaW9cIiYmbSgoKT0+e2UuaGFzQXR0cmlidXRlKFwibmFtZVwiKXx8ZS5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIscil9KTtsZXQgdT1lLnRhZ05hbWUudG9Mb3dlckNhc2UoKT09PVwic2VsZWN0XCJ8fFtcImNoZWNrYm94XCIsXCJyYWRpb1wiXS5pbmNsdWRlcyhlLnR5cGUpfHx0LmluY2x1ZGVzKFwibGF6eVwiKT9cImNoYW5nZVwiOlwiaW5wdXRcIixwPUk/KCk9Pnt9OmFlKGUsdSx0LGg9PntsKEh0KGUsdCxoLGMoKSkpfSk7aWYodC5pbmNsdWRlcyhcImZpbGxcIikmJihbdm9pZCAwLG51bGwsXCJcIl0uaW5jbHVkZXMoYygpKXx8emUoZSkmJkFycmF5LmlzQXJyYXkoYygpKXx8ZS50YWdOYW1lLnRvTG93ZXJDYXNlKCk9PT1cInNlbGVjdFwiJiZlLm11bHRpcGxlKSYmbChIdChlLHQse3RhcmdldDplfSxjKCkpKSxlLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzfHwoZS5feF9yZW1vdmVNb2RlbExpc3RlbmVycz17fSksZS5feF9yZW1vdmVNb2RlbExpc3RlbmVycy5kZWZhdWx0PXAsaSgoKT0+ZS5feF9yZW1vdmVNb2RlbExpc3RlbmVycy5kZWZhdWx0KCkpLGUuZm9ybSl7bGV0IGg9YWUoZS5mb3JtLFwicmVzZXRcIixbXSx3PT57aWUoKCk9PmUuX3hfbW9kZWwmJmUuX3hfbW9kZWwuc2V0KEh0KGUsdCx7dGFyZ2V0OmV9LGMoKSkpKX0pO2koKCk9PmgoKSl9ZS5feF9tb2RlbD17Z2V0KCl7cmV0dXJuIGMoKX0sc2V0KGgpe2woaCl9fSxlLl94X2ZvcmNlTW9kZWxVcGRhdGU9aD0+e2g9PT12b2lkIDAmJnR5cGVvZiByPT1cInN0cmluZ1wiJiZyLm1hdGNoKC9cXC4vKSYmKGg9XCJcIiksd2luZG93LmZyb21Nb2RlbD0hMCxtKCgpPT5nZShlLFwidmFsdWVcIixoKSksZGVsZXRlIHdpbmRvdy5mcm9tTW9kZWx9LG4oKCk9PntsZXQgaD1jKCk7dC5pbmNsdWRlcyhcInVuaW50cnVzaXZlXCIpJiZkb2N1bWVudC5hY3RpdmVFbGVtZW50LmlzU2FtZU5vZGUoZSl8fGUuX3hfZm9yY2VNb2RlbFVwZGF0ZShoKX0pfSk7ZnVuY3Rpb24gSHQoZSx0LHIsbil7cmV0dXJuIG0oKCk9PntpZihyIGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQmJnIuZGV0YWlsIT09dm9pZCAwKXJldHVybiByLmRldGFpbCE9PW51bGwmJnIuZGV0YWlsIT09dm9pZCAwP3IuZGV0YWlsOnIudGFyZ2V0LnZhbHVlO2lmKHplKGUpKWlmKEFycmF5LmlzQXJyYXkobikpe2xldCBpPW51bGw7cmV0dXJuIHQuaW5jbHVkZXMoXCJudW1iZXJcIik/aT1LdChyLnRhcmdldC52YWx1ZSk6dC5pbmNsdWRlcyhcImJvb2xlYW5cIik/aT14ZShyLnRhcmdldC52YWx1ZSk6aT1yLnRhcmdldC52YWx1ZSxyLnRhcmdldC5jaGVja2VkP24uaW5jbHVkZXMoaSk/bjpuLmNvbmNhdChbaV0pOm4uZmlsdGVyKG89PiFlbyhvLGkpKX1lbHNlIHJldHVybiByLnRhcmdldC5jaGVja2VkO2Vsc2V7aWYoZS50YWdOYW1lLnRvTG93ZXJDYXNlKCk9PT1cInNlbGVjdFwiJiZlLm11bHRpcGxlKXJldHVybiB0LmluY2x1ZGVzKFwibnVtYmVyXCIpP0FycmF5LmZyb20oci50YXJnZXQuc2VsZWN0ZWRPcHRpb25zKS5tYXAoaT0+e2xldCBvPWkudmFsdWV8fGkudGV4dDtyZXR1cm4gS3Qobyl9KTp0LmluY2x1ZGVzKFwiYm9vbGVhblwiKT9BcnJheS5mcm9tKHIudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucykubWFwKGk9PntsZXQgbz1pLnZhbHVlfHxpLnRleHQ7cmV0dXJuIHhlKG8pfSk6QXJyYXkuZnJvbShyLnRhcmdldC5zZWxlY3RlZE9wdGlvbnMpLm1hcChpPT5pLnZhbHVlfHxpLnRleHQpO3tsZXQgaTtyZXR1cm4gT3QoZSk/ci50YXJnZXQuY2hlY2tlZD9pPXIudGFyZ2V0LnZhbHVlOmk9bjppPXIudGFyZ2V0LnZhbHVlLHQuaW5jbHVkZXMoXCJudW1iZXJcIik/S3QoaSk6dC5pbmNsdWRlcyhcImJvb2xlYW5cIik/eGUoaSk6dC5pbmNsdWRlcyhcInRyaW1cIik/aS50cmltKCk6aX19fSl9ZnVuY3Rpb24gS3QoZSl7bGV0IHQ9ZT9wYXJzZUZsb2F0KGUpOm51bGw7cmV0dXJuIHRvKHQpP3Q6ZX1mdW5jdGlvbiBlbyhlLHQpe3JldHVybiBlPT10fWZ1bmN0aW9uIHRvKGUpe3JldHVybiFBcnJheS5pc0FycmF5KGUpJiYhaXNOYU4oZSl9ZnVuY3Rpb24gU24oZSl7cmV0dXJuIGUhPT1udWxsJiZ0eXBlb2YgZT09XCJvYmplY3RcIiYmdHlwZW9mIGUuZ2V0PT1cImZ1bmN0aW9uXCImJnR5cGVvZiBlLnNldD09XCJmdW5jdGlvblwifWQoXCJjbG9ha1wiLGU9PnF1ZXVlTWljcm90YXNrKCgpPT5tKCgpPT5lLnJlbW92ZUF0dHJpYnV0ZShDKFwiY2xvYWtcIikpKSkpOyRlKCgpPT5gWyR7QyhcImluaXRcIil9XWApO2QoXCJpbml0XCIsQSgoZSx7ZXhwcmVzc2lvbjp0fSx7ZXZhbHVhdGU6cn0pPT50eXBlb2YgdD09XCJzdHJpbmdcIj8hIXQudHJpbSgpJiZyKHQse30sITEpOnIodCx7fSwhMSkpKTtkKFwidGV4dFwiLChlLHtleHByZXNzaW9uOnR9LHtlZmZlY3Q6cixldmFsdWF0ZUxhdGVyOm59KT0+e2xldCBpPW4odCk7cigoKT0+e2kobz0+e20oKCk9PntlLnRleHRDb250ZW50PW99KX0pfSl9KTtkKFwiaHRtbFwiLChlLHtleHByZXNzaW9uOnR9LHtlZmZlY3Q6cixldmFsdWF0ZUxhdGVyOm59KT0+e2xldCBpPW4odCk7cigoKT0+e2kobz0+e20oKCk9PntlLmlubmVySFRNTD1vLGUuX3hfaWdub3JlU2VsZj0hMCxTKGUpLGRlbGV0ZSBlLl94X2lnbm9yZVNlbGZ9KX0pfSl9KTtuZShQZShcIjpcIixJZShDKFwiYmluZDpcIikpKSk7dmFyIEFuPShlLHt2YWx1ZTp0LG1vZGlmaWVyczpyLGV4cHJlc3Npb246bixvcmlnaW5hbDppfSx7ZWZmZWN0Om8sY2xlYW51cDpzfSk9PntpZighdCl7bGV0IGM9e307V3IoYykseChlLG4pKHU9PntUdChlLHUsaSl9LHtzY29wZTpjfSk7cmV0dXJufWlmKHQ9PT1cImtleVwiKXJldHVybiBybyhlLG4pO2lmKGUuX3hfaW5saW5lQmluZGluZ3MmJmUuX3hfaW5saW5lQmluZGluZ3NbdF0mJmUuX3hfaW5saW5lQmluZGluZ3NbdF0uZXh0cmFjdClyZXR1cm47bGV0IGE9eChlLG4pO28oKCk9PmEoYz0+e2M9PT12b2lkIDAmJnR5cGVvZiBuPT1cInN0cmluZ1wiJiZuLm1hdGNoKC9cXC4vKSYmKGM9XCJcIiksbSgoKT0+Z2UoZSx0LGMscikpfSkpLHMoKCk9PntlLl94X3VuZG9BZGRlZENsYXNzZXMmJmUuX3hfdW5kb0FkZGVkQ2xhc3NlcygpLGUuX3hfdW5kb0FkZGVkU3R5bGVzJiZlLl94X3VuZG9BZGRlZFN0eWxlcygpfSl9O0FuLmlubGluZT0oZSx7dmFsdWU6dCxtb2RpZmllcnM6cixleHByZXNzaW9uOm59KT0+e3QmJihlLl94X2lubGluZUJpbmRpbmdzfHwoZS5feF9pbmxpbmVCaW5kaW5ncz17fSksZS5feF9pbmxpbmVCaW5kaW5nc1t0XT17ZXhwcmVzc2lvbjpuLGV4dHJhY3Q6ITF9KX07ZChcImJpbmRcIixBbik7ZnVuY3Rpb24gcm8oZSx0KXtlLl94X2tleUV4cHJlc3Npb249dH1MZSgoKT0+YFske0MoXCJkYXRhXCIpfV1gKTtkKFwiZGF0YVwiLChlLHtleHByZXNzaW9uOnR9LHtjbGVhbnVwOnJ9KT0+e2lmKG5vKGUpKXJldHVybjt0PXQ9PT1cIlwiP1wie31cIjp0O2xldCBuPXt9O2ZlKG4sZSk7bGV0IGk9e307WXIoaSxuKTtsZXQgbz1SKGUsdCx7c2NvcGU6aX0pOyhvPT09dm9pZCAwfHxvPT09ITApJiYobz17fSksZmUobyxlKTtsZXQgcz1UKG8pO1RlKHMpO2xldCBhPWsoZSxzKTtzLmluaXQmJlIoZSxzLmluaXQpLHIoKCk9PntzLmRlc3Ryb3kmJlIoZSxzLmRlc3Ryb3kpLGEoKX0pfSk7SygoZSx0KT0+e2UuX3hfZGF0YVN0YWNrJiYodC5feF9kYXRhU3RhY2s9ZS5feF9kYXRhU3RhY2ssdC5zZXRBdHRyaWJ1dGUoXCJkYXRhLWhhcy1hbHBpbmUtc3RhdGVcIiwhMCkpfSk7ZnVuY3Rpb24gbm8oZSl7cmV0dXJuIEk/QmU/ITA6ZS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWhhcy1hbHBpbmUtc3RhdGVcIik6ITF9ZChcInNob3dcIiwoZSx7bW9kaWZpZXJzOnQsZXhwcmVzc2lvbjpyfSx7ZWZmZWN0Om59KT0+e2xldCBpPXgoZSxyKTtlLl94X2RvSGlkZXx8KGUuX3hfZG9IaWRlPSgpPT57bSgoKT0+e2Uuc3R5bGUuc2V0UHJvcGVydHkoXCJkaXNwbGF5XCIsXCJub25lXCIsdC5pbmNsdWRlcyhcImltcG9ydGFudFwiKT9cImltcG9ydGFudFwiOnZvaWQgMCl9KX0pLGUuX3hfZG9TaG93fHwoZS5feF9kb1Nob3c9KCk9PnttKCgpPT57ZS5zdHlsZS5sZW5ndGg9PT0xJiZlLnN0eWxlLmRpc3BsYXk9PT1cIm5vbmVcIj9lLnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpOmUuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJkaXNwbGF5XCIpfSl9KTtsZXQgbz0oKT0+e2UuX3hfZG9IaWRlKCksZS5feF9pc1Nob3duPSExfSxzPSgpPT57ZS5feF9kb1Nob3coKSxlLl94X2lzU2hvd249ITB9LGE9KCk9PnNldFRpbWVvdXQocyksYz1oZShwPT5wP3MoKTpvKCkscD0+e3R5cGVvZiBlLl94X3RvZ2dsZUFuZENhc2NhZGVXaXRoVHJhbnNpdGlvbnM9PVwiZnVuY3Rpb25cIj9lLl94X3RvZ2dsZUFuZENhc2NhZGVXaXRoVHJhbnNpdGlvbnMoZSxwLHMsbyk6cD9hKCk6bygpfSksbCx1PSEwO24oKCk9PmkocD0+eyF1JiZwPT09bHx8KHQuaW5jbHVkZXMoXCJpbW1lZGlhdGVcIikmJihwP2EoKTpvKCkpLGMocCksbD1wLHU9ITEpfSkpfSk7ZChcImZvclwiLChlLHtleHByZXNzaW9uOnR9LHtlZmZlY3Q6cixjbGVhbnVwOm59KT0+e2xldCBpPW9vKHQpLG89eChlLGkuaXRlbXMpLHM9eChlLGUuX3hfa2V5RXhwcmVzc2lvbnx8XCJpbmRleFwiKTtlLl94X3ByZXZLZXlzPVtdLGUuX3hfbG9va3VwPXt9LHIoKCk9PmlvKGUsaSxvLHMpKSxuKCgpPT57T2JqZWN0LnZhbHVlcyhlLl94X2xvb2t1cCkuZm9yRWFjaChhPT5tKCgpPT57UChhKSxhLnJlbW92ZSgpfSkpLGRlbGV0ZSBlLl94X3ByZXZLZXlzLGRlbGV0ZSBlLl94X2xvb2t1cH0pfSk7ZnVuY3Rpb24gaW8oZSx0LHIsbil7bGV0IGk9cz0+dHlwZW9mIHM9PVwib2JqZWN0XCImJiFBcnJheS5pc0FycmF5KHMpLG89ZTtyKHM9PntzbyhzKSYmcz49MCYmKHM9QXJyYXkuZnJvbShBcnJheShzKS5rZXlzKCksZj0+ZisxKSkscz09PXZvaWQgMCYmKHM9W10pO2xldCBhPWUuX3hfbG9va3VwLGM9ZS5feF9wcmV2S2V5cyxsPVtdLHU9W107aWYoaShzKSlzPU9iamVjdC5lbnRyaWVzKHMpLm1hcCgoW2YsZ10pPT57bGV0IGI9T24odCxnLGYscyk7bih2PT57dS5pbmNsdWRlcyh2KSYmRShcIkR1cGxpY2F0ZSBrZXkgb24geC1mb3JcIixlKSx1LnB1c2godil9LHtzY29wZTp7aW5kZXg6ZiwuLi5ifX0pLGwucHVzaChiKX0pO2Vsc2UgZm9yKGxldCBmPTA7ZjxzLmxlbmd0aDtmKyspe2xldCBnPU9uKHQsc1tmXSxmLHMpO24oYj0+e3UuaW5jbHVkZXMoYikmJkUoXCJEdXBsaWNhdGUga2V5IG9uIHgtZm9yXCIsZSksdS5wdXNoKGIpfSx7c2NvcGU6e2luZGV4OmYsLi4uZ319KSxsLnB1c2goZyl9bGV0IHA9W10saD1bXSx3PVtdLEY9W107Zm9yKGxldCBmPTA7ZjxjLmxlbmd0aDtmKyspe2xldCBnPWNbZl07dS5pbmRleE9mKGcpPT09LTEmJncucHVzaChnKX1jPWMuZmlsdGVyKGY9PiF3LmluY2x1ZGVzKGYpKTtsZXQgRWU9XCJ0ZW1wbGF0ZVwiO2ZvcihsZXQgZj0wO2Y8dS5sZW5ndGg7ZisrKXtsZXQgZz11W2ZdLGI9Yy5pbmRleE9mKGcpO2lmKGI9PT0tMSljLnNwbGljZShmLDAsZykscC5wdXNoKFtFZSxmXSk7ZWxzZSBpZihiIT09Zil7bGV0IHY9Yy5zcGxpY2UoZiwxKVswXSxPPWMuc3BsaWNlKGItMSwxKVswXTtjLnNwbGljZShmLDAsTyksYy5zcGxpY2UoYiwwLHYpLGgucHVzaChbdixPXSl9ZWxzZSBGLnB1c2goZyk7RWU9Z31mb3IobGV0IGY9MDtmPHcubGVuZ3RoO2YrKyl7bGV0IGc9d1tmXTtnIGluIGEmJihtKCgpPT57UChhW2ddKSxhW2ddLnJlbW92ZSgpfSksZGVsZXRlIGFbZ10pfWZvcihsZXQgZj0wO2Y8aC5sZW5ndGg7ZisrKXtsZXRbZyxiXT1oW2ZdLHY9YVtnXSxPPWFbYl0sZWU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTttKCgpPT57T3x8RSgneC1mb3IgXCI6a2V5XCIgaXMgdW5kZWZpbmVkIG9yIGludmFsaWQnLG8sYixhKSxPLmFmdGVyKGVlKSx2LmFmdGVyKE8pLE8uX3hfY3VycmVudElmRWwmJk8uYWZ0ZXIoTy5feF9jdXJyZW50SWZFbCksZWUuYmVmb3JlKHYpLHYuX3hfY3VycmVudElmRWwmJnYuYWZ0ZXIodi5feF9jdXJyZW50SWZFbCksZWUucmVtb3ZlKCl9KSxPLl94X3JlZnJlc2hYRm9yU2NvcGUobFt1LmluZGV4T2YoYildKX1mb3IobGV0IGY9MDtmPHAubGVuZ3RoO2YrKyl7bGV0W2csYl09cFtmXSx2PWc9PT1cInRlbXBsYXRlXCI/bzphW2ddO3YuX3hfY3VycmVudElmRWwmJih2PXYuX3hfY3VycmVudElmRWwpO2xldCBPPWxbYl0sZWU9dVtiXSxjZT1kb2N1bWVudC5pbXBvcnROb2RlKG8uY29udGVudCwhMCkuZmlyc3RFbGVtZW50Q2hpbGQscXQ9VChPKTtrKGNlLHF0LG8pLGNlLl94X3JlZnJlc2hYRm9yU2NvcGU9VG49PntPYmplY3QuZW50cmllcyhUbikuZm9yRWFjaCgoW1JuLE1uXSk9PntxdFtSbl09TW59KX0sbSgoKT0+e3YuYWZ0ZXIoY2UpLEEoKCk9PlMoY2UpKSgpfSksdHlwZW9mIGVlPT1cIm9iamVjdFwiJiZFKFwieC1mb3Iga2V5IGNhbm5vdCBiZSBhbiBvYmplY3QsIGl0IG11c3QgYmUgYSBzdHJpbmcgb3IgYW4gaW50ZWdlclwiLG8pLGFbZWVdPWNlfWZvcihsZXQgZj0wO2Y8Ri5sZW5ndGg7ZisrKWFbRltmXV0uX3hfcmVmcmVzaFhGb3JTY29wZShsW3UuaW5kZXhPZihGW2ZdKV0pO28uX3hfcHJldktleXM9dX0pfWZ1bmN0aW9uIG9vKGUpe2xldCB0PS8sKFteLFxcfVxcXV0qKSg/OiwoW14sXFx9XFxdXSopKT8kLyxyPS9eXFxzKlxcKHxcXClcXHMqJC9nLG49LyhbXFxzXFxTXSo/KVxccysoPzppbnxvZilcXHMrKFtcXHNcXFNdKikvLGk9ZS5tYXRjaChuKTtpZighaSlyZXR1cm47bGV0IG89e307by5pdGVtcz1pWzJdLnRyaW0oKTtsZXQgcz1pWzFdLnJlcGxhY2UocixcIlwiKS50cmltKCksYT1zLm1hdGNoKHQpO3JldHVybiBhPyhvLml0ZW09cy5yZXBsYWNlKHQsXCJcIikudHJpbSgpLG8uaW5kZXg9YVsxXS50cmltKCksYVsyXSYmKG8uY29sbGVjdGlvbj1hWzJdLnRyaW0oKSkpOm8uaXRlbT1zLG99ZnVuY3Rpb24gT24oZSx0LHIsbil7bGV0IGk9e307cmV0dXJuL15cXFsuKlxcXSQvLnRlc3QoZS5pdGVtKSYmQXJyYXkuaXNBcnJheSh0KT9lLml0ZW0ucmVwbGFjZShcIltcIixcIlwiKS5yZXBsYWNlKFwiXVwiLFwiXCIpLnNwbGl0KFwiLFwiKS5tYXAocz0+cy50cmltKCkpLmZvckVhY2goKHMsYSk9PntpW3NdPXRbYV19KTovXlxcey4qXFx9JC8udGVzdChlLml0ZW0pJiYhQXJyYXkuaXNBcnJheSh0KSYmdHlwZW9mIHQ9PVwib2JqZWN0XCI/ZS5pdGVtLnJlcGxhY2UoXCJ7XCIsXCJcIikucmVwbGFjZShcIn1cIixcIlwiKS5zcGxpdChcIixcIikubWFwKHM9PnMudHJpbSgpKS5mb3JFYWNoKHM9PntpW3NdPXRbc119KTppW2UuaXRlbV09dCxlLmluZGV4JiYoaVtlLmluZGV4XT1yKSxlLmNvbGxlY3Rpb24mJihpW2UuY29sbGVjdGlvbl09biksaX1mdW5jdGlvbiBzbyhlKXtyZXR1cm4hQXJyYXkuaXNBcnJheShlKSYmIWlzTmFOKGUpfWZ1bmN0aW9uIENuKCl7fUNuLmlubGluZT0oZSx7ZXhwcmVzc2lvbjp0fSx7Y2xlYW51cDpyfSk9PntsZXQgbj1ZKGUpO24uX3hfcmVmc3x8KG4uX3hfcmVmcz17fSksbi5feF9yZWZzW3RdPWUscigoKT0+ZGVsZXRlIG4uX3hfcmVmc1t0XSl9O2QoXCJyZWZcIixDbik7ZChcImlmXCIsKGUse2V4cHJlc3Npb246dH0se2VmZmVjdDpyLGNsZWFudXA6bn0pPT57ZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkhPT1cInRlbXBsYXRlXCImJkUoXCJ4LWlmIGNhbiBvbmx5IGJlIHVzZWQgb24gYSA8dGVtcGxhdGU+IHRhZ1wiLGUpO2xldCBpPXgoZSx0KSxvPSgpPT57aWYoZS5feF9jdXJyZW50SWZFbClyZXR1cm4gZS5feF9jdXJyZW50SWZFbDtsZXQgYT1lLmNvbnRlbnQuY2xvbmVOb2RlKCEwKS5maXJzdEVsZW1lbnRDaGlsZDtyZXR1cm4gayhhLHt9LGUpLG0oKCk9PntlLmFmdGVyKGEpLEEoKCk9PlMoYSkpKCl9KSxlLl94X2N1cnJlbnRJZkVsPWEsZS5feF91bmRvSWY9KCk9PnttKCgpPT57UChhKSxhLnJlbW92ZSgpfSksZGVsZXRlIGUuX3hfY3VycmVudElmRWx9LGF9LHM9KCk9PntlLl94X3VuZG9JZiYmKGUuX3hfdW5kb0lmKCksZGVsZXRlIGUuX3hfdW5kb0lmKX07cigoKT0+aShhPT57YT9vKCk6cygpfSkpLG4oKCk9PmUuX3hfdW5kb0lmJiZlLl94X3VuZG9JZigpKX0pO2QoXCJpZFwiLChlLHtleHByZXNzaW9uOnR9LHtldmFsdWF0ZTpyfSk9PntyKHQpLmZvckVhY2goaT0+eG4oZSxpKSl9KTtLKChlLHQpPT57ZS5feF9pZHMmJih0Ll94X2lkcz1lLl94X2lkcyl9KTtuZShQZShcIkBcIixJZShDKFwib246XCIpKSkpO2QoXCJvblwiLEEoKGUse3ZhbHVlOnQsbW9kaWZpZXJzOnIsZXhwcmVzc2lvbjpufSx7Y2xlYW51cDppfSk9PntsZXQgbz1uP3goZSxuKTooKT0+e307ZS50YWdOYW1lLnRvTG93ZXJDYXNlKCk9PT1cInRlbXBsYXRlXCImJihlLl94X2ZvcndhcmRFdmVudHN8fChlLl94X2ZvcndhcmRFdmVudHM9W10pLGUuX3hfZm9yd2FyZEV2ZW50cy5pbmNsdWRlcyh0KXx8ZS5feF9mb3J3YXJkRXZlbnRzLnB1c2godCkpO2xldCBzPWFlKGUsdCxyLGE9PntvKCgpPT57fSx7c2NvcGU6eyRldmVudDphfSxwYXJhbXM6W2FdfSl9KTtpKCgpPT5zKCkpfSkpO3J0KFwiQ29sbGFwc2VcIixcImNvbGxhcHNlXCIsXCJjb2xsYXBzZVwiKTtydChcIkludGVyc2VjdFwiLFwiaW50ZXJzZWN0XCIsXCJpbnRlcnNlY3RcIik7cnQoXCJGb2N1c1wiLFwidHJhcFwiLFwiZm9jdXNcIik7cnQoXCJNYXNrXCIsXCJtYXNrXCIsXCJtYXNrXCIpO2Z1bmN0aW9uIHJ0KGUsdCxyKXtkKHQsbj0+RShgWW91IGNhbid0IHVzZSBbeC0ke3R9XSB3aXRob3V0IGZpcnN0IGluc3RhbGxpbmcgdGhlIFwiJHtlfVwiIHBsdWdpbiBoZXJlOiBodHRwczovL2FscGluZWpzLmRldi9wbHVnaW5zLyR7cn1gLG4pKX1ILnNldEV2YWx1YXRvcih4dCk7SC5zZXRSZWFjdGl2aXR5RW5naW5lKHtyZWFjdGl2ZTpldCxlZmZlY3Q6b24scmVsZWFzZTpzbixyYXc6X30pO3ZhciBWdD1IO3dpbmRvdy5BbHBpbmU9VnQ7cXVldWVNaWNyb3Rhc2soKCk9PntWdC5zdGFydCgpfSk7fSkoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBQUEsR0FBQyxNQUFJO0FBQUMsUUFBSSxLQUFHLE9BQUcsS0FBRyxPQUFHLElBQUUsQ0FBQyxHQUFFLEtBQUc7QUFBRyxhQUFTLEdBQUcsR0FBRTtBQUFDLFNBQUcsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLFFBQUUsU0FBUyxDQUFDLEtBQUcsRUFBRSxLQUFLLENBQUMsR0FBRSxHQUFHO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFO0FBQUMsVUFBSSxJQUFFLEVBQUUsUUFBUSxDQUFDO0FBQUUsWUFBSSxNQUFJLElBQUUsTUFBSSxFQUFFLE9BQU8sR0FBRSxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsS0FBSTtBQUFDLE9BQUMsTUFBSSxDQUFDLE9BQUssS0FBRyxNQUFHLGVBQWUsRUFBRTtBQUFBLElBQUU7QUFBQyxhQUFTLEtBQUk7QUFBQyxXQUFHLE9BQUcsS0FBRztBQUFHLGVBQVEsSUFBRSxHQUFFLElBQUUsRUFBRSxRQUFPO0FBQUksVUFBRSxDQUFDLEVBQUUsR0FBRSxLQUFHO0FBQUUsUUFBRSxTQUFPLEdBQUUsS0FBRyxJQUFHLEtBQUc7QUFBQSxJQUFFO0FBQUMsUUFBSSxHQUFFLEdBQUUsR0FBRSxJQUFHLEtBQUc7QUFBRyxhQUFTLEdBQUcsR0FBRTtBQUFDLFdBQUcsT0FBRyxFQUFFLEdBQUUsS0FBRztBQUFBLElBQUU7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLFVBQUUsRUFBRSxVQUFTLElBQUUsRUFBRSxTQUFRLElBQUUsT0FBRyxFQUFFLE9BQU8sR0FBRSxFQUFDLFdBQVUsT0FBRztBQUFDLGFBQUcsR0FBRyxDQUFDLElBQUUsRUFBRTtBQUFBLE1BQUMsRUFBQyxDQUFDLEdBQUUsS0FBRyxFQUFFO0FBQUEsSUFBRztBQUFDLGFBQVMsR0FBRyxHQUFF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SUFBRSxNQUFJO0FBQUMsY0FBRSxJQUFJLENBQUMsS0FBRyxFQUFFLElBQUksR0FBRSxDQUFDLENBQUMsR0FBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBQyxNQUFLLEdBQUUsT0FBTSxFQUFFLGFBQWEsQ0FBQyxFQUFDLENBQUM7QUFBQSxVQUFDLEdBQUUsSUFBRSxNQUFJO0FBQUMsY0FBRSxJQUFJLENBQUMsS0FBRyxFQUFFLElBQUksR0FBRSxDQUFDLENBQUMsR0FBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQztBQUFBLFVBQUM7QUFBRSxZQUFFLGFBQWEsQ0FBQyxLQUFHLE1BQUksT0FBSyxFQUFFLElBQUUsRUFBRSxhQUFhLENBQUMsS0FBRyxFQUFFLEdBQUUsRUFBRSxLQUFHLEVBQUU7QUFBQSxRQUFDO0FBQUMsUUFBRSxRQUFRLENBQUMsR0FBRSxNQUFJO0FBQUMsV0FBRyxHQUFFLENBQUM7QUFBQSxNQUFDLENBQUMsR0FBRSxFQUFFLFFBQVEsQ0FBQyxHQUFFLE1BQUk7QUFBQyxXQUFHLFFBQVEsT0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0FBQUEsTUFBQyxDQUFDO0FBQUUsZUFBUSxLQUFLO0FBQUUsVUFBRSxLQUFLLE9BQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxLQUFHLEdBQUcsUUFBUSxPQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQUUsZUFBUSxLQUFLO0FBQUUsVUFBRSxlQUFhLEdBQUcsUUFBUSxPQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQUUsVUFBRSxNQUFLLElBQUUsTUFBSyxJQUFFLE1BQUssSUFBRTtBQUFBLElBQUk7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEVBQUUsR0FBRSxHQUFFLEdBQUU7QUFBQyxhQUFPLEVBQUUsZUFBYSxDQUFDLEdBQUUsR0FBRyxFQUFFLEtBQUcsQ0FBQyxDQUFDLEdBQUUsTUFBSTtBQUFDLFVBQUUsZUFBYSxFQUFFLGFBQWEsT0FBTyxPQUFHLE1BQUks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RSxhQUFPLEVBQUUsQ0FBQyxHQUFFLE9BQUc7QUFBQyxZQUFHLE9BQU8sS0FBRyxZQUFVLE1BQUksUUFBTSxFQUFFLGdCQUFlO0FBQUMsY0FBSSxJQUFFLEVBQUUsV0FBVyxLQUFLLENBQUM7QUFBRSxZQUFFLGFBQVcsQ0FBQyxHQUFFLEdBQUUsTUFBSTtBQUFDLGdCQUFJLElBQUUsRUFBRSxXQUFXLEdBQUUsR0FBRSxDQUFDO0FBQUUsbUJBQU8sRUFBRSxlQUFhLEdBQUUsRUFBRSxHQUFFLEdBQUUsQ0FBQztBQUFBLFVBQUM7QUFBQSxRQUFDO0FBQU0sWUFBRSxlQUFhO0FBQUUsZUFBTztBQUFBLE1BQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLGFBQU8sRUFBRSxNQUFNLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRSxNQUFJLEVBQUUsQ0FBQyxHQUFFLENBQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRSxHQUFFO0FBQUMsVUFBRyxPQUFPLEtBQUcsYUFBVyxJQUFFLEVBQUUsTUFBTSxHQUFHLElBQUcsRUFBRSxXQUFTO0FBQUUsVUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFFO0FBQUEsV0FBTTtBQUFDLFlBQUcsRUFBRSxXQUFTO0FBQUUsZ0JBQU07QUFBTSxlQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUUsQ0FBQyxJQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUUsQ0FBQztBQUFBLE1BQUM7QUFBQSxJQUFDO0FBQUMsUUFBSSxLQUFHLENBQUM7QUFBRSxhQUFTLEVBQUUsR0FBRSxHQUFFO0FBQUMsU0FBRyxDQUFDLElBQUU7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLFVBQUksSUFBRSxHQUFHLENBQUM7QUFBRSxhQUFPLE9BQU8sUUFBUSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRSxDQUFDLE1BQUk7QUFBQyxlQUFP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QUUsR0FBRyxDQUFDO0FBQUUsWUFBRSxFQUFFLElBQUksT0FBRyxFQUFFLEtBQUssT0FBRyxFQUFFLFNBQU8sRUFBRSxJQUFJLElBQUUsRUFBQyxNQUFLLFVBQVUsRUFBRSxRQUFPLE9BQU0sSUFBSSxFQUFFLFNBQVEsSUFBRSxDQUFDLEdBQUUsSUFBRSxFQUFFLE9BQU8sQ0FBQztBQUFBLE1BQUM7QUFBQyxVQUFJLElBQUUsQ0FBQztBQUFFLGFBQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFFLE1BQUksRUFBRSxDQUFDLElBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSSxHQUFHLEdBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxPQUFHLEdBQUcsR0FBRSxDQUFDLENBQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUU7QUFBQyxhQUFPLE1BQU0sS0FBSyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxPQUFPLE9BQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUFBLElBQUM7QUFBQyxRQUFJLEtBQUcsT0FBRyxLQUFHLG9CQUFJLE9BQUksS0FBRyxPQUFPO0FBQUUsYUFBUyxHQUFHLEdBQUU7QUFBQyxXQUFHO0FBQUcsVUFBSSxJQUFFLE9BQU87QUFBRSxXQUFHLEdBQUUsR0FBRyxJQUFJLEdBQUUsQ0FBQyxDQUFDO0FBQUUsVUFBSSxJQUFFLE1BQUk7QUFBQyxlQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUU7QUFBUSxhQUFHLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRTtBQUFFLFdBQUcsT0FBTyxDQUFDO0FBQUEsTUFBQyxHQUFFLElBQUUsTUFBSTtBQUFDLGFBQUcsT0FBRyxFQUFFO0FBQUEsTUFBQztBQUFFLFFBQUUsQ0FBQyxHQUFFLEVBQUU7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUU7QUFBQyxVQUFJLElBQUUsQ0FBQyxHQUFFLElBQUUsT0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFFLENBQUMsR0FBRSxDQUFDLElBQUUsR0FBRyxDQUFDO0FBQUUsYUFBTyxFQUFFLEtBQUssQ0FBQyxHQUFFLENBQUMsRUFBQyxRQUFPLEdBQUUsUUFBTyxHQUFFLFNBQVEsR0FBRSxlQUFjLEVBQUUsS0FBSyxHQUFFLENBQUMsR0FBRSxVQUFTLEVBQUUsS0FBSyxHQUFFLENBQUMsRUFBQyxHQUFFLE1BQUksRUFBRSxRQUFRLE9BQUcsRUFBRSxDQUFDLENBQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLFVBQUksSUFBRSxNQUFJO0FBQUEsTUFBQyxHQUFFLElBQUUsR0FBRyxFQUFFLElBQUksS0FBRyxHQUFFLENBQUMsR0FBRSxDQUFDLElBQUUsR0FBRyxDQUFDO0FBQUUsU0FBRyxHQUFFLEVBQUUsVUFBUyxDQUFDO0FBQUUsVUFBSSxJQUFFLE1BQUk7QUFBQyxVQUFFLGFBQVcsRUFBRSxrQkFBZ0IsRUFBRSxVQUFRLEVBQUUsT0FBTyxHQUFFLEdBQUUsQ0FBQyxHQUFFLElBQUUsRUFBRSxLQUFLLEdBQUUsR0FBRSxHQUFFLENBQUMsR0FBRSxLQUFHLEdBQUcsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLElBQUUsRUFBRTtBQUFBLE1BQUU7QUFBRSxhQUFPLEVBQUUsY0FBWSxHQUFFO0FBQUEsSUFBQztBQUFDLFFBQUksS0FBRyxDQUFDLEdBQUUsTUFBSSxDQUFDLEVBQUMsTUFBSyxHQUFFLE9BQU0sRUFBQyxPQUFLLEVBQUUsV0FBVyxDQUFDLE1BQUksSUFBRSxFQUFFLFFBQVEsR0FBRSxDQUFDLElBQUcsRUFBQyxNQUFLLEdBQUUsT0FBTSxFQUFDLElBQUcsS0FBRyxPQUFHO0FBQUUsYUFBUyxHQUFHLElBQUUsTUFBSTtBQUFBLElBQUMsR0FBRTtBQUFDLGFBQU0sQ0FBQyxFQUFDLE1BQUssR0FBRSxPQUFNLEVBQUMsTUFBSTtBQUFDLFlBQUcsRUFBQyxNQUFLLEdBQUUsT0FBTSxFQUFDLElBQUUsR0FBRyxPQUFPLENBQUMsR0FBRSxNQUFJLEVBQUUsQ0FBQyxHQUFFLEVBQUMsTUFBSyxHQUFFLE9BQU0sRUFBQyxDQUFDO0FBQUUsZUFBTyxNQUFJLEtBQUcsRUFBRSxHQUFFLENBQUMsR0FBRSxFQUFDLE1BQUssR0FBRSxPQUFNLEVBQUM7QUFBQSxNQUFDO0FBQUEsSUFBQztBQUFDLFFBQUksS0FBRyxDQUFDO0FBQUUsYUFBUyxHQUFHLEdBQUU7QUFBQyxTQUFHLEtBQUssQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsRUFBQyxNQUFLLEVBQUMsR0FBRTtBQUFDLGFBQU8sR0FBRyxFQUFFLEtBQUssQ0FBQztBQUFBLElBQUM7QUFBQyxRQUFJLEtBQUcsTUFBSSxJQUFJLE9BQU8sSUFBSSxnQkFBZ0I7QUFBRSxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsYUFBTSxDQUFDLEVBQUMsTUFBSyxHQUFFLE9BQU0sRUFBQyxNQUFJO0FBQUMsWUFBSSxJQUFFLEVBQUUsTUFBTSxHQUFHLENBQUMsR0FBRSxJQUFFLEVBQUUsTUFBTSxxQkFBcUIsR0FBRSxJQUFFLEVBQUUsTUFBTSx1QkFBdUIsS0FBRyxDQUFDLEdBQUUsSUFBRSxLQUFHLEVBQUUsQ0FBQyxLQUFHO0FBQUUsZUFBTSxFQUFDLE1BQUssSUFBRSxFQUFFLENBQUMsSUFBRSxNQUFLLE9BQU0sSUFBRSxFQUFFLENBQUMsSUFBRSxNQUFLLFdBQVUsRUFBRSxJQUFJLE9BQUcsRUFBRSxRQUFRLEtBQUksRUFBRSxDQUFDLEdBQUUsWUFBVyxHQUFFLFVBQVMsRUFBQztBQUFBLE1BQUM7QUFBQSxJQUFDO0FBQUMsUUFBSSxLQUFHLFdBQVUsSUFBRSxDQUFDLFVBQVMsT0FBTSxRQUFPLE1BQUssVUFBUyxRQUFPLFFBQU8sT0FBTSxTQUFRLGFBQVksY0FBYSxRQUFPLE1BQUssSUFBRyxVQUFVO0FBQUUsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLFVBQUksSUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLE1BQUksS0FBRyxLQUFHLEVBQUUsTUFBSyxJQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksTUFBSSxLQUFHLEtBQUcsRUFBRTtBQUFLLGFBQU8sRUFBRSxRQUFRLENBQUMsSUFBRSxFQUFFLFFBQVEsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEVBQUUsR0FBRSxHQUFFLElBQUUsQ0FBQyxHQUFFO0FBQUMsUUFBRSxjQUFjLElBQUksWUFBWSxHQUFFLEVBQUMsUUFBTyxHQUFFLFNBQVEsTUFBRyxVQUFTLE1BQUcsWUFBVyxLQUFFLENBQUMsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEVBQUUsR0FBRSxHQUFFO0FBQUMsVUFBRyxPQUFPLGNBQVksY0FBWSxhQUFhLFlBQVc7QUFBQyxjQUFNLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxPQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7QUFBRTtBQUFBLE1BQU07QUFBQyxVQUFJLElBQUU7QUFBRyxVQUFHLEVBQUUsR0FBRSxNQUFJLElBQUUsSUFBRSxHQUFFO0FBQUU7QUFBTyxVQUFJLElBQUUsRUFBRTtBQUFrQixhQUFLO0FBQUcsVUFBRSxHQUFFLEdBQUUsS0FBRSxHQUFFLElBQUUsRUFBRTtBQUFBLElBQWtCO0FBQUMsYUFBUyxFQUFFLE1BQUssR0FBRTtBQUFDLGNBQVEsS0FBSyxtQkFBbUIsS0FBSSxHQUFHLENBQUM7QUFBQSxJQUFDO0FBQUMsUUFBSSxLQUFHO0FBQUcsYUFBUyxLQUFJO0FBQUMsWUFBSSxFQUFFLDZHQUE2RyxHQUFFLEtBQUcsTUFBRyxTQUFTLFFBQU0sRUFBRSxxSUFBcUksR0FBRSxFQUFFLFVBQVMsYUFBYSxHQUFFLEVBQUUsVUFBUyxxQkFBcUIsR0FBRSxHQUFHLEdBQUUsR0FBRyxPQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsR0FBRSxHQUFHLE9BQUcsRUFBRSxDQUFDLENBQUMsR0FBRSxHQUFHLENBQUMsR0FBRSxNQUFJO0FBQUMsV0FBRyxHQUFFLENBQUMsRUFBRSxRQUFRLE9BQUcsRUFBRSxDQUFDO0FBQUEsTUFBQyxDQUFDO0FBQUUsVUFBSSxJQUFFLE9BQUcsQ0FBQyxFQUFFLEVBQUUsZUFBYyxJQUFFO0FBQUUsWUFBTSxLQUFLLFNBQVMsaUJBQWlCLEdBQUcsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxPQUFHO0FBQUMsVUFBRSxDQUFDO0FBQUEsTUFBQyxDQUFDLEdBQUUsRUFBRSxVQUFTLG9CQUFvQixHQUFFLFdBQVcsTUFBSTtBQUFDLFdBQUc7QUFBQSxNQUFDLENBQUM7QUFBQSxJQUFDO0FBQUMsUUFBSSxLQUFHLENBQUMsR0FBRSxLQUFHLENBQUM7QUFBRSxhQUFTLEtBQUk7QUFBQyxhQUFPLEdBQUcsSUFBSSxPQUFHLEVBQUUsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEtBQUk7QUFBQyxhQUFPLEdBQUcsT0FBTyxFQUFFLEVBQUUsSUFBSSxPQUFHLEVBQUUsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLFNBQUcsS0FBSyxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFO0FBQUMsU0FBRyxLQUFLLENBQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxFQUFFLEdBQUUsSUFBRSxPQUFHO0FBQUMsYUFBTyxFQUFFLEdBQUUsT0FBRztBQUFDLGFBQUksSUFBRSxHQUFHLElBQUUsR0FBRyxHQUFHLEtBQUssT0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQUUsaUJBQU07QUFBQSxNQUFFLENBQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxFQUFFLEdBQUUsR0FBRTtBQUFDLFVBQUcsR0FBRTtBQUFDLFlBQUcsRUFBRSxDQUFDO0FBQUUsaUJBQU87QUFBRSxZQUFHLEVBQUUsb0JBQWtCLElBQUUsRUFBRSxrQkFBaUIsQ0FBQyxDQUFDLEVBQUU7QUFBYyxpQkFBTyxFQUFFLEVBQUUsZUFBYyxDQUFDO0FBQUEsTUFBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU8sR0FBRyxFQUFFLEtBQUssT0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQUEsSUFBQztBQUFDLFFBQUksS0FBRyxDQUFDO0FBQUUsYUFBUyxHQUFHLEdBQUU7QUFBQyxTQUFHLEtBQUssQ0FBQztBQUFBLElBQUM7QUFBQyxRQUFJLEtBQUc7QUFBRSxhQUFTLEVBQUUsR0FBRSxJQUFFLEdBQUUsSUFBRSxNQUFJO0FBQUEsSUFBQyxHQUFFO0FBQUMsUUFBRSxHQUFFLE9BQUcsRUFBRSxTQUFTLEtBQUcsR0FBRyxNQUFJO0FBQUMsVUFBRSxHQUFFLENBQUMsR0FBRSxNQUFJO0FBQUMsWUFBRSxjQUFZLEVBQUUsR0FBRSxDQUFDLEdBQUUsR0FBRyxRQUFRLE9BQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxHQUFFLEdBQUcsR0FBRSxFQUFFLFVBQVUsRUFBRSxRQUFRLE9BQUcsRUFBRSxDQUFDLEdBQUUsRUFBRSxjQUFZLEVBQUUsWUFBVSxPQUFNLEVBQUUsYUFBVyxFQUFFO0FBQUEsUUFBRSxDQUFDO0FBQUEsTUFBQyxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsRUFBRSxHQUFFLElBQUUsR0FBRTtBQUFDLFFBQUUsR0FBRSxPQUFHO0FBQUMsV0FBRyxDQUFDLEdBQUUsR0FBRyxDQUFDLEdBQUUsT0FBTyxFQUFFO0FBQUEsTUFBUyxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsS0FBSTtBQUFDLE9BQUMsQ0FBQyxNQUFLLFVBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxHQUFFLENBQUMsVUFBUyxVQUFTLENBQUMsWUFBWSxDQUFDLEdBQUUsQ0FBQyxRQUFPLFFBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUUsR0FBRSxDQUFDLE1BQUk7QUFBQyxXQUFHLENBQUMsS0FBRyxFQUFFLEtBQUssT0FBRztBQUFDLGNBQUcsU0FBUyxjQUFjLENBQUM7QUFBRSxtQkFBTyxFQUFFLFVBQVUsbUJBQW1CLFVBQVUsR0FBRTtBQUFBLFFBQUUsQ0FBQztBQUFBLE1BQUMsQ0FBQztBQUFBLElBQUM7QUFBQyxRQUFJLEtBQUcsQ0FBQyxHQUFFLEtBQUc7QUFBRyxhQUFTLEdBQUcsSUFBRSxNQUFJO0FBQUEsSUFBQyxHQUFFO0FBQUMsYUFBTyxlQUFlLE1BQUk7QUFBQyxjQUFJLFdBQVcsTUFBSTtBQUFDLGFBQUc7QUFBQSxRQUFDLENBQUM7QUFBQSxNQUFDLENBQUMsR0FBRSxJQUFJLFFBQVEsT0FBRztBQUFDLFdBQUcsS0FBSyxNQUFJO0FBQUMsWUFBRSxHQUFFLEVBQUU7QUFBQSxRQUFDLENBQUM7QUFBQSxNQUFDLENBQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxLQUFJO0FBQUMsV0FBSSxLQUFHLE9BQUcsR0FBRztBQUFRLFdBQUcsTUFBTSxFQUFFO0FBQUEsSUFBQztBQUFDLGFBQVMsS0FBSTtBQUFDLFdBQUc7QUFBQSxJQUFFO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLGFBQU8sTUFBTSxRQUFRLENBQUMsSUFBRSxHQUFHLEdBQUUsRUFBRSxLQUFLLEdBQUcsQ0FBQyxJQUFFLE9BQU8sS0FBRyxZQUFVLE1BQUksT0FBSyxHQUFHLEdBQUUsQ0FBQyxJQUFFLE9BQU8sS0FBRyxhQUFXLEdBQUcsR0FBRSxFQUFFLENBQUMsSUFBRSxHQUFHLEdBQUUsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsVUFBSSxJQUFFLE9BQUcsRUFBRSxNQUFNLEdBQUcsRUFBRSxPQUFPLE9BQU8sR0FBRSxJQUFFLE9BQUcsRUFBRSxNQUFNLEdBQUcsRUFBRSxPQUFPLE9BQUcsQ0FBQyxFQUFFLFVBQVUsU0FBUyxDQUFDLENBQUMsRUFBRSxPQUFPLE9BQU8sR0FBRSxJQUFFLFFBQUksRUFBRSxVQUFVLElBQUksR0FBRyxDQUFDLEdBQUUsTUFBSTtBQUFDLFVBQUUsVUFBVSxPQUFPLEdBQUcsQ0FBQztBQUFBLE1BQUM7QUFBRyxhQUFPLElBQUUsTUFBSSxPQUFHLElBQUUsS0FBRyxLQUFHLElBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsVUFBSSxJQUFFLE9BQUcsRUFBRSxNQUFNLEdBQUcsRUFBRSxPQUFPLE9BQU8sR0FBRSxJQUFFLE9BQU8sUUFBUSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRSxDQUFDLE1BQUksSUFBRSxFQUFFLENBQUMsSUFBRSxLQUFFLEVBQUUsT0FBTyxPQUFPLEdBQUUsSUFBRSxPQUFPLFFBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxNQUFJLElBQUUsUUFBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sT0FBTyxHQUFFLElBQUUsQ0FBQyxHQUFFLElBQUUsQ0FBQztBQUFFLGFBQU8sRUFBRSxRQUFRLE9BQUc7QUFBQyxVQUFFLFVBQVUsU0FBUyxDQUFDLE1BQUksRUFBRSxVQUFVLE9BQU8sQ0FBQyxHQUFFLEVBQUUsS0FBSyxDQUFDO0FBQUEsTUFBRSxDQUFDLEdBQUUsRUFBRSxRQUFRLE9BQUc7QUFBQyxVQUFFLFVBQVUsU0FBUyxDQUFDLE1BQUksRUFBRSxVQUFVLElBQUksQ0FBQyxHQUFFLEVBQUUsS0FBSyxDQUFDO0FBQUEsTUFBRSxDQUFDLEdBQUUsTUFBSTtBQUFDLFVBQUUsUUFBUSxPQUFHLEVBQUUsVUFBVSxJQUFJLENBQUMsQ0FBQyxHQUFFLEVBQUUsUUFBUSxPQUFHLEVBQUUsVUFBVSxPQUFPLENBQUMsQ0FBQztBQUFBLE1BQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxFQUFFLEdBQUUsR0FBRTtBQUFDLGFBQU8sT0FBTyxLQUFHLFlBQVUsTUFBSSxPQUFLLEdBQUcsR0FBRSxDQUFDLElBQUUsR0FBRyxHQUFFLENBQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLFVBQUksSUFBRSxDQUFDO0FBQUUsYUFBTyxPQUFPLFFBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxNQUFJO0FBQUMsVUFBRSxDQUFDLElBQUUsRUFBRSxNQUFNLENBQUMsR0FBRSxFQUFFLFdBQVcsSUFBSSxNQUFJLElBQUUsR0FBRyxDQUFDLElBQUcsRUFBRSxNQUFNLFlBQVksR0FBRSxDQUFDO0FBQUEsTUFBQyxDQUFDLEdBQUUsV0FBVyxNQUFJO0FBQUMsVUFBRSxNQUFNLFdBQVMsS0FBRyxFQUFFLGdCQUFnQixPQUFPO0FBQUEsTUFBQyxDQUFDLEdBQUUsTUFBSTtBQUFDLFVBQUUsR0FBRSxDQUFDO0FBQUEsTUFBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsVUFBSSxJQUFFLEVBQUUsYUFBYSxTQUFRLENBQUM7QUFBRSxhQUFPLEVBQUUsYUFBYSxTQUFRLENBQUMsR0FBRSxNQUFJO0FBQUMsVUFBRSxhQUFhLFNBQVEsS0FBRyxFQUFFO0FBQUEsTUFBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU8sRUFBRSxRQUFRLG1CQUFrQixPQUFPLEVBQUUsWUFBWTtBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxJQUFFLE1BQUk7QUFBQSxJQUFDLEdBQUU7QUFBQyxVQUFJLElBQUU7QUFBRyxhQUFPLFdBQVU7QUFBQyxZQUFFLEVBQUUsTUFBTSxNQUFLLFNBQVMsS0FBRyxJQUFFLE1BQUcsRUFBRSxNQUFNLE1BQUssU0FBUztBQUFBLE1BQUU7QUFBQSxJQUFDO0FBQUMsTUFBRSxjQUFhLENBQUMsR0FBRSxFQUFDLE9BQU0sR0FBRSxXQUFVLEdBQUUsWUFBVyxFQUFDLEdBQUUsRUFBQyxVQUFTLEVBQUMsTUFBSTtBQUFDLGFBQU8sS0FBRyxlQUFhLElBQUUsRUFBRSxDQUFDLElBQUcsTUFBSSxVQUFLLENBQUMsS0FBRyxPQUFPLEtBQUcsWUFBVSxHQUFHLEdBQUUsR0FBRSxDQUFDLElBQUUsR0FBRyxHQUFFLEdBQUUsQ0FBQztBQUFBLElBQUUsQ0FBQztBQUFFLGFBQVMsR0FBRyxHQUFFLEdBQUUsR0FBRTtBQUFDLFNBQUcsR0FBRSxJQUFHLEVBQUUsR0FBRSxFQUFDLE9BQU0sT0FBRztBQUFDLFVBQUUsY0FBYyxNQUFNLFNBQU87QUFBQSxNQUFDLEdBQUUsZUFBYyxPQUFHO0FBQUMsVUFBRSxjQUFjLE1BQU0sUUFBTTtBQUFBLE1BQUMsR0FBRSxhQUFZLE9BQUc7QUFBQyxVQUFFLGNBQWMsTUFBTSxNQUFJO0FBQUEsTUFBQyxHQUFFLE9BQU0sT0FBRztBQUFDLFVBQUUsY0FBYyxNQUFNLFNBQU87QUFBQSxNQUFDLEdBQUUsZUFBYyxPQUFHO0FBQUMsVUFBRSxjQUFjLE1BQU0sUUFBTTtBQUFBLE1BQUMsR0FBRSxhQUFZLE9BQUc7QUFBQyxVQUFFLGNBQWMsTUFBTSxNQUFJO0FBQUEsTUFBQyxFQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRSxHQUFFO0FBQUMsU0FBRyxHQUFFLENBQUM7QUFBRSxVQUFJLElBQUUsQ0FBQyxFQUFFLFNBQVMsSUFBSSxLQUFHLENBQUMsRUFBRSxTQUFTLEtBQUssS0FBRyxDQUFDLEdBQUUsSUFBRSxLQUFHLEVBQUUsU0FBUyxJQUFJLEtBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLEdBQUUsSUFBRSxLQUFHLEVBQUUsU0FBUyxLQUFLLEtBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO0FBQUUsUUFBRSxTQUFTLElBQUksS0FBRyxDQUFDLE1BQUksSUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFFLE1BQUksSUFBRSxFQUFFLFFBQVEsS0FBSyxDQUFDLElBQUcsRUFBRSxTQUFTLEtBQUssS0FBRyxDQUFDLE1BQUksSUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFFLE1BQUksSUFBRSxFQUFFLFFBQVEsS0FBSyxDQUFDO0FBQUcsVUFBSSxJQUFFLENBQUMsRUFBRSxTQUFTLFNBQVMsS0FBRyxDQUFDLEVBQUUsU0FBUyxPQUFPLEdBQUUsSUFBRSxLQUFHLEVBQUUsU0FBUyxTQUFTLEdBQUUsSUFBRSxLQUFHLEVBQUUsU0FBUyxPQUFPLEdBQUUsSUFBRSxJQUFFLElBQUUsR0FBRSxJQUFFLElBQUUsR0FBRyxHQUFFLFNBQVEsRUFBRSxJQUFFLE1BQUksR0FBRSxJQUFFLEdBQUcsR0FBRSxTQUFRLENBQUMsSUFBRSxLQUFJLElBQUUsR0FBRyxHQUFFLFVBQVMsUUFBUSxHQUFFLElBQUUsc0JBQXFCLElBQUUsR0FBRyxHQUFFLFlBQVcsR0FBRyxJQUFFLEtBQUksS0FBRyxHQUFHLEdBQUUsWUFBVyxFQUFFLElBQUUsS0FBSSxJ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QUFFO0FBQUEsUUFBRyxDQUFDO0FBQUEsTUFBQyxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFLEdBQUUsR0FBRTtBQUFDLFVBQUcsRUFBRSxRQUFRLENBQUMsTUFBSTtBQUFHLGVBQU87QUFBRSxVQUFJLElBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxJQUFFLENBQUM7QUFBRSxVQUFHLENBQUMsS0FBRyxNQUFJLFdBQVMsTUFBTSxDQUFDO0FBQUUsZUFBTztBQUFFLFVBQUcsTUFBSSxjQUFZLE1BQUksU0FBUTtBQUFDLFlBQUksSUFBRSxFQUFFLE1BQU0sWUFBWTtBQUFFLFlBQUc7QUFBRSxpQkFBTyxFQUFFLENBQUM7QUFBQSxNQUFDO0FBQUMsYUFBTyxNQUFJLFlBQVUsQ0FBQyxPQUFNLFNBQVEsUUFBTyxVQUFTLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRSxRQUFRLENBQUMsSUFBRSxDQUFDLENBQUMsSUFBRSxDQUFDLEdBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxJQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFFO0FBQUEsSUFBQztBQUFDLFFBQUksSUFBRTtBQUFHLGFBQVMsRUFBRSxHQUFFLElBQUUsTUFBSTtBQUFBLElBQUMsR0FBRTtBQUFDLGFBQU0sSUFBSSxNQUFJLElBQUUsRUFBRSxHQUFHLENBQUMsSUFBRSxFQUFFLEdBQUcsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU0sSUFBSSxNQUFJLEtBQUcsRUFBRSxHQUFHLENBQUM7QUFBQSxJQUFDO0FBQUMsUUFBSSxLQUFHLENBQUM7QUFBRSxhQUFTLEVBQUUsR0FBRTtBQUFDLFNBQUcsS0FBSyxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFLEdBQUU7QUFBQyxTQUFHLFFBQVEsT0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLEdBQUUsSUFBRSxNQUFHLEdBQUcsTUFBSTtBQUFDLFVBQUUsR0FBRSxDQUFDLEdBQUUsTUFBSTtBQUFDLFlBQUUsR0FBRSxNQUFJO0FBQUEsVUFBQyxDQUFDO0FBQUEsUUFBQyxDQUFDO0FBQUEsTUFBQyxDQUFDLEdBQUUsSUFBRTtBQUFBLElBQUU7QUFBQyxRQUFJLEtBQUc7QUFBRyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsUUFBRSxpQkFBZSxFQUFFLGVBQWEsRUFBRSxlQUFjLElBQUUsTUFBRyxLQUFHLE1BQUcsR0FBRyxNQUFJO0FBQUMsV0FBRyxDQUFDO0FBQUEsTUFBQyxDQUFDLEdBQUUsSUFBRSxPQUFHLEtBQUc7QUFBQSxJQUFFO0FBQUMsYUFBUyxHQUFHLEdBQUU7QUFBQyxVQUFJLElBQUU7QUFBRyxRQUFFLEdBQUUsQ0FBQyxHQUFFLE1BQUk7QUFBQyxVQUFFLEdBQUUsQ0FBQyxHQUFFLE1BQUk7QUFBQyxjQUFHLEtBQUcsR0FBRyxDQUFDO0FBQUUsbUJBQU8sRUFBRTtBQUFFLGNBQUUsTUFBRyxFQUFFLEdBQUUsQ0FBQztBQUFBLFFBQUMsQ0FBQztBQUFBLE1BQUMsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLFVBQUksSUFBRTtBQUFFLFNBQUcsQ0FBQyxHQUFFLE1BQUk7QUFBQyxZQUFJLElBQUUsRUFBRSxDQUFDO0FBQUUsZUFBTyxFQUFFLENBQUMsR0FBRSxNQUFJO0FBQUEsUUFBQztBQUFBLE1BQUMsQ0FBQyxHQUFFLEVBQUUsR0FBRSxHQUFHLENBQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRSxHQUFFLElBQUUsQ0FBQyxHQUFFO0FBQUMsY0FBTyxFQUFFLGdCQUFjLEVBQUUsY0FBWSxFQUFFLENBQUMsQ0FBQyxJQUFHLEVBQUUsWUFBWSxDQUFDLElBQUUsR0FBRSxJQUFFLEVBQUUsU0FBUyxPQUFPLElBQUUsR0FBRyxDQUFDLElBQUUsR0FBRSxHQUFFO0FBQUEsUUFBQyxLQUFJO0FBQVEsYUFBRyxHQUFFLENBQUM7QUFBRTtBQUFBLFFBQU0sS0FBSTtBQUFRLGFBQUcsR0FBRSxDQUFDO0FBQUU7QUFBQSxRQUFNLEtBQUk7QUFBUSxhQUFHLEdBQUUsQ0FBQztBQUFFO0FBQUEsUUFBTSxLQUFJO0FBQUEsUUFBVyxLQUFJO0FBQVUsYUFBRyxHQUFFLEdBQUUsQ0FBQztBQUFFO0FBQUEsUUFBTTtBQUFRLGFBQUcsR0FBRSxHQUFFLENBQUM7QUFBRTtBQUFBLE1BQUs7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLFVBQUcsR0FBRyxDQUFDO0FBQUUsVUFBRSxXQUFXLFVBQVEsV0FBUyxFQUFFLFFBQU0sSUFBRyxPQUFPLGNBQVksT0FBTyxLQUFHLFlBQVUsRUFBRSxVQUFRLEdBQUcsRUFBRSxLQUFLLE1BQUksSUFBRSxFQUFFLFVBQVEsR0FBRyxFQUFFLE9BQU0sQ0FBQztBQUFBLGVBQVcsR0FBRyxDQUFDO0FBQUUsZUFBTyxVQUFVLENBQUMsSUFBRSxFQUFFLFFBQU0sSUFBRSxDQUFDLE1BQU0sUUFBUSxDQUFDLEtBQUcsT0FBTyxLQUFHLGFBQVcsQ0FBQyxDQUFDLE1BQUssTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFFLEVBQUUsUUFBTSxPQUFPLENBQUMsSUFBRSxNQUFNLFFBQVEsQ0FBQyxJQUFFLEVBQUUsVUFBUSxFQUFFLEtBQUssT0FBRyxHQUFHLEdBQUUsRUFBRSxLQUFLLENBQUMsSUFBRSxFQUFFLFVBQVEsQ0FBQyxDQUFDO0FBQUEsZUFBVSxFQUFFLFlBQVU7QUFBUyxXQUFHLEdBQUUsQ0FBQztBQUFBLFdBQU07QUFBQyxZQUFHLEVBQUUsVUFBUTtBQUFFO0FBQU8sVUFBRSxRQUFNLE1BQUksU0FBTyxLQUFHO0FBQUEsTUFBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsUUFBRSx1QkFBcUIsRUFBRSxvQkFBb0IsR0FBRSxFQUFFLHNCQUFvQixHQUFHLEdBQUUsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsUUFBRSxzQkFBb0IsRUFBRSxtQkFBbUIsR0FBRSxFQUFFLHFCQUFtQixFQUFFLEdBQUUsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFLEdBQUU7QUFBQyxTQUFHLEdBQUUsR0FBRSxDQUFDLEdBQUUsR0FBRyxHQUFFLEdBQUUsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFLEdBQUU7QUFBQyxPQUFDLE1BQUssUUFBTyxLQUFFLEVBQUUsU0FBUyxDQUFDLEtBQUcsR0FBRyxDQUFDLElBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFHLEdBQUcsQ0FBQyxNQUFJLElBQUUsSUFBRyxHQUFHLEdBQUUsR0FBRSxDQUFDO0FBQUEsSUFBRTtBQUFDLGFBQVMsR0FBRyxHQUFFLEdBQUUsR0FBRTtBQUFDLFFBQUUsYUFBYSxDQUFDLEtBQUcsS0FBRyxFQUFFLGFBQWEsR0FBRSxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFLEdBQUUsR0FBRTtBQUFDLFFBQUUsQ0FBQyxNQUFJLE1BQUksRUFBRSxDQUFDLElBQUU7QUFBQSxJQUFFO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLFVBQUksSUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxPQUFHLElBQUUsRUFBRTtBQUFFLFlBQU0sS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLE9BQUc7QUFBQyxVQUFFLFdBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSztBQUFBLE1BQUMsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxVQUFTLENBQUMsR0FBRSxNQUFJLEVBQUUsWUFBWSxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFLEdBQUU7QUFBQyxhQUFPLEtBQUc7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUU7QUFBQyxhQUFNLENBQUMsR0FBRSxLQUFJLFFBQU8sTUFBSyxPQUFNLElBQUUsRUFBRSxTQUFTLENBQUMsSUFBRSxPQUFHLENBQUMsR0FBRSxLQUFJLFNBQVEsT0FBTSxNQUFLLEtBQUUsRUFBRSxTQUFTLENBQUMsSUFBRSxRQUFHLElBQUUsUUFBUSxDQUFDLElBQUU7QUFBQSxJQUFJO0FBQUMsUUFBSSxLQUFHLG9CQUFJLElBQUksQ0FBQyxtQkFBa0IsU0FBUSxhQUFZLFlBQVcsV0FBVSxZQUFXLFdBQVUsU0FBUSxZQUFXLGtCQUFpQixTQUFRLFNBQVEsYUFBWSxRQUFPLFlBQVcsU0FBUSxZQUFXLGNBQWEsUUFBTyxlQUFjLFlBQVcsWUFBVyxZQUFXLFlBQVcsc0JBQXFCLDRCQUEyQix3QkFBd0IsQ0FBQztBQUFFLGFBQVMsR0FBRyxHQUFFO0FBQUMsYUFBTyxHQUFHLElBQUksQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU0sQ0FBQyxDQUFDLGdCQUFlLGdCQUFlLGlCQUFnQixlQUFlLEVBQUUsU0FBUyxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFLEdBQUUsR0FBRTtBQUFDLGFBQU8sRUFBRSxlQUFhLEVBQUUsWUFBWSxDQUFDLE1BQUksU0FBTyxFQUFFLFlBQVksQ0FBQyxJQUFFLEdBQUcsR0FBRSxHQUFFLENBQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRSxHQUFFLElBQUUsTUFBRztBQUFDLFVBQUcsRUFBRSxlQUFhLEVBQUUsWUFBWSxDQUFDLE1BQUk7QUFBTyxlQUFPLEVBQUUsWUFBWSxDQUFDO0FBQUUsVUFBRyxFQUFFLHFCQUFtQixFQUFFLGtCQUFrQixDQUFDLE1BQUksUUFBTztBQUFDLFlBQUksSUFBRSxFQUFFLGtCQUFrQixDQUFDO0FBQUUsZUFBTyxFQUFFLFVBQVEsR0FBRSxHQUFHLE1BQUksRUFBRSxHQUFFLEVBQUUsVUFBVSxDQUFDO0FBQUEsTUFBQztBQUFDLGFBQU8sR0FBRyxHQUFFLEdBQUUsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFLEdBQUU7QUFBQyxVQUFJLElBQUUsRUFBRSxhQUFhLENBQUM7QUFBRSxhQUFPLE1BQUksT0FBSyxPQUFPLEtBQUcsYUFBVyxFQUFFLElBQUUsSUFBRSxNQUFJLEtBQUcsT0FBRyxHQUFHLENBQUMsSUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsSUFBRTtBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU8sRUFBRSxTQUFPLGNBQVksRUFBRSxjQUFZLGlCQUFlLEVBQUUsY0FBWTtBQUFBLElBQVc7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU8sRUFBRSxTQUFPLFdBQVMsRUFBRSxjQUFZO0FBQUEsSUFBVTtBQUFDLGFBQVMsR0FBRyxHQUFFLEdBQUU7QUFBQyxVQUFJO0FBQUUsYUFBTyxXQUFVO0FBQUMsWUFBSSxJQUFFLE1BQUssSUFBRSxXQUFVLElBQUUsV0FBVTtBQUFDLGNBQUUsTUFBSyxFQUFFLE1BQU0sR0FBRSxDQUFDO0FBQUEsUUFBQztBQUFFLHFCQUFhLENBQUMsR0FBRSxJQUFFLFdBQVcsR0FBRSxDQUFDO0FBQUEsTUFBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsVUFBSTtBQUFFLGFBQU8sV0FBVTtBQUFDLFlBQUksSUFBRSxNQUFLLElBQUU7QUFBVSxjQUFJLEVBQUUsTUFBTSxHQUFFLENBQUMsR0FBRSxJQUFFLE1BQUcsV0FBVyxNQUFJLElBQUUsT0FBRyxDQUFDO0FBQUEsTUFBRTtBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsRUFBQyxLQUFJLEdBQUUsS0FBSSxFQUFDLEdBQUUsRUFBQyxLQUFJLEdBQUUsS0FBSSxFQUFDLEdBQUU7QUFBQyxVQUFJLElBQUUsTUFBRyxHQUFFLEdBQUUsSUFBRSxFQUFFLE1BQUk7QUFBQyxZQUFJLElBQUUsRUFBRSxHQUFFLElBQUUsRUFBRTtBQUFFLFlBQUc7QUFBRSxZQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUUsSUFBRTtBQUFBLGFBQU87QUFBQyxjQUFJLElBQUUsS0FBSyxVQUFVLENBQUMsR0FBRSxJQUFFLEtBQUssVUFBVSxDQUFDO0FBQUUsZ0JBQUksSUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUUsTUFBSSxLQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFBQSxRQUFDO0FBQUMsWUFBRSxLQUFLLFVBQVUsRUFBRSxDQUFDLEdBQUUsSUFBRSxLQUFLLFVBQVUsRUFBRSxDQUFDO0FBQUEsTUFBQyxDQUFDO0FBQUUsYUFBTSxNQUFJO0FBQUMsVUFBRSxDQUFDO0FBQUEsTUFBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU8sT0FBTyxLQUFHLFdBQVMsS0FBSyxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsSUFBRTtBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLE9BQUMsTUFBTSxRQUFRLENBQUMsSUFBRSxJQUFFLENBQUMsQ0FBQyxHQUFHLFFBQVEsT0FBRyxFQUFFLENBQUMsQ0FBQztBQUFBLElBQUM7QUFBQyxRQUFJLElBQUUsQ0FBQyxHQUFFLEtBQUc7QUFBRyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsVUFBRyxPQUFLLElBQUUsRUFBRSxDQUFDLEdBQUUsS0FBRyxPQUFJLE1BQUk7QUFBTyxlQUFPLEVBQUUsQ0FBQztBQUFFLFFBQUUsQ0FBQyxJQUFFLEdBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFFLE9BQU8sS0FBRyxZQUFVLE1BQUksUUFBTSxFQUFFLGVBQWUsTUFBTSxLQUFHLE9BQU8sRUFBRSxRQUFNLGNBQVksRUFBRSxDQUFDLEVBQUUsS0FBSztBQUFBLElBQUM7QUFBQyxhQUFTLEtBQUk7QUFBQyxhQUFPO0FBQUEsSUFBQztBQUFDLFFBQUksS0FBRyxDQUFDO0FBQUUsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLFVBQUksSUFBRSxPQUFPLEtBQUcsYUFBVyxNQUFJLElBQUU7QUFBRSxhQUFPLGFBQWEsVUFBUSxHQUFHLEdBQUUsRUFBRSxDQUFDLEtBQUcsR0FBRyxDQUFDLElBQUUsR0FBRSxNQUFJO0FBQUEsTUFBQztBQUFBLElBQUU7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU8sT0FBTyxRQUFRLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFFLENBQUMsTUFBSTtBQUFDLGVBQU8sZUFBZSxHQUFFLEdBQUUsRUFBQyxNQUFLO0FBQUMsaUJBQU0sSUFBSSxNQUFJLEVBQUUsR0FBRyxDQUFDO0FBQUEsUUFBQyxFQUFDLENBQUM7QUFBQSxNQUFDLENBQUMsR0FBRTtBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFLEdBQUU7QUFBQyxVQUFJLElBQUUsQ0FBQztBQUFFLGFBQUssRUFBRTtBQUFRLFVBQUUsSUFBSSxFQUFFO0FBQUUsVUFBSSxJQUFFLE9BQU8sUUFBUSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRSxDQUFDLE9BQUssRUFBQyxNQUFLLEdBQUUsT0FBTSxFQUFDLEVBQUUsR0FBRSxJQUFFLEdBQUcsQ0FBQztBQUFFLGFBQU8sSUFBRSxFQUFFLElBQUksT0FBRyxFQUFFLEtBQUssT0FBRyxFQUFFLFNBQU8sRUFBRSxJQUFJLElBQUUsRUFBQyxNQUFLLFVBQVUsRUFBRSxRQUFPLE9BQU0sSUFBSSxFQUFFLFNBQVEsSUFBRSxDQUFDLEdBQUUsR0FBRyxHQUFFLEdBQUUsQ0FBQyxFQUFFLElBQUksT0FBRztBQUFDLFVBQUUsS0FBSyxFQUFFLFdBQVcsR0FBRSxFQUFFO0FBQUEsTUFBQyxDQUFDLEdBQUUsTUFBSTtBQUFDLGVBQUssRUFBRTtBQUFRLFlBQUUsSUFBSSxFQUFFO0FBQUEsTUFBQztBQUFBLElBQUM7QUFBQyxRQUFJLEtBQUcsQ0FBQztBQUFFLGFBQVMsR0FBRyxHQUFFLEdBQUU7QUFBQyxTQUFHLENBQUMsSUFBRTtBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsYUFBTyxPQUFPLFFBQVEsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxNQUFJO0FBQUMsZUFBTyxlQUFlLEdBQUUsR0FBRSxFQUFDLE1BQUs7QUFBQyxpQkFBTSxJQUFJLE1BQUksRUFBRSxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUM7QUFBQSxRQUFDLEdBQUUsWUFBVyxNQUFFLENBQUM7QUFBQSxNQUFDLENBQUMsR0FBRTtBQUFBLElBQUM7QUFBQyxRQUFJLEtBQUcsRUFBQyxJQUFJLFdBQVU7QUFBQyxhQUFPO0FBQUEsSUFBQyxHQUFFLElBQUksVUFBUztBQUFDLGFBQU87QUFBQSxJQUFDLEdBQUUsSUFBSSxTQUFRO0FBQUMsYUFBTztBQUFBLElBQUMsR0FBRSxJQUFJLE1BQUs7QUFBQyxhQUFPO0FBQUEsSUFBRSxHQUFFLFNBQVEsVUFBUyxnQ0FBK0IsSUFBRywyQkFBMEIsSUFBRyx5QkFBd0IsSUFBRyx5QkFBd0IsSUFBRyx3QkFBdUIsSUFBRyxxQkFBb0IsSUFBRyxvQkFBbUIsSUFBRyxtQkFBa0IsSUFBRyxrQkFBaUIsR0FBRSxpQkFBZ0IsR0FBRSxpQkFBZ0IsSUFBRyxpQkFBZ0IsSUFBRyxpQkFBZ0IsSUFBRyxpQkFBZ0IsSUFBRyxnQkFBZSxHQUFFLGdCQUFlLEdBQUUsZ0JBQWUsSUFBRyxlQUFjLElBQUcsZUFBYyxHQUFFLGVBQWMsSUFBRyxjQUFhLElBQUcsY0FBYSxHQUFFLGFBQVksSUFBRyxhQUFZLEdBQUUsYUFBWSxJQUFHLGFBQVksR0FBRSxhQUFZLEdBQUUsYUFBWSxJQUFHLFlBQVcsSUFBRyxXQUFVLEdBQUUsV0FBVSxHQUFFLFdBQVUsR0FBRSxVQUFTLElBQUcsVUFBUyxJQUFHLFVBQVMsSUFBRyxVQUFTLEdBQUUsVUFBUyxHQUFFLFVBQVMsSUFBRyxVQUFTLEdBQUUsUUFBTyxJQUFHLFFBQU8sSUFBRyxPQUFNLEdBQUUsT0FBTSxJQUFHLE9BQU0sSUFBRyxPQUFNLElBQUcsV0FBVSxJQUFHLE9BQU0sSUFBRyxPQUFNLElBQUcsT0FBTSxJQUFHLE1BQUssR0FBRSxNQUFLLElBQUcsTUFBSyxHQUFFLEdBQUUsSUFBRTtBQUFHLGFBQVMsR0FBRyxHQUFFLEdBQUU7QUFBQyxVQUFJLElBQUUsdUJBQU8sT0FBTyxJQUFJLEdBQUUsSUFBRSxFQUFFLE1BQU0sR0FBRztBQUFFLGVBQVEsSUFBRSxHQUFFLElBQUUsRUFBRSxRQUFPO0FBQUksVUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFFO0FBQUcsYUFBTyxJQUFFLE9BQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxZQUFZLENBQUMsSUFBRSxPQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFBQSxJQUFDO0FBQUMsUUFBSSxLQUFHO0FBQThFLFFBQUksS0FBRyxHQUFHLEtBQUcsOElBQThJO0FBQUUsUUFBSSxLQUFHLE9BQU8sT0FBTyxDQUFDLENBQUMsR0FBRSxLQUFHLE9BQU8sT0FBTyxDQUFDLENBQUM7QUFBRSxRQUFJLEtBQUcsT0FBTyxVQUFVLGdCQUFlLEtBQUcsQ0FBQyxHQUFFLE1BQUksR0FBRyxLQUFLLEdBQUUsQ0FBQyxHQUFFLElBQUUsTUFBTSxTQUFRLEtBQUcsT0FBRyxHQUFHLENBQUMsTUFBSTtBQUFlLFFBQUksS0FBRyxPQUFHLE9BQU8sS0FBRyxVQUFTLEtBQUcsT0FBRyxPQUFPLEtBQUcsVUFBUyxLQUFHLE9BQUcsTUFBSSxRQUFNLE9BQU8sS0FBRztBQUFTLFFBQUksS0FBRyxPQUFPLFVBQVUsVUFBUyxLQUFHLE9BQUcsR0FBRyxLQUFLLENBQUMsR0FBRSxLQUFHLE9BQUcsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFFLEVBQUU7QUFBRSxRQUFJLEtBQUcsT0FBRyxHQUFHLENBQUMsS0FBRyxNQUFJLFNBQU8sRUFBRSxDQUFDLE1BQUksT0FBSyxLQUFHLFNBQVMsR0FBRSxFQUFFLE1BQUk7QUFBRSxRQUFJLEtBQUcsT0FBRztBQUFDLFVBQUksSUFBRSx1QkFBTyxPQUFPLElBQUk7QUFBRSxhQUFPLE9BQUcsRUFBRSxDQUFDLE1BQUksRUFBRSxDQUFDLElBQUUsRUFBRSxDQUFDO0FBQUEsSUFBRSxHQUFFLEtBQUcsVUFBUyxLQUFHLEdBQUcsT0FBRyxFQUFFLFFBQVEsSUFBRyxDQUFDLEdBQUUsTUFBSSxJQUFFLEVBQUUsWUFBWSxJQUFFLEVBQUUsQ0FBQyxHQUFFLEtBQUcsY0FBYSxLQUFHLEdBQUcsT0FBRyxFQUFFLFFBQVEsSUFBRyxLQUFLLEVBQUUsWUFBWSxDQUFDLEdBQUUsS0FBRyxHQUFHLE9BQUcsRUFBRSxPQUFPLENBQUMsRUFBRSxZQUFZLElBQUUsRUFBRSxNQUFNLENBQUMs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QUFJLElBQUUsT0FBRztBQUFDLGFBQUcsRUFBRSxRQUFRLE9BQUc7QUFBQyxXQUFDLE1BQUksS0FBRyxFQUFFLGlCQUFlLEVBQUUsSUFBSSxDQUFDO0FBQUEsUUFBQyxDQUFDO0FBQUEsTUFBQztBQUFFLFVBQUcsTUFBSTtBQUFRLFVBQUUsUUFBUSxDQUFDO0FBQUEsZUFBVSxNQUFJLFlBQVUsRUFBRSxDQUFDO0FBQUUsVUFBRSxRQUFRLENBQUMsR0FBRSxNQUFJO0FBQUMsV0FBQyxNQUFJLFlBQVUsS0FBRyxNQUFJLEVBQUUsQ0FBQztBQUFBLFFBQUMsQ0FBQztBQUFBO0FBQU8sZ0JBQU8sTUFBSSxVQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFFLEdBQUU7QUFBQSxVQUFDLEtBQUk7QUFBTSxjQUFFLENBQUMsSUFBRSxHQUFHLENBQUMsS0FBRyxFQUFFLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRSxHQUFHLENBQUMsS0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFBRztBQUFBLFVBQU0sS0FBSTtBQUFTLGNBQUUsQ0FBQyxNQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFFLEdBQUcsQ0FBQyxLQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUFHO0FBQUEsVUFBTSxLQUFJO0FBQU0sZUFBRyxDQUFDLEtBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQUU7QUFBQSxRQUFLO0FBQUMsVUFBSSxJQUFFLE9BQUc7QUFBQyxVQUFFLFFBQVEsYUFBVyxFQUFFLFFBQVEsVUFBVSxFQUFDLFFBQU8sR0FBRSxRQUFPLEdBQUUsS0FBSSxHQUFFLE1BQUssR0FBRSxVQUFTLEdBQUUsVUFBUyxHQUFFLFdBQVUsRUFBQyxDQUFDLEdBQUUsRUFBRSxRQUFRLFlBQVUsRUFBRSxRQUFRLFVBQVUsQ0FBQyxJQUFFLEVBQUU7QUFBQSxNQUFDO0FBQUUsUUFBRSxRQUFRLENBQUM7QUFBQSxJQUFDO0FBQUMsUUFBSSxLQUFHLEdBQUcsNkJBQTZCLEdBQUUsS0FBRyxJQUFJLElBQUksT0FBTyxvQkFBb0IsTUFBTSxFQUFFLElBQUksT0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUUsS0FBRyxHQUFHO0FBQUUsUUFBSSxLQUFHLEdBQUcsSUFBRTtBQUFFLFFBQUksS0FBRyxHQUFHO0FBQUUsYUFBUyxLQUFJO0FBQUMsVUFBSSxJQUFFLENBQUM7QUFBRSxhQUFNLENBQUMsWUFBVyxXQUFVLGFBQWEsRUFBRSxRQUFRLE9BQUc7QUFBQyxVQUFFLENBQUMsSUFBRSxZQUFZLEdBQUU7QUFBQyxjQUFJLElBQUUsRUFBRSxJQUFJO0FBQUUsbUJBQVEsSUFBRSxHQUFFLElBQUUsS0FBSyxRQUFPLElBQUUsR0FBRTtBQUFJLGNBQUUsR0FBRSxPQUFNLElBQUUsRUFBRTtBQUFFLGNBQUksSUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7QUFBRSxpQkFBTyxNQUFJLE1BQUksTUFBSSxRQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFFO0FBQUEsUUFBQztBQUFBLE1BQUMsQ0FBQyxHQUFFLENBQUMsUUFBTyxPQUFNLFNBQVEsV0FBVSxRQUFRLEVBQUUsUUFBUSxPQUFHO0FBQUMsVUFBRSxDQUFDLElBQUUsWUFBWSxHQUFFO0FBQUMsYUFBRztBQUFFLGNBQUksSUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxNQUFLLENBQUM7QUFBRSxpQkFBTyxHQUFHLEdBQUU7QUFBQSxRQUFDO0FBQUEsTUFBQyxDQUFDLEdBQUU7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLElBQUUsT0FBRyxJQUFFLE9BQUc7QUFBQyxhQUFPLFNBQVMsR0FBRSxHQUFFLEdBQUU7QUFBQyxZQUFHLE1BQUk7QUFBaUIsaUJBQU0sQ0FBQztBQUFFLFlBQUcsTUFBSTtBQUFpQixpQkFBTztBQUFFLFlBQUcsTUFBSSxhQUFXLE9BQUssSUFBRSxJQUFFLEtBQUcsS0FBRyxJQUFFLEtBQUcsSUFBSSxJQUFJLENBQUM7QUFBRSxpQkFBTztBQUFFLFlBQUksSUFBRSxFQUFFLENBQUM7QUFBRSxZQUFHLENBQUMsS0FBRyxLQUFHLEdBQUcsSUFBRyxDQUFDO0FBQUUsaUJBQU8sUUFBUSxJQUFJLElBQUcsR0FBRSxDQUFDO0FBQUUsWUFBSSxJQUFFLFFBQVEsSUFBSSxHQUFFLEdBQUUsQ0FBQztBQUFFLGdCQUFPLEdBQUcsQ0FBQyxJQUFFLEdBQUcsSUFBSSxDQUFDLElBQUUsR0FBRyxDQUFDLE9BQUssS0FBRyxFQUFFLEdBQUUsT0FBTSxDQUFDLEdBQUUsS0FBRyxJQUFFLEdBQUcsQ0FBQyxJQUFFLENBQUMsS0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFFLEVBQUUsUUFBTSxJQUFFLEdBQUcsQ0FBQyxJQUFFLElBQUUsR0FBRyxDQUFDLElBQUUsR0FBRyxDQUFDLElBQUU7QUFBQSxNQUFDO0FBQUEsSUFBQztBQUFDLFFBQUksS0FBRyxHQUFHO0FBQUUsYUFBUyxHQUFHLElBQUUsT0FBRztBQUFDLGFBQU8sU0FBUyxHQUFFLEdBQUUsR0FBRSxHQUFFO0FBQUMsWUFBSSxJQUFFLEVBQUUsQ0FBQztBQUFFLFlBQUcsQ0FBQyxNQUFJLElBQUUsRUFBRSxDQUFDLEdBQUUsSUFBRSxFQUFFLENBQUMsR0FBRSxDQUFDLEVBQUUsQ0FBQyxLQUFHLEdBQUcsQ0FBQyxLQUFHLENBQUMsR0FBRyxDQUFDO0FBQUcsaUJBQU8sRUFBRSxRQUFNLEdBQUU7QUFBRyxZQUFJLElBQUUsRUFBRSxDQUFDLEtBQUcsR0FBRyxDQUFDLElBQUUsT0FBTyxDQUFDLElBQUUsRUFBRSxTQUFPLEdBQUcsR0FBRSxDQUFDLEdBQUUsSUFBRSxRQUFRLElBQUksR0FBRSxHQUFFLEdBQUUsQ0FBQztBQUFFLGVBQU8sTUFBSSxFQUFFLENBQUMsTUFBSSxJQUFFLEdBQUcsR0FBRSxDQUFDLEtBQUcsRUFBRSxHQUFFLE9BQU0sR0FBRSxHQUFFLENBQUMsSUFBRSxFQUFFLEdBQUUsT0FBTSxHQUFFLENBQUMsSUFBRztBQUFBLE1BQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLFVBQUksSUFBRSxHQUFHLEdBQUUsQ0FBQyxHQUFFLElBQUUsRUFBRSxDQUFDLEdBQUUsSUFBRSxRQUFRLGVBQWUsR0FBRSxDQUFDO0FBQUUsYUFBTyxLQUFHLEtBQUcsRUFBRSxHQUFFLFVBQVMsR0FBRSxRQUFPLENBQUMsR0FBRTtBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsVUFBSSxJQUFFLFFBQVEsSUFBSSxHQUFFLENBQUM7QUFBRSxjQUFPLENBQUMsR0FBRyxDQUFDLEtBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFJLEVBQUUsR0FBRSxPQUFNLENBQUMsR0FBRTtBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU8sRUFBRSxHQUFFLFdBQVUsRUFBRSxDQUFDLElBQUUsV0FBUyxDQUFDLEdBQUUsUUFBUSxRQUFRLENBQUM7QUFBQSxJQUFDO0FBQUMsUUFBSSxLQUFHLEVBQUMsS0FBSSxJQUFHLEtBQUksSUFBRyxnQkFBZSxJQUFHLEtBQUksSUFBRyxTQUFRLEdBQUUsR0FBRSxLQUFHLEVBQUMsS0FBSSxJQUFHLElBQUksR0FBRSxHQUFFO0FBQUMsYUFBTyxRQUFRLEtBQUsseUJBQXlCLE9BQU8sQ0FBQyxrQ0FBaUMsQ0FBQyxHQUFFO0FBQUEsSUFBRSxHQUFFLGVBQWUsR0FBRSxHQUFFO0FBQUMsYUFBTyxRQUFRLEtBQUssNEJBQTRCLE9BQU8sQ0FBQyxrQ0FBaUMsQ0FBQyxHQUFFO0FBQUEsSUFBRSxFQUFDO0FBQUUsUUFBSSxLQUFHLE9BQUcsR0FBRyxDQUFDLElBQUUsR0FBRyxDQUFDLElBQUUsR0FBRSxLQUFHLE9BQUcsR0FBRyxDQUFDLElBQUUsR0FBRyxDQUFDLElBQUUsR0FBRSxLQUFHLE9BQUcsR0FBRSxLQUFHLE9BQUcsUUFBUSxlQUFlLENBQUM7QUFBRSxhQUFTLEdBQUcsR0FBRSxHQUFFLElBQUUsT0FBRyxJQUFFLE9BQUc7QUFBQyxVQUFFLEVBQUU7QUFBUSxVQUFJLElBQUUsRUFBRSxDQUFDLEdBQUUsSUFBRSxFQUFFLENBQUM7QUFBRSxZQUFJLEtBQUcsQ0FBQyxLQUFHLEVBQUUsR0FBRSxPQUFNLENBQUMsR0FBRSxDQUFDLEtBQUcsRUFBRSxHQUFFLE9BQU0sQ0FBQztBQUFFLFVBQUcsRUFBQyxLQUFJLEVBQUMsSUFBRSxHQUFHLENBQUMsR0FBRSxJQUFFLElBQUUsS0FBRyxJQUFFLEtBQUc7QUFBRyxVQUFHLEVBQUUsS0FBSyxHQUFFLENBQUM7QUFBRSxlQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUFFLFVBQUcsRUFBRSxLQUFLLEdBQUUsQ0FBQztBQUFFLGVBQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQUUsWUFBSSxLQUFHLEVBQUUsSUFBSSxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFLElBQUUsT0FBRztBQUFDLFVBQUksSUFBRSxLQUFLLFNBQVEsSUFBRSxFQUFFLENBQUMsR0FBRSxJQUFFLEVBQUUsQ0FBQztBQUFFLGFBQU8sTUFBSSxLQUFHLENBQUMsS0FBRyxFQUFFLEdBQUUsT0FBTSxDQUFDLEdBQUUsQ0FBQyxLQUFHLEVBQUUsR0FBRSxPQUFNLENBQUMsR0FBRSxNQUFJLElBQUUsRUFBRSxJQUFJLENBQUMsSUFBRSxFQUFFLElBQUksQ0FBQyxLQUFHLEVBQUUsSUFBSSxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFLElBQUUsT0FBRztBQUFDLGFBQU8sSUFBRSxFQUFFLFNBQVEsQ0FBQyxLQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUUsV0FBVSxDQUFDLEdBQUUsUUFBUSxJQUFJLEdBQUUsUUFBTyxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFO0FBQUMsVUFBRSxFQUFFLENBQUM7QUFBRSxVQUFJLElBQUUsRUFBRSxJQUFJO0FBQUUsYUFBTyxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssR0FBRSxDQUFDLE1BQUksRUFBRSxJQUFJLENBQUMsR0FBRSxFQUFFLEdBQUUsT0FBTSxHQUFFLENBQUMsSUFBRztBQUFBLElBQUk7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsVUFBRSxFQUFFLENBQUM7QUFBRSxVQUFJLElBQUUsRUFBRSxJQUFJLEdBQUUsRUFBQyxLQUFJLEdBQUUsS0FBSSxFQUFDLElBQUUsR0FBRyxDQUFDLEdBQUUsSUFBRSxFQUFFLEtBQUssR0FBRSxDQUFDO0FBQUUsVUFBRSxHQUFHLEdBQUUsR0FBRSxDQUFDLEtBQUcsSUFBRSxFQUFFLENBQUMsR0FBRSxJQUFFLEVBQUUsS0FBSyxHQUFFLENBQUM7QUFBRyxVQUFJLElBQUUsRUFBRSxLQUFLLEdBQUUsQ0FBQztBQUFFLGFBQU8sRUFBRSxJQUFJLEdBQUUsQ0FBQyxHQUFFLElBQUUsR0FBRyxHQUFFLENBQUMsS0FBRyxFQUFFLEdBQUUsT0FBTSxHQUFFLEdBQUUsQ0FBQyxJQUFFLEVBQUUsR0FBRSxPQUFNLEdBQUUsQ0FBQyxHQUFFO0FBQUEsSUFBSTtBQUFDLGFBQVMsR0FBRyxHQUFFO0FBQUMsVUFBSSxJQUFFLEVBQUUsSUFBSSxHQUFFLEVBQUMsS0FBSSxHQUFFLEtBQUksRUFBQyxJQUFFLEdBQUcsQ0FBQyxHQUFFLElBQUUsRUFBRSxLQUFLLEdBQUUsQ0FBQztBQUFFLFVBQUUsR0FBRyxHQUFFLEdBQUUsQ0FBQyxLQUFHLElBQUUsRUFBRSxDQUFDLEdBQUUsSUFBRSxFQUFFLEtBQUssR0FBRSxDQUFDO0FBQUcsVUFBSSxJQUFFLElBQUUsRUFBRSxLQUFLLEdBQUUsQ0FBQyxJQUFFLFFBQU8sSUFBRSxFQUFFLE9BQU8sQ0FBQztBQUFFLGFBQU8sS0FBRyxFQUFFLEdBQUUsVUFBUyxHQUFFLFFBQU8sQ0FBQyxHQUFFO0FBQUEsSUFBQztBQUFDLGFBQVMsS0FBSTtBQUFDLFVBQUksSUFBRSxFQUFFLElBQUksR0FBRSxJQUFFLEVBQUUsU0FBTyxHQUFFLElBQUUsR0FBRyxDQUFDLElBQUUsSUFBSSxJQUFJLENBQUMsSUFBRSxJQUFJLElBQUksQ0FBQyxHQUFFLElBQUUsRUFBRSxNQUFNO0FBQUUsYUFBTyxLQUFHLEVBQUUsR0FBRSxTQUFRLFFBQU8sUUFBTyxDQUFDLEdBQUU7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLGFBQU8sU0FBUyxHQUFFLEdBQUU7QUFBQyxZQUFJLElBQUUsTUFBSyxJQUFFLEVBQUUsU0FBUSxJQUFFLEVBQUUsQ0FBQyxHQUFFLElBQUUsSUFBRSxLQUFHLElBQUUsS0FBRztBQUFHLGVBQU0sQ0FBQyxLQUFHLEVBQUUsR0FBRSxXQUFVLENBQUMsR0FBRSxFQUFFLFFBQVEsQ0FBQyxHQUFFLE1BQUksRUFBRSxLQUFLLEdBQUUsRUFBRSxDQUFDLEdBQUUsRUFBRSxDQUFDLEdBQUUsQ0FBQyxDQUFDO0FBQUEsTUFBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFLEdBQUU7QUFBQyxhQUFPLFlBQVksR0FBRTtBQUFDLFlBQUksSUFBRSxLQUFLLFNBQVEsSUFBRSxFQUFFLENBQUMsR0FBRSxJQUFFLEdBQUcsQ0FBQyxHQUFFLElBQUUsTUFBSSxhQUFXLE1BQUksT0FBTyxZQUFVLEdBQUUsSUFBRSxNQUFJLFVBQVEsR0FBRSxJQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFFLElBQUUsSUFBRSxLQUFHLElBQUUsS0FBRztBQUFHLGVBQU0sQ0FBQyxLQUFHLEVBQUUsR0FBRSxXQUFVLElBQUUsS0FBRyxDQUFDLEdBQUUsRUFBQyxPQUFNO0FBQUMsY0FBRyxFQUFDLE9BQU0sR0FBRSxNQUFLLEVBQUMsSUFBRSxFQUFFLEtBQUs7QUFBRSxpQkFBTyxJQUFFLEVBQUMsT0FBTSxHQUFFLE1BQUssRUFBQyxJQUFFLEVBQUMsT0FBTSxJQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFFLEVBQUUsQ0FBQyxHQUFFLE1BQUssRUFBQztBQUFBLFFBQUMsR0FBRSxDQUFDLE9BQU8sUUFBUSxJQUFHO0FBQUMsaUJBQU87QUFBQSxRQUFJLEVBQUM7QUFBQSxNQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsRUFBRSxHQUFFO0FBQUMsYUFBTyxZQUFZLEdBQUU7QUFBQztBQUFDLGNBQUksSUFBRSxFQUFFLENBQUMsSUFBRSxXQUFXLEVBQUUsQ0FBQyxRQUFNO0FBQUcsa0JBQVEsS0FBSyxHQUFHLEdBQUcsQ0FBQyxlQUFlLGdDQUErQixFQUFFLElBQUksQ0FBQztBQUFBLFFBQUM7QUFBQyxlQUFPLE1BQUksV0FBUyxRQUFHO0FBQUEsTUFBSTtBQUFBLElBQUM7QUFBQyxhQUFTLEtBQUk7QUFBQyxVQUFJLElBQUUsRUFBQyxJQUFJLEdBQUU7QUFBQyxlQUFPLEdBQUcsTUFBSyxDQUFDO0FBQUEsTUFBQyxHQUFFLElBQUksT0FBTTtBQUFDLGVBQU8sR0FBRyxJQUFJO0FBQUEsTUFBQyxHQUFFLEtBQUksSUFBRyxLQUFJLElBQUcsS0FBSSxJQUFHLFFBQU8sSUFBRyxPQUFNLElBQUcsU0FBUSxHQUFHLE9BQUcsS0FBRSxFQUFDLEdBQUUsSUFBRSxFQUFDLElBQUksR0FBRTtBQUFDLGVBQU8sR0FBRyxNQUFLLEdBQUUsT0FBRyxJQUFFO0FBQUEsTUFBQyxHQUFFLElBQUksT0FBTTtBQUFDLGVBQU8sR0FBRyxJQUFJO0FBQUEsTUFBQyxHQUFFLEtBQUksSUFBRyxLQUFJLElBQUcsS0FBSSxJQUFHLFFBQU8sSUFBRyxPQUFNLElBQUcsU0FBUSxHQUFHLE9BQUcsSUFBRSxFQUFDLEdBQUUsSUFBRSxFQUFDLElBQUksR0FBRTtBQUFDLGVBQU8sR0FBRyxNQUFLLEdBQUUsSUFBRTtBQUFBLE1BQUMsR0FBRSxJQUFJLE9BQU07QUFBQyxlQUFPLEdBQUcsTUFBSyxJQUFFO0FBQUEsTUFBQyxHQUFFLElBQUksR0FBRTtBQUFDLGVBQU8sR0FBRyxLQUFLLE1BQUssR0FBRSxJQUFFO0FBQUEsTUFBQyxHQUFFLEtBQUksRUFBRSxLQUFLLEdBQUUsS0FBSSxFQUFFLEtBQUssR0FBRSxRQUFPLEVBQUUsUUFBUSxHQUFFLE9BQU0sRUFBRSxPQUFPLEdBQUUsU0FBUSxHQUFHLE1BQUcsS0FBRSxFQUFDLEdBQUUsSUFBRSxFQUFDLElBQUks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QVMsR0FBRyxHQUFFO0FBQUMsYUFBTyxHQUFHLENBQUMsTUFBSSxHQUFHLENBQUMsSUFBRSxJQUFHLEVBQUUsR0FBRyxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFLEdBQUU7QUFBQyxhQUFPLEVBQUUsR0FBRSxPQUFHO0FBQUMsWUFBRyxFQUFFLFVBQVEsRUFBRSxPQUFPLENBQUM7QUFBRSxpQkFBTTtBQUFBLE1BQUUsQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRSxHQUFFO0FBQUMsUUFBRSxXQUFTLEVBQUUsU0FBTyxDQUFDLElBQUcsRUFBRSxPQUFPLENBQUMsTUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFFLEdBQUcsQ0FBQztBQUFBLElBQUU7QUFBQyxNQUFFLE1BQUssQ0FBQyxHQUFFLEVBQUMsU0FBUSxFQUFDLE1BQUksQ0FBQyxHQUFFLElBQUUsU0FBTztBQUFDLFVBQUksSUFBRSxHQUFHLElBQUksSUFBRSxJQUFJLE1BQUk7QUFBSyxhQUFPLEdBQUcsR0FBRSxHQUFFLEdBQUUsTUFBSTtBQUFDLFlBQUksSUFBRSxHQUFHLEdBQUUsQ0FBQyxHQUFFLElBQUUsSUFBRSxFQUFFLE9BQU8sQ0FBQyxJQUFFLEdBQUcsQ0FBQztBQUFFLGVBQU8sSUFBRSxHQUFHLEtBQUssS0FBSyxNQUFJLEdBQUcsS0FBSztBQUFBLE1BQUcsQ0FBQztBQUFBLElBQUMsQ0FBQztBQUFFLE1BQUUsQ0FBQyxHQUFFLE1BQUk7QUFBQyxRQUFFLFVBQVEsRUFBRSxRQUFNLEVBQUU7QUFBQSxJQUFNLENBQUM7QUFBRSxhQUFTLEdBQUcsR0FBRSxHQUFFLEdBQUUsR0FBRTtBQUFDLFVBQUcsRUFBRSxVQUFRLEVBQUUsUUFBTSxDQUFDLElBQUcsRUFBRSxNQUFNLENBQUM7QUFBRSxlQUFPLEVBQUUsTUFBTSxDQUFDO0FBQUUsVUFBSSxJQUFFLEVBQUU7QUFBRSxhQUFPLEVBQUUsTUFBTSxDQUFDLElBQUUsR0FBRSxFQUFFLE1BQUk7QUFBQyxlQUFPLEVBQUUsTUFBTSxDQUFDO0FBQUEsTUFBQyxD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S0FBRyxTQUFTLGNBQWMsS0FBSztBQUFFLGFBQVMsR0FBRyxHQUFFO0FBQUMsVUFBSSxJQUFFLEVBQUUsTUFBSSxTQUFTLGNBQWMsQ0FBQyxHQUFFLE1BQUksRUFBRSxFQUFFO0FBQUUsYUFBTyxLQUFHLEVBQUUsaURBQWlELElBQUksR0FBRTtBQUFBLElBQUM7QUFBQyxRQUFJLEtBQUcsTUFBSTtBQUFBLElBQUM7QUFBRSxPQUFHLFNBQU8sQ0FBQyxHQUFFLEVBQUMsV0FBVSxFQUFDLEdBQUUsRUFBQyxTQUFRLEVBQUMsTUFBSTtBQUFDLFFBQUUsU0FBUyxNQUFNLElBQUUsRUFBRSxnQkFBYyxPQUFHLEVBQUUsWUFBVSxNQUFHLEVBQUUsTUFBSTtBQUFDLFVBQUUsU0FBUyxNQUFNLElBQUUsT0FBTyxFQUFFLGdCQUFjLE9BQU8sRUFBRTtBQUFBLE1BQVMsQ0FBQztBQUFBLElBQUM7QUFBRSxNQUFFLFVBQVMsRUFBRTtBQUFFLE1BQUUsVUFBUyxFQUFFLENBQUMsR0FBRSxFQUFDLFlBQVcsRUFBQyxHQUFFLEVBQUMsUUFBTyxFQUFDLE1BQUk7QUFBQyxRQUFFLEVBQUUsR0FBRSxDQUFDLENBQUM7QUFBQSxJQUFDLENBQUMsQ0FBQztBQUFFLGFBQVMsR0FBRyxHQUFFLEdBQUUsR0FBRSxHQUFFO0FBQUMsVUFBSSxJQUFFLEdBQUUsSUFBRSxPQUFHLEVBQUUsQ0FBQyxHQUFFLElBQUUsQ0FBQyxHQUFFLElBQUUsQ0FBQyxHQUFFLE1BQUksT0FBRyxFQUFFLEdBQUUsQ0FBQztBQUFFLFVBQUcsRUFBRSxTQUFTLEtBQUssTUFBSSxJQUFFLEdBQUcsQ0FBQyxJQUFHLEVBQUUsU0FBUyxPQUFPLE1BQUksSUFBRSxHQUFHLENBQUMsSUFBRyxFQUFFLFNBQVMsU0FBUyxNQUFJLEVBQUUsVUFBUSxPQUFJLEVBQUUsU0FBUyxTQUFTLE1BQUksRUFBRSxVQUFRLE9BQUksRUFBRSxTQUFTLFFBQVEsTUFBSSxJQUFFLFNBQVEsRUFBRSxTQUFTLFVBQVUsTUFBSSxJQUFFLFdBQVUsRUFBRSxTQUFTLFVBQVUsR0FBRTtB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TyxPQUFHLENBQUMsQ0FBQyxVQUFTLFlBQVcsV0FBVSxRQUFPLFFBQU8sV0FBVSxRQUFPLFFBQU8sV0FBVSxXQUFVLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQUUsVUFBRyxFQUFFLFNBQVMsVUFBVSxHQUFFO0FBQUMsWUFBSSxJQUFFLEVBQUUsUUFBUSxVQUFVO0FBQUUsVUFBRSxPQUFPLEdBQUUsSUFBSSxFQUFFLElBQUUsQ0FBQyxLQUFHLGdCQUFnQixNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsSUFBRSxJQUFFLENBQUM7QUFBQSxNQUFDO0FBQUMsVUFBRyxFQUFFLFNBQVMsVUFBVSxHQUFFO0FBQUMsWUFBSSxJQUFFLEVBQUUsUUFBUSxVQUFVO0FBQUUsVUFBRSxPQUFPLEdBQUUsSUFBSSxFQUFFLElBQUUsQ0FBQyxLQUFHLGdCQUFnQixNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsSUFBRSxJQUFFLENBQUM7QUFBQSxNQUFDO0FBQUMsVUFBRyxFQUFFLFdBQVMsS0FBRyxFQUFFLFdBQVMsS0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFBRSxlQUFNO0FBQUcsVUFBSSxJQUFFLENBQUMsUUFBTyxTQUFRLE9BQU0sUUFBTyxPQUFNLE9BQU8sRUFBRSxPQUFPLE9BQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUFFLGFBQU8sSUFBRSxFQUFFLE9BQU8sT0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRSxFQUFFLEVBQUUsU0FBTyxLQUFHLEVBQUUsT0FBTyxTQUFLLE1BQUksU0FBTyxNQUFJLGFBQVcsSUFBRSxTQUFRLEVBQUUsR0FBRyxNQUFNLEVBQUUsRUFBRSxXQUFTLEVBQUUsV0FBUyxHQUFHLEVBQUUsSUFBSSxLQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUFBLElBQUc7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLFVBQUcsQ0FBQztBQUFFLGVBQU0sQ0FBQztBQUFFLFVBQUUsR0FBRyxDQUFDO0FB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RUFBRSxJQUFJLE9BQUc7QUFBQyxrQkFBSSxJQUFFLEVBQUUsU0FBTyxFQUFFO0FBQUsscUJBQU8sR0FBRyxDQUFDO0FBQUEsWUFBQyxDQUFDLElBQUUsRUFBRSxTQUFTLFNBQVMsSUFBRSxNQUFNLEtBQUssRUFBRSxPQUFPLGVBQWUsRUFBRSxJQUFJLE9BQUc7QUFBQyxrQkFBSSxJQUFFLEVBQUUsU0FBTyxFQUFFO0FBQUsscUJBQU8sR0FBRyxDQUFDO0FBQUEsWUFBQyxDQUFDLElBQUUsTUFBTSxLQUFLLEVBQUUsT0FBTyxlQUFlLEVBQUUsSUFBSSxPQUFHLEVBQUUsU0FBTyxFQUFFLElBQUk7QUFBRTtBQUFDLGdCQUFJO0FBQUUsbUJBQU8sR0FBRyxDQUFDLElBQUUsRUFBRSxPQUFPLFVBQVEsSUFBRSxFQUFFLE9BQU8sUUFBTSxJQUFFLElBQUUsSUFBRSxFQUFFLE9BQU8sT0FBTSxFQUFFLFNBQVMsUUFBUSxJQUFFLEdBQUcsQ0FBQyxJQUFFLEVBQUUsU0FBUyxTQUFTLElBQUUsR0FBRyxDQUFDLElBQUUsRUFBRSxTQUFTLE1BQU0sSUFBRSxFQUFFLEtBQUssSUFBRTtBQUFBLFVBQUM7QUFBQSxRQUFDO0FBQUEsTUFBQyxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFO0FBQUMsVUFBSSxJQUFFLElBQUUsV0FBVyxDQUFDLElBQUU7QUFBSyxhQUFPLEdBQUcsQ0FBQyxJQUFFLElBQUU7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRTtBQUFDLGFBQU8sS0FBRztBQUFBLElBQUM7QUFBQyxhQUFTLEdBQUcsR0FBRTtBQUFDLGFBQU0sQ0FBQyxNQUFNLFFBQVEsQ0FBQyxLQUFHLENBQUMsTUFBTSxDQUFDO0FBQUEsSUFBQztBQUFDLGFBQVMsR0FBRyxHQUFFO0FBQUMsYUFBTyxNQUFJLFFBQU0sT0FBTyxLQUFHLFlBQVUsT0FBTyxFQUFFLE9BQUssY0FBWSxPQUFPLEVBQUUsT0FBSztBQUFBLElBQVU7QUFBQyxNQUFFLFNBQVEsT0FBRyxlQUFlLE1BQUksRUFBRSxNQUFJLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQUUsT0FBRyxNQUFJLElBQUksRUFBRSxNQUFNLElBQUk7QUFBRSxNQUFFLFFBQU8sRUFBRSxDQUFDLEdBQUUsRUFBQyxZQUFXLEVBQUMsR0FBRSxFQUFDLFVBQVMsRUFBQyxNQUFJLE9BQU8sS0FBRyxXQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssS0FBRyxFQUFFLEdBQUUsQ0FBQyxHQUFFLEtBQUUsSUFBRSxFQUFFLEdBQUUsQ0FBQyxHQUFFLEtBQUUsQ0FBQyxDQUFDO0FBQUUsTUFBRSxRQUFPLENBQUMsR0FBRSxFQUFDLFlBQVcsRUFBQyxHQUFFLEVBQUMsUUFBTyxHQUFFLGVBQWMsRUFBQyxNQUFJO0FBQUMsVUFBSSxJQUFFLEVBQUUsQ0FBQztBQUFFLFFBQUUsTUFBSTtBQUFDLFVBQUUsT0FBRztBQUFDLFlBQUUsTUFBSTtBQUFDLGNBQUUsY0FBWTtBQUFBLFVBQUMsQ0FBQztBQUFBLFFBQUMsQ0FBQztBQUFBLE1BQUMsQ0FBQztBQUFBLElBQUMsQ0FBQztBQUFFLE1BQUUsUUFBTyxDQUFDLEdBQUUsRUFBQyxZQUFXLEVBQUMsR0FBRSxFQUFDLFFBQU8sR0FBRSxlQUFjLEVBQUMsTUFBSTtBQUFDLFVBQUksSUFBRSxFQUFFLENBQUM7QUFBRSxRQUFFLE1BQUk7QUFBQyxVQUFFLE9BQUc7QUFBQyxZQUFFLE1BQUk7QUFBQyxjQUFFLFlBQVUsR0FBRSxFQUFFLGdCQUFjLE1BQUcsRUFBRSxDQUFDLEdBQUUsT0FBTyxFQUFFO0FBQUEsVUFBYSxDQUFDO0FBQUEsUUFBQyxDQUFDO0FBQUEsTUFBQyxDQUFDO0FBQUEsSUFBQyxDQUFDO0FBQUUsT0FBRyxHQUFHLEtBQUksR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFBRSxRQUFJLEtBQUcsQ0FBQyxHQUFFLEVBQUMsT0FBTSxHQUFFLFdBQVUsR0FBRSxZQUFXLEdBQUUsVUFBUyxFQUFDLEdBQUUsRUFBQyxRQUFPLEdBQUUsU0FBUSxFQUFDLE1BQUk7QUFBQyxV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QUssQ0FBQztBQUFBLFVBQUM7QUFBQyxZQUFJLElBQUUsQ0FBQyxHQUFFLElBQUUsQ0FBQyxHQUFFLElBQUUsQ0FBQyxHQUFFLElBQUUsQ0FBQztBQUFFLGlCQUFRLElBQUUsR0FBRSxJQUFFLEVBQUUsUUFBTyxLQUFJO0FBQUMsY0FBSSxJQUFFLEVBQUUsQ0FBQztBQUFFLFlBQUUsUUFBUSxDQUFDLE1BQUksTUFBSSxFQUFFLEtBQUssQ0FBQztBQUFBLFFBQUM7QUFBQyxZQUFFLEVBQUUsT0FBTyxPQUFHLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUFFLFlBQUksS0FBRztBQUFXLGlCQUFRLElBQUUsR0FBRSxJQUFFLEVBQUUsUUFBTyxLQUFJO0FBQUMsY0FBSSxJQUFFLEVBQUUsQ0FBQyxHQUFFLElBQUUsRUFBRSxRQUFRLENBQUM7QUFBRSxjQUFHLE1BQUk7QUFBRyxjQUFFLE9BQU8sR0FBRSxHQUFFLENBQUMsR0FBRSxFQUFFLEtBQUssQ0FBQyxJQUFHLENBQUMsQ0FBQztBQUFBLG1CQUFVLE1BQUksR0FBRTtBQUFDLGdCQUFJLElBQUUsRUFBRSxPQUFPLEdBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRSxJQUFFLEVBQUUsT0FBTyxJQUFFLEdBQUUsQ0FBQyxFQUFFLENBQUM7QUFBRSxjQUFFLE9BQU8sR0FBRSxHQUFFLENBQUMsR0FBRSxFQUFFLE9BQU8sR0FBRSxHQUFFLENBQUMsR0FBRSxFQUFFLEtBQUssQ0FBQyxHQUFFLENBQUMsQ0FBQztBQUFBLFVBQUM7QUFBTSxjQUFFLEtBQUssQ0FBQztBQUFFLGVBQUc7QUFBQSxRQUFDO0FBQUMsaUJBQVEsSUFBRSxHQUFFLElBQUUsRUFBRSxRQUFPLEtBQUk7QUFBQyxjQUFJLElBQUUsRUFBRSxDQUFDO0FBQUUsZUFBSyxNQUFJLEVBQUUsTUFBSTtBQUFDLGNBQUUsRUFBRSxDQUFDLENBQUMsR0FBRSxFQUFFLENBQUMsRUFBRSxPQUFPO0FBQUEsVUFBQyxDQUFDLEdBQUUsT0FBTyxFQUFFLENBQUM7QUFBQSxRQUFFO0FBQUMsaUJBQVEsSUFBRSxHQUFFLElBQUUsRUFBRSxRQUFPLEtBQUk7QUFBQyxjQUFHLENBQUMsR0FBRSxDQUFDLElBQUUsRUFBRSxDQUFDLEdBQUUsSUFBRSxFQUFFLENBQUMsR0FBRSxJQUFFLEVBQUUsQ0FBQyxHQUFFLEtBQUcsU0FBUyxjQUFjLEtBQUs7QUFBRSxZQUFFLE1BQUk7QUFBQyxpQkFBRyxFQUFFLHdDQUF1QyxHQUFFLEdBQUUsQ0FBQyxHQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUUsRUFBRSxNQUFNLENBQUMsR0FBRSxFQUFFLGtCQUFnQixFQUFFLE1BQU0sRUFBRSxjQUFjLEdBQUUsR0FBRyxPQUFPLENBQUMsR0FBRSxFQUFFLGtCQUFnQixFQUFFLE1BQU0sRUFBRSxjQUFjLEdBQUUsR0FBRyxPQUFPO0FBQUEsVUFBQyxDQUFDLEdBQUUsRUFBRSxvQkFBb0IsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFBQSxRQUFDO0FBQUMsaUJBQVEsSUFBRSxHQUFFLElBQUUsRUFBRSxRQUFPLEtBQUk7QUFBQyxjQUFHLENBQUMsR0FBRSxDQUFDLElBQUUsRUFBRSxDQUFDLEdBQUUsSUFBRSxNQUFJLGFBQVcsSUFBRSxFQUFFLENBQUM7QUFBRSxZQUFFLG1CQUFpQixJQUFFLEVBQUU7QUFBZ0IsY0FBSSxJQUFFLEVBQUUsQ0FBQyxHQUFFLEtBQUcsRUFBRSxDQUFDLEdBQUUsS0FBRyxTQUFTLFdBQVcsRUFBRSxTQUFRLElBQUUsRUFBRSxtQkFBa0IsS0FBRyxFQUFFLENBQUM7QUFBRSxZQUFFLElBQUcsSUFBRyxDQUFDLEdBQUUsR0FBRyxzQkFBb0IsUUFBSTtBQUFDLG1CQUFPLFFBQVEsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUcsRUFBRSxNQUFJO0FBQUMsaUJBQUcsRUFBRSxJQUFFO0FBQUEsWUFBRSxDQUFDO0FBQUEsVUFBQyxHQUFFLEVBQUUsTUFBSTtBQUFDLGNBQUUsTUFBTSxFQUFFLEdBQUUsRUFBRSxNQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFBQSxVQUFDLENBQUMsR0FBRSxPQUFPLE1BQUksWUFBVSxFQUFFLG9FQUFtRSxDQUFDLEdBQUUsRUFBRSxFQUFFLElBQUU7QUFBQSxRQUFFO0FBQUMsaUJBQVEsSUFBRSxHQUFFLElBQUUsRUFBRSxRQUFPO0FBQUksWUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFBRSxVQUFFLGNBQVk7QUFBQSxNQUFDLENBQUM7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUU7QUFBQyxVQUFJLElBQUUsa0NBQWlDLElBQUUsa0JBQWlCLElBQUUsc0NBQXFDLElBQUUsRUFBRSxNQUFNLENBQUM7QUFBRSxVQUFHLENBQUM7QUFBRTtBQUFPLFVBQUksSUFBRSxDQUFDO0FBQUUsUUFBRSxRQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUs7QUFBRSxVQUFJLElBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxHQUFFLEVBQUUsRUFBRSxLQUFLLEdBQUUsSUFBRSxFQUFFLE1BQU0sQ0FBQztBQUFFLGFBQU8sS0FBRyxFQUFFLE9BQUssRUFBRSxRQUFRLEdBQUUsRUFBRSxFQUFFLEtBQUssR0FBRSxFQUFFLFFBQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxHQUFFLEVBQUUsQ0FBQyxNQUFJLEVBQUUsYUFBVyxFQUFFLENBQUMsRUFBRSxLQUFLLE1BQUksRUFBRSxPQUFLLEdBQUU7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUUsR0FBRSxHQUFFLEdBQUU7QUFBQyxVQUFJLElBQUUsQ0FBQztBQUFFLGFBQU0sV0FBVyxLQUFLLEVBQUUsSUFBSSxLQUFHLE1BQU0sUUFBUSxDQUFDLElBQUUsRUFBRSxLQUFLLFFBQVEsS0FBSSxFQUFFLEVBQUUsUUFBUSxLQUFJLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxJQUFJLE9BQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsR0FBRSxNQUFJO0FBQUMsVUFBRSxDQUFDLElBQUUsRUFBRSxDQUFDO0FBQUEsTUFBQyxDQUFDLElBQUUsV0FBVyxLQUFLLEVBQUUsSUFBSSxLQUFHLENBQUMsTUFBTSxRQUFRLENBQUMsS0FBRyxPQUFPLEtBQUcsV0FBUyxFQUFFLEtBQUssUUFBUSxLQUFJLEVBQUUsRUFBRSxRQUFRLEtBQUksRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLElBQUksT0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLFFBQVEsT0FBRztBQUFDLFVBQUUsQ0FBQyxJQUFFLEVBQUUsQ0FBQztBQUFBLE1BQUMsQ0FBQyxJQUFFLEVBQUUsRUFBRSxJQUFJLElBQUUsR0FBRSxFQUFFLFVBQVEsRUFBRSxFQUFFLEtBQUssSUFBRSxJQUFHLEVBQUUsZUFBYSxFQUFFLEVBQUUsVUFBVSxJQUFFLElBQUc7QUFBQSxJQUFDO0FBQUMsYUFBUyxHQUFHLEdBQUU7QUFBQyxhQUFNLENBQUMsTUFBTSxRQUFRLENBQUMsS0FBRyxDQUFDLE1BQU0sQ0FBQztBQUFBLElBQUM7QUFBQyxhQUFTLEtBQUk7QUFBQSxJQUFDO0FBQUMsT0FBRyxTQUFPLENBQUMsR0FBRSxFQUFDLFlBQVcsRUFBQyxHQUFFLEVBQUMsU0FBUSxFQUFDLE1BQUk7QUFBQyxVQUFJLElBQUUsRUFBRSxDQUFDO0FBQUUsUUFBRSxZQUFVLEVBQUUsVUFBUSxDQUFDLElBQUcsRUFBRSxRQUFRLENBQUMsSUFBRSxHQUFFLEVBQUUsTUFBSSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFBQSxJQUFDO0FBQUUsTUFBRSxPQUFNLEVBQUU7QUFBRSxNQUFFLE1BQUssQ0FBQyxHQUFFLEVBQUMsWUFBVyxFQUFDLEdBQUUsRUFBQyxRQUFPLEdBQUUsU0FBUSxFQUFDLE1BQUk7QUFBQyxRQUFFLFFBQVEsWUFBWSxNQUFJLGNBQVksRUFBRSw2Q0FBNEMsQ0FBQztBQUFFLFVBQUksSUFBRSxFQUFFLEdBQUUsQ0FBQyxHQUFFLElBQUUsTUFBSTtBQUFDLFlBQUcsRUFBRTtBQUFlLGlCQUFPLEVBQUU7QUFBZSxZQUFJLElBQUUsRUFBRSxRQUFRLFVBQVUsSUFBRSxFQUFFO0FBQWtCLGVBQU8sRUFBRSxHQUFFLENB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
