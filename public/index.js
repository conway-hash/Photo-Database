
/*INITIAL-ADD-FILE---------------------------------------------------------------------------------------------------*/
/* FILTER BURGER */
const burger = document.querySelector('#burger')
const direction = document.querySelector('#direction')
const filterList = document.querySelector('#filter-list')
const filters = document.querySelectorAll('.filter')
const filterSelected = document.querySelector('#filter-selected')
const search = document.querySelector('#search')
const search_bar = document.querySelector('#search-bar')

burger.addEventListener('click', () => {
    filterList.classList.toggle('shown')
    if (filterList.style.height !== filters.length * 50 + 'px') {
        direction.classList.add('expanded')
        filterList.style.height = filters.length * 50 + 'px'
    } else {
        filterList.style.height = '0px'
        direction.classList.remove('expanded')
    }
})

let direction_var = -1
direction.addEventListener('click', () => {
    if (direction.className === 'fa fa-angle-down') {
        direction.className = 'fa fa-angle-up'
        direction_var = 1
        getAllData(search_bar.value,direction_var,filter_value);
    } else {
        direction.className = 'fa fa-angle-down'
        direction_var = -1
        getAllData(search_bar.value,direction_var,filter_value);
    }
})

let filter_value = document.querySelector('.selected').id
filters.forEach(filter => {
    filter.addEventListener('click', () => {
        filters.forEach(filter => {filter.classList.remove('selected')})
        filter.classList.add('selected')
        filterSelected.textContent = filter.textContent
        filterList.classList.remove('shown')
        filterList.style.height = '0px'
        direction.classList.remove('expanded')
        filter_value = document.querySelector('.selected').id
        getAllData(search_bar.value,direction_var,filter_value)
    })
})

getAllData(search_bar.value,direction_var,filter_value);

/* SORT SEARCH */
search_bar.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        search_bar.blur()
        getAllData(search_bar.value,direction_var,filter_value)
    }
})

search.addEventListener('click', () => {
    getAllData(search_bar.value,direction_var,filter_value)
})

