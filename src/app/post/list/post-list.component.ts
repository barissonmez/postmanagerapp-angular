import { Component, OnInit } from '@angular/core';
import { PostService } from '../common/post-service';
import { PostDataModel, PostModel, PostValidationModel } from '../common/post-data-model';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';

@Component({
    selector: 'post-list',
    templateUrl: './post-list.component.html',
    styles: [],
    providers: [ConfirmationService, MessageService, PostService]
})
export class PostListComponent {

    postData: PostDataModel = {} as PostDataModel;
    newPostModel: PostModel = {} as PostModel;
    postValidationModel: PostValidationModel = {} as PostValidationModel;
    display: boolean = false;

    constructor(private postService: PostService, private confirmationService: ConfirmationService, private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.populateList();
    }

    populateList() {
        this.postService.getPosts().subscribe(response => {
            this.postData.data = response;
        });
    }

    showDialog() {
        this.display = true;
        this.newPostModel = {} as PostModel;
    }

    createPost() {
        if (this.postModelIsValid()) {
            this.postService.createPost(this.newPostModel).subscribe({
                next: data => {
                    console.log('Delete successful');
                    this.messageService.add({ severity: 'info', summary: 'Created', detail: 'Post created' });
                    this.hideDialog();
                    this.populateList();
                },
                error: error => {
                    this.messageService.add({ severity: 'error', summary: 'Error Occured', detail: error });
                }
            });
        }
    }

    postModelIsValid(): boolean {
        this.postValidationModel.titleIsValid = this.newPostModel && this.newPostModel?.title?.trim() != null && this.newPostModel?.title?.trim() != '';
        this.postValidationModel.bodyIsValid = this.newPostModel && this.newPostModel?.body?.trim() != null && this.newPostModel?.body?.trim() != '';

        var result = this.postValidationModel.titleIsValid && this.postValidationModel.bodyIsValid;

        if (result == false)
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Please enter valid inputs.' });

        return result;
    }


    hideDialog() {
        this.display = false;
    }

    deleteItem(id: number) {

        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {

                this.postService.deletePost(id)
                    .subscribe({
                        next: data => {
                            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });

                            this.populateList();
                        },
                        error: error => {

                            console.error('There was an error!', error);
                        }
                    });


            },
            reject: (type: ConfirmEventType) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                        break;
                }

            }
        });
    }
}