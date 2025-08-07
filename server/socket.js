import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Game from './models/Game.js';
import { maxAreaOfIsland } from './utils/maxAreaOfIsland.js';

// Game state management
const waitingPlayers = new Map();
const activeGames = new Map();

// Helper function to convert grid to binary for maxAreaOfIsland
function convertGridToBinary(grid, color) {
    return grid.map(row =>
        row.map(cell => cell === color ? 1 : 0)
    );
}

// Helper function to calculate area
function calculateArea(grid, color) {
    let area = 0;
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));

    function dfs(row, col) {
        if (row < 0 || row >= rows || col < 0 || col >= cols ||
            visited[row][col] || grid[row][col] !== color) {
            return;
        }

        visited[row][col] = true;
        area++;

        dfs(row + 1, col);
        dfs(row - 1, col);
        dfs(row, col + 1);
        dfs(row, col - 1);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!visited[i][j] && grid[i][j] === color) {
                dfs(i, j);
            }
        }
    }

    return area;
}

export const handleSocketConnection = (io, socket) => {
    // Join waiting room
    socket.on('find_match', async () => {
        console.log('Player looking for match:', socket.user.username, 'Socket ID:', socket.id);

        // Check if player is already in a game
        if (waitingPlayers.has(socket.user._id.toString())) {
            console.log('Player already in matchmaking:', socket.user.username);
            return;
        }

        // Add player to waiting list
        waitingPlayers.set(socket.user._id.toString(), socket.id);
        socket.join('waiting');
        console.log('Players waiting:', waitingPlayers.size);
        console.log('Current waiting players:', Array.from(waitingPlayers.entries()).map(([id, socketId]) => id));

        // Check for match
        if (waitingPlayers.size >= 2) {
            console.log('Found enough players for a match');
            const players = Array.from(waitingPlayers.entries());
            const [player1, player2] = players.slice(0, 2);
            console.log('Matching players:', player1[0], 'and', player2[0]);

            try {
                // Available colors for the game
                const colors = [
                    'red',
                    'blue',
                    'green',
                    'purple',
                    'orange',
                    'pink',
                    'teal',
                    'yellow'
                ];

                // Improved random color selection using Fisher-Yates shuffle
                const shuffledColors = [...colors];
                for (let i = shuffledColors.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]];
                }
                const player1Color = shuffledColors[0];
                const player2Color = shuffledColors[1];

                // Create new game
                const game = new Game({
                    player1: player1[0],
                    player2: player2[0],
                    player1Color,
                    player2Color,
                    currentTurn: player1[0],
                    status: 'in_progress',
                    grid: Array(5).fill().map(() => Array(5).fill(''))
                });

                await game.save();
                console.log('Created new game:', game._id);

                // Store game state
                activeGames.set(game._id.toString(), {
                    game,
                    sockets: [player1[1], player2[1]]
                });

                // Remove players from waiting
                waitingPlayers.delete(player1[0]);
                waitingPlayers.delete(player2[0]);

                // Get player details
                const player1Details = await User.findById(player1[0]).select('username profilePicture');
                const player2Details = await User.findById(player2[0]).select('username profilePicture');

                // Join game room
                io.sockets.sockets.get(player1[1])?.join(game._id.toString());
                io.sockets.sockets.get(player2[1])?.join(game._id.toString());

                console.log('Notifying players about match');
                // Notify players
                io.to(player1[1]).emit('match_found', {
                    gameId: game._id,
                    opponent: player2Details,
                    color: player1Color
                });

                io.to(player2[1]).emit('match_found', {
                    gameId: game._id,
                    opponent: player1Details,
                    color: player2Color
                });

                // Start game after a short delay
                setTimeout(() => {
                    console.log('Starting game:', game._id);
                    io.to(game._id.toString()).emit('game_start', {
                        gameId: game._id,
                        grid: game.grid,
                        currentTurn: game.player1,
                        player1Color,
                        player2Color
                    });
                }, 2000);
            } catch (error) {
                console.error('Error creating game:', error);
                // Clean up waiting players
                waitingPlayers.delete(player1[0]);
                waitingPlayers.delete(player2[0]);
            }
        }
    });

    // Join game room
    socket.on('join_game', (gameId) => {
        console.log('Player joining game:', socket.user.username, 'Game ID:', gameId);
        socket.join(gameId);
    });

    // Make move
    socket.on('make_move', async ({ gameId, row, col }) => {
        console.log('Move received:', { gameId, row, col, player: socket.user.username });

        const gameState = activeGames.get(gameId);
        if (!gameState) {
            console.log('Game state not found for game:', gameId);
            return;
        }

        const { game, sockets } = gameState;

        // Validate move
        if (game.currentTurn.toString() !== socket.user._id.toString()) {
            console.log('Not player\'s turn:', socket.user.username);
            return;
        }

        if (row < 0 || row >= game.grid.length || col < 0 || col >= game.grid[0].length) {
            console.log('Invalid grid position:', { row, col });
            return;
        }

        if (game.grid[row][col] !== '') {
            console.log('Cell already filled:', { row, col });
            return;
        }

        // Update grid
        const playerColor = game.player1.toString() === socket.user._id.toString()
            ? game.player1Color
            : game.player2Color;

        // Create a new grid array to ensure reactivity
        const newGrid = game.grid.map(row => [...row]);
        newGrid[row][col] = playerColor;
        game.grid = newGrid;

        // Switch turn
        game.currentTurn = game.player1.toString() === socket.user._id.toString()
            ? game.player2
            : game.player1;

        // Save move
        game.moves.push({
            player: socket.user._id,
            row,
            col,
            color: playerColor
        });

        await game.save();
        console.log('Move saved:', { row, col, color: playerColor });

        // Update game state in activeGames
        activeGames.set(gameId, { game, sockets });

        // Check if game is over
        const isFull = game.grid.every(row => row.every(cell => cell !== ''));
        if (isFull) {
            console.log('Game is full, calculating winner...');

            // Convert grids to binary for maxAreaOfIsland
            const player1BinaryGrid = convertGridToBinary(game.grid, game.player1Color);
            const player2BinaryGrid = convertGridToBinary(game.grid, game.player2Color);

            // Calculate max areas using the utility
            const player1Area = maxAreaOfIsland(player1BinaryGrid);
            const player2Area = maxAreaOfIsland(player2BinaryGrid);

            console.log('Game end - Areas calculated:', {
                player1: {
                    id: game.player1,
                    color: game.player1Color,
                    area: player1Area
                },
                player2: {
                    id: game.player2,
                    color: game.player2Color,
                    area: player2Area
                }
            });

            // Determine winner based on largest connected area
            let winnerMessage;
            if (player1Area > player2Area) {
                game.winner = game.player1;
                game.result = 'player1_win';
                winnerMessage = {
                    [game.player1.toString()]: `You won with the largest connected area of ${player1Area} cells!`,
                    [game.player2.toString()]: `You lost! Opponent had a larger connected area of ${player1Area} cells.`
                };
                await updatePlayerStats(game.player1, game.player2);
            } else if (player2Area > player1Area) {
                game.winner = game.player2;
                game.result = 'player2_win';
                winnerMessage = {
                    [game.player1.toString()]: `You lost! Opponent had a larger connected area of ${player2Area} cells.`,
                    [game.player2.toString()]: `You won with the largest connected area of ${player2Area} cells!`
                };
                await updatePlayerStats(game.player2, game.player1);
            } else {
                game.result = 'draw';
                winnerMessage = {
                    [game.player1.toString()]: `It's a draw! Both players have equal connected areas of ${player1Area} cells.`,
                    [game.player2.toString()]: `It's a draw! Both players have equal connected areas of ${player2Area} cells.`
                };
                await updateDrawStats(game.player1, game.player2);
            }

            game.status = 'completed';
            await game.save();

            // Update game state in activeGames
            activeGames.set(gameId, { game, sockets });

            // Notify players of game end with more detailed information
            io.to(gameId).emit('game_end', {
                gameId,
                grid: game.grid,
                winner: game.winner,
                result: game.result,
                player1Area,
                player2Area,
                message: winnerMessage,
                player1Color: game.player1Color,
                player2Color: game.player2Color
            });
            // Emit coin update to both players
            io.to(gameId).emit('update_coins');
        } else {
            // Notify players of move with a copy of the grid
            const gridCopy = game.grid.map(row => [...row]);
            io.to(gameId).emit('move_made', {
                gameId,
                grid: gridCopy,
                currentTurn: game.currentTurn,
                lastMove: { row, col, color: playerColor }
            });
        }
    });

    // Cancel matchmaking
    socket.on('cancel_matchmaking', () => {
        console.log('Player cancelled matchmaking:', socket.user.username);
        waitingPlayers.delete(socket.user._id.toString());
        socket.leave('waiting');
    });

    // Forfeit game
    socket.on('forfeit_game', async ({ gameId }) => {
        const gameState = activeGames.get(gameId);
        if (!gameState) return;

        const { game, sockets } = gameState;
        if (![game.player1.toString(), game.player2.toString()].includes(socket.user._id.toString())) return;

        const forfeiter = socket.user._id;
        const winner = game.player1.toString() === socket.user._id.toString() ? game.player2 : game.player1;

        game.winner = winner;
        game.status = 'completed';
        game.result = game.player1.toString() === winner.toString() ? 'player1_win' : 'player2_win';
        game.forfeit = true;
        game.forfeiter = forfeiter;

        await game.save();
        await updatePlayerStats(winner, forfeiter);

        // Create proper forfeit messages - different from regular game messages
        const forfeitMessages = {
            [winner.toString()]: "You won because your opponent forfeited!",
            [forfeiter.toString()]: "You forfeited the game!"
        };

        // Notify both players with forfeit-specific event
        io.to(gameId).emit('game_over_forfeit', {
            gameId,
            winner: winner,
            forfeit: true,
            forfeiter: forfeiter,
            result: game.result,
            message: forfeitMessages
        });

        // Emit coin update to both players
        io.to(gameId).emit('update_coins');

        // Clean up the game state
        activeGames.delete(gameId);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.user.username, 'Socket ID:', socket.id);
        waitingPlayers.delete(socket.user._id.toString());
        // Remove from all rooms
        for (const room of socket.rooms) {
            socket.leave(room);
        }
    });
};

async function updatePlayerStats(winnerId, loserId) {
    const winner = await User.findById(winnerId);
    const loser = await User.findById(loserId);

    winner.stats.wins += 1;
    winner.coins += 200;
    loser.stats.losses += 1;
    loser.coins = Math.max(0, loser.coins - 200);

    await Promise.all([winner.save(), loser.save()]);
}

async function updateDrawStats(player1Id, player2Id) {
    const player1 = await User.findById(player1Id);
    const player2 = await User.findById(player2Id);

    player1.stats.draws += 1;
    player2.stats.draws += 1;

    await Promise.all([player1.save(), player2.save()]);
} 