import{ StyleSheet } from "react-native";


export const Aboutstyle = StyleSheet.create({
    content: {
      padding: 0,
        flex: 1,
        backgroundColor: "#354259",
      },
      
        top: {
          flex: .2,
          borderWidth: 10,
          borderColor: "#2f2d26",
        },
        bottom: {
          flex: .8,
          
        },
        card:{
          flexDirection:"row"
           },
      image: {
        flex: 1,
        justifyContent: "center",
        width: 340, height: 360
      },
    view: {
        width: "100%"
    },
    cardTitle: {
      textAlign: 'center',
        color: "#ffffff"
    },
    titleText: {
      marginBottom:15,
      borderRadius: 0,
      backgroundColor: "#FFFFFF",
      color: "#242F9B",
      textAlign: "center",
      padding:10,
      fontSize: 20,
      
    },
        Text: {
          marginTop: 16,
          padding: 8,
          borderWidth: 4,
          borderColor: "#20232a",
          borderRadius: 1,
          backgroundColor: "#ECE5C7",
          height: 70,
          textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
      },
      button:{
        
        justifyContent: 'center',
        alignItems: 'center'
      },
    cardButton: {
        margin: 1,
      
    },
    card1:{
      padding: 20,
      margin:0,
      marginBottom:100,
      backgroundColor: "#2f2d26",
    },
    
})