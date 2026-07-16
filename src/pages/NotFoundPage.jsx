import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Terminal, Trophy, ArrowLeft, RotateCcw } from 'lucide-react';
import Magnetic from '../components/Magnetic';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

const NotFoundPage = () => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // We use a ref to track the latest direction to prevent quick double-turns causing self-collision
    const directionRef = useRef(direction);

    const generateFood = useCallback((currentSnake) => {
        let newFood;
        let isOccupied = true;
        while (isOccupied) {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
            // eslint-disable-next-line no-loop-func
            isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        }
        return newFood;
    }, []);

    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        directionRef.current = INITIAL_DIRECTION;
        setFood(generateFood(INITIAL_SNAKE));
        setGameOver(false);
        setScore(0);
        setIsPlaying(true);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying && e.key === 'Enter') {
                resetGame();
                return;
            }

            // Prevent default scrolling for arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }

            const { x, y } = directionRef.current;
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (y === 0) directionRef.current = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (y === 0) directionRef.current = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (x === 0) directionRef.current = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (x === 0) directionRef.current = { x: 1, y: 0 };
                    break;
                default:
                    break;
            }
            setDirection(directionRef.current);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying || gameOver) return;

        const moveSnake = () => {
            setSnake(prevSnake => {
                const head = prevSnake[0];
                const newHead = {
                    x: head.x + directionRef.current.x,
                    y: head.y + directionRef.current.y
                };

                // Check wall collision
                if (
                    newHead.x < 0 || 
                    newHead.x >= GRID_SIZE || 
                    newHead.y < 0 || 
                    newHead.y >= GRID_SIZE
                ) {
                    setGameOver(true);
                    return prevSnake;
                }

                // Check self collision
                if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameOver(true);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check food collision
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore(s => {
                        const newScore = s + 10;
                        setHighScore(h => Math.max(h, newScore));
                        return newScore;
                    });
                    setFood(generateFood(newSnake));
                } else {
                    newSnake.pop(); // Remove tail if no food eaten
                }

                return newSnake;
            });
        };

        // Speed increases slightly as snake gets longer
        const currentSpeed = Math.max(50, INITIAL_SPEED - (snake.length * 2));
        const gameLoop = setInterval(moveSnake, currentSpeed);

        return () => clearInterval(gameLoop);
    }, [isPlaying, gameOver, food, generateFood, snake.length]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-[70vh] flex flex-col md:flex-row items-center justify-center gap-12 py-12"
        >
            <div className="flex-1 max-w-md text-center md:text-left">
                <div className="inline-flex items-center justify-center p-3 bg-accent/10 text-accent rounded-2xl mb-6">
                    <Terminal size={32} />
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-md-on-background mb-4">404</h1>
                <h2 className="text-2xl font-display font-bold text-md-on-background mb-4">Page Not Found</h2>
                <p className="text-md-on-surface-variant mb-8 text-lg">
                    Looks like this endpoint doesn't exist. While I train a model to find it, why don't you play some Snake?
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <Magnetic strength={0.2}>
                        <Link 
                            to="/"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-md-on-background text-md-background font-medium hover:scale-105 transition-transform"
                        >
                            <ArrowLeft size={18} />
                            Go Back Home
                        </Link>
                    </Magnetic>
                </div>
            </div>

            <div className="flex-1 w-full max-w-[400px]">
                <div className="bg-md-surface-variant/30 p-6 rounded-3xl border border-md-outline/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-mono text-md-on-surface-variant font-bold">
                            <span className="flex items-center gap-1"><Trophy size={14} className="text-accent" /> {highScore}</span>
                            <span>Score: {score}</span>
                        </div>
                    </div>

                    <div 
                        className="relative bg-md-background/50 rounded-xl border border-md-outline/30 overflow-hidden"
                        style={{ aspectRatio: '1/1' }}
                    >
                        {/* Game Grid */}
                        <div 
                            className="absolute inset-0 grid"
                            style={{ 
                                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
                            }}
                        >
                            {/* Render Food */}
                            <div 
                                className="bg-accent rounded-full scale-75 shadow-[0_0_10px_rgba(var(--accent),0.5)]"
                                style={{ gridColumn: food.x + 1, gridRow: food.y + 1 }}
                            />
                            
                            {/* Render Snake */}
                            {snake.map((segment, index) => (
                                <div 
                                    key={`${segment.x}-${segment.y}-${index}`}
                                    className={`rounded-sm border border-md-background/20 ${index === 0 ? 'bg-md-on-background' : 'bg-md-on-background/70'}`}
                                    style={{ 
                                        gridColumn: segment.x + 1, 
                                        gridRow: segment.y + 1,
                                        transform: index === 0 ? 'scale(1.05)' : 'scale(0.95)'
                                    }}
                                />
                            ))}
                        </div>

                        {/* Overlays */}
                        {(!isPlaying || gameOver) && (
                            <div className="absolute inset-0 bg-md-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                                {gameOver ? (
                                    <>
                                        <h3 className="text-2xl font-display font-bold text-accent mb-2">Game Over!</h3>
                                        <p className="text-md-on-surface-variant mb-6 font-mono text-sm">Final Score: {score}</p>
                                    </>
                                ) : (
                                    <>
                                        <Terminal size={32} className="text-md-on-surface-variant/50 mb-4" />
                                        <h3 className="text-xl font-display font-bold text-md-on-background mb-6">Ready to play?</h3>
                                    </>
                                )}
                                
                                <button 
                                    onClick={resetGame}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-medium hover:scale-105 transition-transform"
                                >
                                    {gameOver ? <RotateCcw size={18} /> : null}
                                    {gameOver ? 'Play Again' : 'Start Game'}
                                </button>
                                <p className="text-xs text-md-on-surface-variant mt-4 font-mono">Use W A S D or Arrow Keys</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default NotFoundPage;
