'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

const eventBindings = {
  autocomplete: 'change:suggestions',
  recommendation: 'change:items',
  search: 'change:items',
  'smart-collection': 'change:items',
};

const randomKey = () => Math.random().toString(36).substring(7);


const waitForFindify = () => new Promise(resolve =>
  (window.findifyCallbacks = window.findifyCallbacks || []).push(findify => resolve(findify))
);

const getWidgetConfig = (type, node, config, customs) => {
  if (type !== 'recommendation') {
    return customs;
  }

  let cfg = config.getIn(['features', 'recommendations', customs.slot || node.getAttribute('id')]);
  
  if (!cfg) {
    cfg = config.getIn(['features', 'recommendations', `#${customs.slot || node.getAttribute('id')}`]);
  }

  return cfg.mergeDeep(customs);
};

const cleanCollectionSlot = (slot) => slot.replace(/^\/|\/$/g, "").toLowerCase();

var index = ({ type, config = {}, options = {}, history, widgetKey = randomKey() }) => {
  const container = react.useRef(null);
  const [ready, setReady] = react.useState(false);
  const [hasError, setError] = react.useState(false);

  react.useEffect(() => {
    if (!container.current) return;
    let findify = void 0;
    let shouldRender = true;
    
    const init = async () => {
      findify = await waitForFindify();

      let collectionSlot;
      if (type === 'smart-collection') {
        collectionSlot = config.slot && config.slot !== '' ? cleanCollectionSlot(config.slot) : findify.utils.collectionPath();
        if (!findify.utils.isCollection(findify.config.get('collections'), collectionSlot)) {
          shouldRender = false;
          setError(true);
        }
      }

      if (!shouldRender) return;
  
      if (history) {
        findify.utils.setHistory
          ? findify.utils.setHistory(history)
          : findify.utils.history = history;
      }    
      const widgetConfig = getWidgetConfig(
        type,
        container.current,
        findify.config,
        {
          widgetKey,
          disableAutoRequest: true,
          ...config,
        }
      );
    
      findify.widgets.attach(
        container.current,
        type === 'smart-collection' ? 'search' : type,
        widgetConfig
      );

      const widget = findify.widgets.get(widgetKey);

      const meta = widget.config.get('meta') && widget.config.get('meta').toJS() || {};
        
      const defaultRequestParams = (widget.config.get('defaultRequestParams') && widget.config.get('defaultRequestParams').toJS()) || {};

      const defaults = {
        ...meta,
        ...defaultRequestParams,
        ...options
      };

      if (type === 'recommendation') {
        defaults.slot = config.slot;
        defaults.type = config.type || widgetConfig.get('type');
      }

      if (collectionSlot) {
        defaults.slot = collectionSlot;
      }

      const callback = (items) => window.requestAnimationFrame(() => {
        widget.agent.off(callback);
        if (!items.size) setError(true);
        setReady(true);
      });

      widget.agent
        .defaults(defaults)
        .on('error', () => setError(true))
        .on(eventBindings[type], callback);

      if (['search', 'smart-collection'].includes(type)) {
        widget.agent.applyState(findify.utils.getQuery());
      }
    };

    init();

    return () => {
      console.log('detach', widgetKey);
      if (findify && findify.widgets.get(widgetKey)) {
        findify.widgets.detach(widgetKey);
      } else {
        shouldRender = false;
      }
    }
  }, [container]);

  return [container, ready, hasError];
};

exports.default = index;
exports.waitForFindify = waitForFindify;
