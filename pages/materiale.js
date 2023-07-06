import React, { useEffect, useState } from 'react'
import axios from "axios"
import {
    Flex,
    Heading,
    useToast,
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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Dashboard() {

    const [elevi, setElevi] = useState([])
    const toast = useToast()

    const [userdata, setUserdata] = useState()
    const [email, setEmail] = useState()
    const [fileName, setFileName] = useState('');
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const db = getFirestore(app);
                const userDocRef = doc(db, 'users', user.email);
                setEmail(user.email)
                getDoc(userDocRef)
                    .then((userDocSnapshot) => {
                        if (userDocSnapshot.exists()) {
                            const userData = userDocSnapshot.data();
                            setUserdata(userData);

                            const classroomCollectionRef = collection(userDocRef, 'files');

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

    const storage = getStorage(app);




    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileNameChange = (e) => {
        setFileName(e.target.value);
    };


    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast({
                title: 'No file selected',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const storage = getStorage(app);
        const storageRef = ref(storage, `files/${selectedFile.name}`);
        const uploadTask = uploadBytes(storageRef, selectedFile);

        try {
            await uploadTask;

            const downloadUrl = await getDownloadURL(storageRef);

            await saveFileToFirestore(downloadUrl);

            toast({
                title: 'File uploaded successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            toast({
                title: 'Error uploading file',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const saveFileToFirestore = async (downloadUrl) => {
        const db = getFirestore(app);
        const fileData = {
          fileName,
          downloadUrl,
          timestamp: new Date().toISOString(),
        };
      
        try {
          const docRef = await addDoc(collection(db, 'users', email, 'files'), fileData);
          console.log('File saved to Firestore:', docRef.id);
      
          // Update the elevi array with the new material
          setElevi(prevElevi => [...prevElevi, fileData]);
        } catch (error) {
          console.error('Error saving file to Firestore:', error);
        }
      };
      
    const handleDownloadFile = (url) => {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = selectedFile.name;
        anchor.click();
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
                    <Heading letterSpacing="tight" mb={4}>Materiale</Heading>
                    <SimpleGrid columns={2} spacing={3}>
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
                        Adauga un material
                    </Heading>
                    <Flex
                        direction="column"
                        p={8}
                        bg="gray.200"
                        rounded="md"
                        shadow="md"
                    >
                        <Input type="file" mb={4} onChange={handleFileChange} />
                        <Input
                            placeholder="Nume fisier"
                            variant="filled"
                            value={fileName}
                            onChange={handleFileNameChange}
                            mb={4}
                        />
                        <Button colorScheme="yellow" onClick={handleFileUpload}>
                            Upload
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