const graphql = require('graphql');

const User = require('../models/User');
const Player = require('../models/Player');
const Queue = require('../models/Queue');
const Team = require('../models/Team');
const Match = require('../models/Match');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        discordID: { type: GraphQLString },
        players: {
            type: GraphQLList(PlayerType),
            resolve(parent, args){
                return Player.find({ userID: parent.id });
            }
        }
    })
});

const PlayerType = new GraphQLObjectType({
    name: 'Player',
    fields: ( ) => ({
        id: { type: GraphQLID },
        userID: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args){
                return User.findById(parent.userID);
            }
        },
        queues: {
            type: GraphQLList(QueueType),
            resolve(parent, args){
                return Player.find({ playerID: parent.id });
            }
        },
        teams: {
            type: GraphQLList(TeamType),
            resolve(parent, args){
                return Team.find({ playerIDs: parent.id });
            }
        }
    })
});

const QueueType = new GraphQLObjectType({
    name: 'Queue',
    fields: ( ) => ({
        id: { type: GraphQLID },
        playerID: { type: GraphQLString },
        bracket: { type: GraphQLString },
        state: { type: GraphQLString },
        matchID: { type: GraphQLString },
        player: {
            type: PlayerType,
            resolve(parent, args){
                return Player.findById(parent.playerID);
            }
        },
        match: {
            type: PlayerType,
            resolve(parent, args){
                return Player.findById(parent.matchID);
            }
        },
    })
});

const TeamType = new GraphQLObjectType({
    name: 'Team',
    fields: ( ) => ({
        id: { type: GraphQLID },
        playerIDs: { type: GraphQLList(GraphQLString) },
        bracket: { type: GraphQLString },
        players: {
            type: GraphQLList(PlayerType),
            resolve(parent, args){
                return Player.find({ '_id': { $in: parent.playerIDs }});
            }
        },
        matches: {
            type: GraphQLList(MatchType),
            resolve(parent, args){
                return Match.find({ teamIDs: parent.id });
            }
        }
    })
});

const MatchType = new GraphQLObjectType({
    name: 'Match',
    fields: ( ) => ({
        id: { type: GraphQLID },
        teamIDs: { type: GraphQLList(GraphQLString) },
        bracket: { type: GraphQLString },
        state: { type: GraphQLString },
        score: { type: GraphQLString },
        teams: {
            type: GraphQLList(TeamType),
            resolve(parent, args){
                return Team.find({ '_id': { $in: parent.teamIDs }});
            }
        },
        queues: {
            type: GraphQLList(QueueType),
            resolve(parent, args){
                return Queue.find({ matchID: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return User.findById(args.id);
            }
        },
        users: {
            type: GraphQLList(UserType),
            resolve(parent, args){
                return User.find({});
            }
        },
        userViaDiscord: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return User.findOne({ discordID: args.id });
            }
        },
        player: {
            type: PlayerType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Player.findById(args.id);
            }
        },
        players: {
            type: GraphQLList(PlayerType),
            resolve(parent, args){
                return Player.find({});
            }
        },
        queue: {
            type: QueueType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Queue.findById(args.id);
            }
        },
        queues: {
            type: GraphQLList(QueueType),
            resolve(parent, args){
                return Queue.find({});
            }
        },
        team: {
            type: TeamType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Team.findById(args.id);
            }
        },
        teams: {
            type: GraphQLList(TeamType),
            resolve(parent, args){
                return Team.find({});
            }
        },
        match: {
            type: MatchType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Match.findById(args.id);
            }
        },
        matchs: {
            type: GraphQLList(MatchType),
            resolve(parent, args){
                return Match.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                discordID: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                let user = new User({
                    name: args.name,
                    discordID: args.discordID
                });
                return user.save();
            }
        },
        addPlayer: {
            type: PlayerType,
            args: {
                userID: { type: GraphQLNonNull(GraphQLString) },
                bracket: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                let player = new Player({
                    userID: args.userID,
                    bracket: args.bracket
                });
                return player.save();
            }
        },
        addQueue: {
            type: QueueType,
            args: {
                playerID: { type: GraphQLNonNull(GraphQLString) },
                bracket: { type: GraphQLNonNull(GraphQLString) },
                state: { type: GraphQLNonNull(GraphQLString) },
                matchID: { type: GraphQLString }
            },
            resolve(parent, args){
                let queue = new Queue({
                    playerID: args.playerID,
                    bracket: args.bracket,
                    state: args.state,
                    matchID: args.matchID
                });
                return queue.save();
            }
        },
        addTeam: {
            type: TeamType,
            args: {
                playerIDs: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
                bracket: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                let queue = new Queue({
                    playerIDs: args.playerIDs,
                    bracket: args.bracket
                });
                return queue.save();
            }
        },
        addMatch: {
            type: MatchType,
            args: {
                teamIDs: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
                bracket: { type: GraphQLNonNull(GraphQLString) },
                states: { type: GraphQLNonNull(GraphQLString) },
                score: { type: GraphQLString }
            },
            resolve(parent, args){
                let match = new Match({
                    teamIDs: args.teamIDs,
                    bracket: args.bracket,
                    states: args.states,
                    score: args.score
                });
                return match.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});