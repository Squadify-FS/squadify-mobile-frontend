import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import { API_URL } from 'react-native-dotenv';
import * as Permissions from 'expo-permissions';
import React, {useState, useEffect} from 'react';
import { AxiosHttpRequest } from '../../utils/axios';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, AsyncStorage, ScrollView, RefreshControl } from 'react-native';

// components
import EventCard from '../../cards/EventCard'

const Feed = ({ navigation }: any) => {
    const [ mapRegion, setMapRegion ] = useState({
        latitude: 0,
        longitude: 0
    });
    
    const [ events, setEvents ] = useState([]);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ latitude, setLatitude ] = useState(0.0);
    const [ longitude, setLongitude ] = useState(0.0);

    const radius = 10;

    useEffect(() => {
        getCurrentLocation();
        findEvents();
    }, [latitude, longitude]);

    const refresh = async () => {
        setRefreshing(true);
        findEvents();
        setRefreshing(false);
    };

    const findEvents = async() => {
        const foundEvents = (await AxiosHttpRequest('GET', `${API_URL}/event/searcharea/${radius}/${latitude}/${longitude}`))?.data;
        setEvents(foundEvents);
    };

    const getCurrentLocation = async() => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if(status !== 'granted') {
            alert('too bad');
        } else {
            try {
                const location = await Location.getCurrentPositionAsync();
                setLatitude(location.coords.latitude);
                setLongitude(location.coords.longitude);
            } catch(err) {
                console.log(err);
            }
        }   
    };

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh} />
            }>
            <Text>Feed. Radius: {radius}</Text>
            {
                events.length !== 0 && events.map((event, index) => <EventCard key={ index } event={event } navigation={ navigation } /> )
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