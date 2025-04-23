

import * as React from 'react';
import {  Linking, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './pages/login';
import Signup from './pages/signup';
import taches from './pages/taches';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';

import {PermissionsAndroid} from 'react-native';
import { useEffect } from 'react';

 // configuration notification
 async function requestUserPermission() {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}
const getToken=async()=>{
  const token=await messaging().getToken();
  console.log("token=  ",token)
}//
//configuration
const NAVIGATION_IDS = ['tache'];
function buildDeepLinkFromNotificationData(data:any){
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId)
    return null;
  }
  if (navigationId === 'tache') {
    return 'myapp://tache';
  }
 
}

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Home: 'tache',
     
    }
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
    const foreground = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);  });


    //onNotificationOpenedApp: When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data)
      if (typeof url === 'string') {
        listener(url)
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
      foreground ()
    };
  },
}

//
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
  useEffect(() =>{
      requestUserPermission();
      getToken();
     })
     
  return (
    <NavigationContainer linking={linking} fallback={<ActivityIndicator animating />}>
      <RootStack />
        <Toast/>
    </NavigationContainer>
  );
}