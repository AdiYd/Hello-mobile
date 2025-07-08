import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Stack, Text, useTheme, XStack, YStack } from 'tamagui';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function StockCard({ stock }: { stock: any }) {
  const isUp = Number(stock.change) > 0;
  const theme = useTheme();
  const [update, setUpdate] = React.useState(0);
  const screenWidth = Dimensions.get('window').width - 60;

  useEffect(() => {
    if (stock) {
      stock.open = Number(stock.open).toFixed(2);
      stock.high = Number(stock.high).toFixed(2);
      stock.low = Number(stock.low).toFixed(2);
      stock.close = Number(stock.close).toFixed(2);
      stock.change = Number(stock.change).toFixed(2);
      stock.previous_close = Number(stock.previous_close).toFixed(2);
      stock.fifty_two_week.low = Number(stock.fifty_two_week.low).toFixed(2);
      stock.fifty_two_week.high = Number(stock.fifty_two_week.high).toFixed(2);
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

  const chart2Data = {
    labels: stock.time_series.values.map((v: any) => v.datetime.slice(5)).reverse(),
    datasets: [
      {
        data: stock.time_series.values.map((v: any) => Number(v.close)).reverse(),
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
    propsForBackgroundLines: {
    stroke: theme.borderColorPress ? `${theme.borderColorPress.val}22` : 'rgba(113,113,122,0.013)', // 0.13 opacity
    // strokeDasharray: '', // keep dashed, or set to '0' for solid
  },
  };

  return (
    <Stack
      width="100%"
      rounded="$4"
      shadowColor="$shadowColor"
      shadowRadius={8}
      p="$2"
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
      {/* Line chart for time series data */}
      <Stack mb="$2" items="center">
        <LineChart
          data={chart2Data}
          width={screenWidth}
          height={180}
          chartConfig={chartConfig}
          style={{ borderRadius: 8 }}
        />
      </Stack>
      {/* Chart section */}
      <Stack mb="$2" items="center">
        <BarChart
          data={chartData}
          width={screenWidth}
          height={180}
          yAxisSuffix=""
          yAxisLabel="$"
          chartConfig={chartConfig}
          style={{
            marginVertical: 8,
            borderRadius: 8,
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