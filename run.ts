import SafeEventEmitter from './SafeEventEmitter';

const emitter = new SafeEventEmitter();

// 1. Подписка на события
emitter.on('userCreated', (user) => {
  console.log(`Создан: ${user.name} (${user.email})`);
});

let onceCounter = 0;
emitter.onceTyped('userUpdated', () => {
  onceCounter++;
  console.log(`onceTyped вызван ${onceCounter} раз`);
});

// 2. Обработка ошибок
emitter.on('error', (error) => {
  console.log(`Ошибка перехвачена: ${error.message}`);
});

// Сломанный обработчик
emitter.on('userCreated', () => {
  throw new Error('Тестовая ошибка в обработчике!');
});

// 3. Использование
emitter.emit('userCreated', {
  id: 1,
  name: 'Иван',
  email: 'ivan@test.com'
});

emitter.emit('userCreated', {
  id: 2,
  name: 'Мария',
  email: 'maria@test.com'
});

console.log('onceTyped работает один раз');
emitter.emit('userUpdated', { id: 1, changes: { name: 'Новое имя' } });
emitter.emit('userUpdated', { id: 2, changes: { email: 'new@mail.com' } });

export default SafeEventEmitter;