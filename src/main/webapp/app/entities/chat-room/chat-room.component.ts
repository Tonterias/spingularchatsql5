import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import { ITEMS_PER_PAGE } from 'app/shared';

import { IChatRoom } from 'app/shared/model/chat-room.model';
import { AccountService } from 'app/core';

import { ChatRoomService } from './chat-room.service';

import { IChatUser } from 'app/shared/model/chat-user.model';
import { ChatUserService } from 'app/entities/chat-user';

@Component({
  selector: 'jhi-chat-room',
  templateUrl: './chat-room.component.html'
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  currentAccount: any;
  chatRooms: IChatRoom[];
  chatusers: IChatUser[];
  chatuser: IChatUser;

  currentSearch: string;

  error: any;
  success: any;
  eventSubscriber: Subscription;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  owner: any;
  isAdmin: boolean;

  arrayAux = [];
  arrayIds = [];

  constructor(
    protected chatRoomService: ChatRoomService,
    protected chatUserService: ChatUserService,
    protected parseLinks: JhiParseLinks,
    protected jhiAlertService: JhiAlertService,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
  }

  loadAll() {
    if (this.currentSearch) {
      const query = {
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      };
      query['roomDescription.contains'] = this.currentSearch;
      query['queryParams'] = 1;
      this.chatRoomService.query(query).subscribe(
        (res: HttpResponse<IChatRoom[]>) => {
          this.chatRooms = res.body;
          //                  console.log('CONSOLOG: M:loadAll & O: this.chatRooms : ', this.chatRooms);
          const query2 = {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()
          };
          query2['roomName.contains'] = this.currentSearch;
          query2['queryParams'] = 1;
          this.chatRoomService.query(query2).subscribe(
            (res2: HttpResponse<IChatRoom[]>) => {
              //                              console.log('CONSOLOG: M:loadAll & O: res2.body : ', res2.body);
              this.chatRooms = this.filterArray(this.chatRooms.concat(res2.body));
              //                              console.log('CONSOLOG: M:loadAll & O: this.chatRooms : ', this.chatRooms);
            },
            (res2: HttpErrorResponse) => this.onError(res2.message)
          );
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      return;
    }
    this.chatRoomService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<IChatRoom[]>) => this.paginateChatRooms(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  private filterArray(chatRooms) {
    this.arrayAux = [];
    this.arrayIds = [];
    chatRooms.map(x => {
      if (this.arrayIds.length >= 1 && this.arrayIds.includes(x.id) === false) {
        this.arrayAux.push(x);
        this.arrayIds.push(x.id);
      } else if (this.arrayIds.length === 0) {
        this.arrayAux.push(x);
        this.arrayIds.push(x.id);
      }
    });
    //              console.log('CONSOLOG: M:filterInterests & O: this.follows : ', this.arrayIds, this.arrayAux);
    return this.arrayAux;
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.router.navigate([
      '/chat-room',
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    this.router.navigate(['/chat-room'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    });
    this.loadAll();
  }

  clear() {
    this.page = 0;
    this.router.navigate([
      '/chat-room',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
      this.owner = account.id;
      this.isAdmin = this.accountService.hasAnyAuthority(['ROLE_ADMIN']);
      const query = {};
      query['id.equals'] = this.currentAccount.id;
      //        console.log('CONSOLOG: M:ngOnInit & O: query : ', query);
      this.chatUserService.query(query).subscribe(
        (res: HttpResponse<IChatUser[]>) => {
          this.chatuser = res.body[0];
          //            console.log('CONSOLOG: M:ngOnInit & O: this.chatUser : ', this.chatuser);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    });
    this.registerChangeInChatRooms();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IChatRoom) {
    return item.id;
  }

  registerChangeInChatRooms() {
    this.eventSubscriber = this.eventManager.subscribe('chatRoomListModification', response => this.loadAll());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  myChatRooms() {
    const query = {};
    if (this.currentAccount.id != null) {
      query['chatUserId.equals'] = this.chatuser.id;
      query['queryParams'] = 1;
    }
    this.chatRoomService
      .query(query)
      .subscribe(
        (res: HttpResponse<IChatRoom[]>) => this.paginateChatRooms(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  protected paginateChatRooms(data: IChatRoom[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.chatRooms = data;
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
