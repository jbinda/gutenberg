const Image = ({src,alt,id,onClick,onFocus,onKeyDown,tabIndex,ariaLabel,imgRef} )=>
{
   return ( <img  
					src={ src }
					alt={ alt }
					data-id={ id }
					onClick={ () => onClick() }
					onFocus={ () => onFocus() }
					onKeyDown={ (e) => onKeyDown(e) }
					tabIndex={tabIndex}
					aria-label={ ariaLabel }
					ref={ imgRef }
					/> )
}

export default Image 