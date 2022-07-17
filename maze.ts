let maze = document.querySelector(".maze") as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null = maze.getContext("2d");
let curr: Cell

class Maze {
    size: number;
    rows: number;
    columns: number;
    grid: Array<Array<Cell>>;
    stack: Array<unknown>;

    constructor(size: number, rows: number, columns: number) {
        this.size = size;
        this.rows = rows;
        this.columns = columns;
        this.grid= [] ;
        this.stack = [];
    }

    setup() {
        for (let r = 0; r < this.rows; r++) {
            let row: Array<Cell> = [];
            for (let c = 0; c < this.columns; c++) {
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
           this.grid.push(row);
        }
             curr = this.grid[0][0]
    }

    draw() {
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "black";
        curr.visited = true

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                let grid: Array<Cell[]> = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns)
            }
        }
    }
}

class Cell {
    rowNumber: number;
    columnNumber: number;
    parentGrid: any;
    parentSize: number;
    visited: boolean;
    walls: {
        topWall: boolean;
        bottomWall: boolean;
        leftWall: boolean;
        rightWall: boolean;
    };

    constructor(
        rowNumber: number,
        columnNumber: number,
        parentGrid: any,
        parentSize: number
    ) {
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visited = false;
        this.walls = {
            topWall: true,
            bottomWall: true,
            leftWall: true,
            rightWall: true,
        };
    }

    drawTopWall(
        x: number,
        y: number,
        size: number,
        columns: number,
     
    ) {
        ctx?.beginPath();
        ctx?.moveTo(x, y);
        ctx?.lineTo(x + size / columns, y);
        ctx?.stroke();
    }

    drawRightWall(
        x: number,
        y: number,
        size: number,
        columns: number,
        rows: number
    ) {
        ctx?.beginPath();
        ctx?.moveTo(x + size / columns, y);
        ctx?.lineTo(x + size / columns, y + size / rows);
        ctx?.stroke();
    }

    drawBottomWall(
        x: number,
        y: number,
        size: number,
        columns: number,
        rows: number
    ) {
        ctx?.beginPath();
        ctx?.moveTo(x, y + size / rows);
        ctx?.lineTo(x + size / columns, y + size / rows);
        ctx?.stroke();
    }

    drawLeftWall(
        x: number,
        y: number,
        size: number,
        rows: number,
    
    ) {
        ctx?.beginPath();
        ctx?.moveTo(x, y);
        ctx?.lineTo(x, y + size / rows);
        ctx?.stroke();
    }

    show(size: number, rows: number, columns: number) : void {
        let x: number = (this.columnNumber * size) / columns;
        let y: number = (this.rowNumber * size) / rows;
        ctx!.strokeStyle = 'white';
        ctx!.fillStyle = "black"
        ctx!.lineWidth = 2

        if (this.walls.topWall) this.drawTopWall(x, y, size, columns);
        if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
        if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns);
        if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);

        if (this.visited) {
            ctx?.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2)
        }
    }
}

let newMaze = new Maze(500, 20, 20);
newMaze.setup();
newMaze.draw()
