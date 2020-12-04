const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const PETS_URL = `${BASE_URL}/pets`
const APMNT_URL = `${BASE_URL}/appointments`

document.addEventListener('DOMContentLoaded', () => {
    getUser()

    const appointmentForm = document.getElementById('appointment-form')
    appointmentForm.addEventListener('submit', createAppointment)
})

function getUser() {
    const label = document.createElement('label')
    label.textContent = 'Enter Your Name: '

    const user = document.createElement('input')
    user.type = 'text'
    user.setAttribute('class', 'form-control')
    user.id = 'user'
    user.setAttribute('required', '')

    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.setAttribute('class', 'btn btn-primary')
    submitBtn.textContent = 'Submit'

    const userForm = document.createElement('form')
    userForm.append(label, user, submitBtn)
    userForm.addEventListener('submit', (e) => {
        createUser(e)
        getPetData()
    })

    const inputHolder = document.getElementById('user-sign-in')
    inputHolder.appendChild(userForm)
}

function createUser(e) {
    e.preventDefault()
    const userInput = e.target.querySelector('#user')
    fetch(USERS_URL, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        },
        body: JSON.stringify({
            name: userInput.value,
            zip_code: '12345'
        })
    })
    .then(resp => resp.json())
    .then(user => {
        renderGreeting(user)
    })
    e.target.reset()
}

function renderGreeting(user) {  
    userName = user
    const greeting = document.querySelector('h5')
    greeting.textContent = `Welcome ${user.name} to Petopia!`

    const input = document.getElementById('user-sign-in')
    input.innerHTML = ''
}

function getPetData() {
    return fetch(PETS_URL)
    .then(resp => resp.json())
    .then(pets => {
        pets.forEach( pet => {
            generatePet(pet)
        })
    })
}

function generatePet(pet) {  

    const pic = document.createElement('img')
    pic.setAttribute('src', pet.img_url)
    pic.setAttribute('class', 'cat-pic')
    pic.addEventListener('click', () => renderInfo(pet))

    const list = document.querySelector('#list')
    list.appendChild(pic)
}

function renderInfo(pet) {
    const appointmentForm = document.getElementById('appointment-form')
    appointmentForm.innerHTML = ''

    const pic = document.createElement('img')
    pic.setAttribute('src', pet.img_url)
    pic.setAttribute('width', '450px')
    pic.setAttribute('height', '350px')

    const name = document.createElement('li')
    name.textContent = `Name: ${pet.name}`

    const breed = document.createElement('li')
    breed.textContent = `Breed: ${pet.breed}`

    const age = document.createElement('li')
    age.textContent = `Age: ${pet.age}`

    const kidFriendly = document.createElement('li')
    kidFriendly.textContent = `Kid Friendly: ${pet.kid_friendly}`

    const personality = document.createElement('li')
    personality.textContent = `Personality: ${pet.personality}`

    const selectBtn = document.createElement('button')
    selectBtn.textContent = 'Choose this fur ball'
    selectBtn.setAttribute('class', 'btn btn-primary')
    selectBtn.addEventListener('click', () => {
        renderForm(pet)
    })
    
    const ul = document.createElement('ul')
    ul.id = 'individual-pet-info'
    ul.append(name, breed, age, kidFriendly, personality, selectBtn)

    const petInfo = document.getElementById('pet-info')
    petInfo.innerHTML = ''
    petInfo.append(pic, ul)
}

function renderForm(pet) {
    const content = `
    <h2>Appointment Form</h2>
    <form id='appointment-form'>
        <div class="form-group">
            <label>Hooman Name: ${userName.name}</label>
        </div>

        <div class="form-group">
            <label>Pet name: </label>
            <input type="text" class="form-control" id="${pet.id}" value="${pet.name}">
        </div>

        <div class="form-group">
            <label>Start Date: </label>
            <input type="date" class="form-control" id="start-date" required>
        </div>

        <div class="form-group">
            <label>End Date: </label>
            <input type="date" class="form-control" id="end-date" required>
        </div>

        <button type="submit" class="btn btn-primary">Submit</button>
    </form>`

    const formHolder = document.getElementById('appointment-form')
    formHolder.innerHTML = content
    if (!(formHolder.innerText === '')) {
        formHolder.setAttribute('style', '')
    }
}

