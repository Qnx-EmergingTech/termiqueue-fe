import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
    padding: 30,
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
  },

  italic: {
    fontFamily: "Roboto_500Medium",
    color: "#096B72",
  },

  field: {
    marginBottom: 10,
    width: "100%",
  },

  input: {
    borderWidth: 1,
    borderColor: "#F2F3F7",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 11,
    fontFamily: "Roboto_300Light",
    marginTop: 6,
    width: "100%",
    backgroundColor: "#F2F3F7",
    color: "#A1A4B2",
    letterSpacing: 1,
  },

  imageContainer: {
  position: 'relative', 
  width: 360,
  height: 440,
},

image: {
  width: '100%',
  height: '100%',
},

headingOnImage: {
  position: 'absolute',
  top: '13%',            
  left: '50%',           
  transform: [{ translateX: -50 }, { translateY: -10 }],
  color: 'black',
  fontSize: 16,
  fontFamily: 'Roboto_700Bold',
  textAlign: 'center',
  letterSpacing: 4,
},

imageBg: {
  position: "absolute",
  top: 0,
  left: 0, 
  width: 100,
  height: 100,
},

welcome: {
  position: 'absolute',
  top: '60%',    
  left: '21%',                 
  transform: [{ translateX: -50 }, { translateY: -10 }],
  justifyContent: "center",
  alignItems: "center",
  width: "85%",
},

create: {
  position: 'absolute',
  top: '50%',    
  left: '21%',                 
  transform: [{ translateX: -50 }, { translateY: -10 }],
  justifyContent: "center",
  alignItems: "center",
  width: "85%",
},
 
  loginButton: {
    backgroundColor: "#096B72",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 50,
    marginBottom: 10,
    alignSelf: "stretch",
    alignItems: "center",
  },

  proceedButton: {
    backgroundColor: "#096B72",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 50,
    alignSelf: "stretch",
    alignItems: "center",
  },

  registerButton:{
    backgroundColor: "#096B72",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "stretch",
    alignItems: "center",
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
    marginBottom: 45,
  },

  pp: {
    flexDirection: "row",
    marginBottom: 45,
    alignSelf: "flex-start",
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
});

export default styles;
