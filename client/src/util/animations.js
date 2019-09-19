//WIN ANIMATION
const animate = (animation) => {
  switch (animation) {
  //diagonal 1
  case "diagonal0":
  document.getElementById('button0').style.background = '#ff4081';
  document.getElementById('button4').style.background = '#ff4081';
  document.getElementById('button8').style.background = '#ff4081';
  break;
  //diagonal 2
  case "diagonal1":
  document.getElementById('button2').style.background = '#ff4081';
  document.getElementById('button4').style.background = '#ff4081';
  document.getElementById('button6').style.background = '#ff4081';
  break;
  //horizontal 1
  case "vertical0":
  document.getElementById('button0').style.background = '#ff4081';
  document.getElementById('button3').style.background = '#ff4081';
  document.getElementById('button6').style.background = '#ff4081';
  break;
  //horizontal 2
  case "vertical1":
  document.getElementById('button1').style.background = '#ff4081';
  document.getElementById('button4').style.background = '#ff4081';
  document.getElementById('button7').style.background = '#ff4081';
  break;
  //horizontal 3
  case "vertical2":
  document.getElementById('button2').style.background = '#ff4081';
  document.getElementById('button5').style.background = '#ff4081';
  document.getElementById('button8').style.background = '#ff4081';
  break;
  //vertical 1
  case "horizontal0":
  document.getElementById('button0').style.background = '#ff4081';
  document.getElementById('button1').style.background = '#ff4081';
  document.getElementById('button2').style.background = '#ff4081';
  break;
  //vertical 2
  case "horizontal1":
  document.getElementById('button3').style.background = '#ff4081';
  document.getElementById('button4').style.background = '#ff4081';
  document.getElementById('button5').style.background = '#ff4081';
  break;
  //vertical 3
  case "horizontal2":
  document.getElementById('button6').style.background = '#ff4081';
  document.getElementById('button7').style.background = '#ff4081';
  document.getElementById('button8').style.background = '#ff4081';
  break;
  }
}