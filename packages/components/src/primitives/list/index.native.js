/**
 * External dependencies
 */
import { FlatList } from 'react-native';

const List = ( { data, classname, renderItem, keyExtractor, ...rest } ) => {
	return (
		<FlatList
			data={ data }
			renderItem={ renderItem }
			keyExtractor={ keyExtractor }
			style={ classname }
			{ ...rest }
		/>
	);
};

export default List;