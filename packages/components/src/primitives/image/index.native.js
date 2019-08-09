/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * External dependencies
 */
import { Image as ImageRN } from 'react-native';

class Image extends Component {
  render() {
  const { src, className,style, ...rest }  = this.props
   return (
        <ImageRN
          style={[className,style]}
          source={{uri: src}}
          {...rest}
        />
 )}
   }

 export default Image 
