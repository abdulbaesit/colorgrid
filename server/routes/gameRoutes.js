import express from 'express';
import Game from '../models/Game.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get game history for user
router.get('/history', protect, async (req, res) => {
    try {
        const games = await Game.find({
            $or: [{ player1: req.user._id }, { player2: req.user._id }]
        })
            .populate('player1', 'username profilePicture')
            .populate('player2', 'username profilePicture')
            .populate('winner', 'username')
            .sort({ createdAt: -1 });

        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get specific game
router.get('/:id', protect, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id)
            .populate('player1', 'username profilePicture')
            .populate('player2', 'username profilePicture')
            .populate('winner', 'username');

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Check if user is part of the game
        if (game.player1._id.toString() !== req.user._id.toString() &&
            game.player2._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(game);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new game (for matchmaking)
router.post('/matchmaking', protect, async (req, res) => {
    try {
        // Check if user already has an active game
        const activeGame = await Game.findOne({
            $or: [{ player1: req.user._id }, { player2: req.user._id }],
            status: { $in: ['waiting', 'in_progress'] }
        });

        if (activeGame) {
            return res.json({
                gameId: activeGame._id,
                status: activeGame.status
            });
        }

        // Create new waiting game
        const game = await Game.create({
            player1: req.user._id,
            status: 'waiting'
        });

        res.status(201).json({
            gameId: game._id,
            status: 'waiting'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel matchmaking
router.post('/:id/cancel', protect, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Check if user is player1 and game is still waiting
        if (game.player1.toString() !== req.user._id.toString() || game.status !== 'waiting') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await game.remove();
        res.json({ message: 'Game cancelled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Forfeit game
router.post('/:id/forfeit', protect, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id)
            .populate('player1', 'username coins')
            .populate('player2', 'username coins');

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Check if user is part of the game and game is in progress
        if ((game.player1._id.toString() !== req.user._id.toString() &&
            game.player2._id.toString() !== req.user._id.toString()) ||
            game.status !== 'in_progress') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Determine winner
        const isPlayer1 = game.player1._id.toString() === req.user._id.toString();
        const winner = isPlayer1 ? game.player2 : game.player1;
        const loser = isPlayer1 ? game.player1 : game.player2;

        // Update game
        game.status = 'completed';
        game.winner = winner._id;
        game.result = isPlayer1 ? 'player2_win' : 'player1_win';
        await game.save();

        // Update player stats and coins
        if (loser.coins >= 200) {
            loser.coins -= 200;
            winner.coins += 200;
        }
        loser.stats.losses += 1;
        winner.stats.wins += 1;
        await loser.save();
        await winner.save();

        res.json({
            message: 'Game forfeited',
            winner: winner.username,
            loser: loser.username
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
