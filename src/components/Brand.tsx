import { Image, Center, Text } from "native-base";

import backgroundImage from "@assets/background.png";
import Logo from "@assets/logo.svg";

export function Brand() {
  return (
    <>
      <Image
        source={backgroundImage}
        defaultSource={backgroundImage}
        alt="Pessoas se exercitando"
        resizeMode="contain"
        position="absolute"
      />

      <Center my={24}>
        <Logo />
        <Text color="gray.100" fontSize="sm">
          Treine sua mente e o seu corpo
        </Text>
      </Center>
    </>
  );
}
