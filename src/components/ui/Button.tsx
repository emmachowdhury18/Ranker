import { ComponentProps, ReactNode, forwardRef } from "react";

type ButtonProps = {
  icon: ReactNode;
};

export default forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & ButtonProps
>(function Button({ icon, ...rest }, ref) {
  return (
    <button
      ref={ref}
      className="inline-flex items-center gap-1 p-1 text-sm text-white cursor-pointer"
      {...rest}>
      {icon}
    </button>
  );
});