import { useState, useEffect } from 'react';
import WordSearchGrid from './WordSearchGrid';

const WordSearchGame = () => {
    const words = ["CANCER", "FAITH", "STAY", "COULD", "BRAVE", "HOPE", "LOVE", "HEALTH", "MIRACLE", "SMILE"];
    const gridSize = 20;

    const generateGrid = () => {
        let grid = Array.from({ length: gridSize }, () =>
            Array.from({ length: gridSize }, () => "")
        );

        const placeWordInGrid = (grid, word) => {
            const wordLength = word.length;
            let placed = false;

            while (!placed) {
                const direction = Math.floor(Math.random() * 8);
                const row = Math.floor(Math.random() * gridSize);
                const col = Math.floor(Math.random() * gridSize);

                const canPlaceWord = (direction, row, col) => {
                    switch (direction) {
                        case 0: return col + wordLength <= gridSize;
                        case 1: return col - wordLength >= -1;
                        case 2: return row + wordLength <= gridSize;
                        case 3: return row - wordLength >= -1;
                        case 4: return row + wordLength <= gridSize && col + wordLength <= gridSize;
                        case 5: return row - wordLength >= -1 && col + wordLength <= gridSize;
                        case 6: return row + wordLength <= gridSize && col - wordLength >= -1;
                        case 7: return row - wordLength >= -1 && col - wordLength >= -1;
                        default: return false;
                    }
                };

                const placeWord = (direction, row, col, word) => {
                    switch (direction) {
                        case 0:
                            for (let i = 0; i < wordLength; i++) grid[row][col + i] = word[i];
                            break;
                        case 1:
                            for (let i = 0; i < wordLength; i++) grid[row][col - i] = word[i];
                            break;
                        case 2:
                            for (let i = 0; i < wordLength; i++) grid[row + i][col] = word[i];
                            break;
                        case 3:
                            for (let i = 0; i < wordLength; i++) grid[row - i][col] = word[i];
                            break;
                        case 4:
                            for (let i = 0; i < wordLength; i++) grid[row + i][col + i] = word[i];
                            break;
                        case 5:
                            for (let i = 0; i < wordLength; i++) grid[row - i][col + i] = word[i];
                            break;
                        case 6:
                            for (let i = 0; i < wordLength; i++) grid[row + i][col - i] = word[i];
                            break;
                        case 7:
                            for (let i = 0; i < wordLength; i++) grid[row - i][col - i] = word[i];
                            break;
                        default: break;
                    }
                };

                if (canPlaceWord(direction, row, col)) {
                    let tempGrid = JSON.parse(JSON.stringify(grid));
                    placeWord(direction, row, col, word);

                    if (isWordCorrectlyPlaced(grid, word)) {
                        placed = true;
                    } else {
                        grid = tempGrid; // Reset the grid if the word isn't placed correctly
                    }
                }
            }
        };

        const isWordCorrectlyPlaced = (grid, word) => {
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    if (checkWordAtPosition(row, col, word, grid)) {
                        return true;
                    }
                }
            }
            return false;
        };

        const checkWordAtPosition = (row, col, word, grid) => {
            const directions = [
                { row: 0, col: 1 }, { row: 0, col: -1 }, { row: 1, col: 0 }, { row: -1, col: 0 }, { row: 1, col: 1 },
                { row: -1, col: 1 }, { row: 1, col: -1 }, { row: -1, col: -1 },];

            for (let i = 0; i < directions.length; i++) {
                const dir = directions[i];
                let match = true;
                for (let j = 0; j < word.length; j++) {
                    const newRow = row + j * dir.row;
                    const newCol = col + j * dir.col;
                    if (newRow < 0 || newCol < 0 || newRow >= gridSize || newCol >= gridSize || grid[newRow][newCol] !== word[j]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    return true;
                }
            }
            return false;
        };

        words.forEach(word => placeWordInGrid(grid, word));

        const fillEmptyCells = (grid) => {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    if (grid[row][col] === "") {
                        grid[row][col] = letters.charAt(Math.floor(Math.random() * letters.length));
                    }
                }
            }
        };

        fillEmptyCells(grid);
        return grid;
    };


    const [grid, setGrid] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [incorrectSelections, setIncorrectSelections] = useState([]);
    const [startCell, setStartCell] = useState(null);
    const [selectionDirection, setSelectionDirection] = useState(null);
    const [correctCells, setCorrectCells] = useState([]);


    useEffect(() => {
        const generatedGrid = generateGrid();
        setGrid(generatedGrid);
        document.body.onmousedown = (e) => {
            e.preventDefault();
        };
    }, []);

    const handleCellMouseDown = (row, col) => {
        setStartCell({ row, col });
        setSelectedCells([{ row, col }]);
        setIncorrectSelections([]); 

        console.log(`Mouse down on cell at row ${row}, col ${col}`);
    };

    const handleCellMouseOver = (row, col) => {
        if (startCell) {
            const newDirection = determineDirection(startCell.row, startCell.col, row, col);
            setSelectionDirection(newDirection);
            const newCells = getSelectionCells(startCell.row, startCell.col, row, col, newDirection);
            setSelectedCells(newCells);

            console.log(`Mouse over on cell at row ${row}, col ${col}`);
            console.log('Current selection:', newCells);
        }
    };

    const determineDirection = (startRow, startCol, endRow, endCol) => {
        if (startRow === endRow) return 'horizontal';
        if (startCol === endCol) return 'vertical';
        const rowDiff = Math.abs(startRow - endRow);
        const colDiff = Math.abs(startCol - endCol);
        return rowDiff === colDiff ? 'diagonal' : null;
    };

    const getSelectionCells = (startRow, startCol, endRow, endCol, direction) => {
        const cells = [];
        if (direction === 'horizontal') {
            const colStart = Math.min(startCol, endCol);
            const colEnd = Math.max(startCol, endCol);
            for (let col = colStart; col <= colEnd; col++) {
                cells.push({ row: startRow, col });
            }
        } else if (direction === 'vertical') {
            const rowStart = Math.min(startRow, endRow);
            const rowEnd = Math.max(startRow, endRow);
            for (let row = rowStart; row <= rowEnd; row++) {
                cells.push({ row, col: startCol });
            }
        } else if (direction === 'diagonal') {
            const rowIncrement = endRow > startRow ? 1 : -1;
            const colIncrement = endCol > startCol ? 1 : -1;
            let row = startRow;
            let col = startCol;
            while (row !== endRow + rowIncrement && col !== endCol + colIncrement) {
                cells.push({ row, col });
                row += rowIncrement;
                col += colIncrement;
            }
        }
        return cells;
    };


    
    const handleMouseUp = () => {
        if (!startCell || selectedCells.length === 0) return;

        const sortedCells = [...selectedCells].sort((a, b) => a.row - b.row || a.col - b.col);
        const firstCell = sortedCells[0];
        const lastCell = sortedCells[sortedCells.length - 1];

        const isHorizontal = firstCell.row === lastCell.row;
        const isVertical = firstCell.col === lastCell.col;
        const isDiagonal = Math.abs(firstCell.row - lastCell.row) === Math.abs(firstCell.col - lastCell.col);

        const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col]).join("");

        console.log(`Selected word: ${selectedWord}`);
        console.log(`Is word found: ${words.includes(selectedWord)}`);

        if (words.includes(selectedWord) || words.includes(selectedWord.split('').reverse().join(''))) {
            const newCorrectCells = selectedCells;
            setCorrectCells(prevCorrectCells => [...prevCorrectCells, ...newCorrectCells]);
            setFoundWords(prevFoundWords => [...prevFoundWords, selectedWord]);

            setIncorrectSelections(prevIncorrectSelections =>
                prevIncorrectSelections.filter(cell =>
                    !selectedCells.some(selectedCell => selectedCell.row === cell.row && selectedCell.col === cell.col)
                )
            );
        } else {
            setIncorrectSelections(prevIncorrectSelections => [
                ...prevIncorrectSelections,
                ...selectedCells
            ]);
        }

        setSelectedCells([]);
        setSelectionDirection(null);
        setStartCell(null);
    };


    const getCellClass = (row, col) => {
        const cellLetter = grid[row][col];
        const isFound = correctCells.some(cell => cell.row === row && cell.col === col);
        const isIncorrect = incorrectSelections.some(cell => cell.row === row && cell.col === col);
        const isSelected = selectedCells.some(cell => cell.row === row && cell.col === col);

        return `w-8 h-8 flex items-center justify-center border border-gray-300 cursor-pointer
      ${isFound ? 'bg-green-500 text-white' : isIncorrect ? 'bg-red-500 text-white' : isSelected ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-black'}`;
    };

    const handleHighlightAllWords = () => {
        const allCells = [];
        words.forEach((word) => {
            const wordCells = findWordInGrid(word, grid);
            if (wordCells) {
                allCells.push(...wordCells);
            }
        });
        setCorrectCells(allCells);
        setFoundWords(words);
    };

    const findWordInGrid = (word, grid) => {
        const wordLength = word.length;
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (checkWordAtPosition(row, col, word, grid)) {
                    return getWordCells(row, col, word, grid);
                }
            }
        }
        return null;
    };

    const checkWordAtPosition = (row, col, word, grid) => {
        const directions = [
            { row: 0, col: 1 },
            { row: 0, col: -1 },
            { row: 1, col: 0 },
            { row: -1, col: 0 },
            { row: 1, col: 1 },
            { row: -1, col: 1 },
            { row: 1, col: -1 },
            { row: -1, col: -1 },
        ];

        for (let i = 0; i < directions.length; i++) {
            const dir = directions[i];
            let match = true;
            for (let j = 0; j < word.length; j++) {
                const newRow = row + j * dir.row;
                const newCol = col + j * dir.col;
                if (newRow < 0 || newCol < 0 || newRow >= gridSize || newCol >= gridSize || grid[newRow][newCol] !== word[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return true;
            }
        }
        return false;
    };

    const getWordCells = (row, col, word, grid) => {
        const directions = [
            { row: 0, col: 1 }, 
            { row: 0, col: -1 }, 
            { row: 1, col: 0 }, 
            { row: -1, col: 0 }, 
            { row: 1, col: 1 }, 
            { row: -1, col: 1 },
            { row: 1, col: -1 }, 
            { row: -1, col: -1 }, 
        ];

        for (let i = 0; i < directions.length; i++) {
            const dir = directions[i];
            let match = true;
            const cells = [];
            for (let j = 0; j < word.length; j++) {
                const newRow = row + j * dir.row;
                const newCol = col + j * dir.col;
                if (newRow < 0 || newCol < 0 || newRow >= gridSize || newCol >= gridSize || grid[newRow][newCol] !== word[j]) {
                    match = false;
                    break;
                }
                cells.push({ row: newRow, col: newCol });
            }
            if (match) {
                return cells;
            }
        }
        return null;
    };

    return (
        <div className='flex'>
            <WordSearchGrid
                grid={grid}
                selectedCells={selectedCells}
                getCellClass={getCellClass}
                onCellMouseDown={handleCellMouseDown}
                onCellMouseOver={handleCellMouseOver}
                onMouseUp={handleMouseUp}
            />

            <div className="flex flex-col justify-center mt-4">
                {words.map((word) => (
                    <button
                        key={word}
                        className={`border px-4 py-2 mx-2 ${foundWords.includes(word) ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                    >
                        {word}
                    </button>
                ))}
                    <button className='border px-4 py-2 mx-2 bg-purple-400' onClick={handleHighlightAllWords}>Highlight All Words</button>

            </div>
        </div>
    );
};

export default WordSearchGame;



