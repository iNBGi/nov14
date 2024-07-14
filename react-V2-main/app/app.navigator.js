import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Loginscreen } from './screen/login/login.screen';
import { Homescreen } from './screen/Home/homescreen';
import { Aboutscreen } from './screen/About/aboutscreen';
import { Contactscreen } from './screen/Contact/contactscreen';
import { Menuscreen } from './screen/Menu/menuscreen';
import { Recipescreen } from './screen/Recipe/recipescreen';
import { Bmiscreen } from './screen/BMI/bmiscreen';
import { Exerscreen } from './screen/Exercise/exerscreen';
import { AuthProvider } from '../Context/authContext';
import { Registerscreen } from './screen/Register/registerscreen';
import { RecipeProvider } from '../Context/recipeContext';
import { Informationscreen } from './screen/information';
import { RecipeDetails } from './screen/Recipe/recipedetails';
import { ExerciseDetails } from './screen/Workout/exercisedetails';
import { ExerciseProvider } from '../Context/exerciseContext';
import { Exercisescreen } from './screen/Workout/exercisescreen';
import { Sensormenu } from './screen/Sensor/sensormenuscreen';
import {ProfileScreen} from './screen/Profile/ProfileScreen';
import SplashScreen from './Splashscreen';
import {Squatsensor} from './screen/Sensor/squatsensor';
import {Dumbellsensor} from './screen/Sensor/dumbellsensor';
import {Lungesensor} from './screen/Sensor/lungesensor';
import {Foryoumenuscreen} from './screen/Foryoumenu/foryoumenuscreen';
import { Ionicons } from '@expo/vector-icons'; 
import { RecipeSteps } from './screen/Recipe/recipesteps';
import { RecipeIngridients } from './screen/Recipe/recipeingridients';
import { RecipeNutrition } from './screen/Recipe/recipenutrition';
import { ProfileProvider } from '../Context/profileinfocontext';
import { RecipeInformationProvider } from '../Context/recipeinformationcontext';
import { FYRecipescreen } from './screen/Foryourecipe/foryourecipescreen'
import { RecipedetailsProvider } from '../Context/recipedetailsContext';
import { FYRecipeDetails } from './screen/Foryourecipe/foryourecipedetails';
import { FYRecipeNutrition } from './screen/Foryourecipe/foryourecipenutrition';
import { FYRecipeIngridients } from './screen/Foryourecipe/foryourecipeingridients';
import { FYRecipeSteps } from './screen/Foryourecipe/foryourecipesteps';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
    return (
      <Tab.Navigator
      tabBarOptions={{  // Change the active tab color here
        inactiveTintColor: 'gray', // Change the inactive tab color here
        style: {
          backgroundColor: '#F6F5F2', // Optional: Change the background color of the tab bar
        },
        labelStyle: {
          fontSize: 12, // Optional: Adjust the font size of tab labels
        },
      }}
    >
      <Tab.Screen
        name="Home" // Change to a unique name like "HomeTab"
        component={Homescreen}
        options={{headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen

        name="Profile screen" // Change to a unique name like "AboutTab"
        component={ProfileScreen}
        options={{headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
  

export const AppNavigator = ({ navigation }) => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <RecipeInformationProvider>
        <RecipedetailsProvider>
        <RecipeProvider>        
          <ExerciseProvider>
    <NavigationContainer initialRouteName="Splashscreen">
        
            <Stack.Navigator>
            <Stack.Screen
                options={{ headerTitle: 'Test', headerShown: false }}
                name="Splashscreen"
                component={SplashScreen}
              />      
            <Stack.Screen options={{headerTitle: 'Home', headerShown: false}} name ='Homes' component={HomeTabs}/>
            <Stack.Screen options={{headerTitle: 'Test', headerShown: false}} name="Login" component={Loginscreen} />
            <Stack.Screen options={{headerTitle: 'Test', headerShown: false}} name="Register" component={Registerscreen} />
            <Stack.Screen options={{headerTitle: 'Information', headerShown: true}} name ='Information' component={Informationscreen}/>
            <Stack.Screen options={{headerTitle: 'Recipe Details', headerShown: true}} name ='RecipeDetails' component={RecipeDetails}/>
            <Stack.Screen options={{headerTitle: 'Recipe Details', headerShown: true}} name ='FYRecipeDetails' component={FYRecipeDetails}/>
            <Stack.Screen options={{headerTitle: 'Nutrition', headerShown: true}} name ='RecipeNutrition' component={RecipeNutrition}/>
            <Stack.Screen options={{headerTitle: 'Nutrition', headerShown: true}} name ='FYRecipeNutrition' component={FYRecipeNutrition}/>
            <Stack.Screen options={{headerTitle: 'Exercise Details', headerShown: true}} name ='ExerciseDetails' component={ExerciseDetails}/>
            <Stack.Screen options={{headerTitle: 'About', headerShown: true}}name ='Abouts' component={HomeTabs}/>
            <Stack.Screen options={{headerTitle: 'Contact', headerShown: true}}name ='Contacts' component={Contactscreen}/>
            <Stack.Screen options={{headerTitle: 'Menu', headerShown: false}}name ='Menu' component={HomeTabs}/>
            <Stack.Screen options={{headerTitle: 'Recipes', headerShown: true}}name ='Recipescreen' component={Recipescreen}/>
            <Stack.Screen options={{headerTitle: 'Recipe For You', headerShown: true}}name ='FYRecipescreen' component={FYRecipescreen}/>
            <Stack.Screen options={{headerTitle: 'Steps', headerShown: true}}name ='RecipeSteps' component={RecipeSteps}/>
            <Stack.Screen options={{headerTitle: 'Steps', headerShown: true}}name ='FYRecipeSteps' component={FYRecipeSteps}/>
            <Stack.Screen options={{headerTitle: 'Exercises', headerShown: true}}name ='Exercisescreen' component={Exercisescreen}/>
            <Stack.Screen options={{headerTitle: 'Pose Recognition', headerShown: false}}name ='Squatsensor' component={Squatsensor}/>
            <Stack.Screen options={{headerTitle: 'Pose Recognition Menu', headerShown: true}}name ='Sensormenu' component={Sensormenu}/>
            <Stack.Screen options={{headerTitle: 'Test', headerShown: false}}name ='Gymsc' component={Exerscreen}/>
            <Stack.Screen options={{headerTitle: 'About', headerShown: true}}name ='ProfileScreen' component={HomeTabs}/>
            <Stack.Screen   options={{ headerTitle: 'Test', headerShown: false }}  name="Dumbellsensor" component={Dumbellsensor}   />
            <Stack.Screen options={{headerTitle: 'Pose Recognition', headerShown: false}}name ='Lungesensor' component={Lungesensor}/>
<Stack.Screen options={{headerTitle: 'Test', headerShown: false}}name ='BMI' component={Bmiscreen}/>
<Stack.Screen name="Profile" component={HomeTabs} options={{ headerTitle: 'Profile' }}/>
<Stack.Screen options={{ headerTitle: 'Recipe Ingridients', headerShown: true }} name="RecipeIngridients" component={RecipeIngridients}/> 
<Stack.Screen options={{ headerTitle: 'Recipe Ingridients', headerShown: true }} name="FYRecipeIngridients" component={FYRecipeIngridients}/> 
            </Stack.Navigator>
            </NavigationContainer>
          </ExerciseProvider>
        </RecipeProvider>
        </RecipedetailsProvider>
        </RecipeInformationProvider>
        </ProfileProvider> 
    </AuthProvider>
  );
};
     
export default AppNavigator;