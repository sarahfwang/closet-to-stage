import React, {useState, useEffect} from 'react'
import queryString from 'query-string'

import {withFirebase} from '../../firebase' 
import ItemPageLayout from '../../layouts/ItemPageLayout'

import "./item-page.scss"

//keeps all info on items
const ItemPage = (props) => {
    const [items, setItems] = useState([])
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState("false")
    const [parsed, setParsed] = useState(props.location)


    useEffect(() => { //going to set the objects based on the URL
        const location = props.location
        let promises = []
        let temp = items
        console.log("temp", temp)

        console.log("search", location.search)


        if(location.search != ""){
            console.log("if")
            const parsed = queryString.parse(location.search, {arrayFormat: 'comma'})
            

            //define an array of items out here

            //for each category in the query object
            //cat: string, category
            //value: string or array, details of category
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

                                if(found){ //is it saying that if it was found from previous list, add it in?? think so
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

                                if(found){ 
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