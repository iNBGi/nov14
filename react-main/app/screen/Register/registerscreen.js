// Import React and necessary components
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { loginStyle } from './login.style'; // Import the login style

// Create Registerscreen component
export const Registerscreen = ({ navigation }) => {
  // State variables for form fields
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = async () => {
    // Your form submission logic here
    // ...

    // For example, you can navigate to the Login screen after successful registration
    navigation.navigate('Login');
  };

  // Return the JSX for the Registerscreen component
  return (
    <SafeAreaView style={loginStyle.container}>
      <View style={loginStyle.content}>
        <Card style={loginStyle.card}>
          <Card.Title title="Register" titleStyle={loginStyle.cardTitle} />
          <Card.Content>
            {/* Reuse the TextInput and Button components with consistent styling */}
            <TextInput
              label="Firstname"
              value={firstname}
              onChangeText={(text) => setFirstname(text)}
            />
            <TextInput
              label="Lastname"
              value={lastname}
              onChangeText={(text) => setLastname(text)}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
            />
            <Button uppercase={false} style={loginStyle.forgotButton}>
              Forgot email/password
            </Button>
            <Button
              mode="contained"
              style={loginStyle.loginButton}
              onPress={handleSubmit}
            >
              Register
            </Button>
            <Button
              style={loginStyle.registerButton}
              onPress={() => navigation.navigate('Login')}
            >
              Login
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};