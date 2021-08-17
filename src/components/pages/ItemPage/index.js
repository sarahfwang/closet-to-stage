import React, {useState, useEffect} from 'react'
import queryString from 'query-string'

import {withFirebase} from '../../firebase' 
import ItemPageLayout from '../../layouts/ItemPageLayout'

import "./item-page.scss"


const ItemPage = (props) => {
    const [items, setItems] = useState([])
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState("false")


    useEffect(() => { //going to set the objects based on the URL
        const location = props.location
        let promises = []
        let temp = items
        console.log("temp", temp)

        // console.log("itemPage loc", location)

        console.log("search", location.search)


        if(location.search != ""){
            //wanna do something
            //then pass hits onto another search?

            console.log("if")
            const parsed = queryString.parse(location.search, {arrayFormat: 'comma'})

            //define an array of items out here

            //for each category in the query object
            Object.entries(parsed).forEach(([cat, value])=> {
                let itemList = []

                console.log(cat, value)

                //if value is an array
                if(Array.isArray(value)){
                    let promise = props.firebase.items().where(cat, 'in', value)
                    .get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            if(doc.data().isListed){
                                const found = temp.some(il => il.id === doc.id)

                                if(found){ //why found instead of !found?
                                    itemList.push({id: doc.id, ...doc.data()})
                                }
                            }
                        })
                    })
                    .then(()=>{
                        temp = itemList
                    })
                    
                    promises.push(promise)
                }
                else{ //the value is a single string
                    console.log("single obj")
                    let promise = props.firebase.items().where(cat, '==', value)
                    .get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            if(doc.data().isListed){
                                const found = temp.some(il => il.id === doc.id)

                                if(found){ //why found instead of !found?
                                    itemList.push({id: doc.id, ...doc.data()})
                                }
                            }
                        })
                    })
                    .then(()=>{
                        temp = itemList
                    })

                    promises.push(promise)

                }
            })

            Promise.all(promises).then(()=> {
                setFiltered(temp)
                console.log("filtered", filtered)
                console.log("temp", temp)
            })






            // console.log("parsed", parsed)
            // const searchString = parsed.q
            // console.log("searchString", searchString)
            // console.log("location", location)

            // props.firebase.doBasicSearch(searchString, "items").then(({hits})=> {
            //     console.log(hits)
            //     setItems(hits)
            //     setFiltered(hits)
            // })

        }
        else{
            console.log("else")

            let tempList = []

            props.firebase.items()
            .where('isListed', '==', true)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    tempList.push({id: doc.id, ...doc.data()})
                })
            }) 
            .then(()=>{
                setItems(tempList)
                setFiltered(tempList)
            }) 
        }
    }, [props.location])
    

    const handleFilterResultsChange = (filtered) =>{
        setFiltered(filtered)
    }

    //route is a string
    const handleRoute = (route) => {
        props.history.push(route)
    }
   
    //cat is spec
       
    return(
        <ItemPageLayout items = {items} filtered = {filtered} handleFilterResultsChange = {handleFilterResultsChange} handleRoute = {handleRoute} location={props.location}/>
        
    )
    
    
}
export default withFirebase(ItemPage)