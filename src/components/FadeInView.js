import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const FadeInView = ({ style, children, duration = 600, delay = 0 }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
    const translateY = useRef(new Animated.Value(20)).current; // Initial slide up

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: duration,
                delay: delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: duration,
                delay: delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, translateY, duration, delay]);

    return (
        <Animated.View
            style={{
                ...style,
                opacity: fadeAnim,
                transform: [{ translateY }],
            }}
        >
            {children}
        </Animated.View>
    );
};

export default FadeInView;
