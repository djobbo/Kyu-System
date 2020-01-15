const graphql = require('graphql');

const User = require('../models/User');
const Player = require('../models/Player');
const Queue = require('../models/Queue');
const Team = require('../models/Team');
const Match = require('../models/Match');

const eloSystem = require('../util/elo-system');

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
            resolve: (root, args) =>
                Player.find({ userID: root.id })
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
            resolve: (root, args) =>
                User.findById(root.userID)
        },
        queues: {
            type: GraphQLList(QueueType),
            resolve: (root, args) =>
                Player.find({ playerID: root.id })
        },
        teams: {
            type: GraphQLList(TeamType),
            resolve: (root, args) =>
                Team.find({ playerIDs: root.id })
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
            resolve: (root, args) =>
                Player.findById(root.playerID)
        },
        match: {
            type: PlayerType,
            resolve: (root, args) =>
                Player.findById(root.matchID)
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
            resolve: (root, args) =>
                Player.find({ '_id': { $in: root.playerIDs } })
        },
        matches: {
            type: GraphQLList(MatchType),
            resolve: (root, args) =>
                Match.find({ teamIDs: root.id })
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
            resolve: (root, args) =>
                Team.find({ '_id': { $in: root.teamIDs } })
        },
        queues: {
            type: GraphQLList(QueueType),
            resolve: (root, args) =>
                Queue.find({ matchID: root.id })
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve: (root, args) =>
                User.findById(args.id)
        },
        users: {
            type: GraphQLList(UserType),
            resolve: (root, args) =>
                User.find({})
        },
        userViaDiscord: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve: (root, args) =>
                User.findOne({ discordID: args.id })
        },
        player: {
            type: PlayerType,
            args: { id: { type: GraphQLID } },
            resolve: (root, args) =>
                Player.findById(args.id)
        },
        players: {
            type: GraphQLList(PlayerType),
            resolve: (root, args) =>
                Player.find({})
        },
        queue: {
            type: QueueType,
            args: { id: { type: GraphQLID } },
            resolve: (root, args) =>
                Queue.findById(args.id)
        },
        queues: {
            type: GraphQLList(QueueType),
            resolve: (root, args) =>
                Queue.find({})
        },
        team: {
            type: TeamType,
            args: { id: { type: GraphQLID } },
            resolve: (root, args) =>
                Team.findById(args.id)
        },
        teams: {
            type: GraphQLList(TeamType),
            resolve: (root, args) =>
                Team.find({})
        },
        match: {
            type: MatchType,
            args: { id: { type: GraphQLID } },
            resolve: (root, args) =>
                Match.findById(args.id)
        },
        matchs: {
            type: GraphQLList(MatchType),
            resolve: (root, args) =>
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
            resolve: (root, args) =>
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
            resolve: (root, args) =>
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
            resolve: (root, args) => new Queue({
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
            resolve: (root, args) =>
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
            resolve: (root, args) =>
                new Match({
                    teamIDs: args.teamIDs,
                    bracket: args.bracket,
                    states: args.states,
                    score: args.score
                }).save()
        },
        setMatchResult: {
            type: MatchType,
            args: {
                matchID: { type: GraphQLNonNull(GraphQLID) },
                score: { type: GraphQLString }
            },
            resolve: (root, args) =>
                Match.findById(args.matchID).then(match => {
                    if (!match) return null;
                    else {
                        const promises = [];
                        Team.find({ _id: { $in: match.teamIDs } })
                            .then(teams => {
                                const playerPromises = [];
                                teams.forEach(team => {
                                    playerPromises.push(
                                        Player.find({ _id: { $in: team.playerIDs } })
                                    )
                                })
                                Promise.all(playerPromises).then(players => {
                                    console.log(players);
                                })
                            })
                            .catch(console.error);
                    }
                })
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});