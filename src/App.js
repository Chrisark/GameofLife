import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import { ChakraProvider, Flex, Spacer, Button } from '@chakra-ui/react';

var numRows = 40;
var numCols = 40;
var speed = 300;

document.body.style.background = "#659DBD";

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};
  
const generateGrid1 = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {

    if(i === 20){
      rows.push(
        Array.from(Array(numCols), () => 1)
      );
    }
    else {
      rows.push(
        Array.from(Array(numCols), () => 0)
      );
    }
  }

  return rows;
};

const generateGrid2 = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {

      rows.push([0,1,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0]);
      
      }
  return rows;
};

function increaseSpeed(){
  speed = speed - 50;
}

function decreaseSpeed(){
  speed = speed + 50;
}

function increaseRows(){
  numRows = numRows + 1;

  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
  
}

function decreaseRows(){
  numRows = numRows - 1;

  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
  
}

function decreaseCols(){
  numCols = numCols - 1;

  const rows = [];
  for (let i = 0; i < numCols; i++) {
    rows.push(Array.from(Array(numRows), () => 0));
  }

  return rows;
  
}

function increaseCols(){
  numCols = numCols + 1;

  const rows = [];
  for (let i = 0; i < numCols; i++) {
    rows.push(Array.from(Array(numRows), () => 0));
  }

  return rows;
  
}


const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    
    setTimeout(runSimulation, speed);
  }, []);

  
  return (
    <>
    <ChakraProvider>

    <Flex mt={6}>
    <Spacer />
    <Button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "Stop" : "Start"}
      </Button>
      <Spacer />
      <Button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        Random board
      </Button>
      <Spacer />
      <Button
        onClick={() => {
          setGrid(generateGrid1());
        }}>
        Grid 1
      </Button>
      <Spacer />
      <Button
        onClick={() => {
          setGrid(generateGrid2());
        }}>
        Grid 2
      </Button>
      <Spacer />
      <Button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        Clear board
      </Button>
      <Spacer />
      <Button
        onClick={() => {
          decreaseSpeed();
        }}
      >
        Decrease speed
      </Button>
      <Spacer />
      <Button
        onClick={() => {
          increaseSpeed();
        }}
      >
        Increase speed
      </Button>
      <Spacer />
      <Button onClick={() => {
          setGrid(increaseRows());
        }}
      >
        Increase rows
      </Button>
      <Spacer />
      <Button onClick={() => {
          setGrid(decreaseRows());
        }}
      >
        Decrease rows
      </Button>
      <Spacer />
      <Button onClick={() => {
          setGrid(increaseCols());
        }}
      >
        Increase cols
      </Button>
      <Spacer />
      <Button onClick={() => {
          setGrid(decreaseCols());
        }}
      >
        Decrease cols
      </Button>
      <Spacer />
    </Flex>
  
      <div
        style={{
          display: "grid",
          justifyContent: "center",
          marginTop: 30,
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "#AFE3C0" : "#544E61",
                border: "solid 1px #659DBD"
              }}
            />
          ))
        )}
      </div>
      </ChakraProvider>
    </>
    
  );
};

export default App;