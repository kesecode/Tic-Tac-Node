//WIN ANIMATION
const animate = (animation) => {
  switch (animation) {
  //diagonal 1
  case "diagonal0":
  document.getElementById('button0').classList.add('result');
  document.getElementById('button4').classList.add('result');
  document.getElementById('button8').classList.add('result');
  break;
  //diagonal 2
  case "diagonal1":
  document.getElementById('button2').classList.add('result');
  document.getElementById('button4').classList.add('result');
  document.getElementById('button6').classList.add('result');
  break;
  //horizontal 1
  case "vertical0":
  document.getElementById('button0').classList.add('result');
  document.getElementById('button3').classList.add('result');
  document.getElementById('button6').classList.add('result');
  break;
  //horizontal 2
  case "vertical1":
  document.getElementById('button1').classList.add('result');
  document.getElementById('button4').classList.add('result');
  document.getElementById('button7').classList.add('result');
  break;
  //horizontal 3
  case "vertical2":
  document.getElementById('button2').classList.add('result');
  document.getElementById('button5').classList.add('result');
  document.getElementById('button8').classList.add('result');
  break;
  //vertical 1
  case "horizontal0":
  document.getElementById('button0').classList.add('result');
  document.getElementById('button1').classList.add('result');
  document.getElementById('button2').classList.add('result');
  break;
  //vertical 2
  case "horizontal1":
  document.getElementById('button3').classList.add('result');
  document.getElementById('button4').classList.add('result');
  document.getElementById('button5').classList.add('result');
  break;
  //vertical 3
  case "horizontal2":
  document.getElementById('button6').classList.add('result');
  document.getElementById('button7').classList.add('result');
  document.getElementById('button8').classList.add('result');
  break;
  }
}