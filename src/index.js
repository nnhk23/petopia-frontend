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
    const greeting = document.createElement('p')
    greeting.textContent = `Welcome ${user.name} to Petopia!`

    const input = document.getElementById('user-sign-in')
    input.innerHTML = ''
    input.appendChild(greeting)
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
    pic.setAttribute('width', '120px')
    pic.setAttribute('height', '120px')
    pic.setAttribute('class', 'cat-pic')
    pic.addEventListener('click', () => renderInfo(pet))

    const list = document.querySelector('#list')
    list.appendChild(pic)
}

function renderInfo(pet) {
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
    selectBtn.addEventListener('click', (e) => renderForm(e, pet))
    
    const ul = document.createElement('ul')
    ul.append(pic, name, breed, age, kidFriendly, personality, selectBtn)

    const petInfo = document.getElementById('pet-info')
    petInfo.innerHTML = ''
    petInfo.appendChild(ul)
}

function renderForm(event, pet) {
    const content = `
    <form id='appointment-form'>
        <div class="form-group">
            <label>Name: </label>
            <input type="text" class="form-control" id="user-name" aria-describedby="emailHelp" value="${userName.name}">
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
        renderAppointment(appointment)
    })
}

function renderAppointment(appointment) {
    const main = document.getElementById('info-form')
    main.innerHTML = ''
    // addCalendar(appointment)
    const calendar = document.querySelector('#calendar')
    calendar.setAttribute('style', '')

    const header = document.createElement('h3')
    header.textContent = 'Appointment List'
    main.appendChild(header)
}

// const calendar = document.querySelector('#calendar')
// calendar.setAttribute('style', '')
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
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
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
                cell.id = date
                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");
                } // color today's date
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row); // appending each row into calendar body.
    }
}

function populateCalendar(appointment){
    debugger
    document.getElementById('2')
}

// function addCalendar(appointment) {

// }
