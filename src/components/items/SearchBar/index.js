import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
//REACT ROUTER STATES ARE PASSED TO LOCATION OHHHHHHHHHHHH. not the actual state.

import {withFirebase} from '../../firebase'

class SearchBar extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            search:"",
            hits:[],
            show: false,
        }

        console.log(this.state)

    }

    onChange = (e) => {
        this.setState({
            search: e.target.value
        }, console.log("search", this.state.search))
    }

    onSubmit = (e) => {
        const search = this.state.search

        this.props.history.push({
            pathname: '/women',
            search: `?search=${search}`
        })
       
        e.preventDefault()
    }

    render(){
        const {search, hits, show} = this.state
        return(
            show ? 
            <div>
                <Redirect to={{
                pathname: "/women",
                state: {hits},
                }}/>
                <form onSubmit={this.onSubmit}>
                        <input
                            type="search"
                            value = {search}
                            onChange = {this.onChange}
                            name="q"
                            placeholder="search"
                            aria-label="search for an item here"
                            spellCheck="true"
                        />
                </form>
            </div>
            :

            <form onSubmit={this.onSubmit}>
                    <input
                        type="search"
                        value = {search}
                        onChange = {this.onChange}
                        name="q"
                        placeholder="search"
                        aria-label="search for an item here"
                        spellCheck="true"
                    />
            </form>

        )
    }
}

export default withFirebase(SearchBar)