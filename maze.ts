let maze: HTMLCanvasElement = document.querySelector(".maze") as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null = maze.getContext("2d");
let curr: Cell | undefined

//DFS MAZE GENERATOR

class Maze {

    private size: number;
    private rows: number;
    private columns: number;
    private grid: Array<Array<Cell>>;
    private stack: Array<Cell>;

    constructor(size: number, rows: number, columns: number) {
        this.size = size;
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.stack = [];
    }


    setup() {
        //feed Array<Cell's> into grid
        for (let r = 0; r < this.rows; r++) {
            let row: Array<Cell> = [];
            for (let c = 0; c < this.columns; c++) {
                let cell: Cell = new Cell(r, c, this.grid, this.size, this.rows, this.columns);
                row.push(cell);
            }
            this.grid.push(row);
        }
        //starting point. first cell
        curr = this.grid[0][0]
    }

    draw() {

        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "blue";
        curr!.isVisited = true

        //draw out grid
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                let grid: Array<Array<Cell>> = this.grid
                grid[r][c].drawCell(this.size, this.rows, this.columns);
            }
        }

        let next = curr!.pickRandomNeighbor()

        if (next) {
            next.isVisited = true
            this.stack.push(curr!)
            curr!.highlight('red')
            console.log(curr)
            curr!.removecellWalls(curr!, next)
            curr = next
        } else if (this.stack.length > 0) {
            curr = this.stack.pop()
          
            curr!.highlight('red')
        }

        if (this.stack.length === 0) {
            console.log('stack is empty')
            return;
        }

        setTimeout(() => {
            window.requestAnimationFrame(() => {
                this.draw();
            },);
        },0)

    }

}


class Cell {
    rowNum: number;
    columnNum: number;
    parentGrid: Array<Array<Cell>>;
    parentGridSize: number;
    rowSize: number;
    columnSize: number
    xPos: number
    yPos: number
    isVisited: boolean;
    cellWalls: {
        top: boolean;
        bottom: boolean;
        left: boolean;
        right: boolean;
    };
    //cell properties
    constructor(
        rowNum: number,
        columnNum: number,
        parentGrid: Array<Array<Cell>>,
        parentGridSize: number,
        rowSize: number,
        columnSize: number
    ) {
        this.rowNum = rowNum;
        this.columnNum = columnNum;
        this.parentGrid = parentGrid;
        this.parentGridSize = parentGridSize;
        this.rowSize = rowSize
        this.columnSize = columnSize
        this.xPos = (this.columnNum * this.parentGridSize) / this.columnSize
        this.yPos = (this.rowNum * this.parentGridSize) / this.rowSize
        this.isVisited = false;
        this.cellWalls = {
            top: true,
            right: true,
            bottom: true,
            left: true,
        };
    }

    drawCell(
        size: number,
        rows: number,
        columns: number
    ) {
        ctx!.strokeStyle = 'black';
        ctx!.fillStyle = "black"
        ctx!.lineWidth = 1
        ctx?.beginPath();
        //start-top
        if (this.cellWalls.top) {
            ctx?.moveTo(this.xPos, this.yPos)
            ctx?.lineTo(this.xPos + size / columns, this.yPos);
            ctx?.stroke();
        }

        if (this.cellWalls.right) {
            //start-right
            ctx?.moveTo(this.xPos + size / columns, this.yPos);
            ctx?.lineTo(this.xPos + size / columns, this.yPos + size / rows);
            ctx?.stroke()
        }

        if (this.cellWalls.bottom) {
            //start bottom
            ctx?.moveTo(this.xPos + size / columns, this.yPos + size / rows);
            ctx?.lineTo(this.xPos, this.yPos + size / rows);
            ctx?.stroke();
        }
        if (this.cellWalls.left) {
            //start left
            ctx?.moveTo(this.xPos, this.yPos + size / rows);
            ctx?.lineTo(this.xPos, this.yPos);
            ctx?.stroke();

        }

        if (this.isVisited) {
            ctx?.fillRect(this.xPos + 1, this.yPos + 1, this.parentGridSize / this.columnSize - 2, this.parentGridSize / this.rowSize - 2)
        }
    }

    pickRandomNeighbor() {
        let neighbors = []
        let topCell: Cell | undefined;
        let bottomCell: Cell | undefined;
        let rightCell: Cell | undefined;
        let leftCell: Cell | undefined;

        //accessing the index of an undefined position throws an error
        try {
            topCell = this.parentGrid[this.rowNum - 1][this.columnNum]
        } catch (error) {

            topCell = undefined
        }
        rightCell = this.parentGrid[this.rowNum][this.columnNum + 1]

        //accessing the index of an undefined position throws an error
        try {
            bottomCell = this.parentGrid[this.rowNum + 1][this.columnNum]
        } catch (error) {

            bottomCell = undefined
        }

        leftCell = this.parentGrid[this.rowNum][this.columnNum - 1]

        if (topCell && !topCell.isVisited) {
            neighbors.push(topCell)
        }


        if (rightCell && !rightCell.isVisited) {
            neighbors.push(rightCell)
        }

        if (bottomCell && !bottomCell.isVisited) {
            neighbors.push(bottomCell)
        }

        if (leftCell && !leftCell.isVisited) {
            neighbors.push(leftCell)
        }

        if (neighbors.length > 0) {
            let random = Math.floor(Math.random() * neighbors.length)

            return neighbors[random];
        } else {
            return undefined;
        }
    }

    highlight(color: string) {
        ctx!.fillStyle = color
        ctx?.fillRect((this.columnNum * this.parentGridSize) / this.columnSize + 1, (this.rowNum * this.parentGridSize) / this.rowSize + 1, this.parentGridSize / this.columnSize - 3, this.parentGridSize / this.columnSize - 3,)

    }

    removecellWalls(current: Cell, next: Cell) {
        let x: number = current.columnNum - next.columnNum;
        let y: number = current.rowNum - next.rowNum

        if (x === 1) {
            current.cellWalls.left = false
            next.cellWalls.right = false
        } else if (x === -1) {
            current.cellWalls.right = false
            next.cellWalls.left = false
        }

        if (y === 1) {
            current.cellWalls.top = false
            next.cellWalls.bottom = false
        } else if (y === -1) {
            current.cellWalls.bottom = false
            next.cellWalls.top = false
        }
    }
}

let newMaze = new Maze(700, 50, 50);
newMaze.setup();
newMaze.draw()
