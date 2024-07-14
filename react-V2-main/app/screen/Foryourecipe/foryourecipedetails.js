import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    RefreshControl,
  } from "react-native";
  import React, { useContext, useState, useCallback, useEffect } from "react";
import { AuthContext } from "../../../Context/authContext";
import axios from "axios";
  import { RecipeContext } from "../../../Context/recipeContext";
import FYRecipeCard from "../../Content/FYRecipecard";
import { Aboutstyle } from "./about.style";
import { Card, TextInput,Button,Title,Paragraph} from 'react-native-paper';
import { RecipeInformationContext } from '../../../Context/recipeinformationcontext';
import { RecipedetailsContext } from '../../../Context/recipedetailsContext';

export const FYRecipeDetails = ({navigation, route}) => {
    const [recipes] = useContext(RecipeContext);
    const [loading, setLoading]= useState(false);
    const { recipeId } = route.params;
    const [selectedrecipe, setSelectedRecipes] = useState([]);
    const [selectednutrition, setSelectedNutritions] = useState([]);
    const [recipenutrition] = useContext(RecipeInformationContext);
    const [recipeInformation] = useContext(RecipedetailsContext);
    const recipenutritioninfo = recipenutrition;
    const recipedetails = recipeInformation;

    const selectedRecipess = recipedetails.find((recipeinformations) => recipeinformations.id === recipeId);
    const recipenutritions = recipenutritioninfo.find((nutritions) => nutritions.id === recipeId);
    console.log('RecipeInformationContext2:', selectedRecipess);
    console.log('RecipedetailsContext1:', recipenutritions);
      // inintal  posts
    //global state
    return (
        <View style={Aboutstyle.content}>
           <Card >
       <Card.Actions  style={Aboutstyle.card}>
       <Button onPress={() => navigation.navigate('FYRecipeDetails', { recipeId })}>Description</Button>
       <Button onPress={() => navigation.navigate('FYRecipeIngridients', { recipeId })}>Ingridients</Button>
       <Button onPress={() => navigation.navigate('FYRecipeSteps', { recipeId })}>Steps</Button>
       <Button onPress={() => navigation.navigate('FYRecipeNutrition', { recipeId })}>Nutrition</Button>
    </Card.Actions>
    </Card>
        <FYRecipeCard recipeId = {recipeId} nutrition = {recipenutritions} recipeinformations = {selectedRecipess} />
        
      <View style={{ backgroundColor: "#ffffff" }}>
      </View>
    </View>
  );
     };