function createAppointment(e) {
    e.preventDefault()
    const pet = e.target.querySelectorAll('div')[1].querySelector('input')
    const startDate = e.target.querySelectorAll('div')[2].querySelector('#start-date').value
    const endDate = e.target.querySelectorAll('div')[3].querySelector('#end-date').value

    fetch(APMNT_URL, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        },
        body: JSON.stringify({
            user_id: userName.id,
            pet_id: pet.id,
            start_date: startDate,
            end_date: endDate
        })
    })
    .then(resp => resp.json())
    .then(appointment => {
        renderCalendar(pet, appointment)
    })
}

function renderCalendar(pet, appointment) {
    const main = document.getElementById('info-form')
    main.setAttribute("style", "display: none;")
     
    // const header = document.createElement('h3')
    // header.textContent = 'Appointment List'
    // main.appendChild(header)

    const calendar = document.querySelector('#calendar')
    calendar.setAttribute('style', '')
    populateCalendar(pet, appointment)
}

function populateCalendar(pet, appointment){
    // set as global variable to repopulate calendar after pressing next/previous
    apmnt = appointment
    petName = pet
    
    // get day only from start/end date
    const sDate = appointment.start_date.split('-')[2]
    const eDate = appointment.end_date.split('-')[2]

    // add pet name to calendar at the matching date
    for(let i = parseInt(sDate); i < (parseInt(eDate[1])+1); i+=1){
        const li = document.createElement('li')
        li.textContent = `${petName.value}`
        li.addEventListener('click', renderAppointmentDetails)
        
        const appointmentList = document.createElement('ul')
        appointmentList.appendChild(li)
        // id for appointment delete function
        appointmentList.id = `${i}`
        appointmentList.setAttribute('class', 'apt-list-item') 

        const startDate = document.getElementById(`0${i}`)
        startDate.appendChild(appointmentList)
    }
}

// render new appointment details
function renderAppointmentDetails(e) {
    const name = document.createElement('li')
    name.textContent = `Hooman Name: ${userName.name.split('')[0].toUpperCase() + userName.name.slice(1)}`
    
    const pet = document.createElement('li')
    pet.textContent = `Pet Name: ${e.target.textContent}`
    
    const startDate = document.createElement('li')
    startDate.textContent = `Start Date: ${apmnt.start_date}`
    
    const endDate = document.createElement('li')
    endDate.textContent = `End Date: ${apmnt.end_date}`

    const header = document.createElement('h2')
    header.textContent = 'Appointment Details'

    // reschedule button
    const upadteBtn = document.createElement('button')
    upadteBtn.textContent = 'Reschedule'
    upadteBtn.setAttribute('class', 'btn btn-outline-primary col-sm-6')
    upadteBtn.addEventListener('click', () => {
        renderRescheduleForm()
    })

    // cancel button
    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Cancel'
    deleteBtn.setAttribute('class', 'btn btn-outline-primary col-sm-6')
    deleteBtn.addEventListener('click', deleteAppointment)

    const apmntDetails = document.createElement('ul')
    apmntDetails.append(header, name, pet, startDate, endDate, upadteBtn, deleteBtn)
    
    const apmntInfo = document.getElementById('info')
    apmntInfo.innerHTML = ''
    apmntInfo.appendChild(apmntDetails)
}

