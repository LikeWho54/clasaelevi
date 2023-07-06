import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    FormErrorMessage,
    FormHelperText,
    Image,
    Select,
    useToast,
  } from '@chakra-ui/react';
  import { useRouter } from 'next/router'
  import { getDatabase, get, child, update, ref, set, remove } from "firebase/database";
  
  import {
    onAuthStateChanged,
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
      sendEmailVerification,
    GoogleAuthProvider,
    GithubAuthProvider,
    sendSignInLinkToEmail,
    signInWithPopup,
  } from 'firebase/auth'
  import { app } from '../firebase';
  import { auth } from '../firebase'
  import { doc, setDoc, getFirestore, addDoc, getDoc } from "firebase/firestore";
  import { useEffect, useState } from 'react'
  import { useContext } from 'react'
  import axios from "axios" 
  
  
  export default function SplitScreen() {
  
    const toast = useToast()
  
    const router = useRouter()
    const [handle, setHandle] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
      const [image, setImage] = useState()
    const [handleErrorBorder, setHandleErrorBorder] = useState('gray.300')
    const [emailErrorBorder, setEmailErrorBorder] = useState('gray.300')
      const [name, setName] =  useState()
    const [passwordErrorBorder, setPasswordErrorBorder] = useState('gray.300')
    const [handles, setHandles] = useState([])
    const [useruid, setUseruid] = useState()
    const [check, setCheck] = useState(0)
    useEffect(() => {
      const db = getFirestore(app)
      const docRef = doc(db, "handle", 'handles');
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          setHandles(docSnap.data().handles)
        } else {
  
        }
      });
  
  
  
    }, [])

    const handleRegister = () => {
      for (var i in handles) {
        if (handles[i] == handle) {
          setCheck(1)
        }
      }
       if (email === undefined) {
        setEmailErrorBorder('red.500')
        setPasswordErrorBorder('gray.500')
        setHandleErrorBorder('gray.500')
      }
      else if (password === undefined) {
        setPasswordErrorBorder('red.500')
        setHandleErrorBorder('gray.500')
        setEmailErrorBorder('gray.300')
      }
      else if (check == 0) {
        setPasswordErrorBorder('gray.500')
        setHandleErrorBorder('gray.500')
        setEmailErrorBorder('gray.300')
        setHandles(oldArray => [...oldArray, handle]);
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            const db = getFirestore(app)
            router.push('/elev')
            // ...
  
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            var result = errorMessage.substr(errorMessage.indexOf(" ") + 1);
            toast({
                title: errorMessage,
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
            console.log(errorMessage)
          });
      }
    }
  
  
    return (
      <Stack minH={'100vh'} sx={{ backgroundColor: '#FFFAE0' }} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Stack spacing={4} w={'full'} maxW={'md'}>
            <Heading fontSize={'2xl'}>Creeaza un cont nou pentru elev</Heading>
            <FormControl id="email">
              <FormLabel>Email </FormLabel>
              <Input borderColor={emailErrorBorder} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Parola</FormLabel>
              <Input type="password" borderColor={passwordErrorBorder} value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Stack spacing={6}>
  
              <Button colorScheme={'yellow'} onClick={() => handleRegister()} variant={'solid'}>
                Creeaza
              </Button>
              <Button colorScheme={'yellow'} onClick={() => router.push('/')} variant={'solid'}>
                Ai  deja un cont? Log in
              </Button>
            </Stack>
          </Stack>
        </Flex >
        <Flex flex={1}>
          <Image
            alt={'Login Image'}
            objectFit={'cover'}
            src={
              'https://ucarecdn.com/950fa752-7042-4dd6-aaa1-e03b0e766d69/'
            }
          />
        </Flex>
      </Stack >
    );
  }
  