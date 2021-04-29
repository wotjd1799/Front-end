let addList = [];
let inputButton = document.querySelector("#enter");
inputButton.addEventListener("click", addItem);
let showStart = false;

function addItem(){
  if ( !showStart ) {
    let item = document.querySelector("#typing").value;
    
    if( document.querySelector("#typing").value != "" ){
      addList.push(item);
      document.querySelector("#typing").value = "";
      document.querySelector("#typing").focus();
      showList();
    }
    else{
      alert("내용을 입력해주세요!");
    }  
  }
}

function deleteItem() {
  let deleteId = this.getAttribute("id");
  addList.splice(deleteId, 1);
  showList();
}

function showList(){
  let list = "<ul>"
  for (let i = 0 ; i < addList.length ; i++ ){
    if ( i == (addList.length-1) ){
      list += `<li class='text' id="${i}">`+ addList[i] + "<div class='button'>" +`<button onclick='uploading(${i})' class='upload' id="${i}">`+ "<img src='upload.png' id='upBotton'>" + "</botton>" + `<button class='delete' id="${i}">`+ "<img src='x.jpg' class='closeButton'>" + "</button>" + "</div>" +"</li>";
    }
    else{
      list += `<div id='liborder'><li class='text' id="${i}">`+ addList[i] + "<div class='button'>" + `<button onclick='uploading(${i})' class='upload' id="${i}">`+ "<img src='upload.png' id='upBotton'>" + "</botton>" + `<button class='delete' id="${i}">`+ "<img src='x.jpg' class='closeButton'>" + "</button>" + "</div>" +"</li></div>";
    }
  }
  list += "</ul>";
  document.querySelector("#list").innerHTML = list;

  let closeButton = document.querySelectorAll(".delete");
  for (let i = 0; i < closeButton.length; i++) {
    closeButton[i].addEventListener("click", deleteItem);
  }
}

let modalBotton = document.querySelector('#myPage');
modalBotton.addEventListener('click', function(){
  showModal('modal');
});

let todoData = {};

async function showModal(id) {
  showStart = true;

  let bg = document.getElementById('bg');
  
  bg.style.display = 'block'
  
  let modal = document.getElementById(id);

  modal.style.display = 'block';
  modal.style.zIndex = 2;

  await axios.get(`${DOMAIN}/todo`)
  .then((res) => {
    todoData = res.data;
    showDbList(todoData);
  });


}

function showDbList(Data){
  let list = '<ul>';
  let secretInput = '<input'
  for(let i = 0 ; i < Data.length; i++ ){
    if( todoData[i].isCheck === 0 ){
      list +=  `<li class='lineCheck' id='${Data[i].id}' style="text-decoration: none"><button class='check' id='${Data[i].id}' onclick='lineCheck(${Data[i].id},${i})'>`+ "<img src='./checkL.jpg' class='checkButton'></button>" + Data[i].content + `<div class='button'><button class='modify' id='${Data[i].id}' onclick='showText(${i})'><img src='./modify.png' class='modifyButton'></button><button class='dbDelete' id='${Data[i].id}'><img src='./x.jpg' class='closeButton'></button></div></li>`;
      list += secretInput + ` id='${i}'class="secretText" style="display:none" type="text" onkeyup="if(window.event.keyCode==13){addItem()}">`
    }
    else {
      list +=  `<li class='lineCheck' id='${Data[i].id}' style="text-decoration: line-through"><button class='check' id='${Data[i].id}' onclick='lineCheck(${Data[i].id},${i})'>`+ "<img src='./checkL.jpg' class='checkButton'></button>" + Data[i].content + `<div class='button'><button class='modify' id='${Data[i].id} onclick='showText(${i})'><img src='./modify.png' class='modifyButton'></button><button class='dbDelete' id='${Data[i].id}'><img src='./x.jpg' class='closeButton'></button></div></li>`;
      list += secretInput + ` id='${i}'class="secretText" style="display:none" type="text" onkeyup="if(window.event.keyCode==13){addItem()}">`
    }
  }
  list += '</ul>';
  document.querySelector('#bottom').innerHTML = list;

  let deleteButton = document.querySelectorAll(".dbDelete");
  for (let i = 0; i < deleteButton.length; i++) {
    deleteButton[i].addEventListener("click", function(){
      deleteDb(Data[i].id);
    });
  }
}

async function lineCheck(id, index){
  let target = document.getElementsByClassName('lineCheck')[index];

  await axios.patch(`${DOMAIN}/todo/check?id=${id}`)
  .then((res)=> {
    if( res.status == 200 ){
      if( todoData[index].isCheck === 1 ){ 
        target.style.textDecoration = 'line-through';
      }
      else if( todoData[index].isCheck === 0 ){
        target.style.textDecoration = 'none';
      }
      reload();
    }
  });
}

async function deleteDb(id){
  await axios.delete(`${DOMAIN}/todo?id=${id}`);
  reload();
}

function showText(index){

  let showtext = document.getElementsByClassName('secretText')[index];

  showtext.addEventListener("keydown", function(e){
    if(e.keyCode === 13){
      modifyDb(index);
    }
  })
  
  if( showtext.style.display === 'none'){
    showtext.style.display = 'block';
    showtext.value = document.getElementsByClassName('lineCheck')[index].textContent;
  }
  else{
    showtext.style.display = 'none';
    showtext.value = "";
  }
  
}

async function modifyDb(index){
  let text = document.getElementsByClassName('secretText')[index];
  console.log(text.value);
  let data = {
    content: text.value
  };
  console.log(data);
  await axios.put(`${DOMAIN}/todo/content?id=${todoData[index].id}`, data);
  reload();
}

function reload(){
  setTimeout(function(){
    close();
    showModal('modal');
  }, 50);
}

let del = document.querySelector('#close');
del.addEventListener('click', close);

window.onkeyup = function(e){
  let key = e.keyCode ? e.keyCode : e.which;

  if(key == 27){
    close();
  }
}

function close(){
  let bg = document.getElementById('bg');
  let modal = document.getElementById('modal');
  modal.style.display = 'none';
  bg.style.display = 'none';

  showStart = false;
}

function uploading(index){
  let item = document.getElementsByClassName('text')[index].textContent;
  alert("저장되었습니다!");
  let data = {
    content: item
  }

  request('post', '/todo', data);
}

const DOMAIN = 'http://20.194.1.45:8080';

const request = async(method, url, data) => {
  return await axios({
    method: method,
    url: DOMAIN + url,
    data: data
  }).then((res) => {
    return res.data
  })
};



// http://20.194.1.45:8080/todo

// baseurl : 20.194.1.45:8080
// Todo 올리기 : /todo
// Body로 content
// method : POST
// Todo 지우기 : /todo?id=
// method : DELETE
// Todo 체크 : /todo/check?id=
// method : PATCH
// Todo 가져오기 : /todo
// method : GET
// Todo 수정하기 : /modify/{todoId}
// Body로 content
// method : PUT