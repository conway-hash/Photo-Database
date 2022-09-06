getData();

/* FILTER BURGER */
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

/* ACTIONS */
/* 1.add-folder-overlay */
const addFolderAction = document.querySelector('#add-folder');

addFolderAction.addEventListener('click', () => {
    const overlayShadow = document.createElement('div');
    overlayShadow.id = 'overlay-shadow';

    const overlay = document.createElement('div');
    overlay.id = 'overlay';

    /* DOTS */
    const closeDot = document.createElement('div');
    closeDot.classList.add('dot','close-dot');
    const iconCloseDot = document.createElement('i');
    iconCloseDot.classList.add('fa','fa-close');
    closeDot.append(iconCloseDot);

    const saveDot = document.createElement('div');
    saveDot.classList.add('dot','save-dot');
    const iconSaveDot = document.createElement('i');
    iconSaveDot.classList.add('fa','fa-save');
    saveDot.append(iconSaveDot);

    overlay.append(closeDot,saveDot);

    closeDot.addEventListener('click',() => {
        overlayShadow.innerHTML = '';
        overlayShadow.remove();
    });

    saveDot.addEventListener('click',() => {
        const data_name = formLeftName.value;
        const data_alias = formLeftAlias.value;
        const data_description = formLeftDescription.value;
        const data = { 
            data_name, 
            data_alias, 
            data_description
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch('/api',options);
        overlayShadow.innerHTML = '';
        overlayShadow.remove();
        getData();
    } )

    /* OVERLAY LOOK */
    /* 1.form left */
    const formLeft = document.createElement('div');
    formLeft.id = 'form-left';

    const formLeftName = document.createElement('input');
    formLeftName.id = 'form-left-name';
    formLeftName.type = 'text';
    formLeftName.placeholder = 'Folder Title...';
    const formLeftAlias = document.createElement('textarea');
    formLeftAlias.id = 'form-left-alias';
    formLeftAlias.placeholder = 'Alias names...';
    const formLeftDescription = document.createElement('textarea');
    formLeftDescription.id = 'form-left-description';
    formLeftDescription.placeholder = 'Description...';

    formLeft.append(formLeftName,formLeftAlias,formLeftDescription);

    /* 2.form-right */
    const formRight = document.createElement('div');
    formRight.id = 'form-right';

    const formRightGrid = document.createElement('div');
    formRightGrid.id = 'form-right-grid';

    const formRightImport = document.createElement('form');
    formRightImport.setAttribute("enctype","multipart/form-data");
    formRightImport.id = 'form-right-import';
    const importField = document.createElement('input');
    importField.type = 'file';
    importField.setAttribute("multiple","");

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

/* GET DATA FROM DB ON LOAD AND ON ADDING OR DELETING */
async function getData() {
    const response = await fetch('/api')
    const data = await response.json();
    
    const grid = document.querySelector('#grid')
    grid.innerHTML = ''
    for (item of data) {
        const folder = document.createElement('div')
        folder.classList.add('folder')
        folder.id = item._id

        /* 1.folder_main */
        const folder_main = document.createElement('div')
        folder_main.classList.add('folder-main')

        const folder_main_cover = document.createElement('div')
        folder_main_cover.classList.add('folder-main-cover')
        folder_main_cover.innerHTML = `
            <div class="folder-main-cover-shadow">
                <i class="fa fa-folder-open-o" style="font-size: 50px;"></i>
            </div>
        `

        const folder_main_content = document.createElement('div')
        folder_main_content.classList.add('folder-main-content')
        const fmc_h4 = document.createElement('h4')
        fmc_h4.textContent = `${item.data_name}`
        const fmc_p = document.createElement('p')
        const d = new Date(item.timestamp)
        fmc_p.textContent = `${d.toLocaleDateString()}`
        folder_main_content.append(fmc_h4,fmc_p)

        folder_main.append(folder_main_cover,folder_main_content)

        /* folder open */
        folder_main.addEventListener('click', () => {
            const overlayShadow = document.createElement('div');
            overlayShadow.id = 'overlay-shadow';
        
            const overlay = document.createElement('div');
            overlay.id = 'overlay';
        
            /* DOTS */
            const closeDot = document.createElement('div');
            closeDot.classList.add('dot','close-dot');
            const iconCloseDot = document.createElement('i');
            iconCloseDot.classList.add('fa','fa-close');
            closeDot.append(iconCloseDot);
        
            const saveDot = document.createElement('div');
            saveDot.classList.add('dot','save-dot');
            const iconSaveDot = document.createElement('i');
            iconSaveDot.classList.add('fa','fa-save');
            saveDot.append(iconSaveDot);

            const deleteDot = document.createElement('div');
            deleteDot.classList.add('dot','delete-dot');
            const iconDeleteDot = document.createElement('i');
            iconDeleteDot.classList.add('fa','fa-trash');
            deleteDot.append(iconDeleteDot);
        
            overlay.append(closeDot,saveDot,deleteDot);
        
            closeDot.addEventListener('click',() => {
                overlayShadow.innerHTML = '';
                overlayShadow.remove();
            });
        
            saveDot.addEventListener('click',() => {
                /* update */
                /*
                const data_name = formLeftName.value;
                const data_alias = formLeftAlias.value;
                const data_description = formLeftDescription.value;
                const data = {data_name, data_alias, data_description};
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                };
                fetch('/api',options);
                overlayShadow.innerHTML = '';
                overlayShadow.remove();
                getData();
                */
            })

            deleteDot.addEventListener('click', () => {
                const data_id = folder.id;
                const data = {data_id};
                const deletion = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                };
                fetch('/deletion',deletion);
                overlayShadow.innerHTML = '';
                overlayShadow.remove();
                getData();
            })
        
            /* OVERLAY LOOK */
            /* 1.form left */
            const formLeft = document.createElement('div');
            formLeft.id = 'form-left';
        
            const formLeftName = document.createElement('input');
            formLeftName.id = 'form-left-name';
            formLeftName.type = 'text';
            formLeftName.placeholder = 'Folder Title...';
            formLeftName.value = `${fmc_h4.textContent}`
            const formLeftAlias = document.createElement('textarea');
            formLeftAlias.id = 'form-left-alias';
            formLeftAlias.placeholder = 'Alias names...';
            formLeftAlias.value = `${ica_p.textContent}`
            const formLeftDescription = document.createElement('textarea');
            formLeftDescription.id = 'form-left-description';
            formLeftDescription.placeholder = 'Description...';
            formLeftDescription.value = `${icd_p.textContent}`
        
            formLeft.append(formLeftName,formLeftAlias,formLeftDescription);
        
            /* 2.form-right */
            const formRight = document.createElement('div');
            formRight.id = 'form-right';
        
            const formRightGrid = document.createElement('div');
            formRightGrid.id = 'form-right-grid';
        
            const formRightImport = document.createElement('form');
            formRightImport.setAttribute("enctype","multipart/form-data");
            formRightImport.id = 'form-right-import';
            const importField = document.createElement('input');
            importField.type = 'file';
            importField.setAttribute("multiple","");
        
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

        /* 2.folder_content */
        const folder_content = document.createElement('div')
        folder_content.classList.add('folder-content')
        const folder_content_container = document.createElement('div')
        folder_content_container.classList.add('folder-content-container')
        folder_content.appendChild(folder_content_container)

        /* 3.folder_info */
        const folder_info = document.createElement('div')
        folder_info.classList.add('folder-info')

        const folder_info_alias = document.createElement('div')
        folder_info_alias.classList.add('folder-info-alias')

        const info_content_alias = document.createElement('div')
        info_content_alias.classList.add('info-content')
        const ica_label = document.createElement('label')
        ica_label.textContent = 'Alias'
        const ica_p = document.createElement('p')
        ica_p.textContent = `${item.data_alias}`
        info_content_alias.append(ica_label,ica_p)

        folder_info_alias.appendChild(info_content_alias)


        const folder_info_description = document.createElement('div')
        folder_info_description.classList.add('folder-info-description')

        const info_content_description = document.createElement('div')
        info_content_description.classList.add('info-content')
        const icd_label = document.createElement('label')
        icd_label.textContent = 'Description'
        const icd_p = document.createElement('p')
        icd_p.textContent = `${item.data_description}`
        info_content_description.append(icd_label,icd_p)

        folder_info_description.appendChild(info_content_description)

        folder_info.append(folder_info_alias,folder_info_description)

        /*folder append*/
        folder.append(folder_main,folder_content,folder_info)
        
        grid.prepend(folder)
    }
    console.log(data)
}