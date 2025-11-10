import { Dimensions, StyleSheet } from "react-native";
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  headingWrapper: {
    marginBottom: 40,
  },

  heading: {
    fontFamily: "Roboto_700Bold",
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
  },

  mid: {
    fontFamily: "Roboto_700Bold",
    fontSize: 30,
    marginBottom: 10,
    textAlign: "center",
  },

  label: {
    fontFamily: "Roboto_300Light",
    fontSize: 16,
    textAlign: "center",
  },

  bot: {
    fontFamily: "Roboto_300Light",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },

  read: {
    fontFamily: "Roboto_300Light",
    fontSize: 14,
    textAlign: "left",
    marginTop: 5,
  },

  policy: {
    fontFamily: "Roboto_300Light",
    fontSize: 14,
    marginTop: 5,
  },
  
  fp: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    letterSpacing: 1,
    marginTop: 5,
    marginBottom: 80,
    textAlign: "center",
  },

  italic: {
    fontFamily: "Roboto_500Medium",
    color: "#096B72",
  },

  field: {
    marginBottom: 10,
  },

  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },

  icon: {
    position: 'absolute',
    right: 50,
    top: '50%',
    transform: [{ translateY: -11 }],
  },

  input: {
    borderWidth: 1,
    borderColor: "#F2F3F7",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 11,
    fontFamily: "Roboto_300Light",
    marginTop: 5,
    width: screenWidth * 0.83,
    backgroundColor: "#F2F3F7",
    color: "#A1A4B2",
    letterSpacing: 1,
    alignSelf: "center",
  },

  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

image: {
  position: 'absolute',
  top: 0,          
  left: 0,
  right: 0,
  height: screenHeight * 0.6,
  width:  '100%'
},

headingOnImage: {
  color: 'black',
  fontSize: 16,
  fontFamily: 'Roboto_700Bold',
  letterSpacing: 4,
  marginTop: 40,
  textAlign: 'center',
},

textSection: {
  padding: 30,
  alignSelf: 'center',
  justifyContent: 'center',
},

imageBg: {
  position: 'absolute',
  top: 0,          
  left: 0,
  right: 0,
  height: screenHeight * 0.45,
  width:  '100%'
},

welcome: {
  position: 'absolute',
  top: screenHeight * 0.2,    
  left: '21%',                 
  transform: [{ translateX: -50 }, { translateY: -10 }],
  justifyContent: "center",
  alignItems: "center",
  width: screenWidth * 0.85,
},

create: {
  position: 'absolute',
  top: screenHeight * 0.13,    
  left: screenWidth * 0.21,                
  transform: [{ translateX: -50 }, { translateY: -10 }],
  justifyContent: "center",
  alignItems: "center",
  width: screenWidth * 0.82,
},

  loginButton: {
    backgroundColor: "#096B72",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
    width: screenWidth * 0.83,
    alignItems: "center",
  },

  proceedButton: {
    backgroundColor: "#096B72",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 50,
    width: screenWidth * 0.83,
    alignItems: "center",
    alignSelf: "center",
  },

  registerButton:{
    backgroundColor: "#096B72",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center",
    alignItems: "center",
    width: screenWidth * 0.83,
  },

  loginText: {
    color: "white",
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
  },

  buttonText: {
    color: "black",
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
  },

  error: {
    color: "red",
    marginBottom: 10,
    fontFamily: "RobotoMono_500Medium",
  },

  bottom: {
    flexDirection: "row",
    marginBottom: 60,
    justifyContent: 'center',
  },

  pp: {
    flexDirection: "row",
    marginBottom: 45,
    alignSelf: "center",
    letterSpacing: 0.5,
    alignItems: "center",
  },

  checkbox: {
    marginLeft: 75,      
    width: 15,
    height: 15,
  },

  fbButton: {
    backgroundColor: "#096B72",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: "stretch",
    alignItems: "center",
  },

  gButton: {
    backgroundColor: "#ffff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: "stretch",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderColor: '#EBEAEC', 
  },

  error: {
  color: "#e63946",        
  marginTop: 10,
  fontSize: 14,
  fontFamily: "RobotoMono_500Medium",
  textAlign: "center",
},

  logo: {
    width: 79,
    height: 25,
    marginTop: 40,
    alignSelf: "center",
  },
});

export default styles;
