// это функция, внутри которой нужно написать ваш код
// roadMines (массив ячеек поля) будет задаваться в момент вызова функции, как в примере кода под ней
function moveTank(roadMines) {
  let health = 2;
  for (let i = 0; i < roadMines.length; i++) {
    if (roadMines[i] === true && health === 1) {
      health -= 1;
      console.log('танк уничтожен');
      return;
    }

    if (roadMines[i] === true && health === 2) {
      console.log('танк поврежден');
      health -= 1;
    }

    if (roadMines[i] === false) {
      console.log(`танк переместился на ${i + 1}`);
    }
  }
}

// вызов функции
moveTank([false, false, false, false, false, false, false, false, false, false]); // танк проедет п
// можете вызывать функцию сколько угодно раз подряд с различными параметрами

// строка ниже необходима, чтобы работало автоматическое тестирование
// не изменяйте этот код!
export default moveTank;
