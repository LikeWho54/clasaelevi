import React, { useEffect, useState } from 'react'
import axios from "axios"
import {
    Flex,
    Heading,
    SimpleGrid,
    Badge,
    Box,
    Button,
    Skeleton,
    SkeletonText,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { doc, setDoc, getFirestore, addDoc, getDoc, collection, getDocs } from "firebase/firestore";
import QuizComponent from '../components/Quiz';
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
    const [teacher, setTeacher]= useState()
    const [emails, setEmails] = useState()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const db = getFirestore(app);
                const userDocRef = doc(db, 'users', user.email);
                setEmails(user.email)
                console.log(user.email)
                getDoc(userDocRef)
                    .then((userDocSnapshot) => {
                        if (userDocSnapshot.exists()) {
                            const userData = userDocSnapshot.data();
                            console.log(userDocSnapshot.data())
                            setUserdata(userData);
                            const teacherref = doc(db, 'users', userDocSnapshot.data()['prof']);
                            setTeacher(userDocSnapshot.data()['prof'])
                            const classroomCollectionRef = collection(teacherref, 'files');

                            getDocs(classroomCollectionRef)
                                .then((querySnapshot) => {
                                    const classroomData = [];
                                    
                                    querySnapshot.forEach((doc) => {
                                        const documentData = {
                                            id: doc.id,
                                            ...doc.data()
                                          };
                                          classroomData.push(documentData);
                                    });
                                    console.log(classroomData);

                                    setElevi(classroomData)
                                })
                                .catch((error) => {
                                    console.error('Error fetching classroom data: ', error);
                                });
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
                    <Heading letterSpacing="tight" mb={4}>Materiale</Heading>
                    <SimpleGrid columns={3} spacing={3}>
                        {elevi[0] ? (

                            elevi.map((item, i) => (
                                <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>

                                <Box p='6'>
                                    <Box display='flex' alignItems='baseline'>
                                        <Badge borderRadius='full' px='2' colorScheme='yellow'>
                                            {"Material"}
                                        </Badge>

                                        <Box
                                            color='gray.500'
                                            fontWeight='semibold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            textTransform='uppercase'
                                            ml='2'
                                        >
                                            <h1> {new Date(item['timestamp']).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "numeric",
                                                day: "numeric",
                                            }).replace(",", " -")}</h1>
                                        </Box>


                                    </Box>

                                    <Box
                                        mt='1'
                                        fontWeight='semibold'
                                        as='h4'
                                        lineHeight='tight'
                                        noOfLines={1}
                                    >
                                        <h1> {item['fileName']}</h1>
                                    </Box>
                                    <Box mb={2}>
                                       <a target='_blank' href={item.downloadUrl}> <Button>
                                            Descarca {item.fileName}
                                        </Button></a>
                                    </Box>


                                </Box>
                            </Box>
                            ))


                        ) : (
                            <h1>~Nu exista materiale 😞 </h1>
                        )}

                    </SimpleGrid>
                    <Flex flexDir="column">
                        <Flex overflow="auto">
                        </Flex>

                    </Flex>
                </Flex>


                {/* Column 3 */}
    
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