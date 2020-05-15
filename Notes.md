## Video 1
We have to create the stars as a state item as it will be an UI element that wil change its value

We use the jsx syntax and the range function that creates an Array from min to max values with step of 1. Then we map this array into a div creation for both stars and numbers


## Video 2
We have to split the stars and the buttonNumbers as different components to have a better structure.

## Video 3
We have implemented the states for the different numbers: Available or candidate, as wrong or used can be deducted from them. Then we can style them using the jsx styling functions learn. 

## Video 4
We have implemented the reset game functionality to restart it when the player has completed it.

## Unmount
Now we have removed the reset functionality and substitute it by using the mount/unmount functionality. To do so, we have labeled our game with an ID and each time the game finishes, it gets a new (different, using increment) id and restarts the state values to their originals.

NOTE: The timer functionality does not work properly at it doesn't follow the counter proportion (i.e. a regular times shows 8s seconds consumed where the game timer shows 2 (8 seconds left)).

## Use custom hooks
As the Game component now contains a lot of functionalities, we should create a custom hook to be the manager of the game and let the Game component to handle only some small computations and the UI.