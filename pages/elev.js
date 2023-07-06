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
    InputLeftElement, Textarea
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
    const [teacher, setTeacher] = useState()
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
                            const classroomCollectionRef = collection(teacherref, 'quizzs');

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


    const [selectedQuiz, setSelectedQuiz] = useState(null);




    if (true) {
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
                    <Heading letterSpacing="tight" mb={4}>Quizz-uri</Heading>
                    <SimpleGrid columns={2} spacing={3}>
                        {elevi[0] ? (
                            elevi.map((item, i) => (
                                <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                                    <Box p='6'>
                                        <Box display='flex' alignItems='baseline'>
                                            <Badge borderRadius='full' px='2' colorScheme='yellow'>
                                                {"Quiz"}
                                            </Badge>

                                            <Box
                                                color='gray.500'
                                                fontWeight='semibold'
                                                letterSpacing='wide'
                                                fontSize='xs'
                                                textTransform='uppercase'
                                                ml='2'
                                            >
                                                {item['quizData']['title']}
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
                                        <Button onClick={() => setSelectedQuiz(item)}>Take Quiz</Button>
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            userdata ? (
                                <h1>~Nu exista quizz-uri 😞 </h1>
                            ) : <h1>~Nu apartii unei clase</h1>
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
                        Buna ziua! <Flex display="inline-flex" fontWeight="bold"></Flex>
                    </Heading>
                    {selectedQuiz ? (

                        <div>
                            <ThemeProvider theme={theme}>
                                <div>
                                    <QuizComponent quizData={selectedQuiz['quizData']} id={selectedQuiz['id']} teacheremail={teacher} useremail={emails} />
                                    {console.log(selectedQuiz)}
                                </div>
                            </ThemeProvider>
                        </div>
                    ) : (
                        <h1></h1>
                    )}
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