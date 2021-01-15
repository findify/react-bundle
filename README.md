# @findifu/jetshop
React hook that allows you to integrate Findify search and autocomplete with Jetshop SPA.

## Installation

#### Install dependency
```bash
yarn add @findify/jetshop
```

#### Add script to `index.html`
```html
<script type="text/javascript" src="https://assets.findify.io/%REACT_APP_FINDIFY_STORE%.min.js"></script>

```

#### Add variable in `.env`
```
REACT_APP_FINDIFY_STORE="YOUR_STORE_NAME"
```
---
## Usage
```javascript
import React from 'react'
import useFindify from '@findify/jetshop'

export default () => {
  const [container, isReady] = useFindify({ type: 'search' })
  return (
    <div ref={container} />
  )
}
```

First element in array is `React.createRef()` that you should add as `ref` to the element where widget will appear.

Second element is widget ready state it could be `true` or `false`. You can use this state to show and hide placeholder while findify is rendering.

### Props

| Prop | Required | Default value | Description |
|---|---|---|---|
| `type<String>` | *yes* | `''`| Type of widget. Could be `search`, `recommendation`, `autocomplete` |
| `widgetKey<String>` | *no* | `random`| Widget unique Id. You can provide this parameter if you would like to use Findify API in the future |
| `config<Object>` | *no* | | Custom widget configuration that will be merged with default one. You should provide `slot` in this object in case you are creating recommendation |
| `options<Object>` | *no* | | Additional request options |

> For more information about Findify API and request options please visit [https://developers.findify.io/](https://developers.findify.io/)


---
## Jetshop minial example

### Search
Go to `/components/SearchPage/SearchPage.js` 
```javascript
//...
import useFindify from '@findify/jetshop';

export const Container = styled(MaxWidth)`
  padding: 0 0.75rem;
`;

//...
const SearchPage = routeProps => {
  const track = useTracker();
  const { pathname, search } = routeProps.location;
  const [container, isReady] = useFindify({ type: 'search' });

  useEffect(() => {
    track(trackPageEvent({ pathname: `${pathname}${search}` }));
  }, [track, pathname, search]);

  return (
    <Container>
      <div ref={container} />
    </Container>
  );
};
```

### Autocomplete
Go to `/components/Layout/Header/SearchBar.js`
```javascript
//...
import useFindify from '@findify/jetshop';

//...
const StyledSearchField = styled('div')`
  & {
    display: flex;
    height: 2rem;
    width: 100% !important;
    justify-content: center;
    input {
      border: 0;
      background: #f3f3f3;
      height: 100%;
      width: 100%;
      padding: 0 1rem;
    }
  }
`;

const SearchBar = ({ searchOpen, setSearchOpen }) => {
  const [container] = useFindify({ type: 'autocomplete' });
  return (
    <PoseGroup flipMove={true}>
      {searchOpen && (
        <PosedSearchBarContainer key={'searchBarPosed'}>
          <InnerSearchBar>
            <StyledSearchField>
              <input ref={container} />
            </StyledSearchField>
          </InnerSearchBar>
        </PosedSearchBarContainer>
      )}
    </PoseGroup>
  )
};
```
