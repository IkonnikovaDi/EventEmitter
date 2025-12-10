// стр-ра данных для пользователя
interface User {
  id: number;
  name: string;
  email: string;
}

// стр-ра для сообщения
interface Message {
    id: number;
    content: string;
    author: User;
    date: Date;
}

export interface UserEventMap {
  userCreated: User;
  userUpdated: { id: number; changes: Partial<User> }; //меняем только нужные поля
}

export interface MessageEventMap{
  newMessage: Message;
  updateMessage: { id: number; changes: Pick<Message, 'content'> }; //меняем только контент
}