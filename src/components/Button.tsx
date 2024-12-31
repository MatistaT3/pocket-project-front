import { Text, Pressable, PressableProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "danger";
  label: string;
}

export function Button({
  variant = "primary",
  label,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "p-4 rounded-full";
  const variantStyles = {
    primary: "bg-black active:bg-black/90",
    secondary: "bg-black/[0.03] active:bg-black/[0.05]",
    danger: "bg-red-500 active:bg-red-600",
  };

  const textStyles = {
    primary: "text-white",
    secondary: "text-black",
    danger: "text-white",
  };

  const disabledStyles = disabled ? "opacity-50" : "";

  return (
    <Pressable
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        disabledStyles,
        className
      )}
      disabled={disabled}
      {...props}
    >
      <Text className={twMerge("text-center font-medium", textStyles[variant])}>
        {label}
      </Text>
    </Pressable>
  );
}
