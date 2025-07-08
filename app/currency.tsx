import React, { useState, useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Keyboard, Platform, Modal, Pressable, ColorValue } from 'react-native';
import { YStack, XStack, Input, Button, Card, Text, useTheme, Spinner, GetThemeValueForKey, View } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Currency dictionary with top 15 most used currencies
const currenciesOld = {
  'USD': { flag: '🇺🇸', symbol: '$', country: 'United States' },
  'EUR': { flag: '🇪🇺', symbol: '€', country: 'European Union' },
  'JPY': { flag: '🇯🇵', symbol: '¥', country: 'Japan' },
  'GBP': { flag: '🇬🇧', symbol: '£', country: 'United Kingdom' },
  'AUD': { flag: '🇦🇺', symbol: 'AU$', country: 'Australia' },
  'CAD': { flag: '🇨🇦', symbol: 'CA$', country: 'Canada' },
  'CHF': { flag: '🇨🇭', symbol: 'Fr', country: 'Switzerland' },
  'CNY': { flag: '🇨🇳', symbol: '¥', country: 'China' },
  'HKD': { flag: '🇭🇰', symbol: 'HK$', country: 'Hong Kong' },
  'NZD': { flag: '🇳🇿', symbol: 'NZ$', country: 'New Zealand' },
  'SEK': { flag: '🇸🇪', symbol: 'kr', country: 'Sweden' },
  'KRW': { flag: '🇰🇷', symbol: '₩', country: 'South Korea' },
  'SGD': { flag: '🇸🇬', symbol: 'SD$', country: 'Singapore' },
  'NOK': { flag: '🇳🇴', symbol: 'kr', country: 'Norway' },
  'ILS': { flag: '🇮🇱', symbol: '₪', country: 'Israel' },
  'RUB': { flag: '🇷🇺', symbol: '₽', country: 'Russia' },

};
const currencies = {
  'USD': { flag: '🇺🇸', symbol: '$', country: 'United States' },
  'EUR': { flag: '🇪🇺', symbol: '€', country: 'European Union' },
  'JPY': { flag: '🇯🇵', symbol: '¥', country: 'Japan' },
  'GBP': { flag: '🇬🇧', symbol: '£', country: 'United Kingdom' },
  'AUD': { flag: '🇦🇺', symbol: 'AU$', country: 'Australia' },
  'CAD': { flag: '🇨🇦', symbol: 'CA$', country: 'Canada' },
  'CHF': { flag: '🇨🇭', symbol: 'Fr', country: 'Switzerland' },
  'CNY': { flag: '🇨🇳', symbol: '¥', country: 'China' },
  'HKD': { flag: '🇭🇰', symbol: 'HK$', country: 'Hong Kong' },
  'NZD': { flag: '🇳🇿', symbol: 'NZ$', country: 'New Zealand' },
  'SEK': { flag: '🇸🇪', symbol: 'kr', country: 'Sweden' },
  'KRW': { flag: '🇰🇷', symbol: '₩', country: 'South Korea' },
  'SGD': { flag: '🇸🇬', symbol: 'SD$', country: 'Singapore' },
  'NOK': { flag: '🇳🇴', symbol: 'kr', country: 'Norway' },
  'ILS': { flag: '🇮🇱', symbol: '₪', country: 'Israel' },
  'RUB': { flag: '🇷🇺', symbol: '₽', country: 'Russia' },
  'INR': { flag: '🇮🇳', symbol: '₹', country: 'India' },
  'BRL': { flag: '🇧🇷', symbol: 'R$', country: 'Brazil' },
  'MXN': { flag: '🇲🇽', symbol: 'MX$', country: 'Mexico' },
  'ZAR': { flag: '🇿🇦', symbol: 'R', country: 'South Africa' },
  'TRY': { flag: '🇹🇷', symbol: '₺', country: 'Turkey' },
  'SAR': { flag: '🇸🇦', symbol: '﷼', country: 'Saudi Arabia' },
  'AED': { flag: '🇦🇪', symbol: 'د.إ', country: 'United Arab Emirates' },
  'PLN': { flag: '🇵🇱', symbol: 'zł', country: 'Poland' },
  'THB': { flag: '🇹🇭', symbol: '฿', country: 'Thailand' },
  'IDR': { flag: '🇮🇩', symbol: 'Rp', country: 'Indonesia' },
  'MYR': { flag: '🇲🇾', symbol: 'RM', country: 'Malaysia' },
  'DKK': { flag: '🇩🇰', symbol: 'kr', country: 'Denmark' },
  'CZK': { flag: '🇨🇿', symbol: 'Kč', country: 'Czech Republic' },
  'HUF': { flag: '🇭🇺', symbol: 'Ft', country: 'Hungary' },
  'PHP': { flag: '🇵🇭', symbol: '₱', country: 'Philippines' },
  'CLP': { flag: '🇨🇱', symbol: '$', country: 'Chile' },
  'COP': { flag: '🇨🇴', symbol: '$', country: 'Colombia' },
  'EGP': { flag: '🇪🇬', symbol: '£', country: 'Egypt' },
  'PKR': { flag: '🇵🇰', symbol: '₨', country: 'Pakistan' },
  'TWD': { flag: '🇹🇼', symbol: 'NT$', country: 'Taiwan' },
  'VND': { flag: '🇻🇳', symbol: '₫', country: 'Vietnam' },
  'BDT': { flag: '🇧🇩', symbol: '৳', country: 'Bangladesh' },
  'UAH': { flag: '🇺🇦', symbol: '₴', country: 'Ukraine' },
  'ARS': { flag: '🇦🇷', symbol: '$', country: 'Argentina' },
  'KWD': { flag: '🇰🇼', symbol: 'د.ك', country: 'Kuwait' },
  'QAR': { flag: '🇶🇦', symbol: 'ر.ق', country: 'Qatar' },
  'MAD': { flag: '🇲🇦', symbol: 'د.م.', country: 'Morocco' },
  'DZD': { flag: '🇩🇿', symbol: 'دج', country: 'Algeria' },
  'JOD': { flag: '🇯🇴', symbol: 'د.ا', country: 'Jordan' },
};

