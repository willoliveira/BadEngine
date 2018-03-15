export enum Direction {
    Up = -1,
    Down = 1,
    Left = -1,
	Right = 1,
	Idle = 0
}

export interface Position {
	x: number;
	y: number;
}

export interface MovementDirection {
	x: Direction.Idle | Direction.Left | Direction.Right ,
	y: Direction.Idle | Direction.Up | Direction.Down
}