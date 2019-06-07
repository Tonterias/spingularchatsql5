import { IChatNotification } from 'app/shared/model/chat-notification.model';
import { IOffensiveMessage } from 'app/shared/model/offensive-message.model';

export interface IChatMessage {
  id?: number;
  messageSentAt?: string;
  message?: string;
  isDelivered?: boolean;
  chatNotifications?: IChatNotification[];
  offensiveMessages?: IOffensiveMessage[];
  chatRoomId?: number;
  chatUserId?: number;
}

export class ChatMessage implements IChatMessage {
  constructor(
    public id?: number,
    public messageSentAt?: string,
    public message?: string,
    public isDelivered?: boolean,
    public chatNotifications?: IChatNotification[],
    public offensiveMessages?: IOffensiveMessage[],
    public chatRoomId?: number,
    public chatUserId?: number
  ) {
    this.isDelivered = this.isDelivered || false;
  }
}
