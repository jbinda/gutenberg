const Link = ( { children,href, ...rest } ) => {
	return <a href={ href } { ...rest }>{ children }</a>;
};

export default Link;