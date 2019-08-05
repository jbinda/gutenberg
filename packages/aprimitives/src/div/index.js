const View = ( { children, ...rest } ) => {
	return <div { ...rest }>{ children }</div>;
};

export default View;