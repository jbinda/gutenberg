/**
 * External dependencies
 */
import { View as RNView } from 'react-native';
/**
 * Internal dependencies
 */
import { Text } from '../typography';

const View = ( { children, className, ...rest } ) => {
	if ( typeof children === 'string' ) {
		return <Text { ...rest }>{ children }</Text>;
	}
	return (
		<RNView style={ className } { ...rest }>
			{ children }
		</RNView>
	);
};

export default View;