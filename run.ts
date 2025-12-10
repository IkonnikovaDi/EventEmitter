import SafeEventEmitter from './SafeEventEmitter';
import { MessageEventMap, UserEventMap } from './types';

const eventEmmiter = new SafeEventEmitter<UserEventMap & MessageEventMap>();

// 1. Подписка на события
eventEmmiter.on('userCreated', (user) => {
  console.log(`Создан: ${user.name} (${user.email})`);
});

let onceCounter = 0;
eventEmmiter.onceTyped('userUpdated', () => {
  onceCounter++;
  console.log(`onceTyped вызван ${onceCounter} раз`);
});

eventEmmiter.on('newMessage', (message) => {
  console.log(`    Новое сообщение от ${message.author.name}:`);
  console.log(`   "${message.content}"`);
  console.log(`   Дата: ${message.date.toLocaleTimeString()}`);
});

// 2. Обработка ошибок
eventEmmiter.on('error', (error) => {
  console.log(`Ошибка перехвачена: ${error.message}`);
});

// Сломанный обработчик
eventEmmiter.on('userCreated', () => {
  throw new Error('Тестовая ошибка в обработчике!');
});

// 3. Использование
eventEmmiter.emit('userCreated', {
  id: 1,
  name: 'Иван',
  email: 'ivan@test.com'
});

const author = {
  id: 1,
  name: 'Мария',
  email: 'maria@test.com'
}

eventEmmiter.emit('newMessage', {
  id: 1,
  content: 'Привет',
  author: author,
  date: new Date()
});

console.log('onceTyped работает один раз');
eventEmmiter.emit('userUpdated', { id: 1, changes: { name: 'Новое имя' } });
eventEmmiter.emit('userUpdated', { id: 1, changes: { email: 'new@mail.com' } });

