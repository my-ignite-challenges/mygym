import { Button as NativeBaseButton, IButtonProps, Text } from "native-base";

type Props = IButtonProps & {
  title: string;
  variant?: "solid" | "outline";
};

export function Button({ title, variant = "solid", ...props }: Props) {
  const isOutlined = variant === "outline";

  return (
    <NativeBaseButton
      w="full"
      h={14}
      bg={isOutlined ? "transparent" : "green.700"}
      borderWidth={isOutlined ? 1 : 0}
      borderColor="green.500"
      rounded="sm"
      _pressed={{
        bg: isOutlined ? "gray.500" : "green.500",
      }}
      {...props}
    >
      <Text
        color={isOutlined ? "green.500" : "white"}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </NativeBaseButton>
  );
}
