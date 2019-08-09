const Text = ( { children, ...rest } ) => {
	return <h1 { ...rest }>{ children }</h1>;
};

export default Text;