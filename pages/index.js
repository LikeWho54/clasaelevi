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
  Image,
  useToast,
} from '@chakra-ui/react';
import {useRouter} from 'next/router'
import { doc, setDoc, getFirestore, addDoc, getDoc, collection, getDocs } from "firebase/firestore";

import { getDatabase, get, child, update, ref , set, remove } from "firebase/database";

import {
    onAuthStateChanged,
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    sendSignInLinkToEmail,
    signInWithPopup,
} from 'firebase/auth'
import { app } from '../firebase';
import { auth } from '../firebase'
import { useEffect, useState } from 'react'
import { useContext } from 'react'

export default function SplitScreen() {
  const toast = useToast()
  const router = useRouter()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {

        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User

            toast({
              title: 'Bine ai revenit!',
              description: "Vă vom redirectiona imediat la dashboard!",
              status: 'success',
              duration: 4000,
              isClosable: true,
            })
                const db = getFirestore(app)
                const docRef = doc(db, "users", user.email);
                getDoc(docRef).then(docSnap => {

                    if (docSnap.exists()) {
                        if(docSnap.data().status == 'prof'){
                          router.push('/dashboard')
                        }
                        else{
                          router.push('/elev')
                        }
                    } else {

                    }

                });
         // router.push('/dashboard')
            // ...
        }

    });

}, []);
  const login = () =>{
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        toast({
          title: 'Welcome back!',
          description: "We'll get you to your dashboard right away!.",
          status: 'success',
          duration: 4000,
          isClosable: true,
        })

         // router.push('/dashboard')
        
     //   router.push('/dashboard')
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast({
          title: 'Error!',
          description:  errorMessage,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
    });
  }
  return (
    <Stack minH={'100vh'} sx={{ backgroundColor: '#FFFAE0' }}  direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>Login</Heading>
          <FormControl id="email">
            <FormLabel>Email </FormLabel>
            <Input type="email"  onChange={(e) => setEmail(e.target.value)}/>
          </FormControl>
          <FormControl id="password">
            <FormLabel>Parola</FormLabel>
            <Input onChange={(e) => setPassword(e.target.value)} type="password" />
          </FormControl>
          <Stack spacing={6}>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}>
            </Stack>
            <Button colorScheme={'yellow'} onClick={() => login()} variant={'solid'}>
              Login
            </Button>
            <Button onClick={() => router.push('/register')} colorScheme={'yellow'} variant={'outline'}>
              Creeaza un cont nou pentru profesor 
            </Button>
            <Button onClick={() => router.push('/registerelev')} colorScheme={'yellow'} variant={'outline'}>
            Creeaza un cont nou pentru elev 
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://ucarecdn.com/950fa752-7042-4dd6-aaa1-e03b0e766d69/'
          }
        />
      </Flex>
    </Stack>
  );
}
