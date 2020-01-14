import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getPlayersQuery } from '../queries/queries';

// components
import PlayerDetails from './PlayerDetails';

class PlayerList extends Component {
    constructor(props){
        super(props);
        this.state = {
            selected: null
        }
    }
    displayPlayers(){
        var data = this.props.data;
        console.log(data);
        if(data.loading){
            return( <div>Loading players...</div> );
        } else {
            return data.players.map(player => {
                return(
                    <li key={ player.id } onClick={ (e) => this.setState({ selected: player.id }) }>{ player.userID } - { player.bracket }</li>
                );
            })
        }
    }
    render(){
        return(
            <div>
                <ul id="user-list">
                    { this.displayPlayers() }
                </ul>
                <PlayerDetails userID={ this.state.selected } />
            </div>
        );
    }
}

export default graphql(getPlayersQuery)(PlayerList);