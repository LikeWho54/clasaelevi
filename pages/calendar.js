import React, { useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { useClipboard } from '@chakra-ui/react'
import {
    Flex,
    Heading,
    Skeleton,
    SkeletonText,
} from '@chakra-ui/react'
import RevoCalendar from 'revo-calendar'
import { useEffect } from 'react'
import { getDatabase, get, child, update, ref, set, remove } from "firebase/database";
import { doc, setDoc, getFirestore, addDoc, getDoc, getDocs, collection } from "firebase/firestore";

import {
    onAuthStateChanged,
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signOut
} from 'firebase/auth'
import { app } from '..//firebase';
import { auth } from '..//firebase'


export default function Dashboard() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [eventname, setEventName] = useState('');
    const [eventdesc, setEventDesc] = useState('');

    const handleEventNameChange = (e) => {
        setEventName(e.target.value);
    };

    const handleEventDescChange = (e) => {
        setEventDesc(e.target.value);
    };

    const [userdata, setUserdata] = useState()
    const [email, setEmail] = useState()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {

            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const useruid = user.uid
                const db = getFirestore(app)
                const docRef = doc(db, "users", user.email);
                setEmail(user.email)
                getDoc(docRef).then(docSnap => {
                    if (docSnap.exists()) {
                        setUserdata(docSnap.data())
                    } else {

                    }
                });

                // ...
            }

        });

    }, []);
    const [eventList, setEventsList] = useState([])
    const [meetings, setMeetings] = useState([])
    useEffect(() => {
        if (userdata) {
            const db = getFirestore(app)
            const docRef = doc(db, "users", email, 'calendar/schedule');
            getDoc(docRef).then(docSnap => {
                console.log(docSnap.data())
                if(docSnap.data()){
                docSnap.data()['events'].map(d => (
                 //  console.log({ name: d['name'],extra: {text: d['extra']['text']}, date: new Date(d['date']['seconds'] * 1000), allDay: true })
                    setEventsList((array) => [...array, { name: d['name'],extra: {text: d['extra']['text']}, date: new Date(d['date']['seconds'] * 1000), allDay: true }])
                ))
                }
            });
        }
    }, [userdata])
    const [name, setName] = useState()
    const [date, setDate] = useState()
    const [meetlink, setMeetLink] = useState()
    const [time, setTime] = useState()

    const opener = (gg) => {
        setDate(gg)
        console.log('hihi', gg)
        onOpen()
    }
    const addEvent = async () => {
        // Create a new event object
        const newEvent = {
          name: eventname,
          date: date,
          allDay: true,
          extra: {
            text: eventdesc,
          },
        };
    
        try {
          const user = auth.currentUser;
          if (user) {
            const db = getFirestore(app);
            const docRef = doc(db, 'users', user.email, 'calendar/schedule');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              // If the document exists, update the 'events' field
              const existingEvents = docSnap.data().events || [];
              await setDoc(docRef, {
                events: [...existingEvents, newEvent],
              });
            } else {
              // If the document does not exist, create it with the 'events' field
              await setDoc(docRef, {
                events: [newEvent],
              });
            }
    
            // Update the event list state with the new event
            setEventsList((prevEvents) => [...prevEvents, newEvent]);
    
            // Close the drawer
            onClose();
          }
        } catch (error) {
          console.log('Error adding event:', error);
        }
      };
    
    
    
    if (true) {
        return (
            <>
                <Flex
                    w={["100%", "100%", "60%", "60%", "100%"]}
                    p="3%"
                    flexDir="column"
                    overflow="auto"
                    minH="100vh"
                >
                    <Heading
                        fontWeight="normal"
                        mb={4}
                        letterSpacing="tight"
                    >
                        Calendar
                    </Heading>

                    <RevoCalendar
                        primaryColor="#000"
                        allowAddEvent={true}
                        secondaryColor="#EAD2A8"
                        addEvent={(e) => opener(e)}
                        todayColor="#3B3966"
                        events={eventList}
                        textColor="#333333"
                        eventSelected={(e) => console.log(e)}

                    />


                </Flex>
            </>
        )
    }
    else {
        return (
            <Flex
                w={["100%", "100%", "60%", "60%", "100%"]}
                p="3%"
                flexDir="column"
                overflow="auto"
                minH="100vh"
            >
                <Heading
                    fontWeight="normal"
                    mb={4}
                    letterSpacing="tight"
                >
                    <SkeletonText mt='4' noOfLines={1} spacing='4' />
                </Heading>

                <Skeleton height='1000px' />


            </Flex>
        )
    }
}