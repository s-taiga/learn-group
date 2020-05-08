export interface ChangeUnit{
    size: number;
    pos: number[];
}

export interface ShowUnit{
    origin: ChangeUnit;
    affected: ChangeUnit;
}