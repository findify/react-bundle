import { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

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

const eventBindings = {
  autocomplete: 'change:suggestions',
  recommendation: 'change:items',
  search: 'change:items'
};

const randomKey = () => Math.random().toString(36).substring(7);

const waitForFindify = () => new Promise(resolve => (window.findifyCallbacks = window.findifyCallbacks || []).push(findify => resolve(findify)));

const getWidgetConfig = (type, node, config, customs) => {
  const cfg = type === 'recommendation' && config.getIn(['features', 'recommendations', '#' + (customs.slot || node.getAttribute('id'))]) || config.getIn(['features', type]);
  return config.withMutations(c => c.mergeDeep(cfg).mergeDeep(customs).set('node', node).set('cssSelector', `findify-${type} findify-widget-${customs.widgetKey}`).toJS());
};

var index = (({
  type,
  config: _config = {},
  options: _options = {},
  widgetKey: _widgetKey = randomKey()
}) => {
  const container = useRef(null);
  const [ready, setReady] = useState(false);
  const history = useHistory();
  useEffect(() => {
    if (!container.current) return;
    let findify = void 0;

    const init = async () => {
      findify = await waitForFindify();
      findify.history = history;
      const widgetConfig = getWidgetConfig(type, container.current, findify.config, _extends({
        widgetKey: _widgetKey,
        disableAutoRequest: type !== 'recommendation'
      }, _config));
      findify.widgets.attach(container.current, type, widgetConfig);
      const widget = findify.widgets.get(_widgetKey);
      const meta = widget.config.get('meta') && widget.config.get('meta').toJS() || {};
      widget.agent.defaults(_extends({}, meta, _options)).once(eventBindings[type], () => setReady(true));

      if (['search', 'smart-collection'].includes(type)) {
        widget.agent.applyState(findify.utils.getQuery());
      }
    };

    init();
    return () => {
      findify.widgets.detach(_widgetKey);
    };
  }, [container]);
  return [container, ready];
});

export default index;
//# sourceMappingURL=findify.modern.js.map
