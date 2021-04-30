let one = ele => document.querySelector(ele);

let target = one('#auto');
let len = target.children.length;
  
target.style.cssText = `width:calc(100% * ${len}); display:flex; transition:2s;`

Array.from(target.children)
.forEach(ele => ele.style.cssText = `width:calc(100% / ${len});`)

const slide = _=> {
  let pos = 0;
  setInterval(() => {
    pos=(pos+1) % len;
    target.style.marginLeft = `${-pos * 100}%`
  }, 3000)
}
