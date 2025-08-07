import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    player1Color: {
        type: String,
        required: true
    },
    player2Color: {
        type: String,
        required: true
    },
    grid: {
        type: [[String]],
        default: Array(5).fill(Array(5).fill(''))
    },
    currentTurn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['waiting', 'in_progress', 'completed'],
        default: 'waiting'
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    result: {
        type: String,
        enum: ['player1_win', 'player2_win', 'draw', 'forfeit', 'in_progress'],
        default: 'in_progress'
    },
    forfeit: {
        type: Boolean,
        default: false
    },
    forfeiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    moves: [{
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        row: Number,
        col: Number,
        color: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model('Game', gameSchema);
