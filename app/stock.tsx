import React, { useEffect, useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { YStack, XStack, Input, Button, Card, Text, useTheme, Spinner } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StockCard from '../components/stockCard';
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.TWELVE_DATA_API_KEY;
const skyColors = ['#4fc3f7', '#b3e5fc', '#ffffff'];

export default function StockScreen() {
  const [symbol, setSymbol] = useState('');
  const [stock, setStock] = useState<any>(null);
  const [availableStocks, setAvailableStocks] = useState<any>({});
  const [recommendedStocks, setRecommendedStocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  //Use effect to store the available stocks in local storage
  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('availableStocks', JSON.stringify(availableStocks));
        const memoryStocksName = await AsyncStorage.getItem('recommendedStocks');
        if (memoryStocksName) {
          const recommendedStocks = JSON.parse(memoryStocksName) as string[];
          const updatedRecommendedStocks = Array.from(new Set([...recommendedStocks, ...Object.keys(availableStocks)])).slice(-5);
            setRecommendedStocks(updatedRecommendedStocks);
          await AsyncStorage.setItem('recommendedStocks', JSON.stringify(updatedRecommendedStocks));
        }
        else {
            await AsyncStorage.setItem('recommendedStocks', JSON.stringify([...Object.keys(availableStocks)]));
        }
      } catch (e) {
        console.error('Failed to save available stocks:', e);
      }
    };
    if (Object.keys(availableStocks).length > 0) {
      storeData();
    }
  }, [availableStocks, Object.keys(availableStocks).length]);

  // Clear all stored data
  const clearData = async () => {
    try {
      await AsyncStorage.removeItem('availableStocks');
      await AsyncStorage.removeItem('recommendedStocks');
      setAvailableStocks({});
      setRecommendedStocks([]);
    } catch (e) {
      console.error('Failed to clear stored data:', e);
    }
  };
//   clearData();

  // Use effect to load the available stocks from local storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const recommendedStocks = await AsyncStorage.getItem('recommendedStocks');
        setRecommendedStocks(recommendedStocks ? JSON.parse(recommendedStocks) : []);

        const jsonValue = await AsyncStorage.getItem('availableStocks');
        const avaliableStorageStock = JSON.parse(jsonValue || '{}');
        // Filter to check if the stock's data is from today
        const today = new Date().toISOString().slice(0, 10);
        const updatedStocks: any = {};
        Object.entries(avaliableStorageStock).forEach(([key, value]: [string, any]) => {
            if (value && value.datetime === today) {
                updatedStocks[key] = value;
            } 
        });
        setAvailableStocks(jsonValue ? updatedStocks : {});
      } catch (e) {
        console.error('Failed to load available stocks:', e);
      }
    };
    loadData();
  }, []);

  const handleStockChange = async (stock: string) => {
    setLoading(true);
    setSymbol(stock);
    if (availableStocks[stock]) {
      setStock(availableStocks[stock]);
      setTimeout(() => {
        setLoading(false);
        }, 600);
    } else {
        await fetchStock(stock);
    }
    
  };

  const fetchStock = async (stockName: string | null) => {
    const capSymbol = (stockName || symbol).toUpperCase().trim();
    setLoading(true);
    if (availableStocks[capSymbol]) {
      setStock(availableStocks[capSymbol]);
        Keyboard.dismiss(); // <-- Dismiss keyboard after loading from cache
      setTimeout(() => {
        setLoading(false);
      }, 600);
      return;
    }
    setError('');
    setStock(null);
    try {
      const res = await fetch(
        `https://api.twelvedata.com/quote?symbol=${capSymbol}&apikey=${apiKey}`
      );
    const res2 = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${capSymbol}&interval=1h&outputsize=1440&apikey=${apiKey}`
    );
      const data = await res.json();
      const data2 = await res2.json();
      if (data.code || !data.symbol) {
        setError('Stock not found or API limit reached.');
        setStock(null);
      } else {
        setAvailableStocks((prev: any) => ({ ...prev, [capSymbol]: { ...data, time_series: data2 } }));
        setStock({ ...data, time_series: data2 });
      }
    } catch (e) {
      setError('Failed to fetch stock data.');
    }
    Keyboard.dismiss(); // <-- Dismiss keyboard after loading from cache    
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  return (
    <LinearGradient
      colors={[ theme.background.val, theme.background.val, theme.background.val, theme.background.val, theme.color2.val, theme.color6.val]}
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
            mb="$4"
            focusStyle={{
              borderColor: '$color11',
              shadowColor: '$color8',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
            accessibilityLabel="Stock Symbol Input"
            returnKeyType="search"
            onSubmitEditing={() => fetchStock(symbol)}
            clearButtonMode="while-editing"
            />
            <Button
            size="$4"
            bg="$color12"
            color='$color1'
            pressStyle={{ bg: '$blue8', scale: 0.97 }}
            onPress={() => fetchStock(symbol)}
            disabled={loading || !symbol}
            animation="quick"
            >

            {loading ? 'Getting stock...' : 'Get Stock'}
            </Button>
            {error ? (
            <Text color="$red10" fontWeight="700" fontSize={16} mt="$2">
              {error}
            </Text>
            ) : null}
            <XStack justify="flex-start" flexWrap='wrap' gap='$2' mt='$4' mb="$2">
            {recommendedStocks.slice(-8).map((stock) => (
                <Button 
                onPress={() => handleStockChange(stock)}
                size='$2' px="$4" rounded="$8" variant='outlined' bg={symbol === stock ? '$color5' : 'transparent'} key={stock}>
                    {stock}
                </Button>
            ))}
            </XStack>
            {loading ? <Spinner mt="$8" size="large" color="$color10" /> : 
            stock  && stock.time_series ? (
            <YStack width="100%" mt="$4">
              <StockCard stock={stock} />
            </YStack>
            ) : null}
          </Card>
        </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}