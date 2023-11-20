import { Alert, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { loginStyle } from './login.style';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../../../Context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialIcons';


export const Loginscreen = ({navigation}) => {  
  const [state, setState] = useContext(AuthContext)
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [firstname, setFirstName] = useState('');
        const [loading, setLoading] = useState('false');
        const [showPassword, setShowPassword] = useState(false);
        const handleLogin = async () => {
          
          try {
            setLoading(true);
          if (!username || !password) {
            // Check if either username or password is empty
            Alert.alert('Error', 'Please enter both username and password.');
            return;
          }
          setLoading(false);
          const {data} = await axios.post("https://serverrrr-3kbl.onrender.com/login", {username, password});
            if (data.success === true) {
              // Successful login
              
              setState(data)
              await AsyncStorage.setItem("@auth", JSON.stringify(data));
              console.log('Stored userId:', data.userId);
              alert(data && data.message);
              navigation.navigate('Homes')
              console.log("Login Data ===>", (username, password))
            } 
            
          }
         
           catch (error) {
            // Handle network errors or other issues
            alert(error.response.data.message);
            setLoading(false);
            console.log(error);
          }
        };
        const getLocalStorageData = async () => {
            let data = await AsyncStorage.getItem("@auth");
            console.log ("Local Storage ==>", data);
        }
        getLocalStorageData();
  
       
  return (
    <SafeAreaView style={loginStyle.container}>
      <View style={loginStyle.content}>
        <Card style={loginStyle.card}>
          <Card.Title title="PoseEase Login" titleStyle={loginStyle.cardTitle} />
          <Card.Content>
            <View style={loginStyle.inputContainer}>
              <Icon name="person" size={20} color="#007BFF" style={loginStyle.icon} />
              <TextInput
                style={loginStyle.input}
                placeholder="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
            <View style={loginStyle.inputContainer}>
              <Icon name="lock" size={20} color="#007BFF" style={loginStyle.icon} />
              <TextInput
                style={loginStyle.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                style={loginStyle.iconButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color="#007BFF"
                  style={{ backgroundColor: showPassword ? 'transparent' : '#fff' }}
                />
              </TouchableOpacity>
            </View>
            <Button
              uppercase={false}
              style={loginStyle.forgotButton}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              Forgot Email/Password
            </Button>
            <Button mode="contained" style={loginStyle.loginButton} onPress={handleLogin}>
              Login
            </Button>
            <Button
              style={loginStyle.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              Register
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};
