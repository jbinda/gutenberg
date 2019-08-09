const Text = ( { children, ...rest } ) => {
	return <h3 { ...rest }>{ children }</h3>;
};

export default Text;