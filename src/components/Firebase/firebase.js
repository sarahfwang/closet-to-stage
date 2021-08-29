//import { firestore } from 'firebase-admin';
import firebase from 'firebase/app'; //what's the diff btwn this and 'app'
import 'firebase/auth' //is this right? they used this.auth instead
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import algoliasearch from "algoliasearch"
import dotenv from 'dotenv'

//dotenv.config()
//import 'firebase/admin'



const client = algoliasearch('YM62ZOQQ5L', 'ab7c1c24fa069b15221969369b1d63fd');//TODO: make private




//console.log(process.env.REACT_APP_API_KEY) //restart local program to see env changes

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    //projectId: process.env.REACT_APP_PROJECT_ID,
    projectId: "closet-to-stage-16bb6",
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  };
  
  class Firebase {
      constructor(){
       firebase.initializeApp(firebaseConfig) //app.init
        //firebase.admin().initializeApp()
        
        this.auth = firebase.auth() //app.auth()
        this.db = firebase.firestore() //app.database
        this.storage = firebase.storage()
        this.functions = firebase.functions()

        console.log(process.env.REACT_APP_API_KEY, "project id")
        
      }
        //Images in storage
        storageRef = () => (
            this.storage.ref()
        )

        doAddImage = (name, file) => {
            return(
                this.storage.ref(`/images/${name}`).put(file)
            )
        }

        //takes in object, an id (same as firestore db id), and 
        doAddNote = (doc, objectID, indexName) => {
            console.log("doAddNote")

            doc.objectID = objectID
            console.log(doc)
            const index = client.initIndex(indexName)
            index.saveObject(doc)
        }

        doUpdateNote = (doc, objectID, indexName) => {
            console.log("doUpdateNote")

            doc.objectID = objectID //need objectID for algolia to identify!
            const index = client.initIndex(indexName)
            index.partialUpdateObject(doc)
        }

        //delete only needs ObjectID and index
        doDeleteNote = (objectID, indexName) => {
            console.log("doDeleteNote")

            const index = client.initIndex(indexName)
            index.deleteObject(objectID)
        }

        doAddArrayNote = (value, arrayName, objectID, indexName) => {

            const index = client.initIndex(indexName)
            console.log("doAddArrayNote")

            return(index.partialUpdateObject({
                [arrayName]:{
                    _operation: 'AddUnique',
                    value: value,
                },
                objectID: objectID,
            }))

        }

        // doAddArrayNote = (value, arrayName, objectID, indexName) => {
        //     console.log("doAddArrayNote")

        //     const index = client.initIndex(indexName)
        //     return(index.partialUpdateObject({
        //         [arrayName]:{
        //             _operation: "AddUnique",
        //             value,
        //         },
        //         objectID,
        //     }))
        // }

        //array union functions

        updatefbUrls = (value, ref) => {
            ref.update({
                fbUrls: firebase.firestore.FieldValue.arrayUnion(value)
            })
        }

        updateItemBuyers = (toUser, msg, ref) => {
            //ref update only works if the doc exists
            //for messages db

            //message database
            console.log("in firebase.js value", toUser, "ref", ref)
            ref.get().then(doc=>{
                if(doc.exists) {
                    ref.update({buyers: firebase.firestore.FieldValue.arrayUnion(toUser)})
                    
                }
                else{ 
                    ref.set({buyers: [toUser]})
                    
                }
            })
        }

        updateArrayUnion = (ref, keyName, value) => {
            ref.update({
                [keyName]: firebase.firestore.FieldValue.arrayUnion(value)
            })
        }

        updateArrayRemove = (ref, keyName, value) => {
            ref.update({
                [keyName]: firebase.firestore.FieldValue.arrayRemove(value)
            })
        }
        
      //*** Auth API ***
        doCreateUserWithEmailAndPassword = (email, password) =>
          this.auth.createUserWithEmailAndPassword(email, password)
      
        doSignInWithEmailAndPassword =(email, password) =>
          this.auth.signInWithEmailAndPassword(email, password)

        /* doSignInWithGoogle = () => {
            const provider = new firebase.auth.GoogleAuthProvider()
            const auth = this.auth

            this.auth.signInWithPopup(auth, provider)
                .then((result) => {
                    const credential = firebase.auth.GoogleAuthProvider.credentialFromResult(result)
                    const token = credential.accessToken

                    const user = result.user
                    console.log("result.user", user)
                }).catch((error) => {
                    console.log("error", error)
                    const errorCode = error.code;
    const errorMessage = error.message;
                    //TODO: HANDLE ERRORS
                })

        } */


      
         doSignOut = () =>
          this.auth.signOut();
      
        doPasswordReset = email =>
          this.auth.sendPasswordResetEmail(email)
      
        doPasswordUpdate = password =>
          this.auth.currentUser.updatePassword(password) //why cureentUser???
      
          //**User API */

        user = uid =>
            this.db.doc(`users/${uid}`)// ` denotes string literal ${} is how you put js in string literals
        //but wait, could you have said('users/'+uid)???
        users = () => 
            this.db.collection('users')

        currentUser = () =>
            this.auth.currentUser;

        cuid = () =>
            this.auth.currentUser.uid

        userItems = (uid) => 
            this.db.collection('users').doc(uid).collection('items')
        //*Item API 

        item = uid =>
            this.db.doc(`items/${uid}`)
        
        items = () =>
            this.db.collection('items') //creates a Ref
        //use parenthsis, not curly quotes for returning

        itemChats = () => 
            this.db.collection('itemChats')
        
        getAuth = () =>
            this.auth

        getDb = () =>(
            this.db
        )
            
        serverTimestamp = () => 
            firebase.firestore.FieldValue.serverTimestamp()


        doAddItem = (item) => (
           this.db.collection('items').add(item)
        )

        doEditItem = (editItem, itemID) => { //editItem is an object {itenName: ,color: ,}
          
            this.db.collection('items').doc(itemID) //returns a promise tacken by .then()
                .set(editItem, {merge: true})
        }

        doDeleteItem = (itemID, userID) => {
            //delete from user, items, chats
            //delete from storage

            const itemRef = this.item(itemID)
            const userRef = this.user(userID)

            //need list of filenames from itemRef
            let imgRefs = []
            itemRef.get().then(doc=>{
                imgRefs = doc.data().imgRefs
            })
            .then(()=>{
                 //delete imgRefs from storage
                imgRefs.forEach(img => {
                this.storage.ref().child(`items/${itemID}/${img}`).delete().then(() => {
                    console.log("storage delete success")
                  }).catch((error) => {
                    console.log("storage delete fail", error)
                  });

                })
            })
            .then(()=>{
                this.updateArrayRemove(userRef, "userItems", itemID) //delete from users
                itemRef.delete() //delete from items
                this.db.collection('itemChats').doc(itemID).delete() //delete from chats
            })
        }

        doChangeListing = (itemID) => {

            this.db.collection('items').doc(itemID)
                .get()
                .then(doc => {
                    const data = doc.data()
                    const listStatus = !data.isListed

                    this.db.collection('items').doc(itemID)
                        .set({
                            isListed: listStatus
                        }, {merge: true})
                    
                })

            
                

        }

        /*Account API */

        getUserItems = () => {
           
        }

        //*** Merge Auth and DB User Api */

        onAuthUserListener = (next, fallback) => { //can this be turned into a promise?
            this.auth.onAuthStateChanged(authUser => { //onAuthStateChanged accepts a user
                if(authUser) { //user is signed in
                    const promise = this.user(authUser.uid).get() //returns Promise<QuerySnapshot>
                    
                    promise.then(snapshot => { //could also get rid of 'promise' and go directly to '.then'
                        const dbUser = snapshot.data()
                        console.log("roles", dbUser.roles)
                        //console.log({roles})

                        if(!dbUser.roles || dbUser.roles===undefined){
                            dbUser.roles= {}
                        }

                        //do you really need to merge? yes, because withAuthorization needs to find 'roles' in the authUser
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            ...dbUser
                        }
                        
                        //console.log(authUser)
                        //console.log(dbUser)
                        next(authUser) //OH this was outside 'if', which meant authUser was never passed to withAuthorization
                    })
                    
                } else { //user is not authenticated/authorized
                    fallback();
                }
            })
        }

        //*Get Current User */

        currentUser = () =>(
            this.auth.currentUser
        )  
        
        //Message API?

        messages = () => (
            this.db.collection("messages")
        )

        affiliated = (id) => (
            this.db.collection("users").doc(id).collection("affiliated")
        )

        rooms = () => (
            this.db.collection("rooms")
        )

        arrayUnion = (add) =>
            this.firestore.FieldValue.arrayUnion(add)

        docPath = () =>
            firebase.firestore.FieldPath.documentId()

        //takes in a string to search for 
        //and Algolia index's name
        doBasicSearch = (queryString, indexName) => {
            const index = client.initIndex(indexName)

            return(
                index.search(queryString)
            )
        }

  }

  export default Firebase

  
