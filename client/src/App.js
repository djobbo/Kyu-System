import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// components
import PlayerList from './components/PlayerList';
import AddPlayer from './components/AddPlayer';

// apollo client setup
const client = new ApolloClient({
    uri: 'https://4000-d42759f6-c99b-4ce6-b178-b2091fb9df1f.ws-eu01.gitpod.io/graphql'
});

class App extends Component {
  render() {
    return (
        <ApolloProvider client={client}>
            <div id="main">
                <h1>Elite FR - Joueurs</h1>
                <PlayerList />
                <AddPlayer />
            </div>
        </ApolloProvider>
    );
  }
}

export default App;