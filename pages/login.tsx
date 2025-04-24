import React, {  useState } from 'react';
import {StyleSheet,SafeAreaView,View,Image,Text,TouchableOpacity,TextInput,} from 'react-native';
import auth from '@react-native-firebase/auth'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
export default function Login() {
 // toast
  const Toasts = () => {
    setTimeout(() =>{
      Toast.show({
        type:'success',
        text1:'connexion reussi',
        
      })
    },1000)
   }
  type appScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'signup'>;
   const navigation = useNavigation<appScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //connexion 
  const onSignIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        
        console.log('Connecté !');
        Toasts();
        navigation.navigate('tache'); 

      },
    )
      .catch(error => console.error(error));
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={styles.headerImg}
            source={require("./../image/to-do-list.png")} />

          <Text style={styles.title}>
            connexion <Text style={{ color: '#075eec' }}>
              List_task</Text>
          </Text>

          <Text style={styles.subtitle}>
          
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>adress email</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={email} />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>

            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={setPassword} 
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={password} />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={() => {
                onSignIn();
                
              }}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>connexion</Text>
              </View>
            </TouchableOpacity>
          </View>

          
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('signup'); 
        }}>
        <Text style={styles.formFooter}>
          tu n'as pas de compte?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>creer un compte</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  /** Form */
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
  formFooter: {
    padding:0,
    margin:0,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#075eec',
    borderColor: '#075eec',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});