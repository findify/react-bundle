import { useRef, useState, useEffect } from 'react';

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
  if (type !== 'recommendation') return customs;
  return config
    .getIn(['features', 'recommendations', customs.slot || node.getAttribute('id')])
    .mergeDeep(customs);
};

var index = ({ type, config = {}, options = {}, history, widgetKey = randomKey() }) => {
  const container = useRef(null);
  const [ready, setReady] = useState(false);
  const [hasError, setError] = useState(false);

  useEffect(() => {
    if (!container.current) return;
    let findify = void 0;
    let shouldRender = true;
    
    const init = async () => {
      findify = await waitForFindify();
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
  
      const defaults = {
        ...meta,
        ...options
      };

      if (type === 'recommendation') {
        defaults.slot = config.slot;
        defaults.type = config.type || widgetConfig.get('type');
      }

      if (type === 'smart-collection') {
        defaults.slot = config.slot || findify.utils.collectionPath();
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

export default index;
export { waitForFindify };
