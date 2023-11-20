import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { Button, Card, TextInput, Menu, Divider } from 'react-native-paper';
import { AuthContext } from '../../../Context/authContext'; // Adjust the path
import { loginStyle } from './login.style'; // Import the login style
import axios from "axios";

export const ProfileScreen = ({ navigation }) => {
  const [weight, setWeight] = useState(''); // Define state for weight
  const [height, setHeight] = useState(''); // Define state for height
  const [name, setName] = useState('');
  const { state, signOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const names = ['dekdek'];

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const handleMenuItemPress = (item) => {
    setSelectedItem(item);
    closeMenu();
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Your form submission logic here
    // ...

    // For example, you can navigate to the Login screen after successful registration
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView>
      <View>
        <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 20 }}>
          Welcome!
        </Text>
        <Card.Title />
        <Card.Content>
          {/* TextInput components with consistent styling */}
          <TextInput
            label="Weight"
            value={weight}
            onChangeText={(text) => setWeight(text)}
          />
          <TextInput
            label="Height"
            value={height}
            onChangeText={(text) => setHeight(text)}
          />

          <Button
            mode="contained"
            style={loginStyle.loginButton}
            onPress={handleSubmit}
          >
            Input
          </Button>

          {/* Dropdown menu */}
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<Button onPress={openMenu}>Suggestion</Button>}
          >
            {names.map((item, index) => (
              <Menu.Item
                key={index}
                onPress={() => handleMenuItemPress(item)}
                title={item}
              />
            ))}
          </Menu>

        </Card.Content>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
