/**
 * External dependencies
 */
import { View as RNView } from 'react-native';

const View = ( { children, classname, ...rest } ) => {
	return (
		<RNView style={ classname } { ...rest }>
			{ children }
		</RNView>
	);
};

export default View;