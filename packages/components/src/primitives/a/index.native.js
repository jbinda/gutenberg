/**
 * External dependencies
 */
import { TouchableHighlight,Linking } from 'react-native';

const Link = ( { children, href, ...rest } ) => {
	return (
            <TouchableHighlight onPress={() =>{
              Linking.canOpenURL(url).then(supported => {
                if (supported) {
                  Linking.openURL(href);
                } else {
                  console.log('Don\'t know how to open URI: ' + href);
                }
              });
              }}>

              { children }
          </TouchableHighlight>
	);
};

export default Link;