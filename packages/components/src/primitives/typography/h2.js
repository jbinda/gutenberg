const Text = ( { children, ...rest } ) => {
	return <h2 { ...rest }>{ children }</h2>;
};

export default Text;