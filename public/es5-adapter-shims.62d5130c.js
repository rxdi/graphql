parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({5:[function(require,module,exports) {
function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function n(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(function(){"use strict";var t=new function(){},e=new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));function n(t){var n=e.has(t);return t=/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(t),!n&&t}function o(t){var e=t.isConnected;if(void 0!==e)return e;for(;t&&!(t.__CE_isImportDocument||t instanceof Document);)t=t.parentNode||(window.ShadowRoot&&t instanceof ShadowRoot?t.host:void 0);return!(!t||!(t.__CE_isImportDocument||t instanceof Document))}function i(t,e){for(;e&&e!==t&&!e.nextSibling;)e=e.parentNode;return e&&e!==t?e.nextSibling:null}function r(t,e,n){n=n||new Set;for(var o=t;o;){if(o.nodeType===Node.ELEMENT_NODE){var a=o;e(a);var l=a.localName;if("link"===l&&"import"===a.getAttribute("rel")){if((o=a.import)instanceof Node&&!n.has(o))for(n.add(o),o=o.firstChild;o;o=o.nextSibling)r(o,e,n);o=i(t,a);continue}if("template"===l){o=i(t,a);continue}if(a=a.__CE_shadowRoot)for(a=a.firstChild;a;a=a.nextSibling)r(a,e,n)}o=o.firstChild?o.firstChild:i(t,o)}}function a(t,e,n){t[e]=n}function l(){this.a=new Map,this.s=new Map,this.f=[],this.b=!1}function c(t,e){t.b=!0,t.f.push(e)}function s(t,e){t.b&&r(e,function(e){return u(t,e)})}function u(t,e){if(t.b&&!e.__CE_patched){e.__CE_patched=!0;for(var n=0;n<t.f.length;n++)t.f[n](e)}}function f(t,e){var n=[];for(r(e,function(t){return n.push(t)}),e=0;e<n.length;e++){var o=n[e];1===o.__CE_state?t.connectedCallback(o):d(t,o)}}function p(t,e){var n=[];for(r(e,function(t){return n.push(t)}),e=0;e<n.length;e++){var o=n[e];1===o.__CE_state&&t.disconnectedCallback(o)}}function h(t,e,n){var o=(n=n||{}).w||new Set,i=n.i||function(e){return d(t,e)},a=[];if(r(e,function(e){if("link"===e.localName&&"import"===e.getAttribute("rel")){var n=e.import;n instanceof Node&&(n.__CE_isImportDocument=!0,n.__CE_hasRegistry=!0),n&&"complete"===n.readyState?n.__CE_documentLoadHandled=!0:e.addEventListener("load",function(){var n=e.import;if(!n.__CE_documentLoadHandled){n.__CE_documentLoadHandled=!0;var r=new Set(o);r.delete(n),h(t,n,{w:r,i:i})}})}else a.push(e)},o),t.b)for(e=0;e<a.length;e++)u(t,a[e]);for(e=0;e<a.length;e++)i(a[e])}function d(t,e){if(void 0===e.__CE_state){var n=e.ownerDocument;if((n.defaultView||n.__CE_isImportDocument&&n.__CE_hasRegistry)&&(n=t.a.get(e.localName))){n.constructionStack.push(e);var i=n.constructor;try{try{if(new i!==e)throw Error("The custom element constructor did not produce the element being upgraded.")}finally{n.constructionStack.pop()}}catch(t){throw e.__CE_state=2,t}if(e.__CE_state=1,e.__CE_definition=n,n.attributeChangedCallback)for(n=n.observedAttributes,i=0;i<n.length;i++){var r=n[i],a=e.getAttribute(r);null!==a&&t.attributeChangedCallback(e,r,null,a,null)}o(e)&&t.connectedCallback(e)}}}function m(t,e){this.c=t,this.a=e,this.b=void 0,h(this.c,this.a),"loading"===this.a.readyState&&(this.b=new MutationObserver(this.f.bind(this)),this.b.observe(this.a,{childList:!0,subtree:!0}))}function w(t){t.b&&t.b.disconnect()}function b(){var t=this;this.b=this.a=void 0,this.f=new Promise(function(e){t.b=e,t.a&&e(t.a)})}function y(t){if(t.a)throw Error("Already resolved.");t.a=void 0,t.b&&t.b(void 0)}function g(t){this.j=!1,this.c=t,this.o=new Map,this.l=function(t){return t()},this.g=!1,this.m=[],this.u=new m(t,document)}l.prototype.connectedCallback=function(t){var e=t.__CE_definition;e.connectedCallback&&e.connectedCallback.call(t)},l.prototype.disconnectedCallback=function(t){var e=t.__CE_definition;e.disconnectedCallback&&e.disconnectedCallback.call(t)},l.prototype.attributeChangedCallback=function(t,e,n,o,i){var r=t.__CE_definition;r.attributeChangedCallback&&-1<r.observedAttributes.indexOf(e)&&r.attributeChangedCallback.call(t,e,n,o,i)},m.prototype.f=function(t){var e=this.a.readyState;for("interactive"!==e&&"complete"!==e||w(this),e=0;e<t.length;e++)for(var n=t[e].addedNodes,o=0;o<n.length;o++)h(this.c,n[o])},g.prototype.define=function(t,e){var o,i,r,a,l,c=this;if(!(e instanceof Function))throw new TypeError("Custom element constructors must be functions.");if(!n(t))throw new SyntaxError("The element name '"+t+"' is not valid.");if(this.c.a.get(t))throw Error("A custom element with name '"+t+"' has already been defined.");if(this.j)throw Error("A custom element is already being defined.");this.j=!0;try{var s=function(t){var e=u[t];if(void 0!==e&&!(e instanceof Function))throw Error("The '"+t+"' callback must be a function.");return e},u=e.prototype;if(!(u instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");o=s("connectedCallback"),i=s("disconnectedCallback"),r=s("adoptedCallback"),a=s("attributeChangedCallback"),l=e.observedAttributes||[]}catch(t){return}finally{this.j=!1}e={localName:t,constructor:e,connectedCallback:o,disconnectedCallback:i,adoptedCallback:r,attributeChangedCallback:a,observedAttributes:l,constructionStack:[]},function(t,e,n){t.a.set(e,n),t.s.set(n.constructor,n)}(this.c,t,e),this.m.push(e),this.g||(this.g=!0,this.l(function(){return function(t){if(!1!==t.g){t.g=!1;for(var e=t.m,n=[],o=new Map,i=0;i<e.length;i++)o.set(e[i].localName,[]);for(h(t.c,document,{i:function(e){if(void 0===e.__CE_state){var i=e.localName,r=o.get(i);r?r.push(e):t.c.a.get(i)&&n.push(e)}}}),i=0;i<n.length;i++)d(t.c,n[i]);for(;0<e.length;){for(var r=e.shift(),i=r.localName,r=o.get(r.localName),a=0;a<r.length;a++)d(t.c,r[a]);(i=t.o.get(i))&&y(i)}}}(c)}))},g.prototype.i=function(t){h(this.c,t)},g.prototype.get=function(t){if(t=this.c.a.get(t))return t.constructor},g.prototype.whenDefined=function(t){if(!n(t))return Promise.reject(new SyntaxError("'"+t+"' is not a valid custom element name."));var e=this.o.get(t);return e?e.f:(e=new b,this.o.set(t,e),this.c.a.get(t)&&!this.m.some(function(e){return e.localName===t})&&y(e),e.f)},g.prototype.v=function(t){w(this.u);var e=this.l;this.l=function(n){return t(function(){return e(n)})}},window.CustomElementRegistry=g,g.prototype.define=g.prototype.define,g.prototype.upgrade=g.prototype.i,g.prototype.get=g.prototype.get,g.prototype.whenDefined=g.prototype.whenDefined,g.prototype.polyfillWrapFlushCallback=g.prototype.v;var E=window.Document.prototype.createElement,v=window.Document.prototype.createElementNS,_=window.Document.prototype.importNode,C=window.Document.prototype.prepend,N=window.Document.prototype.append,k=window.DocumentFragment.prototype.prepend,S=window.DocumentFragment.prototype.append,T=window.Node.prototype.cloneNode,D=window.Node.prototype.appendChild,j=window.Node.prototype.insertBefore,A=window.Node.prototype.removeChild,O=window.Node.prototype.replaceChild,M=Object.getOwnPropertyDescriptor(window.Node.prototype,"textContent"),L=window.Element.prototype.attachShadow,H=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),x=window.Element.prototype.getAttribute,P=window.Element.prototype.setAttribute,R=window.Element.prototype.removeAttribute,F=window.Element.prototype.getAttributeNS,I=window.Element.prototype.setAttributeNS,z=window.Element.prototype.removeAttributeNS,W=window.Element.prototype.insertAdjacentElement,B=window.Element.prototype.insertAdjacentHTML,U=window.Element.prototype.prepend,V=window.Element.prototype.append,X=window.Element.prototype.before,$=window.Element.prototype.after,q=window.Element.prototype.replaceWith,G=window.Element.prototype.remove,J=window.HTMLElement,K=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),Q=window.HTMLElement.prototype.insertAdjacentElement,Y=window.HTMLElement.prototype.insertAdjacentHTML;function Z(t,e,n){function i(e){return function(n){for(var i=[],r=0;r<arguments.length;++r)i[r-0]=arguments[r];r=[];for(var a=[],l=0;l<i.length;l++){var c=i[l];if(c instanceof Element&&o(c)&&a.push(c),c instanceof DocumentFragment)for(c=c.firstChild;c;c=c.nextSibling)r.push(c);else r.push(c)}for(e.apply(this,i),i=0;i<a.length;i++)p(t,a[i]);if(o(this))for(i=0;i<r.length;i++)(a=r[i])instanceof Element&&f(t,a)}}n.h&&(e.prepend=i(n.h)),n.append&&(e.append=i(n.append))}var tt,et=window.customElements;if(!et||et.forcePolyfill||"function"!=typeof et.define||"function"!=typeof et.get){var nt=new l;tt=nt,window.HTMLElement=function(){function e(){var e=this.constructor;if(!(o=tt.s.get(e)))throw Error("The custom element being constructed was not registered with `customElements`.");var n=o.constructionStack;if(!n.length)return n=E.call(document,o.localName),Object.setPrototypeOf(n,e.prototype),n.__CE_state=1,n.__CE_definition=o,u(tt,n),n;var o,i=n[o=n.length-1];if(i===t)throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");return n[o]=t,Object.setPrototypeOf(i,e.prototype),u(tt,i),i}return e.prototype=J.prototype,Object.defineProperty(e.prototype,"constructor",{writable:!0,configurable:!0,enumerable:!1,value:e}),e}(),function(){var t=nt;a(Document.prototype,"createElement",function(e){if(this.__CE_hasRegistry){var n=t.a.get(e);if(n)return new n.constructor}return e=E.call(this,e),u(t,e),e}),a(Document.prototype,"importNode",function(e,n){return e=_.call(this,e,n),this.__CE_hasRegistry?h(t,e):s(t,e),e}),a(Document.prototype,"createElementNS",function(e,n){if(this.__CE_hasRegistry&&(null===e||"http://www.w3.org/1999/xhtml"===e)){var o=t.a.get(n);if(o)return new o.constructor}return e=v.call(this,e,n),u(t,e),e}),Z(t,Document.prototype,{h:C,append:N})}(),Z(nt,DocumentFragment.prototype,{h:k,append:S}),function(){var t=nt;function e(e,n){Object.defineProperty(e,"textContent",{enumerable:n.enumerable,configurable:!0,get:n.get,set:function(e){if(this.nodeType===Node.TEXT_NODE)n.set.call(this,e);else{var i=void 0;if(this.firstChild){var r=this.childNodes,a=r.length;if(0<a&&o(this)){i=Array(a);for(var l=0;l<a;l++)i[l]=r[l]}}if(n.set.call(this,e),i)for(e=0;e<i.length;e++)p(t,i[e])}}})}a(Node.prototype,"insertBefore",function(e,n){if(e instanceof DocumentFragment){var i=Array.prototype.slice.apply(e.childNodes);if(e=j.call(this,e,n),o(this))for(n=0;n<i.length;n++)f(t,i[n]);return e}return i=o(e),n=j.call(this,e,n),i&&p(t,e),o(this)&&f(t,e),n}),a(Node.prototype,"appendChild",function(e){if(e instanceof DocumentFragment){var n=Array.prototype.slice.apply(e.childNodes);if(e=D.call(this,e),o(this))for(var i=0;i<n.length;i++)f(t,n[i]);return e}return n=o(e),i=D.call(this,e),n&&p(t,e),o(this)&&f(t,e),i}),a(Node.prototype,"cloneNode",function(e){return e=T.call(this,e),this.ownerDocument.__CE_hasRegistry?h(t,e):s(t,e),e}),a(Node.prototype,"removeChild",function(e){var n=o(e),i=A.call(this,e);return n&&p(t,e),i}),a(Node.prototype,"replaceChild",function(e,n){if(e instanceof DocumentFragment){var i=Array.prototype.slice.apply(e.childNodes);if(e=O.call(this,e,n),o(this))for(p(t,n),n=0;n<i.length;n++)f(t,i[n]);return e}i=o(e);var r=O.call(this,e,n),a=o(this);return a&&p(t,n),i&&p(t,e),a&&f(t,e),r}),M&&M.get?e(Node.prototype,M):c(t,function(t){e(t,{enumerable:!0,configurable:!0,get:function(){for(var t=[],e=0;e<this.childNodes.length;e++)t.push(this.childNodes[e].textContent);return t.join("")},set:function(t){for(;this.firstChild;)A.call(this,this.firstChild);D.call(this,document.createTextNode(t))}})})}(),function(){var t=nt;function e(e,n){Object.defineProperty(e,"innerHTML",{enumerable:n.enumerable,configurable:!0,get:n.get,set:function(e){var i=this,a=void 0;if(o(this)&&(a=[],r(this,function(t){t!==i&&a.push(t)})),n.set.call(this,e),a)for(var l=0;l<a.length;l++){var c=a[l];1===c.__CE_state&&t.disconnectedCallback(c)}return this.ownerDocument.__CE_hasRegistry?h(t,this):s(t,this),e}})}function n(e,n){a(e,"insertAdjacentElement",function(e,i){var r=o(i);return e=n.call(this,e,i),r&&p(t,i),o(e)&&f(t,i),e})}function i(e,n){function o(e,n){for(var o=[];e!==n;e=e.nextSibling)o.push(e);for(n=0;n<o.length;n++)h(t,o[n])}a(e,"insertAdjacentHTML",function(t,e){if("beforebegin"===(t=t.toLowerCase())){var i=this.previousSibling;n.call(this,t,e),o(i||this.parentNode.firstChild,this)}else if("afterbegin"===t)i=this.firstChild,n.call(this,t,e),o(this.firstChild,i);else if("beforeend"===t)i=this.lastChild,n.call(this,t,e),o(i||this.firstChild,null);else{if("afterend"!==t)throw new SyntaxError("The value provided ("+String(t)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");i=this.nextSibling,n.call(this,t,e),o(this.nextSibling,i)}})}L&&a(Element.prototype,"attachShadow",function(t){return this.__CE_shadowRoot=L.call(this,t)}),H&&H.get?e(Element.prototype,H):K&&K.get?e(HTMLElement.prototype,K):c(t,function(t){e(t,{enumerable:!0,configurable:!0,get:function(){return T.call(this,!0).innerHTML},set:function(t){var e="template"===this.localName,n=e?this.content:this,o=v.call(document,this.namespaceURI,this.localName);for(o.innerHTML=t;0<n.childNodes.length;)A.call(n,n.childNodes[0]);for(t=e?o.content:o;0<t.childNodes.length;)D.call(n,t.childNodes[0])}})}),a(Element.prototype,"setAttribute",function(e,n){if(1!==this.__CE_state)return P.call(this,e,n);var o=x.call(this,e);P.call(this,e,n),n=x.call(this,e),t.attributeChangedCallback(this,e,o,n,null)}),a(Element.prototype,"setAttributeNS",function(e,n,o){if(1!==this.__CE_state)return I.call(this,e,n,o);var i=F.call(this,e,n);I.call(this,e,n,o),o=F.call(this,e,n),t.attributeChangedCallback(this,n,i,o,e)}),a(Element.prototype,"removeAttribute",function(e){if(1!==this.__CE_state)return R.call(this,e);var n=x.call(this,e);R.call(this,e),null!==n&&t.attributeChangedCallback(this,e,n,null,null)}),a(Element.prototype,"removeAttributeNS",function(e,n){if(1!==this.__CE_state)return z.call(this,e,n);var o=F.call(this,e,n);z.call(this,e,n);var i=F.call(this,e,n);o!==i&&t.attributeChangedCallback(this,n,o,i,e)}),Q?n(HTMLElement.prototype,Q):W?n(Element.prototype,W):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched."),Y?i(HTMLElement.prototype,Y):B?i(Element.prototype,B):console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched."),Z(t,Element.prototype,{h:U,append:V}),function(t){var e=Element.prototype;function n(e){return function(n){for(var i=[],r=0;r<arguments.length;++r)i[r-0]=arguments[r];r=[];for(var a=[],l=0;l<i.length;l++){var c=i[l];if(c instanceof Element&&o(c)&&a.push(c),c instanceof DocumentFragment)for(c=c.firstChild;c;c=c.nextSibling)r.push(c);else r.push(c)}for(e.apply(this,i),i=0;i<a.length;i++)p(t,a[i]);if(o(this))for(i=0;i<r.length;i++)(a=r[i])instanceof Element&&f(t,a)}}X&&(e.before=n(X)),X&&(e.after=n($)),q&&a(e,"replaceWith",function(e){for(var n=[],i=0;i<arguments.length;++i)n[i-0]=arguments[i];i=[];for(var r=[],a=0;a<n.length;a++){var l=n[a];if(l instanceof Element&&o(l)&&r.push(l),l instanceof DocumentFragment)for(l=l.firstChild;l;l=l.nextSibling)i.push(l);else i.push(l)}for(a=o(this),q.apply(this,n),n=0;n<r.length;n++)p(t,r[n]);if(a)for(p(t,this),n=0;n<i.length;n++)(r=i[n])instanceof Element&&f(t,r)}),G&&a(e,"remove",function(){var e=o(this);G.call(this),e&&p(t,this)})}(t)}(),document.__CE_hasRegistry=!0;var ot=new g(nt);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:ot})}}).call(self),function(){"use strict";!function(){if(window.customElements){var o=window.HTMLElement,i=window.customElements.define,r=window.customElements.get,a=new Map,l=new Map,c=!1,s=!1;window.HTMLElement=function(){if(!c){var t=a.get(this.constructor),e=r.call(window.customElements,t);return s=!0,new e}c=!1},window.HTMLElement.prototype=o.prototype,Object.defineProperty(window,"customElements",{value:window.customElements,configurable:!0,writable:!0}),Object.defineProperty(window.customElements,"define",{value:function(r,u){var f=u.prototype,p=function(i){function r(){var n;return t(this,r),n=e(this,(r.__proto__||Object.getPrototypeOf(r)).call(this)),Object.setPrototypeOf(n,f),s||(c=!0,u.call(n)),s=!1,n}return n(r,o),r}(),h=p.prototype;p.observedAttributes=u.observedAttributes,h.connectedCallback=f.connectedCallback,h.disconnectedCallback=f.disconnectedCallback,h.attributeChangedCallback=f.attributeChangedCallback,h.adoptedCallback=f.adoptedCallback,a.set(u,r),l.set(r,u),i.call(window.customElements,r,p)},configurable:!0,writable:!0}),Object.defineProperty(window.customElements,"get",{value:function(t){return l.get(t)},configurable:!0,writable:!0})}}()}();
},{}]},{},[5], null)
//# sourceMappingURL=/es5-adapter-shims.62d5130c.map