import React, {useState, useEffect} from 'react'
import queryString from 'query-string'

import {withFirebase} from '../../firebase' 
import ItemPageLayout from '../../layouts/ItemPageLayout'

import "./item-page.scss"


const ItemPage = (props) => {
    const [items, setItems] = useState()
    const [filtered, setFiltered] = useState()
    const [loading, setLoading] = useState("false")


    useEffect(() => {
        const location = props.location

        console.log("itemPage loc", location)

        console.log("search", location.search)


        if(location.search != ""){
            console.log("if")
            const parsed = queryString.parse(location.search)
            const searchString = parsed.q

            props.firebase.doBasicSearch(searchString, "items").then(({hits})=> {
                setItems(hits)
                setFiltered(hits)
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
        this.setState({filtered})
    }

    const handleRoute = (id) => {
        props.history.push(`/item-page/${id}`)
    }
   
    //cat is spec
       
    return(
        <ItemPageLayout items = {items} filtered = {filtered} handleFilterResultsChange = {handleFilterResultsChange} handleRoute = {handleRoute} loc={props.location}/>
        
    )
    
    
}
export default withFirebase(ItemPage)