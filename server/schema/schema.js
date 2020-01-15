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
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        discordID: { type: GraphQLString },
        players: {
            type: GraphQLList(PlayerType),
            resolve: (parent, args) =>
                Player.find({ userID: parent.id })
        }
    })
});

const PlayerType = new GraphQLObjectType({
    name: 'Player',
    fields: () => ({
        id: { type: GraphQLID },
        userID: { type: GraphQLString },
        bracket: { type: GraphQLString },
        user: {
            type: UserType,
            resolve: (parent, args) =>
                User.findById(parent.userID)
        },
        queues: {
            type: GraphQLList(QueueType),
            resolve: (parent, args) =>
                Player.find({ playerID: parent.id })
        },
        teams: {
            type: GraphQLList(TeamType),
            resolve: (parent, args) =>
                Team.find({ playerIDs: parent.id })
        }
    })
});

const QueueType = new GraphQLObjectType({
    name: 'Queue',
    fields: () => ({
        id: { type: GraphQLID },
        playerID: { type: GraphQLString },
        bracket: { type: GraphQLString },
        state: { type: GraphQLString },
        matchID: { type: GraphQLString },
        player: {
            type: PlayerType,
            resolve: (parent, args) =>
                Player.findById(parent.playerID)
        },
        match: {
            type: PlayerType,
            resolve: (parent, args) =>
                Player.findById(parent.matchID)
        },
    })
});

const TeamType = new GraphQLObjectType({
    name: 'Team',
    fields: () => ({
        id: { type: GraphQLID },
        playerIDs: { type: GraphQLList(GraphQLString) },
        bracket: { type: GraphQLString },
        players: {
            type: GraphQLList(PlayerType),
            resolve: (parent, args) =>
                Player.find({ '_id': { $in: parent.playerIDs } })
        },
        matches: {
            type: GraphQLList(MatchType),
            resolve: (parent, args) =>
                Match.find({ teamIDs: parent.id })
        }
    })
});

const MatchType = new GraphQLObjectType({
    name: 'Match',
    fields: () => ({
        id: { type: GraphQLID },
        teamIDs: { type: GraphQLList(GraphQLString) },
        bracket: { type: GraphQLString },
        state: { type: GraphQLString },
        score: { type: GraphQLString },
        teams: {
            type: GraphQLList(TeamType),
            resolve: (parent, args) =>
                Team.find({ '_id': { $in: parent.teamIDs } })
        },
        queues: {
            type: GraphQLList(QueueType),
            resolve: (parent, args) =>
                Queue.find({ matchID: parent.id })
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) =>
                User.findById(args.id)
        },
        users: {
            type: GraphQLList(UserType),
            resolve: (parent, args) =>
                User.find({})
        },
        userViaDiscord: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) =>
                User.findOne({ discordID: args.id })
        },
        player: {
            type: PlayerType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) =>
                Player.findById(args.id)
        },
        players: {
            type: GraphQLList(PlayerType),
            resolve: (parent, args) =>
                Player.find({})
        },
        queue: {
            type: QueueType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) =>
                Queue.findById(args.id)
        },
        queues: {
            type: GraphQLList(QueueType),
            resolve: (parent, args) =>
                Queue.find({})
        },
        team: {
            type: TeamType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) =>
                Team.findById(args.id)
        },
        teams: {
            type: GraphQLList(TeamType),
            resolve: (parent, args) =>
                Team.find({})
        },
        match: {
            type: MatchType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) =>
                Match.findById(args.id)
        },
        matchs: {
            type: GraphQLList(MatchType),
            resolve: (parent, args) =>
                Match.find({})
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
            resolve: (parent, args) =>
                new User({
                    name: args.name,
                    discordID: args.discordID
                }).save()
        },
        addPlayer: {
            type: PlayerType,
            args: {
                userID: { type: GraphQLNonNull(GraphQLID) },
                bracket: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) =>
                Player.findOne({ userID: args.userID, bracket: args.bracket })
                    .then(player => {
                        return player ?
                            player :
                            new Player({
                                userID: args.userID,
                                bracket: args.bracket
                            }).save()
                    })
                    .catch(console.error)
        },
        addQueue: {
            type: QueueType,
            args: {
                playerID: { type: GraphQLNonNull(GraphQLID) },
                bracket: { type: GraphQLNonNull(GraphQLString) },
                state: { type: GraphQLNonNull(GraphQLString) },
                matchID: { type: GraphQLString }
            },
            resolve: (parent, args) => new Queue({
                playerID: args.playerID,
                bracket: args.bracket,
                state: args.state,
                matchID: args.matchID
            }).save()
        },
        addTeam: {
            type: TeamType,
            args: {
                playerIDs: { type: GraphQLNonNull(GraphQLList(GraphQLID)) },
                bracket: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) =>
                Team.findOne({ playerIDs: args.playerIDs, bracket: args.bracket })
                    .then(team => {
                        return team ?
                            team :
                            new Team({
                                playerIDs: args.playerIDs,
                                bracket: args.bracket
                            }).save();
                    })
                    .catch(console.error)
        },
        addMatch: {
            type: MatchType,
            args: {
                teamIDs: { type: GraphQLNonNull(GraphQLList(GraphQLID)) },
                bracket: { type: GraphQLNonNull(GraphQLString) },
                states: { type: GraphQLNonNull(GraphQLString) },
                score: { type: GraphQLString }
            },
            resolve: (parent, args) =>
                new Match({
                    teamIDs: args.teamIDs,
                    bracket: args.bracket,
                    states: args.states,
                    score: args.score
                }).save()
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});