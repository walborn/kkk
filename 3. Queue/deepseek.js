// Реализуйте метод run класса Queue так, чтобы реализация соответствовала примеру использования.
// Данный метод должен последовательно выполнять переданные в него асинхронные функции.
// Следующая функция в очереди может быть вызвана только в том случае, если предыдущая вызвана next()
// Обратите внимание, что третий вызов run() в примере использования никогда не будет вызван.

class Queue {
  constructor() {
    this.queue = []
    this.isRunning = false
    this.index = 0
  }

  run(fn) {
    this.queue.push(fn)
    if (!this.isRunning) {
      this.isRunning = true
      this.next()
    }
    return this
  }

  next = () => {
    // Достаем задачу по порядку (без удаления из массива)
    if (this.index === this.queue.length) return this.isRunning = false
    const task = this.queue[this.index++]

    Promise
      .resolve(task(this.next))
      .catch(() => {
        this.isRunning = false
        this.queue = []
      })
  }
}

const queue = new Queue()

queue
  // .run(async (next) => {
  //   await new Promise(res => setTimeout(res, 100));
  //   throw new Error('Async error');
  // })
  .run(async (next) => {
    console.log('First task')
    // await new Promise((rs, rj) => setTimeout(rj, 500))
    // setTimeout(() => next(), 100)
    next() // Запускает вторую задачу
  })
  .run((next) => {
    console.log('Second task')
    throw new Error('Oops, something went wrong..')
    next() // Не будет вызван
  })
  .run((next) => {
    console.log("Third task (never reached)")
    next()
  })