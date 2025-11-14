import { EventEmitter } from 'events';

// Определяем типы для событий
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

// Типизированная карта событий
interface EventMap {
  userCreated: User;
  userUpdated: { id: number; changes: Partial<User> };
  productAdded: Product;
  error: Error;
}

class SafeEventEmitter {
  // КОМПОЗИЦИЯ: инкапсулируем нативный EventEmitter
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }
}

export default SafeEventEmitter;