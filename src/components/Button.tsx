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
  ...props
}: ButtonProps) {
  const baseStyles = "p-4 rounded-full active:opacity-90";
  const variantStyles = {
    primary: "bg-black",
    secondary: "bg-black/[0.03]",
    danger: "bg-red-500",
  };

  const textStyles = {
    primary: "text-white",
    secondary: "text-black",
    danger: "text-white",
  };

  return (
    <Pressable
      className={twMerge(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      <Text className={twMerge("text-center font-medium", textStyles[variant])}>
        {label}
      </Text>
    </Pressable>
  );
}
