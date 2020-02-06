import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from "../angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";

@NgModule({
    declarations: [PostCreateComponent, PostListComponent],
    imports: [
        ReactiveFormsModule,
        AngularMaterialModule,
        CommonModule,
        RouterModule
    ]
  })
  export class PostsModule {}
  