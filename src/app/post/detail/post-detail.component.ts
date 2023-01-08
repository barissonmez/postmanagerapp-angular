import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../common/post-service';
import { PostDataModel, PostModel, PostValidationModel } from '../common/post-data-model';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'post-detail',
  templateUrl: './post-detail.component.html',
  styles: [],
  providers: [ConfirmationService, MessageService, PostService]
})
export class PostDetailComponent {

  postId: string | null = '';
  postModel: PostModel = {} as PostModel;
  postValidationModel: PostValidationModel = {} as PostValidationModel;

  constructor(private route: ActivatedRoute, private router: Router, private postService: PostService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId == null) return;

    this.postService.getPost(Number(this.postId)).subscribe(response => {
      this.postModel = response;
    });
  }

  cancel() {

    this.confirmationService.confirm({
      message: 'Do you really want to discard changes?',
      header: 'Cancel Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.router.navigate(['posts']);
      }
    });
  }


  updatePost() {

    if (this.postId == null) return;

    if (this.postModelIsValid()) {

      this.confirmationService.confirm({
        message: 'Do you really want to save changes?',
        header: 'Update Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.postService.updatePost(Number(this.postId), this.postModel).subscribe({
            next: data => {
              this.router.navigate(['posts']);
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Error Occured', detail: error });
            }
          });
        }
      });
    }
  }

  postModelIsValid(): boolean {
    this.postValidationModel.titleIsValid = this.postModel && this.postModel?.title?.trim() != null && this.postModel?.title?.trim() != '';
    this.postValidationModel.bodyIsValid = this.postModel && this.postModel?.body?.trim() != null && this.postModel?.body?.trim() != '';

    var result = this.postValidationModel.titleIsValid && this.postValidationModel.bodyIsValid;

    if (result == false)
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Please enter valid inputs.' });

    return result;
  }

}