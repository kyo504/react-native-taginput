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

class TagInput extends Component {

  static propTypes = {
    initialTags: React.PropTypes.arrayOf(React.PropTypes.string),
    tagList: React.PropTypes.arrayOf(React.PropTypes.string),
  }

  static defaultProps = {
    initialTags: [],
    tagList: [],
  }

  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(props.tagList),
      showlist: false,
      tags: props.initialTags,
    }
  }

  triggerBlur() {
    if (this.refs.textInput) this.refs.textInput.blur();
  }

  _getFilterList(newArray) {

    var filteredList = this.props.tagList.filter((tag) => {
      var temp = newArray.find((t) => {
        return t === tag;
      });
      return tag !== temp;
    })

    return filteredList;
  }

  _addTag(text) {
    var newArray = this.state.tags.concat([text]);
    var filteredList = this._getFilterList(newArray);
    this.setState({
      tags: newArray,
      dataSource: this.state.dataSource.cloneWithRows(filteredList)
    });
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={this._addTag.bind(this, rowData)}>
        <View style={styles.tagContainer}>
          <Text style={styles.text}>{rowData}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{height:1, alignSelf: 'stretch', backgroundColor: '#666666'}}
      />
    )
  }

  _onBlur() {
    this.triggerBlur();
    this.setState({showList: false});
  }

  _onFocus() {
    this.setState({showList: true});
  }

  _onChange(event) {
    console.log('onChange');
  }

  _onChangeText(text) {
    var filteredList = this.props.tagList.filter((tag) => {
      return tag.includes(text);
    })

    this.setState({dataSource: this.state.dataSource.cloneWithRows(filteredList)});
  }

  _getListView() {
    if(this.state.showList === true) {
      return (
        <ListView
          style={styles.taglist}
          ref={(component) => this._listView = component}
          keyboardShouldPersistTaps={true}
          keyboardDismissMode="on-drag"
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
        />        
      )
    }

    return null;
  }

  _removeTag(tag) {
    console.log(tag);

    var newTags = this.state.tags.filter((t) => (t !== tag));
    var filteredList = this._getFilterList(newTags);
    this.setState({
      tags: newTags,
      dataSource: this.state.dataSource.cloneWithRows(filteredList),
    })
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.taginputBox}>
            {this.state.tags.map((tag) => (
              <Tag key={tag} text={tag} onPress={this._removeTag.bind(this, tag)}/>
            ))}
            <TextInput
              style={styles.textinput}
              underlineColorAndroid='transparent'
              placeholder='검색'
              onChange={this._onChange.bind(this)}
              onChangeText={this._onChangeText.bind(this)}
              onFocus={this._onFocus.bind(this)}
            />
          </View>
        </View>
        {this._getListView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    borderWidth:1,
    borderColor: 'gray',
  },
  taginputBox: {
    flexDirection:'row', 
    flexWrap: 'wrap',
    margin: 5,
    padding: 5,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  textinput: {
    flex:1,
    alignSelf: 'stretch',
    fontSize: 16,
    minWidth: 50,
  },
  taglist: {
    height:300,
  },
  tagContainer: {
    backgroundColor: '#242424',
    justifyContent:'center',
    paddingHorizontal: 16,
    height: 40,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
});

module.exports = TagInput;
