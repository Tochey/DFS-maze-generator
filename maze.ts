let maze = document.querySelector(".maze") as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null = maze.getContext("2d");
let curr: Cell 
let req : any;


class Maze {

    size: number;
    rows: number;
    columns: number;
    grid: Array<Array<Cell>>;
    stack: Array<Cell>;

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
                let cell = new Cell(r, c, this.grid, this.size, this.rows, this.columns);
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
        maze.style.background = "white";
        ctx!.strokeStyle = 'black';
        ctx!.fillStyle = "white"
        ctx!.lineWidth = 1


        ctx?.fillRect(curr.xPosition + 1, curr.yPosition + 1, curr.gridSize / curr.globalColumnSize - 2, curr.gridSize / curr.globalRowSize - 2)

        //draw out grid
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                let grid = this.grid
                grid[r][c].drawCell(this.size, this.rows, this.columns);
            }
        }
        curr.visited = true
        curr.highlight('purple')
       
        let next = curr.pickRandomNeighbor();

        if (next) {
            next.visited = true
            this.stack.push(curr)
            console.log( curr)
            curr.removeWalls(curr, next)
            curr = next
        } else if (this.stack.length > 0) {
            curr = this.stack.pop()
            console.log(`popping ${curr.rowNumber + " " + curr.columnNumber}`)
          
        }

        if(this.stack.length === 0){
            return;
        }
        setTimeout(() => {
         req =    window.requestAnimationFrame(() => {
                console.log('calling frame')
                this.draw();
            });
        }, 300)

    }

}

class Cell {
    rowNumber: number;
    columnNumber: number;
    globalGrid: Array<Array<Cell>>;
    gridSize: number;
    globalRowSize: number;
    globalColumnSize: number
    xPosition: number
    yPosition: number
    visited: boolean;
    walls: {
        topWall: boolean;
        bottomWall: boolean;
        leftWall: boolean;
        rightWall: boolean;
    };
    //cell properties
    constructor(
        rowNumber: number,
        columnNumber: number,
        globalGrid: Array<Array<Cell>>,
        gridSize: number,
        globalRowSize: number,
        globalColumnSize: number
    ) {
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
        this.globalGrid = globalGrid;
        this.gridSize = gridSize;
        this.globalRowSize = globalRowSize
        this.globalColumnSize = globalColumnSize
        this.xPosition = (this.columnNumber * this.gridSize) / this.globalColumnSize
        this.yPosition = (this.rowNumber * this.gridSize) / this.globalRowSize
        this.visited = false;
        this.walls = {
            topWall: true,
            rightWall: true,
            bottomWall: true,
            leftWall: true,
        };
    }

    drawCell(

        size: number,
        rows: number,
        columns: number
    ) {

        ctx?.beginPath();
        //start-top
        if (this.walls.topWall) {
            ctx?.moveTo(this.xPosition, this.yPosition)
            ctx?.lineTo(this.xPosition + size / columns, this.yPosition);
            ctx?.stroke();
        }

        if (this.walls.rightWall) {
            //start-right
            ctx?.moveTo(this.xPosition + size / columns, this.yPosition);
            ctx?.lineTo(this.xPosition + size / columns, this.yPosition + size / rows);
            ctx?.stroke()
        }

        if (this.walls.bottomWall) {
            //start bottom
            ctx?.moveTo(this.xPosition + size / columns, this.yPosition + size / rows);
            ctx?.lineTo(this.xPosition, this.yPosition + size / rows);
            ctx?.stroke();
        }
        if (this.walls.leftWall) {
            //start left
            ctx?.moveTo(this.xPosition, this.yPosition + size / rows);
            ctx?.lineTo(this.xPosition, this.yPosition);
            ctx?.stroke();

        }

        if (this.visited) {
            ctx?.fillRect(this.xPosition + 1, this.yPosition + 1, this.gridSize / this.globalColumnSize - 2, this.gridSize / this.globalRowSize - 2)
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
            topCell = this.globalGrid[this.rowNumber - 1][this.columnNumber]
        } catch (error) {

            topCell = undefined
        }
        rightCell = this.globalGrid[this.rowNumber][this.columnNumber + 1]

        //accessing the index of an undefined position throws an error
        try {
            bottomCell = this.globalGrid[this.rowNumber + 1][this.columnNumber]
        } catch (error) {

            bottomCell = undefined
        }

        leftCell = this.globalGrid[this.rowNumber][this.columnNumber - 1]

        if (topCell && !topCell.visited) {
            neighbors.push(topCell)
        }


        if (rightCell && !rightCell.visited) {
            neighbors.push(rightCell)
        }

        if (bottomCell && !bottomCell.visited) {
            neighbors.push(bottomCell)
        }

        if (leftCell && !leftCell.visited) {
            neighbors.push(leftCell)
        }

        if (neighbors.length > 0) {
            let random = Math.floor(Math.random() * neighbors.length)
           
            return neighbors[random]
        } else {
            return undefined
        }
    }

    highlight(color : string) {
        ctx!.fillStyle = color
        ctx?.fillRect((this.columnNumber * this.gridSize) / this.globalColumnSize + 1, (this.rowNumber * this.gridSize) / this.globalRowSize + 1, this.gridSize / this.globalColumnSize - 3, this.gridSize / this.globalColumnSize - 3,)

    }

   removeWalls(current: Cell, next: Cell) {
        let x: number = current.columnNumber - next.columnNumber;
        let y: number = current.rowNumber - next.rowNumber

        if (x === 1) {
            current.walls.leftWall = false
            next.walls.rightWall = false
        } else if (x === -1) {
            current.walls.rightWall = false
            next.walls.leftWall = false
        }

        if (y === 1) {
            current.walls.topWall = false
            next.walls.bottomWall = false
        } else if (y === -1) {
            current.walls.bottomWall = false
            next.walls.topWall = false
        }
    }
}

let newMaze = new Maze(200,3, 3);
newMaze.setup();
newMaze.draw()
