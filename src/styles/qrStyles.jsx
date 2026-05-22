import { Dimensions, StyleSheet } from "react-native";
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const qrstyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "white",
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
        marginTop: 20,
    },
    button: {
        backgroundColor: "#E3655B",
        paddingVertical: 12,
        borderRadius: 20,
        marginBottom: 12,
        width: screenWidth * 0.83,
        alignItems: "center",
    },
    rbutton: {
        borderColor: "#E3655B",
        backgroundColor: "white",
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 12,
        width: screenWidth * 0.83,
        alignItems: "center",
    },
    confirm: {
        fontFamily: "Roboto_500Medium",
        color: "white",
        fontSize: 14,
    },
    return: {
        fontFamily: "Roboto_500Medium",
        color: "#E3655B",
        fontSize: 14,
    },
    bottomButtons: {
     position: "absolute",
     bottom: 40,
     width: "100%",
     alignItems: "center",
},
});

export default qrstyles;