import{useRef as e,useState as t,useEffect as n}from"react";import{useHistory as r}from"react-router-dom";function i(){return(i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}var o={autocomplete:"change:suggestions",recommendation:"change:items",search:"change:items"};export default function(a){var c=a.type,u=a.config,s=void 0===u?{}:u,f=a.options,d=void 0===f?{}:f,g=a.widgetKey,m=void 0===g?Math.random().toString(36).substring(7):g,l=e(null),h=t(!1),p=h[0],y=h[1],v=r();return n(function(){if(l.current){var e=void 0;try{return Promise.resolve(new Promise(function(e){return(window.findifyCallbacks=window.findifyCallbacks||[]).push(function(t){return e(t)})})).then(function(t){(e=t).history=v;var n=function(e,t,n,r){var i="recommendation"===e&&n.getIn(["features","recommendations","#"+t.getAttribute("id")])||n.getIn(["features",e]);return n.withMutations(function(n){return n.mergeDeep(i).mergeDeep(r).set("node",t).set("cssSelector","findify-"+e+" findify-widget-"+r.widgetKey).toJS()})}(c,l.current,e.config,i({},s,{widgetKey:m,disableAutoRequest:!0}));e.widgets.attach(l.current,c,n);var r=e.widgets.get(m),a=r.config.get("meta")&&r.config.get("meta").toJS()||{};r.agent.defaults(i({},a,d)).once(o[c],function(){return y(!0)}),["search","smart-collection"].includes(c)&&r.agent.applyState(e.utils.getQuery())})}catch(e){Promise.reject(e)}return function(){if(!e)return shouldRender=!1;e.widgets.detach(m)}}},[l]),[l,p]}
//# sourceMappingURL=findify.module.js.map