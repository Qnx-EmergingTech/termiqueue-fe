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
        fontFamily: "Roboto_400Regular",
        fontSize: 20,
        color: "#A1A4B2",
    },
    btitle: {
        fontFamily: "Roboto_700Bold",
        fontSize: 18,
        color: "white",
        marginBottom: 5
    },
    stitle: {
        fontFamily: "Roboto_500Medium",
        fontSize: 11,
        color: "white",
    },
    out: {
        fontFamily: "Roboto_700Bold",
        fontSize: 20,
        color: "#DB5461",
    },
    outtext: {
        fontFamily: "Roboto_400Regular",
        fontSize: 16,
    },
    map: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.38,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 20,
    },
    proceedButton: {
    backgroundColor: "#8C8C8C",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
    width: screenWidth * 0.83,
    alignItems: "center",
    alignSelf: "center",
  },
    textContainer: {
    flexDirection: "column",
    },
    try: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 40,
    },
    icon: {
        width: 34,
        height: 34,       
        alignItems: "center",       
        justifyContent: "center",
    }
});

export default hstyles;