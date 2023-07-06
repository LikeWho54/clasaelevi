import React, { useState } from 'react'
import {
    Flex,
    Heading,
    Avatar,
    AvatarGroup,
    Text,
    Icon,
    IconButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Divider,
    Link,
    Box,
    Button,
    Input,
    useToast,
    InputGroup,
    InputLeftElement,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    PopoverBody,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    PopoverFooter,
    Portal,
    useDisclosure
} from '@chakra-ui/react'
import { GoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc"
import { useGoogleLogin } from '@react-oauth/google';
import { doc, setDoc, getFirestore, addDoc, getDoc, updateDoc } from "firebase/firestore";
import { GoogleOAuthProvider } from '@react-oauth/google';

import axios from "axios";

import {
    FiHome,
    FiPieChart,
    FiDollarSign,
    FiBox,
    FiCalendar,
    FiCode,
    FiChevronDown,
    FiChevronUp,
    FiPlus,
    FiCreditCard,
    FiSearch,
    FiBell
} from "react-icons/fi"
import { CgLogOut } from 'react-icons/cg'
import { BiPaint } from 'react-icons/bi'
import { useRouter } from 'next/router';
import { getDatabase, get, child, update, ref, set, remove } from "firebase/database";

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
import { useEffect } from 'react'
import { useContext, useRef } from 'react'


export default function Layout({ children }) {
    const client_id = "445175602272-19c49s0gafk3loa6hv4lmm7homema4aa.apps.googleusercontent.com"
    const responseGoogle = (response) => {
        console.log(response);
    }
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    const menuItems = [
        {
            href: '/dashboard',
            title: 'Clasa',
            icon: FiHome,
        },

        {
            href: '/embeed',
            title: 'Quizz-uri',
            icon: FiPlus,
        },

        {
            href: '/rezultateprof',
            title: 'Rezultate',
            icon: FiPieChart,
        },
        {
            href: '/materiale',
            title: 'Materiale',
            icon: FiCode,
        },
        {
            href: '/calendar',
            title: 'Calendar',
            icon: FiCalendar,
        },


    ];
    const elevItems = [
        {
            href: '/elev',
            title: 'Quizz-uri',
            icon: FiHome,
        },

        {
            href: '/rezultate',
            title: 'Rezultate',
            icon: FiPieChart,
        },
        {
            href: '/materialeelev',
            title: 'Materiale',
            icon: FiCode,
        },
        {
            href: '/calendarelev',
            title: 'Calendar',
            icon: FiCalendar,
        },



    ];
    const [useruid, setUseruid] = useState()
    const [handle, setHandle] = useState()
    const router = useRouter()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {

            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User

                setUseruid(user.uid)
                const db = getFirestore(app)
                const docRef = doc(db, "users", user.email);
                getDoc(docRef).then(docSnap => {

                    if (docSnap.exists()) {
                        setHandle(docSnap.data().status)
                    } else {

                    }

                });
                // ...
            }
            else if (user == null) {

                router.push('/')

            }
        });

    }, []);
    console.log('layout running')
    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
            router.push('/')
        }).catch((error) => {
            // An error happened.
        });
    }
    const toast = useToast()
    const isProf = handle === "prof";

    return (
        <>

            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />

                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Link your calendar</DrawerHeader>
                    <DrawerBody>
                        <GoogleOAuthProvider clientId={client_id}>
                        </GoogleOAuthProvider>
                    </DrawerBody>


                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Done
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Flex
                h={[null, null, "100vh"]}
                maxW="2000px"
                flexDir={["column", "column", "row"]}
                overflow="hidden"
            >
                {/* Column 1 */}
                <Flex
                    w={["100%", "100%", "10%", "15%", "15%"]}
                    flexDir="column"
                    alignItems="center"
                    backgroundColor="#020202"
                    color="#fff"
                >
                    <Flex
                        flexDir="column"
                        h={[null, null, "100vh"]}
                        justifyContent="space-between"
                    >
                        <Flex
                            flexDir="column"
                            as="nav"
                        >
                            <Heading
                                mt={50}
                                mb={[25, 50, 100]}
                                fontSize={["4xl", "4xl", "2xl", "3xl", "4xl",]}
                                alignSelf="center"
                                letterSpacing="tight"
                            >
                                Geografie
                            </Heading>
                            <Flex
                                flexDir={["row", "row", "column", "column", "column"]}
                                align={["center", "center", "center", "flex-start", "flex-start"]}
                                wrap={["wrap", "wrap", "nowrap", "nowrap", "nowrap"]}
                                justifyContent="center"
                            >
                                {isProf
                                    ? menuItems.map(({ href, title, icon }) => (
                                        <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                                            <Link display={["none", "none", "flex", "flex", "flex"]}>
                                                <Icon as={icon} fontSize="2xl" />
                                            </Link>
                                            <Link
                                                href={href}
                                                _hover={{ textDecor: "none" }}
                                                display={["flex", "flex", "none", "flex", "flex"]}
                                            >
                                                <Text className={router.asPath === href && "active"}>
                                                    {title}
                                                </Text>
                                            </Link>
                                        </Flex>
                                    ))
                                    : elevItems.map(({ href, title, icon }) => (


                                        <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                                            <Link display={["none", "none", "flex", "flex", "flex"]}>
                                                <Icon as={icon} fontSize="2xl" />
                                            </Link>
                                            <Link
                                                href={href}
                                                _hover={{ textDecor: "none" }}
                                                display={["flex", "flex", "none", "flex", "flex"]}
                                            >
                                                <Text className={router.asPath === href && "active"}>
                                                    {title}
                                                </Text>
                                            </Link>
                                        </Flex>
                                    ))}


                            </Flex>
                        </Flex>


                        <Popover>
                            <PopoverTrigger>
                                <Flex flexDir="column" alignItems="center" mb={10} mt={5}>
                                    <Icon w={7} h={7} as={CgLogOut} />
                                    <Text textAlign="center">Log out</Text>
                                </Flex>
                            </PopoverTrigger>
                            <Portal>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        <h1>Are you sure?</h1>
                                        <Button onClick={() => handleLogout()} colorScheme='red'>Yes, log me out?</Button>
                                    </PopoverBody>
                                </PopoverContent>
                            </Portal>
                        </Popover>

                    </Flex>
                </Flex>

                {children}

            </Flex>

        </>
    )
}