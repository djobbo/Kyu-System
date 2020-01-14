import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getPlayerQuery } from '../queries/queries';

class PlayerDetails extends Component {
    displayPlayerDetails(){
        const { player } = this.props.data;
        if(player){
            return(
                <div>
                    <h2>{ player.user.name }</h2>
                    <p>{ player.bracket }</p>
                    <p>All brackets this user has entered</p>
                    <ul className="other-players">
                        { player.user.players.map(item => {
                            return <li key={item.id}>{ item.bracket }</li>
                        })}
                    </ul>
                </div>
            );
        } else {
            return( <div>No player selected...</div> );
        }
    }
    render(){
        return(
            <div id="player-details">
                { this.displayPlayerDetails() }
            </div>
        );
    }
}

export default graphql(getPlayerQuery, {
    options: (props) => {
        return {
            variables: {
                id: props.userID
            }
        }
    }
})(PlayerDetails);