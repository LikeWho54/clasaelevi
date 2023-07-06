import React, { useEffect, useState } from 'react'
import axios from "axios"
import {
    Flex,
    Heading,
    VStack,
    useToast,
    SimpleGrid,
    Badge,
    RadioGroup,
    Radio,
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

    const [elevi, setElevi] = useState([])
    const toast = useToast()
    const [userdata, setUserdata] = useState()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const db = getFirestore(app);
                const userDocRef = doc(db, 'users', user.email);

                getDoc(userDocRef)
                    .then((userDocSnapshot) => {
                        if (userDocSnapshot.exists()) {
                            const userData = userDocSnapshot.data();
                            setUserdata(userData);

                            const classroomCollectionRef = collection(userDocRef, 'quizzs');

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
                            // User document does not exist
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching user data: ', error);
                    });
            }
        });
    }, []);
    const [quizTitle, setQuizTitle] = useState('');


    const saveQuiz = () => {

        const db = getFirestore(app);
        const quizRef = collection(doc(db, 'users', userdata.email), 'quizzs');
        const quizData = {
            title: quizTitle,
            questions: questions,
        };
        addDoc(quizRef, { quizData })
            .then(() => {
                toast({
                    title: 'Quiz saved',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
            })
            .catch((error) => {
                console.error('Error saving quiz:', error);
                toast({
                    title: 'An error occurred',
                    description: 'Failed to save the quiz. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                });
            });
    };

    const [questions, setQuestions] = useState([]);

    const addQuestion = () => {
        setQuestions((prevQuestions) => [
            ...prevQuestions,
            { question: '', choices: [''], correctAnswer: null, correctInd: '' },
        ]);
    };

    const updateQuestionText = (index, newText) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[index].question = newText;
            return updatedQuestions;
        });
    };

    const addChoice = (questionIndex) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[questionIndex].choices.push('');
            return updatedQuestions;
        });
    };

    const updateChoiceText = (questionIndex, choiceIndex, newText) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[questionIndex].choices[choiceIndex] = newText;
            return updatedQuestions;
        });
    };

    const removeChoice = (questionIndex, choiceIndex) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[questionIndex].choices.splice(choiceIndex, 1);
            return updatedQuestions;
        });
    };

    const setCorrectAnswer = (questionIndex, correctAnswerIndex) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            console.log(updatedQuestions[questionIndex]['choices'][correctAnswerIndex])
            updatedQuestions[questionIndex].correctAnswer = correctAnswerIndex;
            updatedQuestions[questionIndex].correctInd = updatedQuestions[questionIndex]['choices'][correctAnswerIndex];

            return updatedQuestions;
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
                    <h1>Adauga quiz</h1>
                    <Input
                        placeholder="Enter quiz title"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        marginBottom={4}
                    />
                    <Box>
                        {questions.map((question, questionIndex) => (
                            <Flex key={questionIndex} direction="column" marginBottom={4}>
                                <Input
                                    placeholder="Enter question"
                                    value={question.question}
                                    onChange={(e) => updateQuestionText(questionIndex, e.target.value)}
                                    marginBottom={2}
                                />
                                <RadioGroup
                                    onChange={(value) => setCorrectAnswer(questionIndex, parseInt(value), question.question)}
                                    value={question.correctAnswer}
                                >
                                    {question.choices.map((choice, choiceIndex) => (
                                        <Flex key={choiceIndex} alignItems="center">
                                            <Radio value={choiceIndex} marginRight={2} />
                                            <Input
                                                placeholder="Enter choice"
                                                value={choice}
                                                onChange={(e) =>
                                                    updateChoiceText(questionIndex, choiceIndex, e.target.value)
                                                }
                                                marginRight={2}
                                            />
                                            <Button
                                                size="sm"
                                                colorScheme="red"
                                                onClick={() => removeChoice(questionIndex, choiceIndex)}
                                            >
                                                Elimina
                                            </Button>
                                        </Flex>
                                    ))}
                                    <Button
                                        size="sm"
                                        colorScheme="green"
                                        onClick={() => addChoice(questionIndex)}
                                        marginTop={2}
                                    >
                                        Add Choice
                                    </Button>
                                </RadioGroup>
                            </Flex>
                        ))}
                        <div>
                            <VStack spacing={4}>
                                <Button colorScheme="blue" onClick={addQuestion}>
                                    Adauga intrebare
                                </Button>
                                {/* Button to save the quiz data */}
                                <Button colorScheme="green" onClick={saveQuiz}>
                                    Salveaza
                                </Button>

                            </VStack>
                        </div>
                    </Box>
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