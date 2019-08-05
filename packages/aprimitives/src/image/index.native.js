/**
 * External dependencies
 */
import { Image as ImageRN } from 'react-native';

const Image = ({ src, classname, ...rest } )=> {
   return (
        <ImageRN
          style={classname}
          source={{uri: src}}
          {...rest}
        />
 )}

 export default Image 
