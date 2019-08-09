const Text = ( { children, ...rest } ) => {
	return <h4 { ...rest }>{ children }</h4>;
};

export default Text;