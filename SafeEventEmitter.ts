import { EventEmitter } from 'events';

// стр-ра данных для пользователя
interface User {
  id: number;
  name: string;
  email: string;
}

//событие - тип данных, который оно передает
//EventMap - события, которые может обрабатывать SafeEventEmitter
interface EventMap {
  userCreated: User;
  userUpdated: { id: number; changes: Partial<User> }; //меняем только нужные поля
  error: Error;
}

//обертка над нативным EventEmitter
// используем готовый EventEmitter внутри (композиция) + скрываем реализацию
class SafeEventEmitter {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

//приватный метод для создания обертки вокруг слушателя, генерация события 'error'
  private createWrappedListener<K extends keyof EventMap>(
    event: K,
    originalListener: (data: EventMap[K]) => void //оригинальная ф-ция обработчик
  ): (data: EventMap[K]) => void {
    return (data: EventMap[K]) => {
      try {
        originalListener(data);
      } catch (listenerError) {
        const errorMessage = `Ошибка в обработчике события '${String(event)}': ${listenerError}`;
        const errorEventData = new Error(errorMessage) as EventMap['error'];
        
        if (event !== 'error') {
          this.emit('error', errorEventData);
        }
      }
    };
  }

// метод подписки на событие  
// K может быть только одним из ключей EventMap
  on<K extends keyof EventMap>(
    event: K, 
    listener: (data: EventMap[K]) => void //listener получит данные когда событие произойдет, EventMap[K] берет тип данных для этого конкретного события
  ): this {
    const WrappedListener = this.createWrappedListener(event, listener);
    this.emitter.on(event, WrappedListener);
    return this;
  }

//сработает только при первом событии, потом удалится - однократная подписка на событие
  onceTyped<K extends keyof EventMap>(
    event: K, 
    listener: (data: EventMap[K]) => void
  ): this {
    const WrappedListener= this.createWrappedListener(event,listener);
    this.emitter.once(event, WrappedListener);
    return this;
  }

//метод для генерации события, после вызова которого все подписанные обработчики получат данные data  
  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): boolean {
    return this.emitter.emit(event, data);
  }

}

export default SafeEventEmitter;