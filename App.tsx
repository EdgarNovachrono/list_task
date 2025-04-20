

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './pages/login';
import Signup from './pages/signup';
import taches from './pages/taches';
import Toast from 'react-native-toast-message';

export type RootStackParamList = {
  login: undefined;
  signup: undefined;
  tache:undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="login" screenOptions={{headerShown:false}}>
    <Stack.Screen name="login" component={Login} />
    <Stack.Screen name="signup" component={Signup} />
    <Stack.Screen name="tache" component={taches} />
      
  </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
        <Toast/>
    </NavigationContainer>
  );
}