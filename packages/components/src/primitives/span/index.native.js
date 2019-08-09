/**
 * External dependencies
 */
import { View as RNView } from 'react-native';

/**
 * Internal dependencies
 */
import { Text } from '../typography';
import { mergeStyles } from '../utils'

const View = ( { children, className, styles, ...rest } ) => {
	  const mergedStyles = mergeStyles(className,styles)

    if ( typeof children === 'string' ) {
        return <Text style={styles && mergedStyles} { ...rest }>{ children }</Text>;
    }
    return (
        <RNView style={styles && mergedStyles} { ...rest }>
            { children }
        </RNView>
    );
};

export default View;
