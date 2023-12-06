import React, { useContext, useState, useEffect } from 'react';
import { FlatList, SafeAreaView, View, Text, Alert } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { AuthContext } from '../../../Context/authContext';
import { loginStyle } from './login.style';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProfileScreen = ({ navigation, route }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [state, setState] = useContext(AuthContext);
  const [bmi, setBMI] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const userId = state.userId;
  const [currentValue, setCurrentValue] = useState();
  const [isDropdownDisabled, setIsDropdownDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [isNewProfile, setIsNewProfile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch existing data based on userId
        const { data } = await axios.get('http:10.0.2.2:3000/getProfile', {
          params: { userId },
        });

        if (data.success) {
          const profileData = data.profileinfo;
          if (profileData) {
            setWeight(profileData.weight.toString());
            setHeight(profileData.height.toString());
            setAge(profileData.age.toString());
            setBMI(profileData.bmi.toString());
            setCurrentValue(profileData.goal);
            setSelectedGoal(profileData.goal);
            setIsDropdownDisabled(true);
            setExistingData(profileData);
            setIsNewProfile(false); // Set flag for existing profile
          } else {
            setIsNewProfile(true); // Set flag for new profile
          }
        }
      } catch (error) {
        // Handle error appropriately, check if it's a 404 indicating no profile found
        if (error.response && error.response.status === 404) {
          console.log('No profile found for userId:', userId);
          setIsNewProfile(true); // Set flag for new profile
        } else {
          console.error('Error fetching profile data:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    // Calculate BMI whenever weight, height, or age changes
    if (weight && height && age) {
      calculateBMI();
    }
  }, [weight, height, age]);

  const calculateBMI = () => {
    const weightInKg = parseFloat(weight);
    const heightInM = parseFloat(height) / 100;
    const ageValue = parseInt(age);

    if (weightInKg && heightInM && ageValue) {
      const bmiValue = weightInKg / (heightInM * heightInM);
      setBMI(bmiValue.toFixed(2));

      let suggestedGoal = null;

      if (bmiValue < 18.5) {
        suggestedGoal = 'GW'; // Gain Weight
      } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
        suggestedGoal = 'MW'; // Maintain Weight
      } else {
        suggestedGoal = 'LW'; // Lose Weight
      }

      setCurrentValue(suggestedGoal);
      setSelectedGoal(suggestedGoal);

      setIsDropdownDisabled(false);
    }
  };

  const handleEdit = () => {
    // Check if there are existing data
    if (existingData) {
      Alert.alert(
        'Confirm Edit',
        'Are you sure you want to edit your information?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              setIsEditMode(true);
              setIsDropdownDisabled(false);
            },
          },
        ]
      );
    } else {
      setIsEditMode(true);
      setIsDropdownDisabled(false);
    }
  };

  const handleCancel = () => {
    // Reset form values and disable editing
    setWeight(existingData ? existingData.weight.toString() : '');
    setHeight(existingData ? existingData.height.toString() : '');
    setAge(existingData ? existingData.age.toString() : '');
    setBMI(existingData ? existingData.bmi.toString() : '');
    setCurrentValue(existingData ? existingData.goal : '');
    setSelectedGoal(existingData ? existingData.goal : '');
    setIsDropdownDisabled(true);
    setIsEditMode(false);
  };
  const handleSaveOrUpdate = async () => {
    try {
      setLoading(true);
  
      if (!validateInputs()) {
        setLoading(false);
        return;
      }
  
      const requestData = {
        userId: userId,
        age: parseInt(age),
        weight: parseInt(weight),
        height: parseInt(height),
        bmi: parseFloat(bmi),
        goal: selectedGoal,
      };
  
      console.log('Request Data:', requestData);
  
      const { data } = await axios.post('http:10.0.2.2:3000/bmiposting', requestData);
  
      if (data.success === true) {
        alert(data && data.message);
        console.log('Information Submitted/Updated:', requestData);
  
        // Set isEditMode to true and fetch data again to recheck if there is information
        setIsEditMode(true);
        fetchData();
      }
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
      console.log(error);
    } finally {
      // Reset edit mode after saving or updating
      setIsEditMode(false);
    }
  };

  const validateInputs = () => {
    const parsedAge = parseInt(age, 10);
    const parsedHeight = parseInt(height, 10);
    const parsedWeight = parseInt(weight, 10);
    const parsedBMI = parseFloat(bmi);

    if (isNaN(parsedAge) || isNaN(parsedHeight) || isNaN(parsedWeight) || isNaN(parsedBMI)) {
      Alert.alert('Error', 'Please enter valid numeric values for Age, Height, Weight, and BMI');
      return false;
    }

    if (!selectedGoal) {
      Alert.alert('Error', 'Please choose a goal');
      return false;
    }

    return true;
  };

  const items = [
    { label: 'Gain Weight', value: 'GW' },
    { label: 'Maintain Weight', value: 'MW' },
    { label: 'Lose Weight', value: 'LW' },
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@auth:token');
      await AsyncStorage.removeItem('@auth:userId');
      setState((prevState) => ({ ...prevState, token: null }));
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={['dummy']}
        keyExtractor={() => 'dummyKey'}
        renderItem={() => (
          <View style={{ flex: 1, marginBottom: 20 }}>
            <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 20 }}>
              Welcome {state.firstname}!
            </Text>
            <Card.Title />
            <Card.Content>
            <TextInput
  label="Weight"
  value={weight}
  onChangeText={(text) => setWeight(text)}
  editable={isEditMode || isNewProfile} // Allow editing in edit mode or for a new profile
/>
<TextInput
  label="Height"
  value={height}
  onChangeText={(text) => setHeight(text)}
  editable={isEditMode || isNewProfile}
/>
<TextInput
  label="Age"
  value={age}
  onChangeText={(text) => setAge(text)}
  editable={isEditMode || isNewProfile}
/>


              {bmi && (
                <View>
                  <Text style={{ fontSize: 18, marginTop: 10 }}>
                    Your BMI: {bmi}
                  </Text>
                </View>
              )}

              <View style={{ padding: 30 }}>
                <DropDownPicker
                  items={items}
                  open={isOpen}
                  disabled={isDropdownDisabled || !isEditMode}
                  setOpen={() => setIsOpen(!isOpen)}
                  value={currentValue}
                  setValue={(val) => {
                    setCurrentValue(val);
                    setSelectedGoal(val);
                  }}
                  maxHeight={200}
                  autoScroll
                  placeholder="Choose Goal"
                />
              </View>

              {isEditMode ? (
                <View>
                  <Button
                    mode="contained"
                    style={[loginStyle.loginButton, { marginBottom: 20 }]}
                    onPress={handleSaveOrUpdate}
                  >
                    Save Updated Information
                  </Button>

                  <Button
                    mode="contained"
                    style={loginStyle.loginButton}
                    onPress={handleCancel}
                  >
                    Cancel
                  </Button>
                </View>
              ) : (
                <>
                  {existingData && (
                    <Button
                      mode="contained"
                      style={[loginStyle.loginButton, { marginBottom: 20 }]}
                      onPress={handleEdit}
                    >
                      Edit Information
                    </Button>
                  )}

                  {isNewProfile && (
                    <Button
                      mode="contained"
                      style={[loginStyle.loginButton, { marginBottom: 20 }]}
                      onPress={handleSaveOrUpdate}
                    >
                      Save Information
                    </Button>
                  )}
                </>
              )}

              <Button
                mode="contained"
                style={loginStyle.loginButton}
                onPress={handleLogout}
              >
                Logout
              </Button>
            </Card.Content>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;