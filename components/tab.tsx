import { Button, Text } from 'tamagui';

interface TamaguiTabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TamaguiTab: React.FC<TamaguiTabProps> = ({ label, isActive, onPress }) => {
  return (
    <Button
      bg={!isActive ? 'transparent' : '$background'}
      borderBottomColor={isActive ? '$background' : undefined}
      onPress={onPress}
      rounded={0}
    >
      <Text>{label}</Text>
    </Button>
  );
};

export default TamaguiTab;