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


    useEffect(() => { //going to set the objects based on the URL
        const location = props.location
        console.log("search", location.search)

        let temp = []
        let promises = []

        //fixed this logic: DONE
        if(location.search != ""){//if there is an query object
            const parsed = queryString.parse(location.search, {arrayFormat: 'comma'})

            //for each category in the query object
            //cat: string, category: type
            //value: string or array, details of category: [shoe, dress]
            Object.entries(parsed).forEach(([cat, value])=> {
                let itemList = []
                console.log(cat, value)

                //if value is an array
                if(Array.isArray(value)){
                    if(temp.length){ //if temp is empty, say on the first cat
                        console.log("first cat")
                        let promise = props.firebase.items().where(cat, 'in', value)
                        .get()
                        .then(snapshot => {
                            snapshot.forEach(doc => {
                                if(doc.data().isListed){
                                    itemList.push({id: doc.id, ...doc.data()})
                                }
                            })
                        })
                        .then(()=>{
                            temp = itemList
                        })
                        promises.push(promise)
                    }
                    else{
                        console.log("1< cat")
                        let promise = props.firebase.items().where(cat, 'in', value)
                        .get()
                        .then(snapshot => {
                            snapshot.forEach(doc => {
                                if(doc.data().isListed){
                                    /* const found = temp.some(il => il.id === doc.id)//problem is temp is empty if you just load it in
                                    if(found){ //is it saying that if it was found from previous list, add it in?? think so
                                        //I think it prevents from 
                                        itemList.push({id: doc.id, ...doc.data()})
                                    } */

                                    //TODO: ERROR IN FILTER
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
                }
                else{ //the value is a single string
                    console.log("single obj")
                    let promise = props.firebase.items().where(cat, '==', value)
                    .get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            if(doc.data().isListed){
                                /* const found = temp.some(il => il.id === doc.id)

                                if(found){ 
                                    itemList.push({id: doc.id, ...doc.data()})
                                } */

                                itemList.push({id: doc.id, ...doc.data()})
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
        else{ //show all items that exist
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
        <ItemPageLayout 
            items = {items} 
            filtered = {filtered} 
            handleFilterResultsChange = {handleFilterResultsChange} 
            handleRoute = {handleRoute} 
            location={props.location}
        />
    ) 
}
export default withFirebase(ItemPage)