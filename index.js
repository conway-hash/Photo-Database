const burger = document.querySelector('#burger')
const filterList = document.querySelector('#filter-list')
const filters = document.querySelectorAll('.filter')
const filterSelected = document.querySelector('#filter-selected')

burger.addEventListener('click', () => {
    filterList.classList.toggle('shown')
    if (filterList.style.height !== filters.length * 50 + 'px') {
        filterList.parentElement.classList.add('expanded')
        filterList.style.height = filters.length * 50 + 'px'
    } else {
        filterList.style.height = '0px'
        filterList.parentElement.classList.remove('expanded')
    }
})

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        filters.forEach(filter => {filter.classList.remove('selected')})
        filter.classList.add('selected')
        filterSelected.textContent = filter.textContent
        filterList.classList.remove('shown')
        filterList.style.height = '0px'
        filterList.parentElement.classList.remove('expanded')
    })
})

const folders = document.querySelectorAll('.folder')

const addFolderAction = document.querySelector('#add-folder')

addFolderAction.addEventListener('click', () => {
    const overlayShadow = document.createElement('div')
    overlayShadow.classList.add('overlay-shadow')
    const overlay = document.createElement('div')
    overlay.classList.add('overlay')

    /* DOTS */
    const closeDot = document.createElement('div')
    closeDot.classList.add('dot','close-dot')
    const iconCloseDot = document.createElement('i')
    iconCloseDot.classList.add('fa','fa-close')
    closeDot.append(iconCloseDot)

    const saveDot = document.createElement('div')
    saveDot.classList.add('dot','save-dot')
    const iconSaveDot = document.createElement('i')
    iconSaveDot.classList.add('fa','fa-save')
    saveDot.append(iconSaveDot)

    overlay.append(closeDot,saveDot)

    closeDot.addEventListener('click',() => {
        overlayShadow.innerHTML = ''
        overlayShadow.remove()
    } )

    saveDot.addEventListener('click',() => {
        console.log('Submit to database')
    } )
    /* OVERLAY LOOK */
    /* form left */
    const formLeft = document.createElement('div')
    formLeft.classList.add('form-left')

    const formLeftName = document.createElement('input')
    formLeftName.classList.add('form-left-name')
    formLeftName.type = 'text'
    formLeftName.placeholder = 'Folder Title...'

    const formLeftDate = document.createElement('input')
    formLeftDate.classList.add('form-left-date')
    formLeftDate.type = 'date'

    const formLeftLocation = document.createElement('input')
    formLeftLocation.classList.add('form-left-location')
    formLeftLocation.placeholder = 'Location...'

    const formLeftPeople= document.createElement('textarea')
    formLeftPeople.classList.add('form-left-people')
    formLeftPeople.placeholder = 'John Doe, Jane Doe...'
    const formLeftDescription= document.createElement('textarea')
    formLeftDescription.classList.add('form-left-description')
    formLeftDescription.placeholder = 'Description...'

    formLeft.append(formLeftName,formLeftDate,formLeftLocation,formLeftPeople,formLeftDescription)
    /* form-right */
    const formRight = document.createElement('div')
    formRight.id = 'form-right'

    const formRightGrid = document.createElement('div')
    formRightGrid.id = 'form-right-grid'

    const formRightImport = document.createElement('div')
    formRightImport.id = 'form-right-import'
    const importField = document.createElement('input')
    importField.type = 'file'
    importField.setAttribute("multiple","")

    /* form-right display images feature  */
    importField.addEventListener('change', (e) =>{
        if(window.File && window.FileReader && window.FileList && window.Blob) {
            const files = e.target.files
            for (let i = 0; i < files.length; i++) {
                if(!files[i].type.match('image')) continue
                const reader = new FileReader()
                reader.addEventListener('load', function(event) {
                    const file = event.target
                    const formRightGridFile = document.createElement('div')
                    formRightGridFile.classList.add('form-right-grid-file')
                    formRightGridFile.innerHTML = `<img class="thumbnail" src="${file.result}" title="${file.name}">`
                    formRightGrid.appendChild(formRightGridFile)
                })
                reader.readAsDataURL(files[i])
            }

        } else {
            alert('Your browser does not spport File API')
        }
    })

    formRightImport.append(importField)
    formRight.append(formRightGrid,formRightImport)

    /* APENDING OF ELEMENTS */
    overlay.append(formLeft,formRight)
    overlayShadow.append(overlay)
    document.body.append(overlayShadow)
})    