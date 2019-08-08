/**
 * External dependencies
 */
import { FlatList } from 'react-native';

const List = ( { data, className, renderItem, keyExtractor, ...rest } ) => {
	return (
		<FlatList
			data={ data }
			renderItem={ ({item,index}) => renderItem(item,index) }
			keyExtractor={ keyExtractor }
			style={ className }
			{ ...rest }
		/>
	);
};

export default List;