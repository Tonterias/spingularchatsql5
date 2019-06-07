import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IChatUser, ChatUser } from 'app/shared/model/chat-user.model';
import { ChatUserService } from './chat-user.service';
import { IUser, UserService } from 'app/core';

@Component({
  selector: 'jhi-chat-user-update',
  templateUrl: './chat-user-update.component.html'
})
export class ChatUserUpdateComponent implements OnInit {
  chatUser: IChatUser;
  isSaving: boolean;

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    creationDate: [null, [Validators.required]],
    bannedUser: [],
    userId: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected chatUserService: ChatUserService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ chatUser }) => {
      this.updateForm(chatUser);
      this.chatUser = chatUser;
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(chatUser: IChatUser) {
    this.editForm.patchValue({
      id: chatUser.id,
      creationDate: chatUser.creationDate != null ? chatUser.creationDate.format(DATE_TIME_FORMAT) : null,
      bannedUser: chatUser.bannedUser,
      userId: chatUser.userId
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const chatUser = this.createFromForm();
    if (chatUser.id !== undefined) {
      this.subscribeToSaveResponse(this.chatUserService.update(chatUser));
    } else {
      this.subscribeToSaveResponse(this.chatUserService.create(chatUser));
    }
  }

  private createFromForm(): IChatUser {
    const entity = {
      ...new ChatUser(),
      id: this.editForm.get(['id']).value,
      creationDate:
        this.editForm.get(['creationDate']).value != null ? moment(this.editForm.get(['creationDate']).value, DATE_TIME_FORMAT) : undefined,
      bannedUser: this.editForm.get(['bannedUser']).value,
      userId: this.editForm.get(['userId']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChatUser>>) {
    result.subscribe((res: HttpResponse<IChatUser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
