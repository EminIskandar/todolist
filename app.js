// ------------------------------------------------------- Storage -------------------------------------------------------//
let data = []

// ------------------------------------------------------- Variable -------------------------------------------------------//
const themeIcon = document.querySelector('.header__icon')
const container = document.querySelector('body') 
const listContainer = document.querySelector('.todo__list')
const clearComplete = document.querySelector('.list-footer__clear span')
const addinput = document.querySelector('.todo__add .add__input input') 
const count = document.querySelector('.list-footer__counter span')
const filterButtons =  document.querySelectorAll('.list-footer__filter span')
const checkbox = document.querySelector('.add__icon  input')  
let dragStartIndex = null;
let dragEndIndex = null;

// ------------------------------------------------------- Events -------------------------------------------------------//

//add event to theme icon
themeIcon.addEventListener('click', changeTheme )

//is clearing selected of list items
clearComplete.addEventListener('click', clearSelectedListOfItems)

//is writing new value for to do list
addinput.addEventListener('keyup', addNewToDo)

//filtering list items 
filterButtons.forEach((btn,index)=>{
    btn.addEventListener('click', ()=>{filterListItems(index)})
})
 
// ------------------------------------------------------- Change themes -------------------------------------------------------//
function changeTheme (){ 
    if(container.classList.contains('dark')){
        container.classList.remove('dark')
        container.classList.add('light') 
    }else{
        container.classList.add('dark')
        container.classList.remove('light') 
    } 
}

// ------------------------------------------------------- Is inserting data to Dom -------------------------------------------------------//
function Load (datas){

    //is removing all list items
    listContainer.innerHTML = ''

    //is inserted data to dom
    datas.forEach((list,index)=>{
        listContainer.innerHTML += `<div class="list__item">
                                        <div class="list__item-container draggable${list.completed ? ' selected' : ''}" draggable="true" data-index="${index}">  
                                            <div class="list__item-content">
                                                <div class="list__icon todo--icon">
                                                    <input type="checkbox" name="icon" id="" data-id="${list.id}"  ${list.completed ? ' checked="true"' : ''}" >
                                                    <label for="icon"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg></label>
                                                </div>
                                                <div class="list__text todo--input" >
                                                    <input type="text" value="${list.content}" readonly> 
                                                </div>
                                            </div>
                                            <div class="list__button">
                                                <div class="list_button-edit" data-id="${list.id}">
                                                    <svg fill="#1fb141" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="32px" height="32px" class="none"><path d="M 20.292969 5.2929688 L 9 16.585938 L 4.7070312 12.292969 L 3.2929688 13.707031 L 9 19.414062 L 21.707031 6.7070312 L 20.292969 5.2929688 z"/></svg>
                                                    <svg fill="#494C6B" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 32 32" width="32px" height="32px"><path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"/></svg>                                        </div>
                                                <div class="list_button-remove" data-id="${list.id}">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>`
    })
    
    if(datas.length === 0){
        listContainer.innerHTML = `<span class="nothing">Nothing to do</span>`
    }

    //count of items
    count.innerHTML = `${datas.length} items left`

    //after they written in html, is added event
    addEventForListItem() 
}

// ------------------------------------------------------- Events for list items -------------------------------------------------------//
function addEventForListItem(){
    const listItems = document.querySelectorAll('.list__item-container') 

    listItems.forEach((item)=>{

        const checkbox = item.querySelector('.todo--icon input') 
        const editIcon = item.querySelectorAll('.list_button-edit svg')[1]
        const removeIcon = item.querySelector('.list_button-remove')
        const verifyIcon = item.querySelectorAll('.list_button-edit svg')[0]

        checkbox.addEventListener('click' , workDone)
        editIcon.addEventListener('click' , editListItem)
        removeIcon.addEventListener('click' , removeListItem)
        verifyIcon.addEventListener('click' , acceptEdit)

        //drag and drop events
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);  

    })
}


