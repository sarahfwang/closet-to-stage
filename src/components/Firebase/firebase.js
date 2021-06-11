import firebase from 'firebase/app'; //what's the diff btwn this and 'app'
import 'firebase/auth' //is this right? they used this.auth instead
import 'firebase/firestore'
import 'firebase/storage'




//console.log(process.env.REACT_APP_API_KEY) //restart local program to see env changes

const firebaseConfig = {
    apiKey: "AIzaSyAy54gs5VLLS1aCQ8gJzauIu8zAbMC_ELY",
    authDomain: "closet-to-stage-16bb6.firebaseapp.com",
    projectId: "closet-to-stage-16bb6",
    storageBucket: "closet-to-stage-16bb6.appspot.com",
    messagingSenderId: "601529027789",
    appId: "1:601529027789:web:13b1b73191e399be9bed84",
    measurementId: "G-H172SXJ9ZX"
  };
  
  class Firebase {
      constructor(){
        firebase.initializeApp(firebaseConfig) //app.init
        
        
        this.auth = firebase.auth() //app.auth()
        this.db = firebase.firestore() //app.database
        this.storage = firebase.storage()

        
        
      
       
      }
        storageRef = () => (
            this.storage.ref()
        )

        doAddImage = (name, file) => {
            return(
                this.storage.ref(`/images/${name}`).put(file)
            )
        }

        updatefbUrls = (value, ref) => {

            ref.update({
                fbUrls: firebase.firestore.FieldValue.arrayUnion(value)
            })
        }

        updateItemBuyers = (value, ref) => {
            //ref update only works if the doc exists

            console.log("in firebase.js value", value, "ref", ref)
            ref.get().then(doc=>{
                if(doc.exists) {
                    ref.update({buyers: firebase.firestore.FieldValue.arrayUnion(value)})
                }
                else{
                    ref.set({buyers: [value]})
                }
            })
            
            

        }

      //*** Auth API ***
        doCreateUserWithEmailAndPassword = (email, password) =>
          this.auth.createUserWithEmailAndPassword(email, password)
      
        doSignInWithEmailAndPassword =(email, password) =>
          this.auth.signInWithEmailAndPassword(email, password)
      
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
            
            //var itemKey = itemRef.key //ref can refer to a push(), but not push().set()
            //console.log("item key "+itemKey)

            //don't store in two locations 
            /*this.db.collection('users/' + uid +'/items').add({ 
                item,
            })  */
        )

        doEditItem = (editItem, itemID) => { //editItem is an object {itenName: ,color: ,}
          
            this.db.collection('items').doc(itemID) //returns a promise tacken by .then()
                .set(editItem, {merge: true})
        }

        doDeleteItem = (itemID) => {
            this.db.collection('items').doc(itemID).delete()

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
            
        
  }

  export default Firebase

  
