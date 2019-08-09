/**
 * External dependencies
 */
import { View as RNView } from 'react-native';
/**
 * Internal dependencies
 */
import { mergeStyles } from '../utils'

const View = ( { children, className, styles={}, ...rest } ) => {
	const mergedStyles = mergeStyles(className,styles)
	return (
		<RNView style={styles && mergedStyles} { ...rest }>
			{ children }
		</RNView>
	);
};

export default View;