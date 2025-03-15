import { Button } from "zmp-ui";
import { ButtonProps } from "zmp-ui/button";
import "./styles.scss";
import React from "react";

type CommonButtonProps = ButtonProps & {
  children: string;
  onClick: () => any;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "large" | "medium" | "small";
  isUppercase?: boolean;
  [key: string]: any;
};

const CommonButton = ({
  children,
  onClick,
  variant,
  size,
  isUppercase,
  ...restProps
}: CommonButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant={variant || "primary"}
      size={size || "large"}
      {...restProps}
      className={`commonButton ${restProps?.className ?? ""}`}
    >
      {children && (
        <span className={isUppercase ? "uppercase" : ""}>{children}</span>
      )}
    </Button>
  );
};

export default CommonButton;
