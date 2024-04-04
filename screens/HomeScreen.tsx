import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const HomeScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const { uid } = auth.currentUser
    useEffect(() => {
        const fetchChats = async () => {
            const chatRooms = []
            try {
                const chatsSnapshot = await getDocs(collection(db, "chats"));
                chatsSnapshot.forEach((chatDoc) => {
                    const chatId = chatDoc.id;
                    const members = chatDoc.data().members;
                    console.log('member/id', chatId, members)
                    if (members.includes(uid)) {
                        chatRooms.push({ id: chatId, ...chatDoc.data() });
                    }
                });
                setChats(chatRooms)
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };

        fetchChats();
    }, []);


    const handleChatPress = (chatId) => {
        navigation.navigate("ChatLogScreen", { chatId });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.button} onPress={() => handleChatPress(item.id)}>
                        <Text style={styles.buttonText}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007bff",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 10,
        alignItems: "center",
    }, container: {
        flex: 1,
        padding: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default HomeScreen;