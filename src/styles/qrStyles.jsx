import { StyleSheet, Dimensions } from "react-native";
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const qrstyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
    },
    title: {
        fontFamily: "Roboto_700Bold",
        fontSize: 20,
        marginBottom: 15,
    },
    info: {
        fontFamily: "Roboto_500Medium",
        fontSize: 16,
    },
    subtitle: {
        fontFamily: "Roboto_300Light",
        fontSize: 16,
        fontStyle: "italic",
    },
    textContainer: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center",   
        justifyContent: "left",
    },
    image: {
        width: 16,
        height: 16,
        marginRight: 10,
        marginLeft: 10,
    },
    qrWrapper: {
        alignItems: "center",   
        marginBottom: 20,  
    },
    button: {
        backgroundColor: "#096B72",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginTop: 60,
        marginBottom: 20,
        width: screenWidth * 0.83,
        alignItems: "center",
        alignSelf: "center",
        position: "absolute",
        bottom: 20,
    },
    confirm: {
        fontFamily: "Roboto_500Medium",
        color: "white",
        fontSize: 14,
    }
});

export default qrstyles;