import { Injectable } from '@angular/core'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Environment } from '../../../environments/environment';
import { PostModel } from '../common/post-data-model';

@Injectable({
    providedIn: 'root',
})
export class PostService{

    constructor(private http: HttpClient) {}

    public getPosts() : Observable<PostModel[]> {
        return this.http.get<PostModel[]>(Environment.ApiUrl);
    }

    public getPost(id:number) : Observable<PostModel> {
        return this.http.get<PostModel>(Environment.ApiUrl + id);
    }

    public deletePost(id:number) {
        return this.http.delete(Environment.ApiUrl + id);
    }

    public createPost(post: PostModel) : Observable<Object> {
        var headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };

        const body = JSON.stringify(post);

        return this.http.post(Environment.ApiUrl, body, {headers} );
    }

    public updatePost(id:number, post: PostModel) : Observable<Object> {
        var headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        };

        const body = JSON.stringify(post);

        return this.http.put(Environment.ApiUrl+ id, body, {headers} );
    }
}