/* ACTIONS */
const refresh = document.querySelector('#refresh')
refresh.addEventListener('click', () => {
    search_bar.value = ''
    direction.className = 'fa fa-angle-down'
    direction_var = -1
    filters.forEach(filter => {filter.classList.remove('selected')})
    document.querySelector('#date_u').classList.add('selected')
    filter_value = document.querySelector('.selected').id
    document.querySelector('#filter-selected').innerText = 'By date uploaded'
    getAllData(search_bar.value,direction_var,filter_value);
    refresh.children[0].classList.add('spin')
    setTimeout(function() {
        refresh.children[0].classList.remove('spin')
    },500)
})

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
        const data_name_lc = data_name.toLowerCase()
        const data_alias = formLeftAlias.value;
        const data_alias_lc = data_alias.toLowerCase()
        const data_description = formLeftDescription.value;
        const data_description_lc = data_description.toLowerCase()
        const _id = String(Date.now());
        const data_modified = _id
        const data = {data_name, data_name_lc, data_alias, data_alias_lc, data_description, data_description_lc, data_modified, _id};
        const data_content = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch('/api',data_content);
        const formData = new FormData()
        for (let i = 0; i < importField.files.length; i++) {
            formData.append("files", importField.files[i])
        }
        fetch("/multiple", {method: "POST",body: formData});
        overlayShadow.innerHTML = '';
        overlayShadow.remove();
        getAllData(search_bar.value,direction_var,filter_value);
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
    formRightImport.id = 'form-right-import';
    const importField = document.createElement('input');
    importField.type = 'file';
    importField.id = 'import-field';
    importField.setAttribute("multiple","");

    /* add multiple folders, add more folders afterwards, delete */
    const dt = new DataTransfer();
    importField.addEventListener('change', () => {
        for(let i = 0; i < importField.files.length; i++){
            let form_right_grid_file = document.createElement('div')
            form_right_grid_file.classList.add('form-right-grid-file')

            const file_overlay = document.createElement('div')
            const trash_icon = document.createElement('i')
            trash_icon.classList.add('fa','fa-trash-o')
            trash_icon.addEventListener('click', () => {
                let delete_file = trash_icon.parentElement.lastElementChild.innerHTML
                trash_icon.parentElement.parentElement.remove()
                for(let i = 0; i < dt.items.length; i++){
                    if(delete_file === dt.items[i].getAsFile().name){
                        dt.items.remove(i);
                        continue;
                    }
                }
                document.getElementById('import-field').files = dt.files;
            })

            const type = importField.files.item(i).type
            const eye_icon = document.createElement('i')
            eye_icon.classList.add('fa','fa-eye')
            eye_icon.addEventListener('click', () => {
                console.log('show image')
            })
            const file_overlay_name = document.createElement('p')
            file_overlay_name.classList.add('file-overlay-name')
            file_overlay_name.innerHTML = `${importField.files.item(i).name}`
            
            form_right_grid_file.addEventListener('mouseenter', () => {
                file_overlay.classList.add('file-overlay')
                file_overlay.append(eye_icon,trash_icon,file_overlay_name)
                form_right_grid_file.appendChild(file_overlay)
            })

            form_right_grid_file.addEventListener('mouseleave', () => {
                file_overlay.remove()
            })

            if(window.File && window.FileReader && window.FileList && window.Blob) {
                const reader = new FileReader()
                reader.addEventListener('load', (event) => {
                    if (type.includes('image')){
                        form_right_grid_file.innerHTML = `<img class="thumbnail" src="${event.target.result}"/>`
                    } else if (type.includes('video')) {
                        form_right_grid_file.innerHTML = `<i class="fa fa-file-movie-o"></i>`
                    } else if (type.includes('audio')) {
                        form_right_grid_file.innerHTML = `<i class="fa fa-file-audio-o"></i>`
                    } else {
                        form_right_grid_file.innerHTML = `<i class="fa fa-file-o"></i>`
                    }
                })
                reader.readAsDataURL(importField.files[i])
                formRightGrid.appendChild(form_right_grid_file)
            } else {
                alert('Your browser does not spport File API')
                if (type.includes('image')){
                    form_right_grid_file.innerHTML = `<i class="fa fa-file-photo-o"></i>`
                } else if (type.includes('video')) {
                    form_right_grid_file.innerHTML = `<i class="fa fa-file-movie-o"></i>`
                } else if (type.includes('audio')) {
                    form_right_grid_file.innerHTML = `<i class="fa fa-file-audio-o"></i>`
                } else {
                    form_right_grid_file.innerHTML = `<i class="fa fa-file-o"></i>`
                }
            }
        };

        for (let file of importField.files) {
            dt.items.add(file);
        }

        importField.files = dt.files;
    });
    
    formRightImport.append(importField)
    formRight.append(formRightGrid,formRightImport)

    /* APENDING OF ELEMENTS */
    overlay.append(formLeft,formRight)
    overlayShadow.append(overlay)
    document.body.append(overlayShadow)
})    
/*SECONDARY-ADD-FILE--------------------------------------------------------------------------------------------------*/
/* GET DATA FROM DB ON LOAD AND ON ADDING OR DELETING */
async function getAllData(keyword_value, direction_value, filter_value) {
    const value_in = {keyword_value, direction_value, filter_value}
    const value_req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value_in)
    };
    fetch('/sort',value_req)

    const response = await fetch('/api')
    const data = await response.json();

    /*
    const search_bar = document.querySelector('#search-bar')
    search_bar.value = ''
    */

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
        const fmc_p_u = document.createElement('p')
        const fmc_p_m = document.createElement('p')
        const dt_u = new Date(Number(item._id))
        const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
        const date_u = `${
            padL(dt_u.getDate())}/${
            padL(dt_u.getMonth()+1)}/${
            dt_u.getFullYear()} ${
            padL(dt_u.getHours())}:${
            padL(dt_u.getMinutes())}:${
            padL(dt_u.getSeconds())
        }`
        const dt_m = new Date(Number(item.data_modified))
        fmc_p_u.innerHTML = `Uploaded: ${date_u}`
        const date_m = `${
            padL(dt_m.getDate())}/${
            padL(dt_m.getMonth()+1)}/${
            dt_m.getFullYear()} ${
            padL(dt_m.getHours())}:${
            padL(dt_m.getMinutes())}:${
            padL(dt_m.getSeconds())
        }`
        fmc_p_m.innerHTML = `Modified: ${date_m}`
        folder_main_content.append(fmc_h4,fmc_p_m,fmc_p_u)

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
                const data_name = formLeftName.value;
                const data_name_lc = data_name.toLowerCase()
                const data_alias = formLeftAlias.value;
                const data_alias_lc = data_alias.toLowerCase()
                const data_description = formLeftDescription.value;
                const data_description_lc = data_description.toLowerCase()
                const data_modified = String(Date.now());
                const _id = folder.id;
                const data = {data_name, data_name_lc, data_alias, data_alias_lc, data_description,  data_description_lc, data_modified, _id};
                const data_content = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                };
                fetch('/update',data_content);
                overlayShadow.innerHTML = '';
                overlayShadow.remove();
                getAllData(search_bar.value,direction_var,filter_value);
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
                getAllData(search_bar.value,direction_var,filter_value);
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
            formRightImport.id = 'form-right-import';
            const importField = document.createElement('input');
            importField.type = 'file';
            importField.id = 'import-field';
            importField.setAttribute("multiple","");

            /* add multiple folders, add more folders afterwards, delete */
            const dt = new DataTransfer();
            importField.addEventListener('change', () => {
                for(let i = 0; i < importField.files.length; i++){
                    let form_right_grid_file = document.createElement('div')
                    form_right_grid_file.classList.add('form-right-grid-file')

                    const file_overlay = document.createElement('div')
                    const trash_icon = document.createElement('i')
                    trash_icon.classList.add('fa','fa-trash-o')
                    trash_icon.addEventListener('click', () => {
                        let delete_file = trash_icon.parentElement.lastElementChild.innerHTML
                        trash_icon.parentElement.parentElement.remove()
                        for(let i = 0; i < dt.items.length; i++){
                            if(delete_file === dt.items[i].getAsFile().name){
                                dt.items.remove(i);
                                continue;
                            }
                        }
                        document.getElementById('import-field').files = dt.files;
                    })

                    const type = importField.files.item(i).type
                    const eye_icon = document.createElement('i')
                    eye_icon.classList.add('fa','fa-eye')
                    eye_icon.addEventListener('click', () => {
                        console.log('show image')
                    })
                    const file_overlay_name = document.createElement('p')
                    file_overlay_name.classList.add('file-overlay-name')
                    file_overlay_name.innerHTML = `${importField.files.item(i).name}`
            
                    form_right_grid_file.addEventListener('mouseenter', () => {
                        file_overlay.classList.add('file-overlay')
                        file_overlay.append(eye_icon,trash_icon,file_overlay_name)
                        form_right_grid_file.appendChild(file_overlay)
                    })

                    form_right_grid_file.addEventListener('mouseleave', () => {
                        file_overlay.remove()
                    })

                    if(window.File && window.FileReader && window.FileList && window.Blob) {
                        const reader = new FileReader()
                        reader.addEventListener('load', (event) => {
                            if (type.includes('image')){
                                form_right_grid_file.innerHTML = `<img class="thumbnail" src="${event.target.result}"/>`
                            } else if (type.includes('video')) {
                                form_right_grid_file.innerHTML = `<i class="fa fa-file-movie-o"></i>`
                            } else if (type.includes('audio')) {
                                form_right_grid_file.innerHTML = `<i class="fa fa-file-audio-o"></i>`
                            } else {
                                form_right_grid_file.innerHTML = `<i class="fa fa-file-o"></i>`
                            }
                        })
                        reader.readAsDataURL(importField.files[i])
                        formRightGrid.appendChild(form_right_grid_file)
                    } else {
                        alert('Your browser does not spport File API')
                        if (type.includes('image')){
                            form_right_grid_file.innerHTML = `<i class="fa fa-file-photo-o"></i>`
                        } else if (type.includes('video')) {
                            form_right_grid_file.innerHTML = `<i class="fa fa-file-movie-o"></i>`
                        } else if (type.includes('audio')) {
                            form_right_grid_file.innerHTML = `<i class="fa fa-file-audio-o"></i>`
                        } else {
                            form_right_grid_file.innerHTML = `<i class="fa fa-file-o"></i>`
                        }
                    }
                };

                for (let file of importField.files) {
                    dt.items.add(file);
                }

                importField.files = dt.files;
            });
    
            formRightImport.append(importField)
            formRight.append(formRightGrid,formRightImport)

            /* APENDING OF ELEMENTS */
            overlay.append(formLeft,formRight)
            overlayShadow.append(overlay)
            document.body.append(overlayShadow)
        });

        /* 2.folder_content */
        const folder_content = document.createElement('div')
        folder_content.classList.add('folder-content')
        const folder_content_container = document.createElement('div')
        folder_content_container.classList.add('folder-content-container')

        const data_id = folder.id;
        const datasend = {data_id};
        const id = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datasend)
        };
        fetch('/fetchsend',id);

        const response = await fetch('/fetchrecieve')
        const datarecieve = await response.json();
        
        let grid_index = 0
        datarecieve.forEach(file => {
            if (grid_index < 15) {
                const folder_content_card = document.createElement('div')
                folder_content_card.classList.add('folder-content-card')
                console.log(file)
                if (file.mimetype.includes('image')){
                    folder_content_card.innerHTML = `<img class='thumbnail' src="${file.path}" alt="${file.originalname}">`
                } else if (file.mimetype.includes('video')) {
                    folder_content_card.innerHTML = `<i class="fa fa-file-movie-o"></i>`
                } else if (file.mimetype.includes('audio')) {
                    folder_content_card.innerHTML = `<i class="fa fa-file-audio-o"></i>`
                } else {
                    folder_content_card.innerHTML = `<i class="fa fa-file-o"></i>`
                }
                folder_content_container.appendChild(folder_content_card)
                
            } else {
                return
            }
            grid_index++
        })

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

        grid.append(folder)
    }
}