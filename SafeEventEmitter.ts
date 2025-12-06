import { EventEmitter } from 'events';

//обертка над нативным EventEmitter
// используем готовый EventEmitter внутри (композиция) + скрываем реализацию
class SafeEventEmitter<EventMap extends Record<string, any>> {
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
    this.emitter.on(String(event), WrappedListener);
    return this;
  }

//сработает только при первом событии, потом удалится - однократная подписка на событие
  onceTyped<K extends keyof EventMap>(
    event: K, 
    listener: (data: EventMap[K]) => void
  ): this {
    const WrappedListener= this.createWrappedListener(event,listener);
    this.emitter.once(String(event), WrappedListener);
    return this;
  }

//метод для генерации события, после вызова которого все подписанные обработчики получат данные data  
  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): boolean {
    return this.emitter.emit(String(event), data);
  }

}

export default SafeEventEmitter;