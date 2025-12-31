# Maze Generation and Solving

In 2024 I decided to undertake the creation and documentation of an A Level style programming project akin to the AQA Computer Science NEA.

I started by brainstorming ideas for something that would involve A Level CS algorithms but would also be interesting and relevant to my interests such as game design or robotics.

Eventually I landed on implementing maze generation and solution algorithms since they are often used in RPG video games and have actually practical use cases such as for GPS navigation.

Having decided the project, I set out the end goals:
 * Generate a challenging but solvable maze given size parameters
 * Visualise this maze on the screen as a grid
 * Solve the maze given it as an object
 * Visualise the solution to the maze
 * Be able to animate the generation and solution process (just for fun)
 
I started by creating the Maze class and designing the visualisation functions since that would aid in debugging the generation and solution aspects later on. I decided on using simple turtle graphics for display, though the drawing needed to be instantaneous to have full control over it as a display.
```
self.graphic = turtle.Turtle()
self.window = self.graphic.screen
self.window.tracer(0) # allows me to manually control updates
self.graphic.speed(0) # makes drawing instantaneous
```
I then defined some very simple helper functions such as drawing a single square of a given colour at a given coordinate and also drawing the frame of each cell in the grid. The Maze object had a grid as a property which existed as a 2D array where a 0 is an empty cell and a 1 is a filled cell. The general display function then went through each cell of the grid and drew a square if the cell was occupied. Later I expanded the Maze object to have solution and path process arrays which could then be visualised in the same manner.

The next logical step was to implement a generation algorithm, since that would allow me to test the solution algorithm later. I chose to use a recursive backtracking alogirthm, which is a randomised version of a Depth-First Search. The idea is it randomly chooses a direction to extend the path in by 2 grid cell units, until it cannot extend in any direction at that point in the path. At this moment it backtracks to an earlier junction (where it had made a decision to travel in a direction) and continues the path in a different direction from that point.

The start point was the random point where the DFS function began, and then the end point was defined as the point furthest from the start point. I used Manhattan distance to assess this due to using a grid based system. Manhattan distance is the sum of the absolute distances between the xs and ys of 2 points on the grid, so for two points $(x_{1},y_{1})$ and $(x_{2},y_{2})$, the Manhattan distance is $|x₁ - x₂| + |y₁ - y₂|$.