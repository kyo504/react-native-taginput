'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
  TouchableHighlight,
} from 'react-native';

import Tag from './Tag';

export default class TagInput extends Component {

  static propTypes = {
    initialTags: React.PropTypes.arrayOf(React.PropTypes.string),
    suggestions: React.PropTypes.arrayOf(React.PropTypes.string),
    placeholder: React.PropTypes.string,
    footerText: React.PropTypes.string,
    height: React.PropTypes.number,
    fontSize: React.PropTypes.number,
    containerStyle: View.propTypes.style,
    inputContainerStyle: View.propTypes.style,
    textInputStyle: TextInput.propTypes.style,
    listStyle: ListView.propTypes.style,
    onUpdateTags: React.PropTypes.func,
    onUpdateLayout: React.PropTypes.func,
  }

  static defaultProps = {
    initialTags: [],
    suggestions: [],
    placeholder: 'Select tag or enter tag name...',
    footerText: 'Add a new tag',
    onUpdateTags: () => {},
    onUpdateLayout: () => {},
    containerStyle: null,
    inputContainerStyle: null,
    textInputStyle: null,
    listStyle: null,
  }

  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(this._filterList(props.initialTags)),
      showlist: false,
      tags: props.initialTags,
      userInput: '',
      listPosition: {
        top: 0,
        left: 0,
        right: 0,
      }
    }
  }

  getTags() {
    return this.state.tags;
  }

  blur() {
    this.refs.textInput.blur();
  }

  focus() {
    this.refs.textInput.focus();
  }

  clearText() {
    this.setState({userInput: ''});
    this.refs.textInput.setNativeProps({text: ''});
  }

  _filterList(newTags) {
    var filteredList = this.props.suggestions.filter((tag) => {
      return tag !== newTags.find((t) => (t === tag))
    });
    return filteredList;
  }

  _addTag(text) {
    var newTags = this.state.tags.concat([text]);
    var filteredList = this._filterList(newTags);
    this.setState({
      tags: newTags,
      dataSource: this.state.dataSource.cloneWithRows(filteredList)
    });

    this.clearText();

    this.props.onChange(newTags);
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={this._addTag.bind(this, rowData)}>
        <View style={styles.rowContainer}>
          <Text style={styles.text}>{rowData}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  _renderFooter() {
    const { userInput, tags } = this.state;
    const shouldRender = ( userInput && !tags.includes(userInput) ) ? true : false;
    if (shouldRender) {
      return (
        <TouchableHighlight onPress={this._addTag.bind(this, userInput)}>
          <View style={styles.tagContainer}>
            <Text style={styles.text}>{this.props.footerText + ' \"' + userInput + '\"'}</Text>
          </View>
        </TouchableHighlight>
      )
    }

    return null;
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={rowID} style={styles.separator}/>
    )
  }

  _onBlur() {
    this.blur();
    this.setState({showList: false});
  }

  _onFocus() {
    this.setState({showList: true});
  }

  _onChangeText(text) {
    var filteredList = this.props.suggestions.filter((tag) => {
      return !this.state.tags.find(t => (t === tag)) && tag.includes(text);
    })

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(filteredList),
      userInput: text,
    });
  }

  _getListView() {
    const { dataSource, listPosition } = this.state;
    const { listStyle } = this.props; 

    if(!this.state.showList) {
      return null;
    }

    return (
      <ListView
        style={[styles.list, listPosition, listStyle]}
        ref='listView'
        keyboardShouldPersistTaps={true}
        dataSource={dataSource}
        enableEmptySections={true}
        renderRow={this._renderRow.bind(this)}
        renderSeparator={this._renderSeparator.bind(this)}
        renderFooter={this._renderFooter.bind(this)}
      />        
    )
  }

  _removeTag(tag) {
    var newTags = this.state.tags.filter((t) => (t !== tag));
    var filteredList = this._filterList(newTags);
    this.setState({
      tags: newTags,
      dataSource: this.state.dataSource.cloneWithRows(filteredList),
    });

    this.props.onChange(newTags);    
  }

  _onChangeLayout(e) {
    let layout = e.nativeEvent.layout;

    this.setState({
      listPosition: {
        top: layout.height,
        left: 0,
        right: 0,
      }
    })

    this.props.onUpdateLayout(layout);
  }

  render() {

    const { placeholder, containerStyle, inputContainerStyle, textInputStyle } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <View ref='tagInput' style={[styles.inputContainer, inputContainerStyle]} onLayout={this._onChangeLayout.bind(this)}>
          {this.state.tags.map((tag) => (
            <Tag key={tag} text={tag} style={null} onPress={this._removeTag.bind(this, tag)}/>
          ))}
          <TextInput
            ref='textInput'
            style={[styles.textinput, textInputStyle]}
            underlineColorAndroid='transparent'
            placeholder={this.state.tags.length > 0 ? '' : this.props.placeholder}
            onChangeText={this._onChangeText.bind(this)}
            onFocus={this._onFocus.bind(this)}
            onBlur={this._onBlur.bind(this)}
            autoCorrect={false}
            autoCapitalize='none'
          />
        </View>
        {this._getListView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection:'row', 
    flexWrap: 'wrap',
    padding: 2,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    minHeight:20,
  },
  textinput: {
    flex: 1,
    fontSize:10,
    alignSelf: 'stretch',
    minWidth: 50,
    height:20,
    margin:2
  },
  rowContainer: {
    backgroundColor: 'white',
    justifyContent:'center',
    padding:10,
  },
  text: {
    fontSize: 10,
  },
  separator: {
    height:1,
    alignSelf: 'stretch',
    backgroundColor: '#666666',
  },
  list: {
    position: 'absolute',
  }
});
