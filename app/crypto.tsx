import { YStack, Text } from 'tamagui';
export default function CryptoScreen() {
  return (
    <YStack bg="$background" flex={1} content="center" items="center">
      <Text mt='$10' fontSize={25} fontWeight="900">Crypto Screen</Text>
    </YStack>
  );
}