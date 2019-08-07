/**
 * External dependencies
 */
import { Text as RNText } from 'react-native';

const Text = ( { classname, children, ...rest } ) => {
	return (
		<RNText style={ classname } { ...rest }>
			{ children }
		</RNText>
	);
};

export default Text