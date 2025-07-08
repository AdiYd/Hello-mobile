import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { YStack, XStack, Input, Button, Card, Text, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import StockCard from '../components/stockCard';
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.TWELVE_DATA_API_KEY;
const skyColors = ['#4fc3f7', '#b3e5fc', '#ffffff'];

export default function StockScreen() {
  const [symbol, setSymbol] = useState('');
  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const fetchStock = async () => {
    setLoading(true);
    setError('');
    setStock(null);
    try {
      const res = await fetch(
        `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`
      );
      const res2 = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=7&apikey=${apiKey}`
      );
      const data = await res.json();
      const data2 = await res2.json();
      if (data.code || !data.symbol) {
        setError('Stock not found or API limit reached.');
        setStock(null);
      } else {
        setStock({ ...data, time_series: data2 });
      }
    } catch (e) {
      setError('Failed to fetch stock data.');
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={[ theme.background.val,theme.background.val,theme.color3.val, theme.color6.val]}
      style={{ flex: 1 }}
      start={[0, 0]}
      end={[1, 1]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        >
        <YStack
          px="$2"
          py="$6"
        >
          <Text
            fontSize={25}
            fontWeight="900"
            mx='auto'
            mb="$4"
            letterSpacing={1}
          >
            Stock Viewer
          </Text>
          <Card
            size="$5"
            maxWidth={420}
            p="$4"
            bg="$background0"
            rounded="$4"
            backdropFilter='blur(200px)'
          >
            <Input
            size="$4"
            placeholder="Enter stock symbol (e.g. AAPL)"
            value={symbol}
            onChangeText={setSymbol}
            autoCapitalize="characters"
            fontSize={18}
            placeholderTextColor='$accent8'
            borderColor='$color11'
            fontWeight="600"
            px="$4"
            mb="$2"
            focusStyle={{
              borderColor: '$color11',
              shadowColor: '$color8',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
            accessibilityLabel="Stock Symbol Input"
            returnKeyType="search"
            onSubmitEditing={fetchStock}
            clearButtonMode="while-editing"
            />
            <Button
            size="$4"
            bg="$color12"
            color='$color1'
            pressStyle={{ bg: '$blue8', scale: 0.97 }}
            onPress={fetchStock}
            disabled={loading || !symbol}
            animation="quick"
            >
            {loading ? 'Loading...' : 'Get Stock'}
            </Button>
            {error ? (
            <Text color="$red10" fontWeight="700" fontSize={16} mt="$2">
              {error}
            </Text>
            ) : null}
            {stock && stock.symbol && (
            <YStack width="100%" mt="$4">
              <StockCard stock={stock} />
            </YStack>
            )}
          </Card>
        </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}