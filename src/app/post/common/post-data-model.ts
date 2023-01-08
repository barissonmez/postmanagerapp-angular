export interface  PostModel {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export interface  PostValidationModel {
    titleIsValid: boolean;
    bodyIsValid: boolean;
}

export interface  PostDataModel {
    data: PostModel[];
}