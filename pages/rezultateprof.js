import React, { useEffect, useState } from 'react'
import axios from "axios"
import {
    Flex,
    Heading,
    SimpleGrid,
    Badge,
    Box,
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
import { createTheme, ThemeProvider } from '@mui/material/styles';



export default function Dashboard() {
    const theme = createTheme();
    const [elevi, setElevi] = useState([])

    const [userdata, setUserdata] = useState()
    const [teacher, setTeacher] = useState()
    const [emails, setEmails] = useState()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const db = getFirestore(app);
                const userDocRef = collection(db, 'users', user.email, 'rezultateprof');
                setEmails(user.email);
                console.log(user.email);
                getDocs(userDocRef)
                    .then((userDocSnapshot) => {
                        if (userDocSnapshot.size > 0) {
                            const userDataArray = [];
                            userDocSnapshot.forEach((doc) => {
                                const userData = doc.data();
                                userDataArray.push(userData);
                            });
                            setUserdata(userDataArray); // Update the userdata state with the retrieved data
                        } else {
                            // User document does not exist
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching user data: ', error);
                    });
            }

        });
    }, []);


    const [selectedQuiz, setSelectedQuiz] = useState(null);

    console.log(userdata)


    if (userdata) {
        return (
            <>
                {/* Column 2 */}
                <Flex
                    w={["100%", "100%", "60%", "60%", "85%"]}
                    bgColor="#F5F5F5" p="3%"
                    flexDir="column"
                    overflow="auto"
                    minH="100vh"
                >
                    <Heading letterSpacing="tight" mb={4}>Rezultate</Heading>
                    <SimpleGrid columns={3} spacing={3}>
                        {userdata[0] ? (

                            userdata.map((item, i) => (
                                <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                                    <Box p='6'>
                                        <Box display='flex' alignItems='baseline'>
                                            <Badge borderRadius='full' px='2' colorScheme='yellow'>
                                                {"Rezultat"}
                                            </Badge>
     
                                                <Box
                                                    color='gray.500'
                                                    fontWeight='semibold'
                                                    letterSpacing='wide'
                                                    fontSize='xs'
                                                    textTransform='uppercase'
                                                    ml='2'
                                                >
                                                    <h1>{item['timestamp']['title']}</h1>
                                                </Box>
                                            
                                        </Box>
                                        <Box
                                            mt='1'
                                            fontWeight='semibold'
                                            as='h4'
                                            lineHeight='tight'
                                            noOfLines={1}
                                        >
                                            <h1>{item['timestamp']['score']}  / {item['timestamp']['totalQuestions']}</h1>
                                        </Box>
                                        <Box>
                                            {item['email']}
                                            <Box as='span' color='gray.600' fontSize='sm'>
                                            </Box>
                                        </Box>
                                        <h1>{new Date(item['timestamp']['timestamp']).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        }).replace(",", " -")} </h1>
                                        <h1> {item['timestamp']['useremail']}</h1>
                                    </Box>
                                </Box>
                            ))


                        ) : (
                            <h1>~Nu exista quizz-uri 😞 </h1>
                        )}

                    </SimpleGrid>
                    <Flex flexDir="column">
                        <Flex overflow="auto">
                        </Flex>

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