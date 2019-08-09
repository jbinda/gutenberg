export const  mergeStyles = (className,styles) => (className||"").split(" ").map(style => styles[style])
