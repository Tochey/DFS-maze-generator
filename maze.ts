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
        this.grid = [];
        this.stack = [];
    }


    setup() {
        //feed Array<Cell's> into grid
        for (let r = 0; r < this.rows; r++) {
            let row: Array<Cell> = [];
            for (let c = 0; c < this.columns; c++) {
                let cell = new Cell(r, c, this.grid, this.size);
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
        maze.style.background = "black";
        curr.visited = true

        //draw out grid
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                this.grid[r][c].show(this.size, this.rows, this.columns);
             
        }  
    }
    for(let i = 0; i < this.rows * this.columns; i++){

        let next = curr.checkNeighbors();
        if (next) {
            next.visited = true
            ctx?.fillRect((next.rowNumber * this.size) / this.rows + 1, (next.columnNumber * this.size) / this.columns + 1, this.size / this.columns - 2, this.size / this.rows - 2)
            curr = next
          
        }
    }
 
}
}


class Cell {
    rowNumber: number;
    columnNumber: number;
    globalGrid: Array<Array<Cell>>;
    gridSize: number;
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
        gridSize: number
    ) {
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
        this.globalGrid = globalGrid;
        this.gridSize = gridSize;
        this.visited = false;
        this.walls = {
            topWall: true,
            rightWall: true,
            bottomWall: true,
            leftWall: true,
        };
    }

    drawCell(
        x: number,
        y: number,
        size: number,
        columns: number,
        rows: number
    ) {
       
        ctx?.beginPath();
        //start-top
        if (this.walls.topWall) {
            ctx?.moveTo(x, y)
            ctx?.lineTo(x + size / columns, y);
            ctx?.stroke();
        }

        if (this.walls.rightWall) {
            //start-right
            ctx?.moveTo(x + size / columns, y);
            ctx?.lineTo(x + size / columns, y + size / rows);
            ctx?.stroke()
        }

        if (this.walls.bottomWall) {
            //start bottom
            ctx?.moveTo(x + size / columns, y + size / rows);
            ctx?.lineTo(x, y + size / rows);
            ctx?.stroke();
        }
        if (this.walls.leftWall) {
            //start left
            ctx?.moveTo(x, y + size / rows);
            ctx?.lineTo(x, y);
            ctx?.stroke();
        
        }

       

    }

    checkNeighbors() {
        let neighbors = []
        let topCell: Cell | undefined;
        let bottomCell: Cell | undefined;
        let rightCell: Cell | undefined;
        let leftCell: Cell | undefined;

        //  if(this.columnNumber < 0 || this.rowNumber < 0 || this.columnNumber > columns - 1 || this.rowNumber > rows-1){

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

        // console.log(neighbors)

        if (neighbors.length > 0) {
            let random = Math.floor(Math.random() * neighbors.length)
            
            return neighbors[random]
        } else {
            return undefined;
        }

    }


    show(size: number, rows: number, columns: number): void {
        let x: number = (this.columnNumber * size) / columns;
        let y: number = (this.rowNumber * size) / rows;

        ctx!.strokeStyle = 'white';
        ctx!.fillStyle = "red"
        ctx!.lineWidth = 1
    

        this.drawCell(x, y, size, columns, rows)
        
    }


}

let newMaze = new Maze(700, 20, 20);
newMaze.setup();
newMaze.draw()
