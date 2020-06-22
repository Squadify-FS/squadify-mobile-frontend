import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { API_URL } from 'react-native-dotenv';
import * as Permissions from 'expo-permissions';
import React, {useState, useEffect} from 'react';
import { AxiosHttpRequest } from '../../utils/axios';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, AsyncStorage, ScrollView } from 'react-native';

// components
import EventCard from '../../cards/EventCard'

const Feed = ({ navigation }: any) => {
    const [ mapRegion, setMapRegion ] = useState({
        latitude: 0,
        longitude: 0
    });
    
    const [ events, setEvents ] = useState([]);
    const radius = 10;

    useEffect(() => {
        const getCurrentLocation = async() => {
            const { status } = await Permissions.askAsync(Permissions.LOCATION);
            if(status !== 'granted') {
                alert('too bad');
            } else {
                try {
                    const location = await Location.getCurrentPositionAsync();
                    const { latitude, longitude } = location.coords;
                    const findEvents = (await AxiosHttpRequest('GET', `${API_URL}/event/searcharea/${radius}/${latitude}/${longitude}`))?.data;
                    console.log(findEvents, 'geolocation events');
                    setEvents(findEvents);
                } catch(err) {
                    console.log(err);
                }
            }   
        };
        getCurrentLocation();
    }, []);
    return (
        <ScrollView>
            <Text>Feed. Radius: {radius}</Text>
            {
                events.map((event, index) => <EventCard key={ index } event={event } navigation={ navigation } /> )
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    inputField: {
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,
    },
});

export default Feed;