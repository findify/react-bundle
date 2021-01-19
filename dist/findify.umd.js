(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-router-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-router-dom'], factory) :
  (global = global || self, factory(global.reactBundle = {}, global.react, global.reactRouterDom));
}(this, (function (exports, react, reactRouterDom) {
  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var eventBindings = {
    autocomplete: 'change:suggestions',
    recommendation: 'change:items',
    search: 'change:items',
    'smart-collection': 'change:items'
  };

  var randomKey = function randomKey() {
    return Math.random().toString(36).substring(7);
  };

  var waitForFindify = function waitForFindify() {
    return new Promise(function (resolve) {
      return (window.findifyCallbacks = window.findifyCallbacks || []).push(function (findify) {
        return resolve(findify);
      });
    });
  };

  var getWidgetConfig = function getWidgetConfig(type, node, config, customs) {
    if (type !== 'recommendation') return customs;
    return config.getIn(['features', 'recommendations', '#' + (customs.slot || node.getAttribute('id'))]).mergeDeep(customs);
  };

  var index = (function (_ref) {
    var type = _ref.type,
        _ref$config = _ref.config,
        config = _ref$config === void 0 ? {} : _ref$config,
        _ref$options = _ref.options,
        options = _ref$options === void 0 ? {} : _ref$options,
        _ref$widgetKey = _ref.widgetKey,
        widgetKey = _ref$widgetKey === void 0 ? randomKey() : _ref$widgetKey;
    var container = react.useRef(null);

    var _useState = react.useState(false),
        ready = _useState[0],
        setReady = _useState[1];

    var _useState2 = react.useState(false),
        hasError = _useState2[0],
        setError = _useState2[1];

    var history = reactRouterDom.useHistory();
    react.useEffect(function () {
      if (!container.current) return;
      var findify = void 0;

      var init = function init() {
        try {
          return Promise.resolve(waitForFindify()).then(function (_waitForFindify) {
            findify = _waitForFindify;
            findify.history = history;
            var widgetConfig = getWidgetConfig(type, container.current, findify.config, _extends({
              widgetKey: widgetKey,
              disableAutoRequest: true
            }, config));
            findify.widgets.attach(container.current, type === 'smart-collection' ? 'search' : type, widgetConfig);
            var widget = findify.widgets.get(widgetKey);
            var meta = widget.config.get('meta') && widget.config.get('meta').toJS() || {};

            var defaults = _extends({}, meta, options);

            if (type === 'recommendation') {
              defaults.slot = config.slot;
              defaults.type = config.type || widgetConfig.get('type');
            }

            if (type === 'smart-collection') {
              defaults.slot = config.slot || findify.utils.collectionPath();
            }

            widget.agent.defaults(defaults).once('error', function () {
              return setError(true);
            }).once(eventBindings[type], function (items) {
              if (!items.length) setError(true);
              setReady(true);
            });

            if (['search', 'smart-collection'].includes(type)) {
              widget.agent.applyState(findify.utils.getQuery());
            }
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      init();
      return function () {
        findify.widgets.detach(widgetKey);
      };
    }, [container]);
    return [container, ready, hasError];
  });

  exports.default = index;
  exports.waitForFindify = waitForFindify;

})));
//# sourceMappingURL=findify.umd.js.map
