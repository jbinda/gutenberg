/**
 * External dependencies
 */
import { Image as ImageRN } from 'react-native';

const Image = ({ src, className,style, ...rest } )=> {
   return (
        <ImageRN
          style={[className,style]}
          source={{uri: src}}
          {...rest}
        />
 )}

 export default Image 
