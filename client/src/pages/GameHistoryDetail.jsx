import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function GameHistoryDetail() {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGame();
    }, [gameId]);

    const fetchGame = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/games/${gameId}`);
            setGame(response.data);
        } catch (error) {
            console.error('Error fetching game:', error);
            setError('Failed to load game details');
        } finally {
            setLoading(false);
        }
    };

    const getResultText = (game) => {
        if (!game.result) return 'In Progress';
        if (game.result === 'draw') return 'Draw';
        const currentUserId = localStorage.getItem('userId');
        if (game.winner?._id && currentUserId) {
            return game.winner._id === currentUserId ? 'Won' : 'Lost';
        }
        const currentUsername = localStorage.getItem('username');
        return game.winner?.username === currentUsername ? 'Won' : 'Lost';
    };

    const getPlayerColor = (game, playerId) => {
        return game.player1._id === playerId ? game.player1Color : game.player2Color;
    };

    const getOpponent = (game) => {
        const currentUserId = localStorage.getItem('userId');
        if (game.player1._id === currentUserId) {
            return game.player2;
        }
        if (game.player2._id === currentUserId) {
            return game.player1;
        }
        // fallback: if neither matches, just return player2 (shouldn't happen)
        return game.player2;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-xl">Loading game details...</div>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-red-600 text-xl">{error || 'Game not found'}</div>
                    <Link
                        to="/history"
                        className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Back to History
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Game #{gameId.slice(-4)}
                        </h1>
                        <Link
                            to="/history"
                            className="text-blue-600 hover:text-blue-700"
                        >
                            Back to History
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <img
                                    src={game.player1.profilePicture || 'https://via.placeholder.com/40'}
                                    alt={game.player1.username}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {game.player1.username}
                                    </h3>
                                    <p className="text-gray-600">
                                        Color: <span style={{ color: game.player1Color }}>{game.player1Color}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <img
                                    src={game.player2.profilePicture || 'https://via.placeholder.com/40'}
                                    alt={game.player2.username}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {game.player2.username}
                                    </h3>
                                    <p className="text-gray-600">
                                        Color: <span style={{ color: game.player2Color }}>{game.player2Color}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Game Status</h2>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <p className="text-lg">
                                Result: <span className="font-semibold">{getResultText(game)}</span>
                            </p>
                            <p className="text-gray-600 mt-2">
                                Played on {new Date(game.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Final Grid</h2>
                        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                            {game.grid.map((row, i) =>
                                row.map((cell, j) => (
                                    <div
                                        key={`${i}-${j}`}
                                        className="aspect-square rounded-lg border-2 border-gray-200"
                                        style={{ backgroundColor: cell || '#f3f4f6' }}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Moves</h2>
                        <div className="space-y-2">
                            {game.moves.map((move, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={move.player.profilePicture || 'https://via.placeholder.com/40'}
                                            alt={move.player.username}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="text-gray-900">
                                            {move.player.username}
                                        </span>
                                    </div>
                                    <div className="text-gray-600">
                                        Row: {move.row + 1}, Col: {move.col + 1}
                                    </div>
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: move.color }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameHistoryDetail; 