import React, { useEffect, useState } from 'react'
import axios from "axios"
import {
    Flex,
    Heading,

    SimpleGrid,
    Badge,
    Box,
    Button,
    Input,
    Skeleton,
    SkeletonText,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { doc, setDoc, getFirestore, addDoc, getDoc, collection, getDocs } from "firebase/firestore";

import {
    onAuthStateChanged,
} from 'firebase/auth'
import { app } from '..//firebase';
import { auth } from '..//firebase'



export default function Dashboard() {
    const [inputtedEmail, setInputtedEmail] = useState('');
    const [elevi, setElevi] = useState([])
    const [userdata, setUserdata] = useState()
    const [profemail, setProfemail] = useState()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const db = getFirestore(app);
                const userDocRef = doc(db, 'users', user.email);
                setProfemail(user.email)
                getDoc(userDocRef)
                    .then((userDocSnapshot) => {
                        if (userDocSnapshot.exists()) {
                            const userData = userDocSnapshot.data();
                            setUserdata(userData);

                            const classroomCollectionRef = collection(userDocRef, 'classroom');

                            getDocs(classroomCollectionRef)
                                .then((querySnapshot) => {
                                    const classroomData = [];
                                    querySnapshot.forEach((doc) => {
                                        classroomData.push(doc.data());
                                    });
                                    console.log(classroomData);
                                    setElevi(classroomData)
                                })
                                .catch((error) => {
                                    console.error('Error fetching classroom data: ', error);
                                });
                        } else {
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching user data: ', error);
                    });
            }
        });
    }, []);

    const handleSaveEmail = () => {
        const db = getFirestore(app);
        const docRef = doc(db, `users/${userdata.email}/classroom`, inputtedEmail);

        setDoc(docRef, { email: inputtedEmail })
            .then(() => {
                console.log('Email saved successfully!');
                setElevi((prevElevi) => [...prevElevi, {email:inputtedEmail}]);

            })
            .catch((error) => {
                console.error('Error saving email:', error);
            });

        const docRefelev = doc(db, `users/`, inputtedEmail);

        setDoc(docRefelev, { email: inputtedEmail,status:'elev', prof:profemail })
            .then(() => {
                console.log('Email saved successfully!');
            })
            .catch((error) => {
                console.error('Error saving email:', error);
            });
    };
    if (userdata) {
        return (
            <>
                {/* Column 2 */}
                <Flex
                    w={["100%", "100%", "60%", "60%", "55%"]}
                    bgColor="#F5F5F5" p="3%"
                    flexDir="column"
                    overflow="auto"
                    minH="100vh"
                >
                    <Heading letterSpacing="tight" mb={4}>Elevi</Heading>
                    <SimpleGrid columns={2} spacing={3}>
                        {elevi[0] ? (

                            elevi.map((item, i) => (

                                <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>

                                    <Box p='6'>
                                        <Box display='flex' alignItems='baseline'>
                                            <Badge borderRadius='full' px='2' colorScheme='yellow'>
                                                {item['name']}
                                            </Badge>

                                                <Box
                                                    color='gray.500'
                                                    fontWeight='semibold'
                                                    letterSpacing='wide'
                                                    fontSize='xs'
                                                    textTransform='uppercase'
                                                    ml='2'
                                                >
                                                    Elev
                                                </Box>
                                            

                                        </Box>
                                        {item['meetingTime'] ? (
                                            <Box
                                                mt='1'
                                                fontWeight='semibold'
                                                as='h4'
                                                lineHeight='tight'
                                                noOfLines={1}
                                            >
                                                {new Date(item['meetingTime'].toDate()).getDate() + '/'} {new Date(item['meetingTime'].toDate()).getMonth() + 1} {'/' + new Date(item['meetingTime'].toDate()).getFullYear() + ' ' + new Date(item['meetingTime'].toDate()).getHours() + ':' + new Date(item['meetingTime'].toDate()).getMinutes()}
                                            </Box>
                                        ) : (
                                            <h1></h1>
                                        )}
                                        <Box
                                            mt='1'
                                            fontWeight='semibold'
                                            as='h4'
                                            lineHeight='tight'
                                            noOfLines={1}
                                        >
                                            {item['description']}
                                        </Box>

                                        <Box>
                                            {item['email']}
                                            <Box as='span' color='gray.600' fontSize='sm'>

                                            </Box>
                                        </Box>



                                    </Box>
                                </Box>

                            ))

                        ) : (
                            <h1>~Clasa este goala 😞 </h1>
                        )}

                    </SimpleGrid>
                    <Flex flexDir="column">
                        <Flex overflow="auto">
                        </Flex>

                    </Flex>
                </Flex>


                {/* Column 3 */}
                <Flex
                    w={["100%", "100%", "30%"]}
                    p="3%"
                    flexDir="column"
                    overflow="auto"
                    minW={[null, null, "300px", "300px", "400px"]}
                >
                    <Heading
                        fontWeight="normal"
                        mb={4}
                        letterSpacing="tight"
                    >
                        Buna, <Flex display="inline-flex" fontWeight="bold">{userdata.name}</Flex>
                    </Heading>
                    <h1>Adauga elev</h1>
                    <Flex alignItems="center">
                        <Input
                            type="email"
                            value={inputtedEmail}
                            onChange={(e) => setInputtedEmail(e.target.value)}
                        />
                        <Button onClick={handleSaveEmail} ml={2}>
                            Adauga
                        </Button>
                    </Flex>
                </Flex>
            </>
        )
    } else {
        return (
            <>
                {/* Column 2 */}
                <Flex
                    w={["100%", "100%", "60%", "60%", "55%"]}
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
                        <SkeletonText mt='4' noOfLines={4} spacing='4' />
                    </Heading>
                    <Skeleton height='500px' />

                    <Flex flexDir="column">
                        <Flex overflow="auto">
                        </Flex>

                    </Flex>
                </Flex>


                {/* Column 3 */}
                <Flex
                    w={["100%", "100%", "30%"]}
                    bgColor="#F5F5F5" p="3%"
                    flexDir="column"
                    overflow="auto"
                    minW={[null, null, "300px", "300px", "400px"]}
                >
                    <Flex alignContent="center">

                    </Flex>
                    <SkeletonText mt='4' noOfLines={1} mb={3} spacing='4' />
                    <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                        <Skeleton height='150px' />
                    </Box>

                </Flex>
            </>)
    }
}