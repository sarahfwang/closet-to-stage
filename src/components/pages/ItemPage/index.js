import React from 'react'

import {withFirebase} from '../../firebase' 
import ItemPageLayout from '../../layouts/ItemPageLayout'

import ItemCard from '../../items/ItemCard'
import { mapProps, renderComponent } from 'recompose'

import "./item-page.scss"
import TestFilter from '../TestFilter'



class ItemPage extends React.Component{
    constructor(props){
        super(props)

        this.state = {
           items:[],
           filtered:[],
           loading:"false",
        }
    }

    handleFilterResultsChange = (filtered) =>{
        this.setState({filtered})
    }

    handleRoute = (id) => {

        this.props.history.push(`/item-page/${id}`)
    }
   

    componentDidMount= () => {
        
        this.props.firebase.items()
            .where('isListed', '==', true)
            .get()
            .then(snapshot => {
                let tempList = [] 

                snapshot.forEach(doc => {
                    tempList.push({id: doc.id, ...doc.data()})
                })

                this.setState({
                    items: tempList,
                    filtered: tempList,
                })

            })  
            
    }

    //cat is spec
    
    render(){
        const {items, filtered} = this.state
        return(
            <ItemPageLayout items = {items} filtered = {filtered} handleFilterResultsChange = {this.handleFilterResultsChange} handleRoute = {this.handleRoute}/>
            
        )
    }
    
}
export default withFirebase(ItemPage)