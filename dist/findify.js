var t=require("react");function e(){return(e=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t}).apply(this,arguments)}var n={autocomplete:"change:suggestions",recommendation:"change:items",search:"change:items","smart-collection":"change:items"},o=function(){return new Promise(function(t){return(window.findifyCallbacks=window.findifyCallbacks||[]).push(function(e){return t(e)})})};exports.default=function(r){var i=r.type,a=r.config,c=void 0===a?{}:a,s=r.options,u=void 0===s?{}:s,l=r.history,f=r.widgetKey,g=void 0===f?Math.random().toString(36).substring(7):f,d=t.useRef(null),m=t.useState(!1),h=m[0],p=m[1],y=t.useState(!1),v=y[0],w=y[1];return t.useEffect(function(){if(d.current){var t=void 0;return function(){try{Promise.resolve(o()).then(function(o){t=o,l&&(t.utils.history=l);var r=function(t,e,n,o){return"recommendation"!==t?o:n.getIn(["features","recommendations","#"+(o.slot||e.getAttribute("id"))]).mergeDeep(o)}(i,d.current,t.config,e({widgetKey:g,disableAutoRequest:!0},c));t.widgets.attach(d.current,"smart-collection"===i?"search":i,r);var a=t.widgets.get(g),s=e({},a.config.get("meta")&&a.config.get("meta").toJS()||{},u);"recommendation"===i&&(s.slot=c.slot,s.type=c.type||r.get("type")),"smart-collection"===i&&(s.slot=c.slot||t.utils.collectionPath()),a.agent.defaults(s).on("error",function(){return w(!0)}).on(n[i],function t(e){return window.requestAnimationFrame(function(){a.agent.off(t),e.size||w(!0),p(!0)})}),["search","smart-collection"].includes(i)&&a.agent.applyState(t.utils.getQuery())})}catch(t){return Promise.reject(t)}}(),function(){console.log("detach",g),t.widgets.detach(g)}}},[d]),[d,h,v]},exports.waitForFindify=o;
//# sourceMappingURL=findify.js.map
