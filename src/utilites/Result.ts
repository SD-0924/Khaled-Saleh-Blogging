class Result<T>{
    statusCode: number;
    value: T;
    constructor(value : T,statusCode:number){
        this.statusCode = statusCode;
        this.value = value;
    }
}


export interface ResultWithPagination<T>{
    results : T;
    page : number;
    pageSize : number;
    pages : number
    totalRecords: number;
}

export default Result;