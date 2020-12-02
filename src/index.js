const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const PETS_URL = `${BASE_URL}/pets`

document.addEventListener('DOMContentLoaded', () => {
    getPetData()
})

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
    pic.addEventListener('click', (e) => renderInfo(e, pet))

    const list = document.querySelector('#list')
    list.appendChild(pic)
}

function renderInfo(e, pet) {
    // debugger
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
    selectBtn.addEventListener('click', renderForm)
    
    const ul = document.createElement('ul')
    ul.append(pic, name, breed, age, kidFriendly, personality, selectBtn)

    const petInfo = document.getElementById('pet-info')
    petInfo.innerHTML = ''
    petInfo.appendChild(ul)
}

function renderForm(event) {
    const form = document.createElement('form')
    
}