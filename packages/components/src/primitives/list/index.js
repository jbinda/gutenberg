const List = ( { data, renderItem, ...otherProps } ) => {
	return <ul { ...otherProps }>{ data.map( renderItem ) }</ul>;
};

export default List;