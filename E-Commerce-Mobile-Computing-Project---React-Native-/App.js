import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ProductProvider } from './src/data/ProductsContext';
import { CartProvider } from './src/data/CartContext';
import MainTabNavigation from './src/navigation/Navigator';
import SignupScreen from './src/screens/SignupScreen';
import Toast from 'react-native-toast-message';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// const toastConfig = {
//   success: (internalState) => (
//     <View style={{ width: 300, backgroundColor: 'green', padding: 10 }}>
//       <Text style={{ color: 'white' }}>{internalState.text1}</Text>
//       <Text style={{ color: 'white' }}>{internalState.text2}</Text>
//     </View>
//   ),
//   error: (internalState) => (
//     <View style={{ width: 300, backgroundColor: 'red', padding: 10 }}>
//       <Text style={{ color: 'white' }}>{internalState.text1}</Text>
//       <Text style={{ color: 'white' }}>{internalState.text2}</Text>
//     </View>
//   ),
// };


const App = () => {
  return (
    <NavigationContainer>
      <ProductProvider>
        <CartProvider>
          <RootNavigator />
          <Toast  />
        </CartProvider>
      </ProductProvider>
    </NavigationContainer>
  );
};

export default App;
