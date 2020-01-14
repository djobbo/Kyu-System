import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { getUsersQuery, addPlayerMutation, getPlayersQuery } from '../queries/queries';

class AddPlayer extends Component {
    constructor(props){
        super(props);
        this.state = {
            userID: '',
            bracket: ''
        };
    }
    displayUsers(){
        var data = this.props.getUsersQuery;
        if(data.loading){
            return( <option disabled>Loading users</option> );
        } else {
            return data.users.map(user => {
                return( <option key={ user.id } value={user.id}>{ user.name }</option> );
            });
        }
    }
    submitForm(e){
        e.preventDefault()
        // use the addBookMutation
        this.props.addPlayerMutation({
            variables: {
                userID: this.state.userID,
                bracket: this.state.bracket
            },
            refetchQueries: [{ query: getPlayersQuery }]
        });
    }
    render(){
        return(
            <form id="add-player" onSubmit={ this.submitForm.bind(this) } >
                <div className="field">
                    <label>Bracket:</label>
                    <input type="text" onChange={ (e) => this.setState({ bracket: e.target.value }) } />
                </div>
                <div className="field">
                    <label>User:</label>
                    <select onChange={ (e) => this.setState({ userID: e.target.value }) } >
                        <option>Select user</option>
                        { this.displayUsers() }
                    </select>
                </div>
                <button>+</button>
            </form>
        );
    }
}

export default compose(
    graphql(getUsersQuery, { name: "getUsersQuery" }),
    graphql(addPlayerMutation, { name: "addPlayerMutation" })
)(AddPlayer);