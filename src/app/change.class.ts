export interface ChangeUnit{
    size: number;
    pos: number[];
}

export interface ShowUnit{
    origin: ChangeUnit;
    affected: ChangeUnit;
}

export interface HistoryUnit{
    affect_unit: ChangeUnit;
    is_show: Boolean;
    pointer2affected_index: number[];
}