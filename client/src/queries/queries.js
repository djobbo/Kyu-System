import { gql } from 'apollo-boost';

const getUsersQuery = gql`
    {
        users {
            id
            name
        }
    }
`;

const getPlayersQuery = gql`
    {
        players {
            id
            userID
            bracket
        }
    }
`;

const addPlayerMutation = gql`
    mutation AddPlayer($userID: ID!, $bracket: String!){
        addPlayer(userID: $userID, bracket: $bracket){
            id
            userID
            bracket
        }
    }
`;

const getPlayerQuery = gql`
    query GetPlayer($id: ID){
        player(id: $id) {
            id
            userID
            bracket
            user {
                id
                name
                discordID
                players {
                    id
                    bracket
                }
            }
        }
    }
`;

export { getUsersQuery, getPlayersQuery, addPlayerMutation, getPlayerQuery };