import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TamaguiProvider, Theme, ThemeName, ThemeProps, useTheme } from 'tamagui';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import CurrencyScreen from './currency';
import StockScreen from './stock';
import CryptoScreen from './crypto';
import config from '../tamagui.config';
import { useState } from 'react';

const Tab = createMaterialTopTabNavigator();

export default function Layout() {
  const [themeName, setThemeName] = useState<ThemeName>('light_red');
  const currentTheme = config.themes['light_red'];
  return (
    <TamaguiProvider config={config}>
      <Theme name={themeName}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Remove NavigationContainer - expo-router provides its own */}
        <Tab.Navigator
          initialRouteName='Stock'
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => {
              if (route.name === 'Currency') {
                return <FontAwesome5 name="money-bill-wave" size={20} color={color} />;
              } else if (route.name === 'Stock') {
                return <MaterialCommunityIcons name="finance" size={20} color={color} />;
              } else if (route.name === 'Crypto') {
                return <Ionicons name="logo-bitcoin" size={20} color={color} />;
              }
              return <></>;
            },
            tabBarActiveTintColor: currentTheme.color11.val,
            tabBarInactiveTintColor: currentTheme.accent8.val,
            tabBarShowIcon: true,
            tabBarIndicatorStyle: {
              backgroundColor: currentTheme.color11.val,
              height: 2,
            },
            tabBarStyle:{
              backgroundColor: currentTheme.background.val,
            }
          })}
        >
          <Tab.Screen name="Stock" component={StockScreen} />
          <Tab.Screen name="Currency" component={CurrencyScreen} />
          <Tab.Screen name="Crypto" component={CryptoScreen} />
        </Tab.Navigator>
      </SafeAreaView>
      </Theme>
    </TamaguiProvider>
  );
}