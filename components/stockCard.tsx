import React, { useEffect } from 'react';
import { ColorValue, Dimensions, TouchableOpacity } from 'react-native';
import { GetThemeValueForKey, Stack, Text, useTheme, XStack, YStack } from 'tamagui';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function StockCard({ stock }: { stock: any }) {
  const isUp = Number(stock.change) > 0;
  const theme = useTheme();
  const [update, setUpdate] = React.useState(0);
  const [selectedRange, setSelectedRange] = React.useState<'1d' | '1w' | '1m' | '60d'>('1d');
  const screenWidth = Dimensions.get('window').width - 40;

  useEffect(() => {
    if (stock) {
      stock.open = Number(stock.open).toFixed(2);
      stock.high = Number(stock.high).toFixed(2);
      stock.low = Number(stock.low).toFixed(2);
      stock.close = Number(stock.close).toFixed(2);
      stock.change = Number(stock.change).toFixed(2);
      stock.previous_close = Number(stock.previous_close).toFixed(2);
      if (stock.fifty_two_week) {
        stock.fifty_two_week.low = Number(stock.fifty_two_week.low).toFixed(2);
        stock.fifty_two_week.high = Number(stock.fifty_two_week.high).toFixed(2);
      }
    }
    setUpdate((prev) => prev + 1);
  }, [stock]);

  const chartData = {
    labels: ['52w Low', 'Current', '52w High'],
    datasets: [
      {
        data: [
          Number(stock.fifty_two_week.low),
          Number(stock.close),
          Number(stock.fifty_two_week.high)
        ]
      }
    ]
  };

  // Helper to filter time series
  const getFilteredTimeSeries = () => {
    if (!stock?.time_series?.values) return [];
    const all = stock.time_series.values;
    switch (selectedRange) {
      case '1d':
        // 1 day = 7 (market hours) or 24 (full day) points, but API is 1h interval, so 7 for market hours
        return all.slice(0, 7).filter((v: any) => v.datetime.slice(0, 10) === new Date().toISOString().slice(0, 10)).reverse();
      case '1w':
        return all.slice(0, 7 * 5).reverse(); // 5 market days
      case '1m':
        return all.slice(0, 30 * 7).reverse(); // 30 market days, 7 hours per day
      case '60d':
        return all.slice(0, 60 * 7).reverse();
      default:
        return all.reverse();
    }
  };

  const filteredSeries = getFilteredTimeSeries();

  const chart2Data = {
    labels: filteredSeries.map((v: any, i: number) => {
      // Show only a few labels to avoid clutter
      if (selectedRange === '1d') return v.datetime.slice(11, 16); // HH:MM
      if (i % Math.ceil(filteredSeries.length / 6) === 0) return v.datetime.slice(5, 10); // MM-DD
      return '';
    }),
    datasets: [
      {
        data: filteredSeries.map((v: any) => Number(v.close)),
      },
    ],
  };

  // Use theme colors for chart config
  const chartConfig = {
    backgroundColor: theme.background.val ?? '#fff',
    backgroundGradientFrom: theme.background02?.val ?? '#fff',
    backgroundGradientTo: theme.background0?.val ?? '#fff',
    color: (opacity = 1) => theme.color10 ? `${theme.color10.val}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : `rgba(124,58,237,${opacity})`,
    labelColor: (opacity = 1) => theme.colorPress ? `${theme.colorPress.val}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : `rgba(113,113,122,${opacity})`,
    barPercentage: 0.8,
    decimalPlaces: 2,
    propsForLabels: {
      fontSize: 10,
    },
    propsForDots: {
      r: "0",
      strokeWidth: "1",
    },
    propsForBackgroundLines: {
    stroke: theme.borderColorPress ? `${theme.accent12.val}22` : 'rgba(113,113,122,0.013)', // 0.13 opacity
     },
  };
  return (
    <Stack
      width="100%"
      rounded="$4"
      shadowColor="$shadowColor"
      shadowRadius={8}
      p="$0.25"
      mb="$3"
    >
      <XStack items="baseline" mb="$2">
        <Text>
          <Icon name="finance" size={25} color="currentColor" />
        </Text>
        <Text ml="$2" fontSize="$6" fontWeight="bold" color="$color">
          {stock.name}
        </Text>
        <Text ml="$2" fontSize="$2" self='baseline' color="$colorPress">
          ({stock.symbol})
        </Text>
      </XStack>
      <XStack items="center" mb="$2">
        <Icon
          name={isUp ? "arrow-up-bold-circle" : "arrow-down-bold-circle"}
          size={24}
          color={isUp ? "green" : "red"}
        />
        <Text ml="$2" fontSize="$6" fontWeight="600" color={isUp ? "$green10" : "$red10"}>
          ${stock.close}
        </Text>
        <Text ml="$2" fontSize="$4" color={isUp ? "$green10" : "$red10"}>
          {stock.change} ({Number(stock.percent_change).toFixed(2)}%)
        </Text>
      </XStack>
      <XStack flexWrap="wrap" justify="space-between" my="$2">
        <YStack>
          <Text fontSize="$3" color="$colorPress">Open: ${stock.open}</Text>
          <Text fontSize="$3" color="$colorPress">High: ${stock.high}</Text>
        </YStack>
        <YStack>
          <Text fontSize="$3" color="$colorPress">Low: ${stock.low}</Text>
          <Text fontSize="$3" color="$colorPress">Prev: ${stock.previous_close}</Text>
        </YStack>
      </XStack>
      <XStack items="center" my="$2">
        <Text>
          <Icon name="swap-vertical" size={20} color="currentColor" />
        </Text>
          <Text ml="$1" fontSize="$3" color="$color">52W Range: ${stock.fifty_two_week.low} - ${stock.fifty_two_week.high}</Text>
      </XStack>
      {/* Filter bar */}
      <XStack justify="center" gap='$2' mt='$4' mb="$2">
        {[
          { label: '1 Day', value: '1d' },
          { label: '1 Week', value: '1w' },
          { label: '1 Month', value: '1m' },
          { label: '60 Days', value: '60d' },
        ].map((f) => (
          <TouchableOpacity key={f.value} onPress={() => setSelectedRange(f.value as any)}>
            <Text
              fontWeight={selectedRange === f.value ? 'bold' : 'normal'}
              color={selectedRange === f.value ? '$color' : '$colorPress'}
              borderBottomWidth={selectedRange === f.value ? 2 : 0}
              borderBottomColor={selectedRange === f.value ? '$color' : 'transparent'}
              px="$2"
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </XStack>
      {/* Line chart for time series data */}
      <Stack
        width={screenWidth}
        self="center"
        rounded={12}
        my='$2'
        items="center"
      >
        <LineChart
          data={chart2Data}
          width={screenWidth}
          yAxisLabel="$"
          height={180}
          chartConfig={chartConfig}
           style={{
            borderRadius: 16,
            borderWidth: 0.8, 
            borderColor: theme.borderColor.val as ColorValue,
          }}
        />
      </Stack>
      {/* Chart section */}
      <Stack 
        rounded={12}
        self="center"
        items='center'
        mb={'$2'}
        >
        <BarChart
          data={chartData}
          width={screenWidth}
          height={180}
          yAxisSuffix=""
          yAxisLabel="$"
          chartConfig={chartConfig}
          style={{
            borderRadius: 16,
            borderWidth: 0.8,
            borderColor: theme.borderColor.val as ColorValue,
          }}
          fromZero
        />
      </Stack>
      <XStack flexWrap="wrap" justify="space-between">
        <YStack>
          <Text fontSize="$2" color="$colorPress">Volume: {stock.volume}</Text>
          <Text fontSize="$2" color="$colorPress">Avg Vol: {stock.average_volume}</Text>
        </YStack>
        <YStack>
          <Text fontSize="$2" color="$colorPress">Currency: {stock.currency}</Text>
          <Text fontSize="$2" color="$colorPress">Exchange: {stock.exchange}</Text>
        </YStack>
      </XStack>
    </Stack>
  );
}