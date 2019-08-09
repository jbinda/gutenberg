const Text = ( { children, ...rest } ) => {
	return <p { ...rest }>{ children }</p>;
};

export default Text;
