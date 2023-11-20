import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View, Image, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../Context/authContext'; // Adjust the path

const SplashScreen = ({ navigation }) => {
  const [state, setState] = useContext(AuthContext);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          // Update the context state with user information
          setState({ ...state, user: userId });
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        navigation.replace('Login'); // Handle errors by navigating to Login
      }
    };

    setTimeout(() => {
      checkUserStatus();
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="zoomIn"
        iterationCount={1}
        source={require('./poseee.png')}
        style={{ width: '90%', resizeMode: 'contain', margin: 30 }}
      />
      <Animatable.Text
        animation="fadeInUp"
        iterationCount={1}
        style={styles.phrase}
      >
        Make workout easy
      </Animatable.Text>
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        easing="ease-out"
        style={styles.activityIndicatorContainer}
      >
        <ActivityIndicator
          color="#307ecc"
          size="large"
          style={styles.activityIndicator}
        />
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  activityIndicatorContainer: {
    alignItems: 'center',
  },
  activityIndicator: {
    height: 80,
  },
  phrase: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default SplashScreen;
