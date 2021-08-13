import React from 'react'
import {Link} from 'react-router-dom'

import {withFirebase} from '../../firebase' 
import ItemPageLayout from '../../layouts/ItemPageLayout'

import "./item-page.scss"


class ItemPage extends React.Component{
    constructor(props){
        super(props)

        this.state = {
           items:[],
           filtered:[],
           loading:"false",
        }

        console.log("itemPage state", this.state)
        console.log("itemPage loc", this.props.location)
    }

    handleFilterResultsChange = (filtered) =>{
        this.setState({filtered})
    }

    handleRoute = (id) => {
        this.props.history.push(`/item-page/${id}`)
    }
   

    componentDidMount= () => {
        const hits = this.props.location.hits
        console.log("compodidmount", hits)

        this.props.firebase.items()
            .where('isListed', '==', true)
            .get()
            .then(snapshot => {
                let tempList = [] 

                snapshot.forEach(doc => {
                    tempList.push({id: doc.id, ...doc.data()})
                })

                if(hits){
                    this.setState({
                        items: tempList,
                        filtered: hits,
                    })}
                else{
                    this.setState({
                        items: tempList,
                        filtered: tempList,
                    })}
        })  
            
    }

    //cat is spec
    
    render(){
        const {items, filtered} = this.state
        return(
            <ItemPageLayout items = {items} filtered = {filtered} handleFilterResultsChange = {this.handleFilterResultsChange} handleRoute = {this.handleRoute} loc={this.props.location}/>
            
        )
    }
    
}
export default withFirebase(ItemPage)