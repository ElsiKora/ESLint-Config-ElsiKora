export interface IUserData {
    readonly id: string;
    readonly name: string;
}
export declare class UserService {
    private readonly userData;
    constructor(userData: IUserData);
    getName(): string;
}
