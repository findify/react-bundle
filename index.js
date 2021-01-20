import { useRef, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

const eventBindings = {
  autocomplete: 'change:suggestions',
  recommendation: 'change:items',
  search: 'change:items',
  'smart-collection': 'change:items',
}

const randomKey = () => Math.random().toString(36).substring(7)


export const waitForFindify = () => new Promise(resolve =>
  (window.findifyCallbacks = window.findifyCallbacks || []).push(findify => resolve(findify))
);

const getWidgetConfig = (type, node, config, customs) => {
  if (type !== 'recommendation') return customs;
  return config
    .getIn(['features', 'recommendations', '#' + (customs.slot || node.getAttribute('id'))])
    .mergeDeep(customs);
};

export default ({ type, config = {}, options = {}, widgetKey = randomKey() }) => {
  const container = useRef(null);
  const [ready, setReady] = useState(false);
  const [hasError, setError] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (!container.current) return;
    let findify = void 0;
    
    const init = async () => {
      findify = await waitForFindify();
      findify.utils.setHistory(history);
    
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
      )

      const widget = findify.widgets.get(widgetKey)

      const meta = widget.config.get('meta') && widget.config.get('meta').toJS() || {};
  
      const defaults = {
        ...meta,
        ...options
      }

      if (type === 'recommendation') {
        defaults.slot = config.slot;
        defaults.type = config.type || widgetConfig.get('type');
      }

      if (type === 'smart-collection') {
        defaults.slot = config.slot || findify.utils.collectionPath();
      }

      widget.agent
        .defaults(defaults)
        .once('error', () => setError(true))
        .once(eventBindings[type], (items) => {
          if (!items.length) setError(true)
          setReady(true);
        })

      if (['search', 'smart-collection'].includes(type)) {
        widget.agent.applyState(findify.utils.getQuery())
      }
    }

    init();

    return () => {
      findify.widgets.detach(widgetKey)
    }
  }, [container]);

  return [container, ready, hasError];
}
