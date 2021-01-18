# @findify/react-bundle
React hook that allows you to integrate Findify search and autocomplete with Jetshop SPA.

## Installation

#### Install dependency
```bash
yarn add @findify/react-bundle
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
import useFindify from '@findify/react-bundle'

export default () => {
  const [container, isReady, hasError] = useFindify({ type: 'search' })
  return (
    <div ref={container} />
  )
}
```

First element in array is `React.createRef()` that you should add as `ref` to the element where widget will appear.

Second element is widget ready state it could be `true` or `false`. You can use this state to show and hide placeholder while findify is rendering.

Third element in array is error state `true` or `false`, it shows you if any error happened
 or no items was returned from the response.

### Props

| Prop | Required | Default value | Description |
|---|---|---|---|
| `type<String>` | *yes* | `''`| Type of widget. Could be `search`, `recommendation`, `autocomplete`, `smart-collection` |
| `widgetKey<String>` | *no* | `random`| Widget unique Id. You can provide this parameter if you would like to use Findify API in the future |
| `config<Object>` | *no* | | Custom widget configuration that will be merged with default one. You should provide `slot` in this object in case you are creating recommendation |
| `options<Object>` | *no* | | Additional request options |

> For more information about Findify API and request options please visit [https://developers.findify.io/](https://developers.findify.io/)


---
## Jetshop minimal example

### Search
Go to `/components/SearchPage/SearchPage.js` 
```javascript
//...
import useFindify from '@findify/react-bundle';

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
import useFindify from '@findify/react-bundle';

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

### Recommendation
Go to `/components/StartPage/StatPage.js`
```javascript
//...
import useFindify from '@findify/react-bundle';

//...
const StartPage = ({ location: { pathname, key }, startPageId }) => {
  const [container, isReady, hasError] = useFindify({
    type: 'recommendation',
    config: {
      slot: 'home-findify-rec-2', // Slot is required for recommendations
    }
  });
  return (
    <Fragment>
      <StartPageWrapper>
        <Container>
          <div ref={container} />
          { !isReady && !hasError && 'Widget loading...'}
          // ...
```

### Smart Collection
Go to `/components/StartPage/StatPage.js`
```javascript
//...
import useFindify from '@findify/react-bundle';

//...

const CategoryPage = props => {
  // ...
  const [container, isReady, hasError] = useFindify({ type: 'smart-collection' });

  if (!hasError) {
    return (
      <Container>
        <div ref={container} />
        { !isReady && 'Loading collection'}
      </Container>
    )
  }
  if (infinitePagination) {
    return <LoadableWindowedCategoryPage {...props} />;
  } else {
    return <LoadableStandardCategoryPage {...props} />;
  }
};
  //...
```
In Smart Collection example we are using fallback to initial component' logic to prevent empty page rendering if current category is not imported as collection in Findify.
        