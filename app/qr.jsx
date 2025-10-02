import { View, Text, Image, Pressable } from "react-native";
import { useFonts, Roboto_400Regular, Roboto_700Bold, Roboto_300Light, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { Stack, useRouter } from "expo-router";
import qrstyles from "../src/styles/qrStyles";
import * as SplashScreen from "expo-splash-screen";
import QRCode from 'react-native-qrcode-svg';
import { Dimensions } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function qr() {
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const qrSize = width * 0.7;

  const [fontsLoaded] = useFonts({
    Roboto_300Light,
    Roboto_700Bold,
    Roboto_500Medium,
  });

  if (!fontsLoaded) return null

  const handleConfirm = () => {
    router.push('/cancelModal');
  };

  return (
  <>
    <Stack.Screen
        options={{
          headerShown: true,           
          headerTitle: 'Bus details',              
          headerTransparent: false,      
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontFamily: 'Roboto_700Bold', 
            fontSize: 20,                                       
            },
        }}
      />

    <View style={qrstyles.container}>
    <View style={qrstyles.qrWrapper}>
      <QRCode
        value="https://example.com/ticket/12345" //queue number
        size={qrSize}               
        color="black"            
        backgroundColor="white" 
      />
    </View>
      <Text style={qrstyles.title}>Terminal 1</Text>
      <View style={qrstyles.textContainer}>
      <Text style={qrstyles.info}>Destination</Text>
      <Image
        source={require('../assets/images/bus-school.png')}
        style={qrstyles.image}
        resizeMode="contain"
      />
      <Text style={qrstyles.info}>Pacita</Text>
      </View>
      <View style={qrstyles.textContainer}>
      <Text style={qrstyles.info}>Estimated time arrival</Text>
      <Image
        source={require('../assets/images/bus-school.png')}
        style={qrstyles.image}
        resizeMode="contain"
      />
      <Text style={qrstyles.info}>Already here</Text>
      </View>
      <View style={qrstyles.textContainer}>
      <Text style={qrstyles.info}>Queue number - </Text>
      <Text style={qrstyles.info}>#10928</Text>
      </View>
      <View style={qrstyles.textContainer}>
      <Text style={qrstyles.info}>Trip duration estimation - </Text>
      <Text style={qrstyles.info}>1hr 20mins</Text>
      </View>
      <Text style={qrstyles.subtitle}>You're all set! Just show this QR to the attendant when boarding.</Text>

      <Pressable style={qrstyles.button} onPress={handleConfirm}>
          <Text style={qrstyles.confirm}>Cancel Queue</Text>
      </Pressable>
    </View>
  </>
  );
}
