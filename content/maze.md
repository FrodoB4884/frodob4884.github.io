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

The start point was the random point where the DFS function began, and then the end point was defined as the point furthest from the start point. I used Manhattan distance to assess this due to using a grid based system. Manhattan distance is the sum of the absolute distances between the xs and ys of 2 points on the grid, so for two points $(x_{1},y_{1})$ and $(x_{2},y_{2})$, the Manhattan distance is $|x₁ - x₂| + |y₁ - y₂|$. I then implemented this as a function and iterated over every point in the maze comparing their distance to the start point to find the longest. Looking back on this project now I realise this was incredibly inefficient and could have simply been done by checking the corners of the grid for which is furthest since by my approach the corners always ended up being the furthest points. 

Having now finished the maze generator class I was able to start on the solution algorithm. I compared the A Star and Dijkstra algorithms for this since these are the most prominent algorithms for graph navigation and a grid based maze is simply a graph where all nodes/cells have connecting weights of 1. I decided on using A Star since it builds on Dijkstra by adding a heuristic to make informed choice on which node to visit next by approximate distance to the end. This improves on Dijkstra since it results in fewer nodes being considered and therefore a faster time. This heuristic also used Manhattan distance.

A Star uses two lists, an open list containing nodes to check, and a closed list of already visited nodes. The nodes in the open list are prioritized by cost calculated as cost to navigate to there from start plus the heuristic value which approximates distance to end. It keeps a "came from" map or in Python a "came from" dictionary that stores pointers and allows the path to be reconstructed backwards from the goal. So essentially when navigating this "came from" map is built and upon reaching the goal backtracks to reconstruct the successful path.

I then implemented this to add the successful path to the maze object as well as all explored areas to be visualised as an animation. I then added the same idea of animation to the construction of the maze by the generator storing the state of the maze at each step as well as how many steps to take through the states since even with drawing sped up turtle is pretty slow.

For example this video takes larger steps in the animation else it would be a few minutes long.

<video width=100% controls>
	<source src="videos/maze_example.mp4" type="video/mp4">
</video>

If I were to take this project further I would certainly make some areas more efficient and use a different visualisation engine, perhaps Taichi which is a python library that uses the GPU. I recommend it for any mathematical visualisation such as Mandelbrot fractals or even 3D visualisation.
