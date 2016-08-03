

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native';

class Tag extends Component {

  static propTypes = {
    text: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func,
  }

  static defaultProps = {
    text: 'none',
    onPress: () => {},
  }

  render() {    
    return (
      <View style={[styles.container, ]}>
        <Text style={styles.text}>{this.props.text}</Text>
        <TouchableWithoutFeedback onPress={() => this.props.onPress()}>
          <View style={styles.delete}>
            <Text style={styles.deleteText}>X</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'gray',    
    paddingHorizontal: 5,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    height:30,
  },
  text: {
    fontSize: 16,
    color: '#ffffff'
  },
  delete: {
    justifyContent:'center',
    alignItems: 'center',
    width: 14,
    height: 14,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 7,
    right:0,
    marginLeft:5,
  },
  deleteText: {
    fontSize: 12,
    color: '#ffffff'
  }
});

export default Tag;