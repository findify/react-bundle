import { useEffect, useState, useCallback } from 'react';

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

export default ({ type, config = {}, options = {}, history, widgetKey = randomKey() }) => {
  const [container, setContainer] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const onSetContainer = useCallback((node) => {
    setContainer(node);
  }, [container])

  useEffect(() => {
    if (!container) return;
    let findify = void 0;
    let shouldRender = true;

    setError(null)
    
    const init = async () => {
      findify = await waitForFindify();
      
      if (!shouldRender) return;

      let collectionSlot;
      if (type === 'smart-collection') {
        collectionSlot = config.slot && config.slot !== '' ? cleanCollectionSlot(config.slot) : findify.utils.collectionPath();
        if (!findify.utils.isCollection(findify.config.get('collections'), collectionSlot)) {
          setError(`collection slot: ${collectionSlot} not configured in Findify`);
          return
        }
      }

      if (history) {
        findify.utils.setHistory
          ? findify.utils.setHistory(history)
          : findify.utils.history = history
      };
    
      const widgetConfig = getWidgetConfig(
        type,
        container,
        findify.config,
        {
          widgetKey,
          disableAutoRequest: true,
          ...config,
        }
      );
    
      findify.widgets.attach(
        container,
        type === 'smart-collection' ? 'search' : type,
        widgetConfig
      )

      const widget = findify.widgets.get(widgetKey)

      const meta = widget.config.get('meta') && widget.config.get('meta').toJS() || {};
        
      const defaultRequestParams = (widget.config.get('defaultRequestParams') && widget.config.get('defaultRequestParams').toJS()) || {};

      const defaults = {
        ...meta,
        ...defaultRequestParams,
        ...options
      }

      if (type === 'recommendation') {
        defaults.slot = config.slot;
        defaults.type = config.type || widgetConfig.get('type');
      }

      if (collectionSlot) {
        defaults.slot = collectionSlot;
      }

      const callback = (items) => window.requestAnimationFrame(() => {
        widget.agent.off(callback)
        if (!items.size) setError('Findify Search API returns 0 items')
        setReady(true);
      })

      widget.agent
        .defaults(defaults)
        .on('error', () => setError('Findify Search API throws an error'))
        .on(eventBindings[type], callback)

      if (['search', 'smart-collection'].includes(type)) {
        widget.agent.applyState(findify.utils.getQuery())
      }
    }

    init();

    return () => {
      console.log('detach', widgetKey)
      if (findify && findify.widgets.get(widgetKey)) {
        findify.widgets.detach(widgetKey)
      } else {
        shouldRender = false
      }
    }
  }, [container, config, type]);

  return [onSetContainer, ready, !!error, error];
}
