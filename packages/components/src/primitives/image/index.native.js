/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * External dependencies
 */
import { Image as ImageRN,TouchableWithoutFeedback } from 'react-native';

/**
 * Internal dependencies
 */
import { mergeStyles } from '../utils'

class Image extends Component {
  render() {
  const { src,imgRef, className,resizeMode, style,styles={}, onPress, onClick, onFocus, ...rest }  = this.props
  const mergedStyles = mergeStyles(className,styles)

  return (
    <TouchableWithoutFeedback onPress={() => onClick ? onClick() : onFocus ? onFocus() : onPress && onPress()}>
        <ImageRN
          ref={imgRef}
          style={ [{resizeMode},style,mergedStyles]}
          source={{uri: src}}
          {...rest}
        />
    </TouchableWithoutFeedback>
 )}
}

 export default Image 
