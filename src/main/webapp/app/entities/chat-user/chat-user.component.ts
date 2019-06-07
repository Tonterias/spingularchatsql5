import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IChatUser } from 'app/shared/model/chat-user.model';
import { AccountService } from 'app/core';
import { ChatUserService } from './chat-user.service';

@Component({
  selector: 'jhi-chat-user',
  templateUrl: './chat-user.component.html'
})
export class ChatUserComponent implements OnInit, OnDestroy {
  chatUsers: IChatUser[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected chatUserService: ChatUserService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.chatUserService
      .query()
      .pipe(
        filter((res: HttpResponse<IChatUser[]>) => res.ok),
        map((res: HttpResponse<IChatUser[]>) => res.body)
      )
      .subscribe(
        (res: IChatUser[]) => {
          this.chatUsers = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInChatUsers();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IChatUser) {
    return item.id;
  }

  registerChangeInChatUsers() {
    this.eventSubscriber = this.eventManager.subscribe('chatUserListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
