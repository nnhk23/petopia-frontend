const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const PETS_URL = `${BASE_URL}/pets`
const APMNT_URL = `${BASE_URL}/appointments`
let apmnt
let petName

document.addEventListener('DOMContentLoaded', () => {
    getUser()

    const homePage = document.getElementById('petopia')
    homePage.addEventListener('click', renderMainPage)

    const appointmentForm = document.getElementById('appointment-form')
    appointmentForm.addEventListener('submit', createAppointment)

    const rescheduleForm = document.getElementById('reschedule-form')
    rescheduleForm.addEventListener('submit', renderNewAppointment)
})

function getUser() {
    const label = document.createElement('label')
    label.textContent = 'Enter Your Name: '

    const user = document.createElement('input')
    user.type = 'text'
    user.setAttribute('class', 'form-control')
    user.setAttribute('placeholder', 'your name here')
    user.setAttribute('required', '')
    user.id = 'user'

    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.setAttribute('class', 'btn btn-info')
    submitBtn.id = 'submit'
    submitBtn.textContent = 'Submit'

    const userForm = document.createElement('form')
    userForm.setAttribute('class', 'form-group')
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

// replace sign-in box with user greeting
function renderGreeting(user) {  
    userName = user
    const greeting = document.querySelector('h4')
    greeting.textContent = `Welcome ${user.name} to Petopia!`

    const input = document.getElementById('user-sign-in')
    input.innerHTML = ''

    const viewAppointments = document.getElementById('view-all-apmnt-btn')
    viewAppointments.setAttribute('style', '')
    viewAppointments.textContent = 'View All Appointments'
    viewAppointments.setAttribute('class', 'btn btn-info')
    viewAppointments.addEventListener('click', renderAllAppointments)

    const dropdown = document.getElementById('dropdown-breed')
    dropdown.setAttribute('style', '')

    // log out button
    const signOutBtn = document.getElementById('sign-out-btn')
    signOutBtn.textContent = 'Sign Out'
    signOutBtn.setAttribute('style', '')
    signOutBtn.addEventListener('click', () => {
        document.location.reload()
        alert("See you again soon ♡♡♡!")
    })
}

function renderMainPage(){
    const infoForm = document.getElementById('info-form')
    infoForm.setAttribute('style', '')

    const petInfo = document.getElementById('pet-info')
    petInfo.setAttribute('style', '')
    petInfo.innerHTML = ''

    const appointmentForm = document.getElementById('appointment-form')
    appointmentForm.setAttribute('style', 'display: none;')

    const calendar = document.getElementById('calendar')
    calendar.setAttribute('style', 'display: none;')

    const appointmentInfo = document.getElementById('appointment-info')
    appointmentInfo.setAttribute('style', 'display: none;')

    const allApmnt = document.getElementById('all-appointments')
    allApmnt.setAttribute('style', 'display: none;')
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

// show list of all appointments
async function renderAllAppointments() {
    const petInfo = document.getElementById('pet-info')
    petInfo.innerHTML = ''

    const infos = document.getElementById('appointment-info')
    infos.setAttribute('style', '')

    const details = document.getElementById('info')
    details.setAttribute('style', 'display: none;')

    const id = userName.id
    await sleep(500)
    fetch(USERS_URL + '/' + id)
    .then(resp => resp.json())
    .then(data => {
        console.log('data', data)
        const header = document.createElement('h2')
        header.textContent = 'List Of Booked Appointments'
        header.id = 'booked-appointment'

        const appointmentList = document.createElement('ul')
        appointmentList.id = 'pet-names-holder'
        if (data.pets.length === 0){
            const content = document.createElement('p')
            content.textContent = "Awwww shucks, you don't have any appointments booked yet :(. Let's start by clicking on our pet's icon!!!"
            content.id = 'warning'

            const doge = document.createElement('img')
            doge.id = 'doge'
            doge.setAttribute('src', 'https://media.giphy.com/media/HCTfYH2Xk5yw/giphy.gif')

            appointmentList.append(content, doge)
        }
        for(let i=0; i < data.pets.length; i+=1){
            const name = document.createElement('li')
            name.textContent = data.pets[i].name
            name.setAttribute('class', 'list-group-item list-group-item-action list-group-item-info')
            name.id = 'all-appointments-pet-name'
            name.addEventListener('click', (e) => {
                console.log('click event', e.target)
                console.log('appointment details', data.appointments[i])
                renderApmntAndPet(e, data.appointments[i])
            })

            appointmentList.appendChild(name)
        }

        const list = document.getElementById('all-appointments')
        list.innerHTML = ''
        list.setAttribute('style', '')
        list.append(header, appointmentList)
    })
}

function renderApmntAndPet(e, appointment){
    console.log(e.target)
    petName = e.target
    apmnt = appointment
    fetch(APMNT_URL + '/' + `${apmnt.id}`)
    .then(resp => resp.json())
    .then(data => {
        renderAppointmentDetails(data)
        const deleteBtn = document.getElementById('delete-btn')
        deleteBtn.setAttribute('style', '')
        const apmntInfo = document.getElementById('info')
        apmntInfo.setAttribute('style', '')
    })
}

function sortByCat(){
    const dogs = document.getElementsByClassName('dog-pic')
    const cats = document.getElementsByClassName('cat-pic')
    for(let i = 0; i < dogs.length; i+=1){
        dogs[i].setAttribute('style', 'display:none;')
        cats[i].setAttribute('style', '')
    }
}

function sortByDog(){
    const dogs = document.getElementsByClassName('dog-pic')
    const cats = document.getElementsByClassName('cat-pic')
    for(let i = 0; i < cats.length; i+=1){
        cats[i].setAttribute('style', 'display:none;')
        dogs[i].setAttribute('style', '')
    }
}

function undoSort(){
    const dogs = document.getElementsByClassName('dog-pic')
    const cats = document.getElementsByClassName('cat-pic')
    for(let i = 0; i < cats.length; i+=1){
        cats[i].setAttribute('style', '')
        dogs[i].setAttribute('style', '')
    }
}

function populateAllAppointments(data) {
    let objName
    data.appointments.forEach(appointment => {
        data.pets.forEach(pet => {
            if (pet.id == appointment.pet_id){
                objName = pet.name
            }
        })
        const sDate = appointment.start_date.split('-')[2]
        const eDate = appointment.end_date.split('-')[2]

        let limit
        eDate.length > 1 ? limit = (parseInt(eDate)+1) : limit = (parseInt(eDate[1])+1)
        // add pet name to calendar at the matching date
        for(let i = parseInt(sDate); i < limit; i+=1){
            const li = document.createElement('li')
            li.textContent = `${objName}`
            li.addEventListener('click', renderAppointmentDetails)
            
            const appointmentList = document.createElement('ul')
            appointmentList.appendChild(li)
            // id for appointment delete function
            appointmentList.id = `${i}`
            appointmentList.setAttribute('class', 'apt-list-item') 

            let startDate
            `${i}`.length > 1 ? startDate = document.getElementById(`${i}`) : startDate = document.getElementById(`0${i}`)
            startDate.appendChild(appointmentList)
        }
    })
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
    pet.species == "Cat" ? pic.setAttribute('class', 'cat-pic') : pic.setAttribute('class', 'dog-pic')
    pic.addEventListener('click', () => renderInfo(pet))

    const list = document.querySelector('#list')
    list.appendChild(pic)
}

function renderInfo(pet) {
    const allApmnt = document.getElementById('all-appointments')
    allApmnt.setAttribute('style', 'display:none;')

    const appointmentForm = document.getElementById('appointment-form')
    appointmentForm.innerHTML = ''

    const calendar = document.getElementById('calendar')
    calendar.setAttribute('style', 'display:none;')

    const header = document.createElement('h2')
    header.textContent = 'Pet Details'

    const pic = document.createElement('img')
    pic.setAttribute('src', pet.img_url)
    pic.id = 'pet-portrait'

    const caption = document.createElement('p')
    caption.textContent = 'click me for more details about pet.'
    caption.id = 'pet-pic-caption'

    const clickablePic = document.createElement('a')
    clickablePic.setAttribute('href', pet.url)
    clickablePic.setAttribute('target', '_blank')
    clickablePic.append(pic, caption)

    const name = document.createElement('li')
    name.textContent = `Name: ${pet.name}`
    name.setAttribute('class', "list-group-item")

    const breed = document.createElement('li')
    breed.textContent = `Breed: ${pet.breed}`
    breed.setAttribute('class', "list-group-item")

    const age = document.createElement('li')
    age.textContent = `Age: ${pet.age}`
    age.setAttribute('class', "list-group-item")

    const kidFriendly = document.createElement('li')
    kidFriendly.textContent = `Kid Friendly: ${pet.kid_friendly}`
    kidFriendly.setAttribute('class', "list-group-item")

    const personality = document.createElement('li')
    personality.textContent = `Personality: ${pet.personality}`
    personality.setAttribute('class', "list-group-item")

    const description = document.createElement('li')
    description.textContent = `Pet Description: ${pet.description}`
    description.setAttribute('class', "list-group-item")

    const contact = document.createElement('li')
    contact.textContent = `Shelter's Email: ${pet.email}`
    contact.setAttribute('class', "list-group-item")

    const selectBtn = document.createElement('button')
    selectBtn.textContent = 'Choose this fur ball'
    selectBtn.setAttribute('class', 'btn btn-info')
    selectBtn.id = 'select-pet'
    selectBtn.addEventListener('click', () => {
        renderForm(pet)
    })
    
    const ul = document.createElement('ul')
    ul.id = 'individual-pet-info'
    ul.setAttribute('class', 'list-group1 list-group-flush')
    ul.append(header, name, breed, age, kidFriendly, personality, description, contact, selectBtn)

    const petInfo = document.getElementById('pet-info')
    petInfo.innerHTML = ''
    petInfo.append(clickablePic, ul)
}

function renderForm(pet) {
    const content = `
    <h2 style="padding-left: 345px;">Appointment Form</h2>
    <form id='appointment-form'>
        <div class="form-group">
            <label><strong>Hooman Name:</strong> ${userName.name}</label>
        </div>

        <div class="form-group">
            <label><strong>Pet name: </strong></label>
            <input type="text" class="form-control" id="${pet.id}" value="${pet.name}" disabled>
        </div>

        <div class="form-group">
            <label><strong>Start Date: </strong></label>
            <input type="date" class="form-control" id="start-date" required>
        </div>

        <div class="form-group">
            <label><strong>End Date: </strong></label>
            <input type="date" class="form-control" id="end-date" required>
        </div>

        <button type="submit" class="btn btn-info">Submit</button>
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
        renderAppointmentDetails(appointment)
    })
}

function renderCalendar(pet, appointment) {
    petName = pet
    const main = document.getElementById('info-form')
    main.setAttribute("style", "display: none;")
 
    const calendar = document.querySelector('#calendar')
    calendar.setAttribute('style', '')
    fetch(APMNT_URL + '/' + `${appointment.id}`)
    .then(resp => resp.json())
    .then(data => {
        populateCalendar(data)
    })
}

function populateCalendar(appointment){
    emptyCalendar(appointment)
    // set as global variable to repopulate calendar after pressing next/previous
    if (!apmnt){
        apmnt = appointment
    }
    // get day only from start/end date
    const sDate = appointment.start_date.split('-')[2]
    const eDate = appointment.end_date.split('-')[2]

    let limit
    eDate.length > 1 ? limit = (parseInt(eDate)+1) : limit = (parseInt(eDate[1])+1)
    // add pet name to calendar at the matching date
    for(let i = parseInt(sDate); i < limit; i+=1){
        const li = document.createElement('li')
        li.textContent = `${petName.value}`
        li.addEventListener('click', () => {
            const apmntInfo = document.getElementById('info')
            apmntInfo.setAttribute('style', '')
        })
        
        const appointmentList = document.createElement('ul')
        appointmentList.appendChild(li)
        // id for appointment delete function
        let ulId
        `${i}`.length > 1 ? ulId = `0${i}` : ulId = `${i}`
        appointmentList.id = ulId
        appointmentList.setAttribute('class', 'apt-list-item') 

        let startDate
        `${i}`.length > 1 ? startDate = document.getElementById(`${i}`) : startDate = document.getElementById(`0${i}`)
        startDate.appendChild(appointmentList)
    }
}

// render new appointment details
function renderAppointmentDetails(appointment) {
    const name = document.createElement('li')
    name.textContent = `Hooman Name: ${userName.name.split('')[0].toUpperCase() + userName.name.slice(1)}`
    name.setAttribute('class', "theme-purple")
    
    const pet = document.createElement('li')
    pet.setAttribute('class', "theme-purple")
    !!petName.value ? pet.textContent = `Pet Name: ${petName.value}` : pet.textContent = `Pet Name: ${petName.textContent}`
    
    const startDate = document.createElement('li')
    startDate.textContent = `Start Date: ${appointment.start_date}`
    startDate.setAttribute('class', "theme-purple")
    
    const endDate = document.createElement('li')
    endDate.textContent = `End Date: ${appointment.end_date}`
    endDate.setAttribute('class', "theme-purple")

    const header = document.createElement('h2')
    header.textContent = 'Appointment Details'

    // reschedule button
    const upadteBtn = document.createElement('button')
    upadteBtn.textContent = 'Reschedule'
    upadteBtn.setAttribute('class', 'btn btn btn btn-outline-secondary col-sm-6')
    upadteBtn.addEventListener('click', () => {
        renderRescheduleForm()
    })

    // cancel button
    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Cancel'
    deleteBtn.setAttribute('class', 'btn btn btn btn-outline-secondary col-sm-6')
    deleteBtn.setAttribute('style', 'display: none;')
    deleteBtn.id = 'delete-btn'
    deleteBtn.addEventListener('click', () => {
        let ans = confirm("Are you 10000% sure to cancel me? :(")
        // delete button confirmation
        if (ans == true) {
            deleteAppointment()

            let petObj
            !!petName.value ? petObj = petName.value : petObj = petName.textContent

            alert(`Appointment with ${petObj} is cancelled.`)
        }
    })

    const apmntDetails = document.createElement('ul')
    apmntDetails.append(header, name, pet, startDate, endDate, upadteBtn, deleteBtn)
    
    const apmntInfo = document.getElementById('info')
    apmntInfo.innerHTML = ''
    // hide appointment details temporary, waiting for click event
    apmntInfo.setAttribute('style', 'display: none;')
    apmntInfo.appendChild(apmntDetails)

    const infoHolder = document.getElementById('appointment-info')
    infoHolder.setAttribute('style', '')
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

        <button type="submit" class="btn btn-info">Confirm</button>
    </form>`

    const rescheduleForm = document.getElementById('reschedule-form')
    rescheduleForm.innerHTML = content

    // add submit event for reschedule form
    rescheduleForm.setAttribute('style', '')

    // hide appointment info
    const appointmentInfo = document.getElementById('info')
    appointmentInfo.setAttribute('style', 'display: none;')
}

function renderNewAppointment(e) {
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
    emptyCalendar(apmnt)
    populateCalendar(data)
}

// cancel appointment
function deleteAppointment() {
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

    // re-render updated appointment list
    const allApmnt = document.getElementById('appointment-info')
    allApmnt.setAttribute('style', 'display: none;')
    
    renderAllAppointments()
    // clear pet names on calendar when delete
    emptyCalendar(apmnt)
}

function emptyCalendar(appointment){ 
    // clear out all pet's name
    console.log('hit empty calendar')
    for(let a = 1; a < 32; a+=1){
        let n
        let appointmentList
        `${a}`.length > 1 ? n = `0${a}` : n = `${a}`   
        if (!!document.getElementById(n)){
            appointmentList = document.getElementById(n)
            appointmentList.remove()
            console.log('clearing calendar')
        }
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
    populateCalendarBasedOnFullDate(currentMonth, currentYear, apmnt)
}

// populate calendar after clicking next/previous
function populateCalendarBasedOnFullDate(month, year, appointment){
    const currentMonth = (new Date(year, month)).getMonth() + 1
    const sMonth = appointment.start_date.split('-')[1]

    fetch(APMNT_URL + '/' + `${appointment.id}`)
    .then(resp => resp.json())
    .then(data =>{
        console.log('updated appointment', data)
        if (sMonth == currentMonth) {
            populateCalendar(data)
        }
    })
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
    populateCalendarBasedOnFullDate(currentMonth, currentYear, apmnt)
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
                cell.setAttribute('style', "height:115px;width:115px;border: 1px solid #c4b4a978;")
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            } 
            else {
                let cell = document.createElement("td");
                `${date}`.length > 1 ? cell.id = `${date}` : cell.id = `0${date}`
                cell.setAttribute('style', "height:115px;width:115px;border: 1px solid #c4b4a978;")
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