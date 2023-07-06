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
                const useruid = user.uid
                const db = getFirestore(app)
                const docRef = doc(db, "users", user.email);
                getDoc(docRef).then(docSnap => {
                    if (docSnap.exists()) {
                        setUserdata(docSnap.data())
                        console.log(docSnap.data().prof)
                        setEmail(docSnap.data().prof)
                    } else {

                    }
                });

                // ...
            }

        });

    }, []);
    const [eventList, setEventsList] = useState([])
    useEffect(() => {
        if (email) {
            const db = getFirestore(app);
            console.log('->',email)
            const docRef = doc(db, 'users', email, 'calendar/schedule');
            getDoc(docRef).then((docSnap) => {
              if (docSnap.exists()) {
                console.log(docSnap.data());
                docSnap.data()['events'].map((d) =>
                  setEventsList((array) => [
                    ...array,
                    {
                      name: d['name'],
                      extra: { text: d['extra']['text'] },
                      date: new Date(d['date']['seconds'] * 1000),
                      allDay: true,
                    },
                  ])
                );
              }
            });
          }
          
    }, [email])

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
                        secondaryColor="#EAD2A8"
                        todayColor="#3B3966"
                        events={eventList}
                        textColor="#333333"

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