function findIndexItem(id){ 
    const index = data.findIndex(datas => datas.id === parseInt(id))
    return index
}

function workDone(e){ 
    const isSelected = e.target.checked
    const item = e.currentTarget.closest('.list__item-container')
    const index =  findIndexItem(e.target.dataset.id)  
    data[index].completed = isSelected
    item.classList.toggle('selected')
    
}

function editListItem (e) { 
    const icons = e.target.closest('.list__button').querySelectorAll('.list_button-edit svg')
    const input = e.target.closest('.list__item-container').querySelector('.todo--input input') 

    icons[0].classList.remove('none')
    icons[1].classList.add('none')

    input.readOnly = false
}

function acceptEdit(e){
    const index =  findIndexItem(e.currentTarget.parentNode.dataset.id)
    const input = e.target.closest('.list__item-container').querySelector('.todo--input input')
    const icons = e.target.closest('.list__button').querySelectorAll('.list_button-edit svg')

    icons[0].classList.add('none')
    icons[1].classList.remove('none')

    input.readOnly = true 
    data[index].content = input.value
}

function removeListItem (e){ 
    const index =  findIndexItem(e.currentTarget.dataset.id)
    data.splice( index, 1 )
    Load(data)
}


// ------------------------------------------------------- Clear all selected of list items -------------------------------------------------------//
function clearSelectedListOfItems () {
    const removedList = []

    //find
    data.forEach((list) => {
        if(list.completed){
            removedList.push(list.id)
        }
    })

    //removed
    removedList.forEach((id) => { 
        data = data.filter(function(item) { return item.id !== id })
    })

    removeActiveClassInFilters()
    addActiveClassInFilters(0)
    
    Load(data)
}


// ------------------------------------------------------- Is writing new value for to do list -------------------------------------------------------//
function addNewToDo(e) {

    const value = addinput.value
    const checked = checkbox.checked
    var uniq = (new Date()).getTime(); 
    const newTodo = {
        content: value,
        completed : false,
        id: uniq
    }

    if(e.keyCode === 13){
        if(value !== ''){
            if(checked){
                newTodo.completed = true
            }else{
                newTodo.completed = false
            }
    
            data.push(newTodo)
            addinput.value = ''
        }else{
            alert('Cannot be empty')
        }

        Load(data)
    }

    removeActiveClassInFilters()
    addActiveClassInFilters(0)
}

// ------------------------------------------------------- Filter -------------------------------------------------------//
function filterListItems (index) {

   let newData = data;

   removeActiveClassInFilters()
   addActiveClassInFilters(index)

    switch (index) {
        // select all
        case 0:
            newData = data
            break;

        //is selected active work
        case 1:
            newData = newData.filter(function(item) { return item.completed !== true })
            break;

        //is selected only complete work
        case 2:
            newData = newData.filter(function(item) { return item.completed !== false})
            break;
        default:
            break;
    }
    
    //is added active class to selected 
    filterButtons[index].classList.add('active')

    Load(newData)
}

function removeActiveClassInFilters(){
    //remove active class
    filterButtons.forEach((btn)=>{
        btn.classList.remove('active')
    })
}

function addActiveClassInFilters(index){
    //is added active class to selected 
    filterButtons[index].classList.add('active')
}
// ------------------------------------------------------- Drag and Drop -------------------------------------------------------//
function dragStart() { 
    dragStartIndex= +this.dataset.index  
}

function dragEnter(e) { 
    this.classList.add('over');
}

function dragLeave(e) { 
    this.classList.remove('over');
}

function dragOver(e) { 
    e.preventDefault();
}

function dragDrop() { 
    dragEndIndex = +this.dataset.index   
    swapDatas(dragStartIndex, dragEndIndex)
    this.classList.remove('over');
} 

function swapDatas(first, second ) {
    const firstData = data[first]
    const secondData  = data[second] 
    
    data.splice(first,1,secondData);
    data.splice(second,1,firstData); 

    Load(data)
}


Load(data)