import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';

import {PostsService} from '../../shared/posts.service';
import {Post} from '../../shared/interfaces';

@Component({
    selector: 'app-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

    form: FormGroup;
    post: Post;
    submitted = false;

    uSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private postsService: PostsService
    ) {}

    ngOnInit() {
        this.route.params
            .pipe(
                switchMap((params: Params) => {
                    return this.postsService.getById(params['id']);
                })
            ).subscribe((post: Post) => {
            this.post = post;
            this.form = new FormGroup({
                title: new FormControl(post.title, Validators.required),
                text: new FormControl(post.text, Validators.required)
            });
        });
    }

    ngOnDestroy() {
        if (this.uSub) {
            this.uSub.unsubscribe();
        }
    }

    submit() {
        if (this.form.invalid) {
            return;
        }
        this.uSub = this.postsService.upadate({
            ...this.post,
            text: this.form.value.text,
            title: this.form.value.title
        }).subscribe(() => {
            this.submitted = false;
        });
    }

}
