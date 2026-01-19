import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

export default function ScanSuccess() {
  return (
     <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/scan.png')}
            style={styles.image}
            resizeMode="cover"
          />

          <Image
            source={require('../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textSection}>
          <View>
            <Text style={styles.mid}>Scan success!</Text>
            <Text style={styles.label}>
              Please select a seat and wait for the bus departure, have a safe trip!
            </Text>
            <Text style={styles.label}>
             Will proceed automatically in 5 sec...
            </Text>
          </View>

        </View>
      </View>
    </>
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "white",
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
  imageContainer: {
    backgroundColor: 'white',
    height: screenHeight * 0.56,
  },
image: {
  position: 'absolute',
  top: 0,          
  left: 0,
  right: 0,
  height: screenHeight * 0.56,
  width:  '100%'
},
logo: {
    width: 79,
    height: 25,
    marginTop: 40,
    alignSelf: "center",
  },
  textSection: {  
  padding: 40,
  alignSelf: 'center',
  justifyContent: 'center',
},
label: 
  {
    fontFamily: "Roboto_300Light",
    fontSize: 16,
    textAlign: "center",
  },
})