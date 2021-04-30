let target2 = document.querySelector('#passivity');
let len2 = target.children.length;

target2.style.cssText = `width:calc(${len2} * 100%); display: flex; transition:1s`

Array.from(target2.children)
.forEach(ele => ele.style.cssText = `width:calc(100% / ${len2});`)

let pos2 = 0;

function dotSlide(id){
  pos2 = (id-1);
  showSlide();
}

function moveSlide(n){
  if(pos2+n < 0){
    n = 4;
  }
  pos2 = (pos2+n)%len2;
  showSlide();
}

function showSlide(){
  let dots = document.getElementsByClassName('dot');
  target2.style.marginLeft = `${pos2 * -100}%`

  for ( i = 0 ; i < dots.length ; i++ ){
    dots[i].style.background="#bbb";
  }

  dots[pos2].style.background="#717171"
}

window.onload = function() {
  showSlide();
  slide();
}