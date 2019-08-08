/**
 * External dependencies
 */
import { View as RNView } from 'react-native';

const View = ( { children, className, ...rest } ) => {
	return (
		<RNView style={ className } { ...rest }>
			{ children }
		</RNView>
	);
};

export default View;