// render a rechedule form with start date and end date
function renderRescheduleForm() {
    const content = `
    <form id='reschedule-form'>
        <div class="form-group">
            <label id='name'>Name: ${userName.name}</label>
        </div>

        <div class="form-group">
            <label id='pet-name'>Pet name: ${petName.value}</label>
        </div>

        <div class="form-group">
            <label>Start Date: </label>
            <input type="date" class="form-control" id="new-start-date" required>
        </div>

        <div class="form-group">
            <label>End Date: </label>
            <input type="date" class="form-control" id="new-end-date" required>
        </div>

        <button type="submit" class="btn btn-primary">Confirm</button>
    </form>`

    const rescheduleForm = document.getElementById('reschedule-form')
    rescheduleForm.innerHTML = content
    addEventForResForm()

    const appointmentInfo = document.getElementById('info')
    appointmentInfo.setAttribute('style', 'display: none;')
}

// add submit event for reschedule form
function addEventForResForm() {
    const form = document.getElementById('reschedule-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const newStartDate = e.target.querySelector('#new-start-date').value
        const newEndDate = e.target.querySelector('#new-end-date').value
        const id = apmnt.id
        fetch(APMNT_URL + '/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
            },
            body: JSON.stringify({
                start_date: newStartDate,
                end_date: newEndDate
            })
        })
        .then(resp => resp.json())
        .then(data => {
            populateAppointmentWithNewData(data)
            updateCalendar(data)
        })
    })
}

// populate page with updated appointment data
function populateAppointmentWithNewData(data){
    // hide reschedule form
    const rescheduleForm = document.getElementById('reschedule-form')
    rescheduleForm.setAttribute('style', 'display: none;')

    // populate page with updated data optimistically
    const appointmentInfo = document.getElementById('info')
    appointmentInfo.setAttribute('style', '')

    const startDate = appointmentInfo.querySelectorAll('li')[2]
    startDate.textContent = `Start Date: ${data.start_date}`
    
    const endDate = document.getElementById('info').querySelectorAll('li')[3]
    endDate.textContent = `End Date: ${data.end_date}`
}

// move pet's name to updated date on calendar
function updateCalendar(data){
    console.log(data, apmnt)
    // empty out calendar
    emptyCalendar(apmnt)

    const sDate = data.start_date.split('-')[2]
    const eDate = data.end_date.split('-')[2]
    // add pet name to calendar at the matching date
    for(let i = parseInt(sDate); i < (parseInt(eDate[1])+1); i+=1){
        const li = document.createElement('li')
        li.textContent = `${petName.value}`
        li.addEventListener('click', renderAppointmentDetails)
        
        const appointmentList = document.createElement('ul')
        appointmentList.appendChild(li)
        // id for appointment delete function
        appointmentList.id = `${i}`

        // add condition to check if date is 1 or 2 character
        const startDate = document.getElementById(`0${i}`)
        startDate.appendChild(appointmentList)
    }
}

// cancel appointment
function deleteAppointment(e) {
    const id = apmnt.id
    fetch(APMNT_URL + '/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        }
    })
    const appointmentInfo = document.getElementById('info')
    appointmentInfo.innerHTML = ''

    const calendar = document.getElementById('calendar')
    calendar.setAttribute('style', 'display: none;')

    const mainPage = document.getElementById('info-form')
    mainPage.setAttribute('style', '')

    const appointmentForm = document.getElementById('appointment-form')
    appointmentForm.setAttribute('style', 'display: none;')

    // clear pet names on calendar when delete
    emptyCalendar(apmnt)
}

function emptyCalendar(appointment){ 
    const sDate = appointment.start_date.split('-')[2]
    const eDate = appointment.end_date.split('-')[2]
    // remove pet name to calendar at the matching date
    for(let i = parseInt(sDate); i < (parseInt(eDate[1])+1); i+=1){
        const appointmentList = document.getElementById(`${i}`)
        appointmentList.innerHTML = ''
    }
}

// CALENDAR

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
    // populateCalendar(petName, apmnt)
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
    // populateCalendar(petName, apmnt)
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            }

            else {
                let cell = document.createElement("td");
                date.length > 1 ? cell.id = date : cell.id = `0${date}`
                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info1");
                } // color today's date
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row); // appending each row into calendar body.
    }
}

