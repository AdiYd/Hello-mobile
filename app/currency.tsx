import { YStack, Text } from 'tamagui';
export default function CurrencyScreen() {
  return (
    <YStack bg="$background" flex={1} content="center" items="center">
      <Text mt='$10' fontSize={25} fontWeight="900">Currency Screen</Text>
    </YStack>
  );
}