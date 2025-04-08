const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

// 棋盘参数
const GRID_SIZE = 15;
const CELL_SIZE = 40;
const PIECE_RADIUS = 18;
const BOARD_PADDING = 20;

// 游戏状态
let currentPlayer = 1; // 1: 黑子, 2: 白子
let gameBoard = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
let gameOver = false;

// 初始化游戏
function initGame() {
    drawBoard();
}

// 绘制棋盘
function drawBoard() {
    // 绘制棋盘背景
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格线
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    // 绘制横线和竖线
    for (let i = 0; i < GRID_SIZE; i++) {
        const position = BOARD_PADDING + i * CELL_SIZE;
        // 横线
        ctx.moveTo(BOARD_PADDING, position);
        ctx.lineTo(canvas.width - BOARD_PADDING, position);
        // 竖线
        ctx.moveTo(position, BOARD_PADDING);
        ctx.lineTo(position, canvas.height - BOARD_PADDING);
    }
    ctx.stroke();

    // 绘制天元和星位
    const stars = [3, 7, 11];
    stars.forEach(x => {
        stars.forEach(y => {
            ctx.beginPath();
            ctx.arc(
                BOARD_PADDING + x * CELL_SIZE,
                BOARD_PADDING + y * CELL_SIZE,
                4,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = '#000000';
            ctx.fill();
        });
    });
}

// 绘制棋子
function drawPiece(row, col, player) {
    const x = BOARD_PADDING + col * CELL_SIZE;
    const y = BOARD_PADDING + row * CELL_SIZE;

    ctx.beginPath();
    ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);
    
    // 创建渐变效果
    const gradient = ctx.createRadialGradient(
        x - 5, y - 5, 1,
        x, y, PIECE_RADIUS
    );

    if (player === 1) {
        gradient.addColorStop(0, '#666');
        gradient.addColorStop(1, '#000');
    } else {
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#ccc');
    }

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = player === 1 ? '#000' : '#888';
    ctx.stroke();
}

// 处理点击事件
canvas.addEventListener('click', function(event) {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 计算点击的格子位置
    const col = Math.round((x - BOARD_PADDING) / CELL_SIZE);
    const row = Math.round((y - BOARD_PADDING) / CELL_SIZE);

    // 检查是否在有效范围内
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
        makeMove(row, col);
    }
});

// 下棋
function makeMove(row, col) {
    // 检查该位置是否已经有棋子
    if (gameBoard[row][col] !== 0) return;

    // 放置棋子
    gameBoard[row][col] = currentPlayer;
    drawPiece(row, col, currentPlayer);

    // 检查是否获胜
    if (checkWin(row, col)) {
        gameOver = true;
        status.textContent = `${currentPlayer === 1 ? '黑子' : '白子'}获胜！`;
        return;
    }

    // 切换玩家
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    status.textContent = `轮到${currentPlayer === 1 ? '黑子' : '白子'}下`;
}

// 检查是否获胜
function checkWin(row, col) {
    const directions = [
        [[0, 1], [0, -1]],  // 水平
        [[1, 0], [-1, 0]],  // 垂直
        [[1, 1], [-1, -1]], // 对角线
        [[1, -1], [-1, 1]]  // 反对角线
    ];

    return directions.some(direction => {
        const count = 1 + // 当前位置
            countPieces(row, col, direction[0][0], direction[0][1]) +
            countPieces(row, col, direction[1][0], direction[1][1]);
        return count >= 5;
    });
}

// 计算某个方向上相同颜色的棋子数量
function countPieces(row, col, deltaRow, deltaCol) {
    let count = 0;
    let currentRow = row + deltaRow;
    let currentCol = col + deltaCol;
    const player = gameBoard[row][col];

    while (
        currentRow >= 0 &&
        currentRow < GRID_SIZE &&
        currentCol >= 0 &&
        currentCol < GRID_SIZE &&
        gameBoard[currentRow][currentCol] === player
    ) {
        count++;
        currentRow += deltaRow;
        currentCol += deltaCol;
    }

    return count;
}

// 重新开始游戏
function restartGame() {
    gameBoard = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    currentPlayer = 1;
    gameOver = false;
    status.textContent = '轮到黑子下';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initGame();
}

// 启动游戏
initGame(); 