const STORAGE_KEY = 'selectedCurrencies';


type CurrencyCode = keyof typeof currencies;
const DEFAULT_CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'ILS', 'AUD'];

// Currency Row Component
const CurrencyRow = ({ 
  currencyCode, 
  value, 
  onValueChange, 
  onCurrencyChange, 
  focused,
  onFocus,
  disabled
}: { 
  currencyCode: CurrencyCode; 
  value: string; 
  onValueChange: (value: string) => void; 
  onCurrencyChange: (currency: CurrencyCode) => void;
  focused: boolean;
  onFocus: () => void;
  disabled: boolean;
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const currencyInfo = currencies[currencyCode];
  const [searchCurrency, setSearchCurrency] = useState('');

  
  return (
    <>
      <XStack 
        items="center" 
        gap="$2" 
        py="$1"
        bg={focused ? '$color5' : '$background'}
        px="$2"
        mb="$2"
        rounded="$4"
      >
        {/* Only the selector is pressable */}
        <Pressable style={{flex:2}} onPress={() => !disabled && setModalVisible(true)}>
          <XStack items="center" gap="$2" minW={90}>
            <Text fontSize={24}>{currencyInfo.flag}</Text>
            <Text fontSize={16} fontWeight="600">{currencyCode}</Text>
            <Text onPress={onFocus}  text='center' fontSize={20}>{currencyInfo.symbol}</Text>
            <Ionicons name="chevron-down" size={16} color={theme.color.val } />
          </XStack>
        </Pressable>

        <Input
          flex={2}
          value={value}
          onChangeText={onValueChange}
          keyboardType="numeric"
          fontSize={20}
          text="right"
          borderWidth={0}
          bg="transparent"
          px="$2"
          width='40%'
          onFocus={onFocus}
          disabled={disabled}
          placeholder="0.00"
          placeholderTextColor={theme.colorPress.val }
          showSoftInputOnFocus={false}
          editable={false}
          pointerEvents='none' // Disable keyboard input
        />
      </XStack>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        >
        <Pressable
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
            onPress={() => setModalVisible(false)}
        >
            <YStack
            width="80%"
            maxH="70%"
            p="$4"
            bg='$background'
            rounded="$4"
            // Prevent press propagation to the background
            onStartShouldSetResponder={() => true}
            onTouchEnd={e => e.stopPropagation()}
            >
            <Text fontSize={18} fontWeight="bold" mb="$4">Select Currency</Text>
            {/* Search input */}
            <Input
              placeholder="Search..."
              value={searchCurrency}
              onChangeText={(text) => {
                setSearchCurrency(text);
              }}
            />
            <ScrollView showsVerticalScrollIndicator>
                <YStack>
                {Object.entries(currencies).filter(([code, info]) => {
                    const upperCase= searchCurrency.toUpperCase();
                  return info.flag.includes(upperCase) || code.includes(upperCase) || info.symbol.includes(upperCase) || info.country.toUpperCase().includes(upperCase);
                }).map(([code, info]) => (
                    <Pressable key={code} onPress={() => {
                        onCurrencyChange(code as CurrencyCode);
                        setModalVisible(false);
                    }}>
                        <XStack gap="$2" items="center" py="$2">
                            <Text fontSize={24}>{info.flag}</Text>
                            <Text fontSize={16} fontWeight="600">{code}</Text>
                            <Text fontSize={16} fontWeight="600">{info.symbol}</Text>
                            <Text fontSize={10} fontWeight="300">({info.country})</Text>
                        </XStack>
                    </Pressable>
                ))}
                </YStack>
            </ScrollView>
            <Button mt="$4" onPress={() => setModalVisible(false)} bg="$color12" color="$color1">Close</Button>
            </YStack>
        </Pressable>
        </Modal>
    </>
  );
};

// Number Pad Component
const NumberPad = ({ onPress }: { onPress: (value: string) => void }) => {
  const theme = useTheme();
  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '.', '0', '⌫'
  ];
  
  return (
    <YStack width="100%" mt="$2">
      <XStack flexWrap="wrap" justify="center">
        {buttons.map((btn) => (
          <Button
            key={btn}
            width="30%"
            height={50}
            m={'1.5%'}
            bg='$background'
            borderColor={'$borderColor'}
            borderWidth={1}
            shadowColor={'$shadowColor'}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.2}
            shadowRadius={4}
            pressStyle={{ bg: '$color8', scale: 0.97 }}
            onPress={() => onPress(btn)}
            animation="quick"
          >
            <Text fontSize={24} fontWeight="600">
              {btn}
            </Text>
          </Button>
        ))}
      </XStack>
    </YStack>
  );
};

