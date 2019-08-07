const View = ( { children, ...rest } ) => {
	return <span { ...rest }>{ children }</span>;
};

export default View;