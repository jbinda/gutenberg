const Text = ( children, ...rest ) => {
	return <h5 { ...rest }>{ children }</h5>;
};

export default Text;