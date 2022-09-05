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
        const data_name = formLeftName.value
        const data_people = formLeftPeople.value
        const data_description = formLeftDescription.value
        const data = { data_name, data_people, data_description,}
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch('/api',options);
        overlayShadow.innerHTML = ''
        overlayShadow.remove()
    } )
    /* OVERLAY LOOK */
    /* form left */
    const formLeft = document.createElement('div')
    formLeft.classList.add('form-left')

    const formLeftName = document.createElement('input')
    formLeftName.classList.add('form-left-name')
    formLeftName.type = 'text'
    formLeftName.name = 'foldername'
    formLeftName.placeholder = 'Folder Title...'
    const formLeftPeople = document.createElement('textarea')
    formLeftPeople.classList.add('form-left-people')
    formLeftPeople.name = 'folderpeople'
    formLeftPeople.placeholder = 'John Doe, Jane Doe...'
    const formLeftDescription = document.createElement('textarea')
    formLeftDescription.classList.add('form-left-description')
    formLeftDescription.name = 'folderdescription'
    formLeftDescription.placeholder = 'Description...'

    formLeft.append(formLeftName,formLeftPeople,formLeftDescription)
    /* form-right */
    const formRight = document.createElement('div')
    formRight.id = 'form-right'

    const formRightGrid = document.createElement('div')
    formRightGrid.id = 'form-right-grid'

    const formRightImport = document.createElement('form')
    formRightImport.setAttribute("enctype","multipart/form-data")
    formRightImport.id = 'form-right-import'
    const importField = document.createElement('input')
    importField.type = 'file'
    importField.name = 'foldermedia'
    importField.setAttribute("multiple","")

    /* form-right display images feature  */
    importField.addEventListener('change', (e) =>{
        const reset_files = document.querySelectorAll('.form-right-grid-file')
        reset_files.forEach(file => {file.remove()})
        if(window.File && window.FileReader && window.FileList && window.Blob) {
            const files = e.target.files
            for (let i = 0; i < files.length; i++) {
                if(!files[i].type.match('image')) continue
                const reader = new FileReader()
                reader.addEventListener('load', function(event) {
                    const file = event.target
                    const formRightGridFile = document.createElement('div')
                    formRightGridFile.classList.add('form-right-grid-file')

                    /*Show or Delete on click*/
                    const file_overlay = document.createElement('div')
                    const trash_icon = document.createElement('i')
                    const eye_icon = document.createElement('i')
                    trash_icon.classList.add('fa','fa-trash-o')
                    eye_icon.classList.add('fa','fa-eye')

                    trash_icon.addEventListener('click', () => {
                        console.log('delete item from list')
                    })

                    eye_icon.addEventListener('click', () => {
                        console.log('show image')
                    })

                    formRightGridFile.addEventListener('mouseenter', () => {
                        file_overlay.classList.add('file-overlay')
                        file_overlay.append(eye_icon,trash_icon)
                        formRightGridFile.appendChild(file_overlay)
                    })

                    formRightGridFile.addEventListener('mouseleave', () => {
                        file_overlay.remove()
                    })
                    formRightGridFile.innerHTML = `<img class="thumbnail" src="${file.result}"/>`
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
