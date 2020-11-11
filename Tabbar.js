import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Animated,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { Dimensions } from 'react-native';

const TabBar = ({ state, descriptors, navigation }) => {

    const [translateValue] = useState(new Animated.Value(0));
    const totalWidth = Dimensions.get("window").width;
    const tabWidth = totalWidth / state.routes.length;

    const animateSlider = (index) => {
        Animated.spring(translateValue, {
            toValue: index * tabWidth,
            velocity: 10,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        animateSlider(state.index);
    }, [state.index]);


    return (


        <View style={[style.tabContainer, { width: totalWidth }]}>
            <View style={{ flexDirection: "row" }}>
                <Animated.View
                    style={[
                        style.slider,
                        {
                            transform: [{ translateX: translateValue }],
                            width: tabWidth - 20,
                        },
                    ]}
                />

                {state.routes.map((route, index) => {

                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {

                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }

                        animateSlider(index);
                    };


                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityStates={isFocused ? ["selected"] : []}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            style={{ flex: 1 }}
                            key={index}
                        >
                            <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{}}>{label}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    tabContainer: {
        height: 60,
        shadowOffset: {
            width: 0,
            height: -1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.0,
        backgroundColor: "white",
        elevation: 10,
        position: "absolute",
        bottom: 0,
    },
    slider: {
        height: 3,
        position: "absolute",
        top: 0,
        left: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        
    },
});


export default TabBar


