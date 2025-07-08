# MobileZero - Financial Markets Viewer

## Project Overview
MobileZero is a mobile application for tracking and visualizing financial market data across three main categories:
- Stocks
- Currencies
- Cryptocurrencies

The app fetches real-time data from financial APIs (primarily Twelve Data API) and displays it with interactive charts and detailed information.

## Key Technologies

### Core Framework
- **React Native** (via Expo SDK 53)
- **TypeScript** for type safety
- **Expo Router** for file-based navigation

### Package Management
- **Yarn** is the package manager for this project
  ```bash
  # Install dependencies
  yarn install
  
  # Start the development server
  yarn start
  
  # Run on iOS
  yarn ios
  
  # Run on Android
  yarn android
  ```

### UI Frameworks
1. **Tamagui** - Primary UI component library
   - Used for components like Stack, Button, Card, Input
   - Theme-based styling system

2. **NativeWind/Tailwind CSS** - Used for utility-based styling
   - Applied in some components alongside Tamagui

### Navigation
- **Expo Router** for overall app navigation
- **React Navigation** with Material Top Tabs for tab-based navigation

### Data Fetching & State Management
- **React Query** (@tanstack/react-query) for data fetching and caching
- React's built-in state management (useState, useEffect)

### Data Visualization
- **React Native Chart Kit** - For bar and line charts
- **Victory Native** - Alternative charting library

### Other Notable Libraries
- **Expo Linear Gradient** - For gradient backgrounds
- **React Native Reanimated** - For animations
- **React Native SVG** - For SVG support

## Project Structure
- `app/` - Main application screens and navigation setup
  - `_layout.tsx` - Top-level navigation configuration
  - `stock.tsx`, `currency.tsx`, `crypto.tsx` - Main screen 
  (other screens...)
  components
  - `settings.tsx`, `profile.tsx` - Other screens
- `components/` - Reusable UI components (e.g., stockCard.tsx)
- `tamagui.config.ts` - Tamagui configuration

## Code Examples

### Tamagui Components
```tsx
import { YStack, XStack, Button, Text, Card, useTheme } from 'tamagui';

function ExampleComponent() {
  const theme = useTheme();
  
  return (
    <Card size="$5" p="$4" bg="$background">
      <YStack space="$2">
        <Text fontSize="$6" fontWeight="bold">Title</Text>
        <XStack space="$2">
          <Button size="$4" bg="$color12">Action</Button>
          <Button size="$4" variant="outlined">Cancel</Button>
        </XStack>
      </YStack>
    </Card>
  );
}
```

### Chart Implementation
```tsx
import { LineChart } from 'react-native-chart-kit';

// Inside component:
<LineChart
  data={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [20, 45, 28, 80, 99, 43]
    }]
  }}
  width={screenWidth}
  height={220}
  chartConfig={{
    backgroundColor: theme.background.val,
    backgroundGradientFrom: theme.background.val,
    backgroundGradientTo: theme.background.val,
    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  }}
/>
```

## Development Notes
- The app uses theme-based styling with Tamagui's theming system
- API keys should be stored in environment variables or via Expo's Constants
- Components are designed to be responsive across different device sizes
- Make sure to handle API rate limits appropriately



## Additional notes:
- The app currently supports dark mode and light mode themes.
- Consider adding more themes in the future for better user customization.
- Create dynamic and reusable components.
- Use modern styling, professional UI and great UX.
- Use proper Typography that emphesis different sections and parts of the screen.
- Use loaders (spiners), skeletons and other techuniqes.
- Use fallback and 'try'-'catch' for error handling
- Use Icons, text helpers and gesture buttons for the client to be aware of errors, missing info and genral state of the app.
- Always use inherit styles and colors, use variables for consistent styling. (e.g '$color<number>', '$background', etc.)