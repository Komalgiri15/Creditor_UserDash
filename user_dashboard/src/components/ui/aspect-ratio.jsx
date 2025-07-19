import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = React.forwardRef(({ className, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    className={className}
    {...props}
  />
));
AspectRatio.displayName = AspectRatioPrimitive.Root.displayName;

export { AspectRatio };