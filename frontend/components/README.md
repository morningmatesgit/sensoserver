# Components Guide

## How to Use Components in React Native

Components are reusable pieces of UI that can be used across different pages. Here's how they work:

### 1. Component Structure
```tsx
// components/MyComponent.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export default function MyComponent({ title, onPress }: MyComponentProps) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}
```

### 2. Using Components in Pages
```tsx
// app/mypage.tsx
import React from 'react';
import { View } from 'react-native';
import MyComponent from '../components/MyComponent';

export default function MyPage() {
  return (
    <View>
      <MyComponent title="Hello World" />
    </View>
  );
}
```

### 3. Available Components

- **TaskCard**: Displays individual task items
- **PlantCard**: Shows plant information with metrics
- **BottomNavigation**: Navigation bar at bottom of screen

### 4. Props (Properties)
Props are data passed to components:
- `title`: Text to display
- `onPress`: Function to call when pressed
- `plant`: Object containing plant data
- `task`: Object containing task data

### 5. Benefits of Components
- **Reusable**: Use same component in multiple places
- **Maintainable**: Change once, updates everywhere
- **Clean**: Keeps pages simple and organized
- **Testable**: Easy to test individual pieces