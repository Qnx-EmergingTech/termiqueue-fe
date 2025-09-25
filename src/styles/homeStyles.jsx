import { StyleSheet, Dimensions } from "react-native";
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const hstyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
    },
    greeting: {
        fontFamily: "Roboto_700Bold",
        fontSize: 20,
    },
    title: {
        fontFamily: "Roboto_300Light",
        fontSize: 20,
    },
    out: {
        fontFamily: "Roboto_700Bold",
        fontSize: 20,
        color: "#DB5461",
    },
    outtext: {
        fontFamily: "Roboto_400Regular",
        fontSize: 16,
    }
});

export default hstyles;