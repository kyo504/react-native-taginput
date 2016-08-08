
## react-native-taginput

Tag input component fro React Native

## ChangeLog
- v0.1.0
 - Initial working version

## Installation

1. Run `npm install react-native-taginput --save`
2. `import TagInput from 'react-native-taginput`

## Basic usage

```javascript
import TagInput from 'react-native-taginput';

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TagInput
          ref='tagInput'
          initialTags={initialTags}
          suggestions={this.state.data.suggestions}
          containerStyle={styles.taginput}
          onChange={this._onChange.bind(this)}
          onUpdateLayout={this._onUpdateLayout.bind(this)}
        />
      </View>
    );
  }
}
```

## Examples

> Add example link

## Props

> Add props

## Contribution
**Issues** and **Pull requests** are welcome. Please add a screenshot of bug and code snippet.

## About
This is inspired by [react-native-autocomplete-input](https://github.com/l-urence/react-native-autocomplete-input).

---

**MIT Licensed**