export default function CurrencyScreen() {
  const theme = useTheme();
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [justFocused, setJustFocused] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState<CurrencyCode[]>(DEFAULT_CURRENCIES);
  const [values, setValues] = useState<Record<CurrencyCode, string>>(
    DEFAULT_CURRENCIES.reduce((acc, curr) => ({ ...acc, [curr]: '' }), {} as Record<CurrencyCode, string>)
  );
  const [activeInput, setActiveInput] = useState<CurrencyCode>('USD');
  const [lastUpdated, setLastUpdated] = useState('');

    // Load preferences on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.every(code => typeof code === 'string')) {
            setSelectedCurrencies(parsed as CurrencyCode[]);
          }
        }
      } catch (e) {
        // handle error if needed
      }
    })();
  }, []);

    // Save preferences when changed
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCurrencies));
  }, [selectedCurrencies]);

  // Fetch currency rates
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        // Using ExchangeRate-API for this example
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
          setRates(data.rates);
          setLastUpdated(new Date().toLocaleString());
        } else {
          setError('Unable to load currency rates');
        }
      } catch (err) {
        setError('Error fetching currency rates. Please try again later.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRates();
  }, []);
  
  // Handle currency change
  const handleCurrencyChange = (index: number, newCurrency: CurrencyCode) => {
    // Prevent duplicates
    // if (selectedCurrencies.includes(newCurrency)) return;
    const newSelectedCurrencies = [...selectedCurrencies];
    newSelectedCurrencies[index] = newCurrency;
    
    // Remove values for currencies not in the new selection
    const newValues: Record<CurrencyCode, string> = {} as Record<CurrencyCode, string>;
    newSelectedCurrencies.forEach((code) => {
        newValues[code] = values[code] || '';
    });
    setSelectedCurrencies(newSelectedCurrencies);
    setValues(newValues);
    // Update values after currency change
    const activeValue = values[activeInput];
    if (activeValue && activeValue !== '0') {
      handleValueChange(activeInput, activeValue);
    }
    setJustFocused(true);
  };
  
  // Handle value change
  const handleValueChange = (currencyCode: CurrencyCode, newValue: string) => {
    if (!/^\d*\.?\d*$/.test(newValue) && newValue !== '') return;
    
    const newValues = { ...values };
    newValues[currencyCode] = newValue;
    
    // Only calculate if we have rates and a value
    if (Object.keys(rates).length > 0 && newValue !== '') {
      // Convert the value to USD first
      const valueInUSD = parseFloat(newValue) / (rates[currencyCode] || 1);
      
      // Convert USD to all other currencies
      selectedCurrencies.forEach((code) => {
        if (code !== currencyCode) {
          const convertedValue = (valueInUSD * (rates[code] || 1)).toFixed(2);
          newValues[code] = convertedValue;
        }
      });
    } else if (newValue === '') {
      // Clear all values if input is empty
      selectedCurrencies.forEach((code) => {
        if (code !== currencyCode) {
          newValues[code] = '';
        }
      });
    }
    
    setValues(newValues);
  };
  
  // Handle number pad press
  const handleNumberPress = (value: string) => {
    if (!activeInput) return;
    
    if (value === '⌫') {
      handleValueChange(
        activeInput,
        values[activeInput].slice(0, -1)
      );
    } else if (value === '.' && values[activeInput].includes('.')) {
      return; // Don't add multiple decimal points
    }  else {
      let newValue;
      if (justFocused) {
        newValue = value === '.' ? '0.' : value;
        setJustFocused(false);
      } else {
        newValue = values[activeInput] === '0' && value !== '.'
          ? value
          : values[activeInput] + value;
      }
      handleValueChange(activeInput, newValue);
    }
  };

  const handleRetry = () => {
    setError('');
    setLoading(true);
    // Re-fetch the rates
    const fetchRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
          setRates(data.rates);
          setLastUpdated(new Date().toLocaleString());
          setError('');
        } else {
          setError('Unable to load currency rates');
        }
      } catch (err) {
        setError('Error fetching currency rates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRates();
  };
  
  return (
    <LinearGradient
      colors={[
        theme.background.val , 
        theme.background.val , 
        theme.background.val , 
        theme.background.val ,
        theme.color2.val , 
        theme.color6.val 
      ]}
      style={{ flex: 1 }}
      start={[0, 0]}
      end={[1, 1]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <YStack flex={1} px="$4" py="$4">
            <YStack items="center" gap="$2" mb="$4">
              <Text fontSize={25} fontWeight="900" letterSpacing={1}>Currency Converter</Text>
              {lastUpdated && (
                <Text fontSize={12} color={'$colorPress'} opacity={0.8} mt="$1">
                  Last updated: {lastUpdated}
                </Text>
              )}
            </YStack>
            
            {loading ? (
              <YStack items="center" justify="center" flex={1} gap="$4">
                <Spinner size="large" color={'$color10'} />
                <Text fontSize={16}>Loading currency rates...</Text>
                <Text fontSize={14} color={'$colorPress'} text="center" maxW={300}>
                  We're retrieving the latest exchange rates for you
                </Text>
              </YStack>
            ) : error ? (
              <YStack items="center" justify="center" flex={1} gap="$4">
                <Ionicons name="alert-circle" size={48} color={'$color11'} />
                <Text fontSize={16} color={'$color11'} text="center">
                  {error}
                </Text>
                <Button 
                  onPress={handleRetry}
                  bg={'$color12'}
                  color={'$color1'}
                  size="$4"
                >
                  Retry
                </Button>
              </YStack>
            ) : (
              <>
                <Card 
                  p="$2" 
                  rounded="$4" 
                  bg={theme.background.val as GetThemeValueForKey<'color'>}
                  shadowRadius={8}
                //   elevation={3}
                >
                  <ScrollView style={{ maxHeight: 270 }}>
                    {Array.from(new Set(selectedCurrencies)).map((currencyCode, index) => (
                      <CurrencyRow
                        key={index}
                        currencyCode={currencyCode}
                        value={values[currencyCode]}
                        onValueChange={(value) => handleValueChange(currencyCode, value)}
                        onCurrencyChange={(currency) => handleCurrencyChange(index, currency)}
                        focused={activeInput === currencyCode}
                        onFocus={() => {
                            setJustFocused(true);
                          setActiveInput(currencyCode);
                          Keyboard.dismiss(); // Dismiss keyboard to use number pad
                        }}
                        disabled={loading}
                      />
                    ))}
                  </ScrollView>

                  {/* <XStack mt="$4" items="baseline" justify="center" gap="$2" opacity={0.7}>
                    <Text color={'$colorPress'}>
                        <FontAwesome5 name="info-circle" size={14} color={'currentColor'} />
                    </Text>
                    <Text fontSize={12} color={'$colorPress'}>
                      Tap a currency to edit its value
                    </Text>
                  </XStack> */}
                </Card>
                
                <NumberPad onPress={handleNumberPress} />
              </>
            )}
          </YStack>
        </Pressable>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}