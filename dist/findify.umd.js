!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],t):t((e||self).reactBundle={},e.react)}(this,function(e,t){function n(){return(n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}var o={autocomplete:"change:suggestions",recommendation:"change:items",search:"change:items","smart-collection":"change:items"},i=function(){return new Promise(function(e){return(window.findifyCallbacks=window.findifyCallbacks||[]).push(function(t){return e(t)})})};e.default=function(e){var r=e.type,c=e.config,a=void 0===c?{}:c,s=e.options,u=void 0===s?{}:s,f=e.history,l=e.widgetKey,d=void 0===l?Math.random().toString(36).substring(7):l,g=t.useRef(null),m=t.useState(!1),h=m[0],p=m[1],y=t.useState(!1),w=y[0],v=y[1];return t.useEffect(function(){if(g.current){var e=void 0;return function(){try{Promise.resolve(i()).then(function(t){e=t,f&&(e.utils.history=f);var i=function(e,t,n,o){return"recommendation"!==e?o:n.getIn(["features","recommendations","#"+(o.slot||t.getAttribute("id"))]).mergeDeep(o)}(r,g.current,e.config,n({widgetKey:d,disableAutoRequest:!0},a));e.widgets.attach(g.current,"smart-collection"===r?"search":r,i);var c=e.widgets.get(d),s=n({},c.config.get("meta")&&c.config.get("meta").toJS()||{},u);"recommendation"===r&&(s.slot=a.slot,s.type=a.type||i.get("type")),"smart-collection"===r&&(s.slot=a.slot||e.utils.collectionPath()),c.agent.defaults(s).on("error",function(){return v(!0)}).on(o[r],function e(t){return window.requestAnimationFrame(function(){c.agent.off(e),t.size||v(!0),p(!0)})}),["search","smart-collection"].includes(r)&&c.agent.applyState(e.utils.getQuery())})}catch(e){return Promise.reject(e)}}(),function(){console.log("detach",d),e.widgets.detach(d)}}},[g]),[g,h,w]},e.waitForFindify=i});
//# sourceMappingURL=findify.umd.js.map
