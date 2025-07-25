class Queue {
  constructor() {
    this.queue = []        // Очередь для хранения задач
    this.isRunning = false // Флаг, указывающий, выполняется ли очередь
  }

  run(task) {
    this.queue.push(task)   // Добавляем задачу в очередь
    if (!this.isRunning) {  // Если очередь не выполняется, запускаем её
      this.isRunning = true
      this.next()
    }
    return this             // Возвращаем this для цепочки вызовов
  }

  next = async () => {
    await this.queue.shift()?.(this.next)       // Передаем next как resolve
    this.isRunning = false 
  }
}

// Пример использования
const queue = new Queue()

queue
  .run(async (next) => {
    console.log('Hello')
    next();
  })
  .run((next) => {
    console.log('World')
    throw new Error('Oops, something went wrong..');
    next();
  })
  .run((next) => {
    console.log('Goodbye')
    // Этот код недостижим из-за ошибки выше
    next();
  });


// const start = performance.now();
// queue
//   .run(async (next) => {
//     console.log('Start 1', performance.now() - start);
//     await new Promise(res => setTimeout(res, 100));
//     console.log('End 1', performance.now() - start);
//     next();
//   })
//   .run((next) => {
//     console.log('Start 2', performance.now() - start); // Выведется ДО 'End 1'
//     next();
//   });