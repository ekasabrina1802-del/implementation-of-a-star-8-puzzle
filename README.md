# A* 8-Puzzle Solver
<img src="https://github.com/user-attachments/assets/6823c145-bda8-429d-920f-251d00a10ca6" alt="Tampilan 1" width="600" />
<img src="https://github.com/user-attachments/assets/5eba4802-2273-41f5-bf61-95f5b73f6687" alt="Tampilan 2" width="600" />

This project is a web-based implementation of the **A\*** algorithm to solve the **8-puzzle problem**. Built with **React** and **Vite**, this application allows users to enter an initial puzzle state, check whether it is solvable, and view the solution step by step.

## Overview
The 8-puzzle is a 3×3 board consisting of 8 numbered tiles and 1 empty space. The goal is to arrange the tiles into the correct order by sliding them into the empty space.
This project uses the **A\*** search algorithm with the **Manhattan Distance** heuristic to find the optimal solution.

## Features
- Input custom initial state
- Validate numbers from 0 to 8
- Check whether the puzzle is solvable
- Solve the puzzle using A*
- Show total steps
- Show explored nodes
- Display solution moves
- Step-by-step simulation
- Play, next, previous, and reset controls

## Technologies
- React
- Vite
- JavaScript
- CSS
