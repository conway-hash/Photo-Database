//SORTING
//SORTING-SEARCH
const search = document.querySelector('#search')
const search_bar = document.querySelector('#search-bar')
search_bar.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        search_bar.blur()
        getAllData(search_bar.value,direction_var,filter_value)
    }
})

search.addEventListener('click', () => {
    getAllData(search_bar.value,direction_var,filter_value)
})

//SORTING-FILTER
const burger = document.querySelector('#burger')
const filterSelected = document.querySelector('#filter-selected')
const filterList = document.querySelector('#filter-list')
const filters = document.querySelectorAll('.filter')
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

//SORTING-DIRECTION
const direction = document.querySelector('#direction')
let direction_var = -1
direction.addEventListener('click', () => {
    if (direction.classList.contains('fa-angle-down')) {
        direction.classList.remove('fa-angle-down')
        direction.classList.remove('expanded')
        direction.classList.add('fa-angle-up')
        direction_var = 1
        filterList.classList.remove('shown')
        filterList.style.height = '0px'
        getAllData(search_bar.value,direction_var,filter_value);
    } else {
        direction.classList.remove('fa-angle-up')
        direction.classList.add('fa-angle-down')
        direction.classList.remove('expanded')
        direction_var = -1
        filterList.classList.remove('shown')
        filterList.style.height = '0px'
        getAllData(search_bar.value,direction_var,filter_value);
    }
})
//FIRST INITIATION
getAllData(search_bar.value,direction_var,filter_value);

//ACTIONS
//ACTIONS-REFRESH
const refresh = document.querySelector('#refresh')
refresh.addEventListener('click', () => {
    search_bar.value = ''
    direction.className = 'fa fa-angle-down'
    direction.classList.remove('expanded')
    direction_var = -1
    filters.forEach(filter => {filter.classList.remove('selected')})
    document.querySelector('#date_u').classList.add('selected')
    filter_value = document.querySelector('.selected').id
    document.querySelector('#filter-selected').innerText = 'By date uploaded'
    filterList.classList.remove('shown')
    filterList.style.height = '0px'
    getAllData(search_bar.value,direction_var,filter_value);
    refresh.firstElementChild.classList.add('spin')
    setTimeout(function() {
        refresh.firstElementChild.classList.remove('spin')
    },500)
})

//ACTIONS-ADDFOLDER
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

    saveDot.addEventListener('click', async () => {
        if (formLeftName.value !== '') {
            const body = { data_name : formLeftName.value}
            await fetch("/namecheck",{
                method: "POST", 
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            })
            const response_none = await fetch("/namecheck")
            const response_text = await response_none.json()
            if (response_text.samename) {
                alert('File name already taken!')
                return
            }
            const data_name = formLeftName.value;
            const data_name_lc = data_name.toLowerCase()
            const data_alias = formLeftAlias.value;
            const data_alias_lc = data_alias.toLowerCase()
            const data_description = formLeftDescription.value;
            const data_description_lc = data_description.toLowerCase()
            const _id = String(Date.now());
            const data_modified = _id
            const data_main_image = flag_image
            const data = {data_name, data_name_lc, data_alias, data_alias_lc, data_description, data_description_lc, data_modified, data_main_image, _id};
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
            await fetch("/multiple", {method: "POST",body: formData});
            getAllData(search_bar.value,direction_var,filter_value);
            overlayShadow.innerHTML = '';
            overlayShadow.remove();
        } else {
            alert('Specify folder name!')
        }
    })

    /* OVERLAY LOOK */
    /* 1.form left */
    const formLeft = document.createElement('form');
    formLeft.id = 'form-left';

    const formLeftName = document.createElement('input');
    formLeftName.id = 'form-left-name';
    formLeftName.type = 'text';
    formLeftName.placeholder = 'Folder Title...';
    formLeftName.maxLength = '20'
    formLeftName.autocomplete = 'off'
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
    let flag_image = ''
    importField.addEventListener('change', (e) => {
        /*console.log(e.target.files[0].size)*/
        for(let i = 0; i < importField.files.length; i++){
            const form_right_grid_file = document.createElement('div')
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
                if (flag_image === trash_icon.nextSibling.innerText) {
                    flag_image = ''
                }
            })

            const flag_icon = document.createElement('i')
            flag_icon.classList.add("fa","fa-flag-o")
            flag_icon.addEventListener('click', () => {
                if (flag_icon.classList.contains('fa-flag-o')) {
                    const flags = document.querySelectorAll('.fa-flag')
                    for(let i = 0; i < flags.length; i++){
                        flags[i].classList.remove('fa-flag')
                        flags[i].classList.add('fa-flag-o')
                    }
                    flag_icon.classList.remove('fa-flag-o')
                    flag_icon.classList.add('fa-flag')
                    flag_image = flag_icon.nextSibling.nextSibling.innerText
                } else {
                    flag_icon.classList.remove('fa-flag')
                    flag_icon.classList.add('fa-flag-o')
                    flag_image = ''
                }
            })

            const index = i
            const type = importField.files.item(i).type
            const eye_icon = document.createElement('i')
            eye_icon.classList.add('fa','fa-eye')
            eye_icon.addEventListener('click', () => {
                /*
                const current_files = document.querySelectorAll('.form-right-grid-file')       
                current_files.forEach((file,file_index) => {
                    file.id = file_index
                })
                let leftrightIndex = eye_icon.parentElement.parentElement.id
                */

                const overlay_show_shadow = document.createElement('div')
                overlay_show_shadow.id = 'overlay-show-shadow'
                const overlay_show = document.createElement('div')
                overlay_show.id = 'overlay-show'
                const overlay_show_container = document.createElement('div')
                overlay_show_container.id = 'overlay-show-container'
                const overlay_show_content = document.createElement('div')
                overlay_show_content.id = 'overlay-show-content'
                const overlay_show_content_name = document.createElement('div')
                overlay_show_content_name.id = "overlay-show-content-name"

                let final_byte_size = ''
                if (importField.files[index].size * 0.000001 > 1) {
                    let byte_size = importField.files[index].size * 0.000001
                    final_byte_size = byte_size.toFixed(2) + 'MB'
                } else {
                    let byte_size = importField.files[index].size * 0.001
                    final_byte_size = byte_size.toFixed(2) + 'KB'
                }

                if(window.File && window.FileReader && window.FileList && window.Blob) {
                    const reader = new FileReader()
                    reader.addEventListener('load', (event) => {
                        if (type.includes('image')){
                            overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                        } else if (type.includes('video')) {
                            overlay_show_content.innerHTML = `
                            <video class="overlay-show-content" controls autoplay>
                                <source src="${event.target.result}" type="${type}" />
                            </video>
                            `
                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                        } else if (type.includes('audio')) {
                            overlay_show_content.innerHTML = `
                            <audio controls autoplay>
                                <source src="${event.target.result}" type="${type}" />
                            </audio>
                            `
                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                        } else {
                            overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                        }
                    })
                    reader.readAsDataURL(importField.files[index])
                } else {
                    alert('Your browser does not spport File API')
                }

                const closeDot = document.createElement('div');
                closeDot.classList.add('dot','close-dot');
                const iconCloseDot = document.createElement('i');
                iconCloseDot.classList.add('fa','fa-close');
                closeDot.append(iconCloseDot);
                closeDot.addEventListener('click',() => {
                    /* REMOVE EVENT LISTENERS */
                    overlay_show_shadow.innerHTML = '';
                    overlay_show_shadow.remove();
                });
                /*
                const leftArrowDot = document.createElement('div');
                leftArrowDot.classList.add('dot','left-arrow-dot')
                const iconLeftArrowDot = document.createElement('i');
                iconLeftArrowDot.classList.add('fa','fa-chevron-left');
                leftArrowDot.append(iconLeftArrowDot);
                leftArrowDot.addEventListener('click',() => {
                    leftrightIndex --
                    if (leftrightIndex < 0) {
                        leftrightIndex = importField.files.length - 1
                    }
                    if(window.File && window.FileReader && window.FileList && window.Blob) {
                        const reader = new FileReader()
                        reader.addEventListener('load', (event) => {
                            if (importField.files.item(leftrightIndex).type.includes('image')){
                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                            } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                overlay_show_content.innerHTML = `
                                <video class="overlay-show-content" controls autoplay>
                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                </video>
                                `
                            } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                overlay_show_content.innerHTML = `
                                <audio controls autoplay>
                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                </audio>
                                `
                            } else {
                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                            }
                        })
                        reader.readAsDataURL(importField.files[leftrightIndex])
                    } else {
                        alert('Your browser does not spport File API')
                    }
                });
                /*
                document.addEventListener('keydown', (e) => {
                    if (e.key == 'ArrowLeft') {
                        console.log('left')
                    }
                })
                */
                /*
                const rightArrowDot = document.createElement('div');
                rightArrowDot.classList.add('dot','right-arrow-dot')
                const iconRightArrowDot = document.createElement('i');
                iconRightArrowDot.classList.add('fa','fa-chevron-right');
                rightArrowDot.append(iconRightArrowDot);
                rightArrowDot.addEventListener('click',() => {
                    leftrightIndex ++
                    if (leftrightIndex > importField.files.length - 1) {
                        leftrightIndex = 0
                    }
                    if(window.File && window.FileReader && window.FileList && window.Blob) {
                        const reader = new FileReader()
                        reader.addEventListener('load', (event) => {
                            if (importField.files.item(leftrightIndex).type.includes('image')){
                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                            } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                overlay_show_content.innerHTML = `
                                <video class="overlay-show-content" controls autoplay>
                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                </video>
                                `
                            } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                overlay_show_content.innerHTML = `
                                <audio controls autoplay>
                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                </audio>
                                `
                            } else {
                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                            }
                        })
                        reader.readAsDataURL(importField.files[leftrightIndex])
                    } else {
                        alert('Your browser does not spport File API')
                    }
                });
                /*
                document.addEventListener('keydown', (e) => {
                    if (e.key == 'ArrowRight') {
                        console.log('right')
                    }
                })
                */
                overlay_show_container.append(overlay_show_content,overlay_show_content_name)
                overlay_show.append(closeDot,/*leftArrowDot,rightArrowDot,*/overlay_show_container)

                overlay_show_shadow.append(overlay_show)
                document.body.append(overlay_show_shadow)
            })
            const file_overlay_name = document.createElement('p')
            file_overlay_name.classList.add('file-overlay-name')
            file_overlay_name.innerHTML = `${importField.files.item(i).name}`
            file_overlay.style.display = "none"
            file_overlay.classList.add('file-overlay')
            
            form_right_grid_file.addEventListener('mouseenter', () => {
                file_overlay.style.display = "flex"
                if (type.includes('image')) {
                    file_overlay.append(eye_icon,flag_icon,trash_icon,file_overlay_name)
                } else {
                    file_overlay.append(eye_icon,trash_icon,file_overlay_name)
                }
                form_right_grid_file.appendChild(file_overlay)
            })

            form_right_grid_file.addEventListener('mouseleave', () => {
                file_overlay.style.display = "none"
            })

            if(window.File && window.FileReader && window.FileList && window.Blob) {
                const reader = new FileReader()
                reader.addEventListener('load', (event) => {
                    if (type.includes('image')){
                        form_right_grid_file.innerHTML = `<img class="thumbnail" src="${event.target.result}" loading="lazy" decoding="async">`
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

    const grid = document.querySelector('#grid')
    grid.innerHTML = ''
    for (item of data) {
        const folder = document.createElement('div')
        folder.classList.add('folder')
        const current_item_data = item
        folder.id = item._id

        /* 1.folder_main */
        const folder_main = document.createElement('div')
        folder_main.classList.add('folder-main')

        const folder_main_cover = document.createElement('div')
        folder_main_cover.classList.add('folder-main-cover')
        folder_main_cover.innerHTML = ``

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
        folder_main.addEventListener('click', async () => {
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
        
            saveDot.addEventListener('click', async() => {
                if (formLeftName.value !== '') {
                    const body = { data_name : formLeftName.value, _id : folder.id}
                    await fetch("/namecheck",{
                        method: "POST", 
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify(body)
                    })
                    const response_none = await fetch("/namecheck")
                    const response_text = await response_none.json()
                    if (response_text.samename) {
                        alert('File name already taken!')
                        return
                    }
                    const data_name = formLeftName.value;
                    const data_name_lc = data_name.toLowerCase()
                    const data_alias = formLeftAlias.value;
                    const data_alias_lc = data_alias.toLowerCase()
                    const data_description = formLeftDescription.value;
                    const data_description_lc = data_description.toLowerCase()
                    const data_modified = String(Date.now());
                    const _id = folder.id;
                    const data_main_image = flag_image
                    const data = {data_name, data_name_lc, data_alias, data_alias_lc, data_description,  data_description_lc, data_modified, data_main_image, _id};
                    const data_content = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    };
                    fetch('/update',data_content);
                    const formData = new FormData()
                    for (let i = 0; i < importField.files.length; i++) {
                        formData.append("files", importField.files[i])
                    }
                    await fetch("/multiple", {method: "POST",body: formData});
                    if (delete_array.length !== 0) {
                        const data = { array:delete_array };
                        const deletion = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        };
                        fetch('/deletion',deletion);
                        delete_array = ''
                    }
                    getAllData(search_bar.value,direction_var,filter_value);   
                    overlayShadow.innerHTML = '';
                    overlayShadow.remove();              
                } else {
                    alert('Specify folder name!')
                }
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
                getAllData(search_bar.value,direction_var,filter_value);
                overlayShadow.innerHTML = '';
                overlayShadow.remove();
            })
        
            /* OVERLAY LOOK */
            /* 1.form left */
            const formLeft = document.createElement('form');
            formLeft.id = 'form-left';
        
            const formLeftName = document.createElement('input');
            formLeftName.id = 'form-left-name';
            formLeftName.type = 'text';
            formLeftName.placeholder = 'Folder Title...';
            formLeftName.maxLength = '20'
            formLeftName.autocomplete = 'off'
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

            /* HERE */
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

            let delete_array = []
            let current_item_main_image = current_item_data.data_main_image
            let flag_image = current_item_main_image
            for(current_data_item of datarecieve){
                let current_item = current_data_item
                const form_right_grid_file = document.createElement('div')
                form_right_grid_file.classList.add('form-right-grid-file')

                const file_overlay = document.createElement('div')
                const trash_icon = document.createElement('i')
                

                trash_icon.classList.add('fa','fa-trash-o')
                trash_icon.addEventListener('click', () => {
                    delete_array.push(current_item._id)
                    trash_icon.parentElement.parentElement.remove()

                    if (flag_image === trash_icon.nextSibling.innerText) {
                        flag_image = ''
                    }
                })

                const flag_icon = document.createElement('i')
                if (current_item.originalname === current_item_main_image) {
                    flag_icon.classList.add("fa","fa-flag")
                } else {
                    flag_icon.classList.add("fa","fa-flag-o")
                }

                flag_icon.addEventListener('click', () => {
                    if (flag_icon.classList.contains('fa-flag-o')) {
                        const flags = document.querySelectorAll('.fa-flag')
                        for(let i = 0; i < flags.length; i++){
                            flags[i].classList.remove('fa-flag')
                            flags[i].classList.add('fa-flag-o')
                        }
                        flag_icon.classList.remove('fa-flag-o')
                        flag_icon.classList.add('fa-flag')
                        flag_image = flag_icon.nextSibling.nextSibling.innerText
                    } else {
                        flag_icon.classList.remove('fa-flag')
                        flag_icon.classList.add('fa-flag-o')
                        flag_image = ''
                    }
                })             

                const eye_icon = document.createElement('i')
                eye_icon.classList.add('fa','fa-eye')
                eye_icon.addEventListener('click', () => {
                    /*
                    const current_files = document.querySelectorAll('.form-right-grid-file')       
                    current_files.forEach((file,file_index) => {
                        file.id = file_index
                    })
                    */
                    //let leftrightIndex = eye_icon.parentElement.parentElement.id
    
                    const overlay_show_shadow = document.createElement('div')
                    overlay_show_shadow.id = 'overlay-show-shadow'
                    const overlay_show = document.createElement('div')
                    overlay_show.id = 'overlay-show'
                    const overlay_show_container = document.createElement('div')
                    overlay_show_container.id = 'overlay-show-container'
                    const overlay_show_content = document.createElement('div')
                    overlay_show_content.id = 'overlay-show-content'
                    const overlay_show_content_name = document.createElement('div')
                    overlay_show_content_name.id = "overlay-show-content-name"

                    let final_byte_size = ''
                    if (current_item.size * 0.000001 > 1) {
                        let byte_size = current_item.size * 0.000001
                        final_byte_size = byte_size.toFixed(2) + 'MB'
                    } else {
                        let byte_size = current_item.size * 0.001
                        final_byte_size = byte_size.toFixed(2) + 'KB'
                    }

                    if (current_item.mimetype.includes('image')){
                        overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${current_item.path}" loading="lazy" decoding="async">`
                        overlay_show_content_name.innerHTML = `${current_item.originalname} ${final_byte_size}`
                    } else if (current_item.mimetype.includes('video')) {
                        overlay_show_content.innerHTML = `
                        <video class="overlay-show-content" controls autoplay>
                            <source src="${current_item.path}" type="${current_item.mimetype}" />
                        </video>
                        `
                        overlay_show_content_name.innerHTML = `${current_item.originalname} ${final_byte_size}`
                    } else if (current_item.mimetype.includes('audio')) {
                        overlay_show_content.innerHTML = `
                        <audio controls autoplay>
                            <source src="${current_item.path}" type="${current_item.mimetype}" />
                        </audio>
                        `
                        overlay_show_content_name.innerHTML = `${current_item.originalname} ${final_byte_size}`
                    } else {
                        overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                        overlay_show_content_name.innerHTML = `${current_item.originalname} ${final_byte_size}`
                    }

    
                    const closeDot = document.createElement('div');
                    closeDot.classList.add('dot','close-dot');
                    const iconCloseDot = document.createElement('i');
                    iconCloseDot.classList.add('fa','fa-close');
                    closeDot.append(iconCloseDot);
                    closeDot.addEventListener('click',() => {
                        /* REMOVE EVENT LISTENERS */
                        overlay_show_shadow.innerHTML = '';
                        overlay_show_shadow.remove();
                    });
                    /*
                    console.log(datarecieve[leftrightIndex]._id)
                    let datarecievemode = true
                    const leftArrowDot = document.createElement('div');
                    leftArrowDot.classList.add('dot','left-arrow-dot')
                    const iconLeftArrowDot = document.createElement('i');
                    iconLeftArrowDot.classList.add('fa','fa-chevron-left');
                    leftArrowDot.append(iconLeftArrowDot);
                    leftArrowDot.addEventListener('click',() => {
                        leftrightIndex --
                        if (datarecievemode === false) {
                            if (leftrightIndex < 0) {
                                datarecievemode = true
                                leftrightIndex = datarecieve.length - 1 - delete_array.length
                                if (datarecieve[leftrightIndex].mimetype.includes('image')){
                                    overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[leftrightIndex].path}" loading="lazy" decoding="async">`
                                } else if (datarecieve[leftrightIndex].mimetype.includes('video')) {
                                    overlay_show_content.innerHTML = `
                                    <video class="overlay-show-content" controls autoplay>
                                        <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                    </video>
                                    `
                                } else if (datarecieve[leftrightIndex].mimetype.includes('audio')) {
                                    overlay_show_content.innerHTML = `
                                    <audio controls autoplay>
                                        <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                    </audio>
                                    `
                                } else {
                                    overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                }
                            } else {
                                if(window.File && window.FileReader && window.FileList && window.Blob) {
                                    const reader = new FileReader()
                                    reader.addEventListener('load', (event) => {
                                        if (importField.files.item(leftrightIndex).type.includes('image')){
                                            overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                        } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                            overlay_show_content.innerHTML = `
                                            <video class="overlay-show-content" controls autoplay>
                                                <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                            </video>
                                            `
                                        } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                            overlay_show_content.innerHTML = `
                                            <audio controls autoplay>
                                                <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                            </audio>
                                            `
                                        } else {
                                            overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                        }
                                    })
                                    reader.readAsDataURL(importField.files[leftrightIndex])
                                }
                            }
                        } else {
                            if (leftrightIndex < 0) {
                                if (importField.files.length > 0) {
                                    datarecievemode = false
                                    leftrightIndex = importField.files.length - 1
                                    if(window.File && window.FileReader && window.FileList && window.Blob) {
                                        const reader = new FileReader()
                                        reader.addEventListener('load', (event) => {
                                            if (importField.files.item(leftrightIndex).type.includes('image')){
                                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                            } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                                overlay_show_content.innerHTML = `
                                                <video class="overlay-show-content" controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </video>
                                                `
                                            } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                                overlay_show_content.innerHTML = `
                                                <audio controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </audio>
                                                `
                                            } else {
                                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                            } 
                                        })
                                        reader.readAsDataURL(importField.files[leftrightIndex])
                                    }  
                                } else {
                                    leftrightIndex = datarecieve.length - 1 - delete_array.length
                                    if (datarecieve[leftrightIndex].mimetype.includes('image')){
                                        overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[leftrightIndex].path}" loading="lazy" decoding="async">`
                                    } else if (datarecieve[leftrightIndex].mimetype.includes('video')) {
                                        overlay_show_content.innerHTML = `
                                        <video class="overlay-show-content" controls autoplay>
                                            <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                        </video>
                                        `
                                    } else if (datarecieve[leftrightIndex].mimetype.includes('audio')) {
                                        overlay_show_content.innerHTML = `
                                        <audio controls autoplay>
                                            <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                        </audio>
                                        `
                                    } else {
                                        overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                    }
                                }            
                            } else {
                                if (datarecieve[leftrightIndex].mimetype.includes('image')){
                                    overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[leftrightIndex].path}" loading="lazy" decoding="async">`
                                } else if (datarecieve[leftrightIndex].mimetype.includes('video')) {
                                    overlay_show_content.innerHTML = `
                                    <video class="overlay-show-content" controls autoplay>
                                        <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                    </video>
                                    `
                                } else if (datarecieve[leftrightIndex].mimetype.includes('audio')) {
                                    overlay_show_content.innerHTML = `
                                    <audio controls autoplay>
                                        <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                    </audio>
                                    `
                                } else {
                                    overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                }
                            }
                        }
                    });
                    /*
                    document.addEventListener('keydown', (e) => {
                        if (e.key == 'ArrowLeft') {
                            console.log('left')
                        }
                    })
                    */
                   /*
                    const rightArrowDot = document.createElement('div');
                    rightArrowDot.classList.add('dot','right-arrow-dot')
                    const iconRightArrowDot = document.createElement('i');
                    iconRightArrowDot.classList.add('fa','fa-chevron-right');
                    rightArrowDot.append(iconRightArrowDot);
                    rightArrowDot.addEventListener('click',() => {
                        leftrightIndex ++
                        if (datarecievemode === false) {
                            if (leftrightIndex > importField.files.length - 1) {
                                datarecievemode = true
                                leftrightIndex = 0
                                if (datarecieve[leftrightIndex].mimetype.includes('image')){
                                    overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[leftrightIndex].path}" loading="lazy" decoding="async">`
                                } else if (datarecieve[leftrightIndex].mimetype.includes('video')) {
                                    overlay_show_content.innerHTML = `
                                    <video class="overlay-show-content" controls autoplay>
                                        <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                    </video>
                                    `
                                } else if (datarecieve[leftrightIndex].mimetype.includes('audio')) {
                                    overlay_show_content.innerHTML = `
                                    <audio controls autoplay>
                                        <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                    </audio>
                                    `
                                } else {
                                    overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                }
                            } else {
                                if(window.File && window.FileReader && window.FileList && window.Blob) {
                                    const reader = new FileReader()
                                    reader.addEventListener('load', (event) => {
                                        if (importField.files.item(leftrightIndex).type.includes('image')){
                                            overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                        } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                            overlay_show_content.innerHTML = `
                                            <video class="overlay-show-content" controls autoplay>
                                                <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                            </video>
                                            `
                                        } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                            overlay_show_content.innerHTML = `
                                            <audio controls autoplay>
                                                <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                            </audio>
                                            `
                                        } else {
                                            overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                        }
                                    })
                                    reader.readAsDataURL(importField.files[leftrightIndex])
                                }
                            }
                        } else {
                            if (leftrightIndex > datarecieve.length - 1 - delete_array.length) {
                                if (importField.files.length > 0) {
                                    datarecievemode = false
                                    leftrightIndex = 0
                                    if(window.File && window.FileReader && window.FileList && window.Blob) {
                                        const reader = new FileReader()
                                        reader.addEventListener('load', (event) => {
                                            if (importField.files.item(leftrightIndex).type.includes('image')){
                                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                            } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                                overlay_show_content.innerHTML = `
                                                <video class="overlay-show-content" controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </video>
                                                `
                                            } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                                overlay_show_content.innerHTML = `
                                                <audio controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </audio>
                                                `
                                            } else {
                                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                            } 
                                        })
                                        reader.readAsDataURL(importField.files[leftrightIndex])
                                    }
                                } else {
                                    leftrightIndex = 0
                                    if (datarecieve[leftrightIndex].mimetype.includes('image')){
                                        overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[leftrightIndex].path}" loading="lazy" decoding="async">`
                                    } else if (datarecieve[leftrightIndex].mimetype.includes('video')) {
                                        overlay_show_content.innerHTML = `
                                        <video class="overlay-show-content" controls autoplay>
                                            <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                        </video>
                                        `
                                    } else if (datarecieve[leftrightIndex].mimetype.includes('audio')) {
                                        overlay_show_content.innerHTML = `
                                        <audio controls autoplay>
                                            <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                        </audio>
                                        `
                                    } else {
                                        overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                    }
                                }                            
                            } else {
                                if (delete_array.length > 0) {                    
                                    delete_array.forEach((delete_array_file) => {
                                        if (datarecieve[leftrightIndex]._id.includes(delete_array_file)) {
                                            leftrightIndex ++
                                        }
                                        console.log(delete_array_file)
                                    })
                                }
                                console.log(datarecieve[leftrightIndex]._id)
                                console.log(leftrightIndex)
                            
                                if (datarecieve[leftrightIndex].mimetype.includes('image')){
                                    overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[leftrightIndex].path}" loading="lazy" decoding="async">`
                                } else if (datarecieve[leftrightIndex].mimetype.includes('video')) {
                                    overlay_show_content.innerHTML = `
                                    <video class="overlay-show-content" controls autoplay>
                                        <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                    </video>
                                    `
                                } else if (datarecieve[leftrightIndex].mimetype.includes('audio')) {
                                    overlay_show_content.innerHTML = `
                                    <audio controls autoplay>
                                        <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                    </audio>
                                    `
                                } else {
                                    overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                }
                                
                            }
                        }
                    });
                    /*
                    document.addEventListener('keydown', (e) => {
                        if (e.key == 'ArrowRight') {
                            console.log('right')
                        }
                    })
                    */
                    overlay_show_container.append(overlay_show_content,overlay_show_content_name)
                    overlay_show.append(closeDot,/*leftArrowDot,rightArrowDot,*/overlay_show_container)
    
                    overlay_show_shadow.append(overlay_show)
                    document.body.append(overlay_show_shadow)
                })

                const file_overlay_name = document.createElement('p')
                file_overlay_name.classList.add('file-overlay-name')
                file_overlay_name.innerHTML = `${current_data_item.originalname}`
                file_overlay.style.display = 'none'
                file_overlay.classList.add('file-overlay')

        
                form_right_grid_file.addEventListener('mouseenter', () => {
                    file_overlay.style.display = "flex"
                    if (current_item.mimetype.includes('image')) {
                        file_overlay.append(eye_icon,flag_icon,trash_icon,file_overlay_name)
                    } else {
                        file_overlay.append(eye_icon,trash_icon,file_overlay_name)
                    }
                    form_right_grid_file.appendChild(file_overlay)
                })

                form_right_grid_file.addEventListener('mouseleave', () => {
                    file_overlay.style.display = 'none'
                })

                if (current_data_item.mimetype.includes('image')){
                    form_right_grid_file.innerHTML = `
                        <img class="thumbnail" src="${current_data_item.path}" loading="lazy" decoding="async" alt="${current_data_item.originalname}">
                    `
                } else if (current_data_item.mimetype.includes('video')) {
                    form_right_grid_file.innerHTML = `<i class="fa fa-file-movie-o"></i>`
                } else if (current_data_item.mimetype.includes('audio')) {
                    form_right_grid_file.innerHTML = `<i class="fa fa-file-audio-o"></i>`
                } else {
                    form_right_grid_file.innerHTML = `<i class="fa fa-file-o"></i>`
                }
                formRightGrid.appendChild(form_right_grid_file)
            };

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
                    const form_right_grid_file = document.createElement('div')
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
                        if (flag_image === trash_icon.nextSibling.innerText) {
                            flag_image = ''
                        }
                    })

                    const flag_icon = document.createElement('i')
                    flag_icon.classList.add("fa","fa-flag-o")
                    flag_icon.addEventListener('click', () => {
                        if (flag_icon.classList.contains('fa-flag-o')) {
                            const flags = document.querySelectorAll('.fa-flag')
                            for(let i = 0; i < flags.length; i++){
                                flags[i].classList.remove('fa-flag')
                                flags[i].classList.add('fa-flag-o')
                            }
                            flag_icon.classList.remove('fa-flag-o')
                            flag_icon.classList.add('fa-flag')
                            flag_image = flag_icon.nextSibling.nextSibling.innerText
                        } else {
                            flag_icon.classList.remove('fa-flag')
                            flag_icon.classList.add('fa-flag-o')
                            flag_image = ''
                        }
                    })

                    const index = i
                    const type = importField.files.item(i).type
                    const eye_icon = document.createElement('i')
                    eye_icon.classList.add('fa','fa-eye')
                    eye_icon.addEventListener('click', () => {
                        console.log(importField.files[index])
                        /*
                        const current_files = document.querySelectorAll('.form-right-grid-file')       
                        current_files.forEach((file,file_index) => {
                            file.id = file_index
                        })
                        */
                        //let leftrightIndex = eye_icon.parentElement.parentElement.id - datarecieve.length - delete_array.length
        
                        const overlay_show_shadow = document.createElement('div')
                        overlay_show_shadow.id = 'overlay-show-shadow'
                        const overlay_show = document.createElement('div')
                        overlay_show.id = 'overlay-show'
                        const overlay_show_container = document.createElement('div')
                        overlay_show_container.id = 'overlay-show-container'
                        const overlay_show_content = document.createElement('div')
                        overlay_show_content.id = 'overlay-show-content'
                        const overlay_show_content_name = document.createElement('div')
                        overlay_show_content_name.id = "overlay-show-content-name"

                        let final_byte_size = ''
                        if (importField.files[index].size * 0.000001 > 1) {
                            let byte_size = importField.files[index].size * 0.000001
                            final_byte_size = byte_size.toFixed(2) + 'MB'
                        } else {
                            let byte_size = importField.files[index].size * 0.001
                            final_byte_size = byte_size.toFixed(2) + 'KB'
                        }

                        if(window.File && window.FileReader && window.FileList && window.Blob) {
                            const reader = new FileReader()
                            reader.addEventListener('load', (event) => {
                                if (type.includes('image')){
                                    overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                    overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                } else if (type.includes('video')) {
                                    overlay_show_content.innerHTML = `
                                    <video class="overlay-show-content" controls autoplay>
                                        <source src="${event.target.result}" type="${type}" />
                                    </video>
                                    `
                                    overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                } else if (type.includes('audio')) {
                                    overlay_show_content.innerHTML = `
                                    <audio controls autoplay>
                                        <source src="${event.target.result}" type="${type}" />
                                    </audio>
                                    `
                                    overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                } else {
                                    overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                    overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                }
                            })
                            reader.readAsDataURL(importField.files[index])
                        } else {
                            alert('Your browser does not spport File API')
                        }
        
                        const closeDot = document.createElement('div');
                        closeDot.classList.add('dot','close-dot');
                        const iconCloseDot = document.createElement('i');
                        iconCloseDot.classList.add('fa','fa-close');
                        closeDot.append(iconCloseDot);
                        closeDot.addEventListener('click',() => {
                            /* REMOVE EVENT LISTENERS */
                            overlay_show_shadow.innerHTML = '';
                            overlay_show_shadow.remove();
                        });
                        /*
                        const leftArrowDot = document.createElement('div');
                        leftArrowDot.classList.add('dot','left-arrow-dot')
                        const iconLeftArrowDot = document.createElement('i');
                        iconLeftArrowDot.classList.add('fa','fa-chevron-left');
                        leftArrowDot.append(iconLeftArrowDot);
                        let datarecievemode = false
                        leftArrowDot.addEventListener('click',() => {
                            leftrightIndex --
                            if (datarecievemode) {
                                if (leftrightIndex < 0) {
                                    datarecievemode = false
                                    leftrightIndex = importField.files.length - 1
                                    if(window.File && window.FileReader && window.FileList && window.Blob) {
                                        const reader = new FileReader()
                                        reader.addEventListener('load', (event) => {
                                            if (importField.files.item(leftrightIndex).type.includes('image')){
                                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                            } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                                overlay_show_content.innerHTML = `
                                                <video class="overlay-show-content" controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </video>
                                                `
                                            } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                                overlay_show_content.innerHTML = `
                                                <audio controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </audio>
                                                `
                                            } else {
                                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                            }
                                        })
                                        reader.readAsDataURL(importField.files[leftrightIndex])
                                    } else {
                                        alert('Your browser does not spport File API')
                                    }
                                } else {
                                    if (datarecieve[leftrightIndex].mimetype.includes('image')){
                                        overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[leftrightIndex].path}" loading="lazy" decoding="async">`
                                    } else if (datarecieve[leftrightIndex].mimetype.includes('video')) {
                                        overlay_show_content.innerHTML = `
                                        <video class="overlay-show-content" controls autoplay>
                                            <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                        </video>
                                        `
                                    } else if (datarecieve[leftrightIndex].mimetype.includes('audio')) {
                                        overlay_show_content.innerHTML = `
                                        <audio controls autoplay>
                                            <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                        </audio>
                                        `
                                    } else {
                                        overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                    }
                                }
                            } else {
                                if (leftrightIndex < 0) {
                                    if (datarecieve.length > 0) {
                                        datarecievemode = true
                                        leftrightIndex = datarecieve.length - 1 - delete_array.length
                                        if (datarecieve[leftrightIndex].mimetype.includes('image')){
                                            overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[leftrightIndex].path}" loading="lazy" decoding="async">`
                                        } else if (datarecieve[leftrightIndex].mimetype.includes('video')) {
                                            overlay_show_content.innerHTML = `
                                            <video class="overlay-show-content" controls autoplay>
                                                <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                            </video>
                                            `
                                        } else if (datarecieve[leftrightIndex].mimetype.includes('audio')) {
                                            overlay_show_content.innerHTML = `
                                            <audio controls autoplay>
                                                <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                            </audio>
                                            `
                                        } else {
                                            overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                        }
                                    } else {
                                        leftrightIndex = importField.files.length - 1
                                        if(window.File && window.FileReader && window.FileList && window.Blob) {
                                            const reader = new FileReader()
                                            reader.addEventListener('load', (event) => {
                                                if (importField.files.item(leftrightIndex).type.includes('image')){
                                                    overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                                } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                                    overlay_show_content.innerHTML = `
                                                    <video class="overlay-show-content" controls autoplay>
                                                        <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                    </video>
                                                    `
                                                } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                                    overlay_show_content.innerHTML = `
                                                    <audio controls autoplay>
                                                        <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                    </audio>
                                                    `
                                                } else {
                                                    overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                                }
                                            })
                                            reader.readAsDataURL(importField.files[leftrightIndex])
                                        } else {
                                            alert('Your browser does not spport File API')
                                        }
                                    }
                                } else {
                                    if(window.File && window.FileReader && window.FileList && window.Blob) {
                                        const reader = new FileReader()
                                        reader.addEventListener('load', (event) => {
                                            if (importField.files.item(leftrightIndex).type.includes('image')){
                                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                            } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                                overlay_show_content.innerHTML = `
                                                <video class="overlay-show-content" controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </video>
                                                `
                                            } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                                overlay_show_content.innerHTML = `
                                                <audio controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </audio>
                                                `
                                            } else {
                                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                            }
                                        })
                                        reader.readAsDataURL(importField.files[leftrightIndex])
                                    } else {
                                        alert('Your browser does not spport File API')
                                    }
                                }
                            }

                        });
                        /*
                        document.addEventListener('keydown', (e) => {
                            if (e.key == 'ArrowLeft') {
                                console.log('left')
                            }
                        })
                        */
                       /*
                        const rightArrowDot = document.createElement('div');
                        rightArrowDot.classList.add('dot','right-arrow-dot')
                        const iconRightArrowDot = document.createElement('i');
                        iconRightArrowDot.classList.add('fa','fa-chevron-right');
                        rightArrowDot.append(iconRightArrowDot);
                        rightArrowDot.addEventListener('click',() => {
                            leftrightIndex ++
                            if (datarecievemode) {
                                if (leftrightIndex > datarecieve.length - delete_array.length) {
                                    datarecievemode = false
                                    leftrightIndex = 0
                                    if(window.File && window.FileReader && window.FileList && window.Blob) {
                                        const reader = new FileReader()
                                        reader.addEventListener('load', (event) => {
                                            if (importField.files.item(leftrightIndex).type.includes('image')){
                                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                            } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                                overlay_show_content.innerHTML = `
                                                <video class="overlay-show-content" controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </video>
                                                `
                                            } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                                overlay_show_content.innerHTML = `
                                                <audio controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </audio>
                                                `
                                            } else {
                                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                            }
                                        })
                                        reader.readAsDataURL(importField.files[leftrightIndex])
                                    } else {
                                        alert('Your browser does not spport File API')
                                    }
                                } else {
                                    if (datarecieve[leftrightIndex].mimetype.includes('image')){
                                        overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[leftrightIndex].path}" loading="lazy" decoding="async">`
                                    } else if (datarecieve[leftrightIndex].mimetype.includes('video')) {
                                        overlay_show_content.innerHTML = `
                                        <video class="overlay-show-content" controls autoplay>
                                            <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                        </video>
                                        `
                                    } else if (datarecieve[leftrightIndex].mimetype.includes('audio')) {
                                        overlay_show_content.innerHTML = `
                                        <audio controls autoplay>
                                            <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                        </audio>
                                        `
                                    } else {
                                        overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                    }
                                }
                            } else {
                                if (leftrightIndex > importField.files.length - 1) {
                                    if (datarecieve.length > 0) {
                                        datarecievemode = true
                                        leftrightIndex = 0
                                        if (datarecieve[leftrightIndex].mimetype.includes('image')){
                                            overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[leftrightIndex].path}" loading="lazy" decoding="async">`
                                        } else if (datarecieve[leftrightIndex].mimetype.includes('video')) {
                                            overlay_show_content.innerHTML = `
                                            <video class="overlay-show-content" controls autoplay>
                                                <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                            </video>
                                            `
                                        } else if (datarecieve[leftrightIndex].mimetype.includes('audio')) {
                                            overlay_show_content.innerHTML = `
                                            <audio controls autoplay>
                                                <source src="${datarecieve[leftrightIndex].path}" type="${datarecieve[leftrightIndex].mimetype}" />
                                            </audio>
                                            `
                                        } else {
                                            overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                        }
                                    } else {
                                        leftrightIndex = importField.files.length - 1
                                        if(window.File && window.FileReader && window.FileList && window.Blob) {
                                            const reader = new FileReader()
                                            reader.addEventListener('load', (event) => {
                                                if (importField.files.item(leftrightIndex).type.includes('image')){
                                                    overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                                } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                                    overlay_show_content.innerHTML = `
                                                    <video class="overlay-show-content" controls autoplay>
                                                        <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                    </video>
                                                    `
                                                } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                                    overlay_show_content.innerHTML = `
                                                    <audio controls autoplay>
                                                        <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                    </audio>
                                                    `
                                                } else {
                                                    overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                                }
                                            })
                                            reader.readAsDataURL(importField.files[leftrightIndex])
                                        } else {
                                            alert('Your browser does not spport File API')
                                        }
                                    }
                                } else {
                                    if(window.File && window.FileReader && window.FileList && window.Blob) {
                                        const reader = new FileReader()
                                        reader.addEventListener('load', (event) => {
                                            if (importField.files.item(leftrightIndex).type.includes('image')){
                                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                            } else if (importField.files.item(leftrightIndex).type.includes('video')) {
                                                overlay_show_content.innerHTML = `
                                                <video class="overlay-show-content" controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </video>
                                                `
                                            } else if (importField.files.item(leftrightIndex).type.includes('audio')) {
                                                overlay_show_content.innerHTML = `
                                                <audio controls autoplay>
                                                    <source src="${event.target.result}" type="${importField.files.item(leftrightIndex).type}" />
                                                </audio>
                                                `
                                            } else {
                                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                            }
                                        })
                                        reader.readAsDataURL(importField.files[leftrightIndex])
                                    } else {
                                        alert('Your browser does not spport File API')
                                    }
                                }
                            }
                        });
                        /*
                        document.addEventListener('keydown', (e) => {
                            if (e.key == 'ArrowRight') {
                                console.log('right')
                            }
                        })
                        */
                        overlay_show_container.append(overlay_show_content,overlay_show_content_name)
                        overlay_show.append(closeDot,/*leftArrowDot,rightArrowDot,*/overlay_show_container)
        
                        overlay_show_shadow.append(overlay_show)
                        document.body.append(overlay_show_shadow)
                    })
                    const file_overlay_name = document.createElement('p')
                    file_overlay_name.classList.add('file-overlay-name')
                    file_overlay_name.innerHTML = `${importField.files.item(i).name}`
                    file_overlay.style.display = 'none'
                    file_overlay.classList.add('file-overlay')
            
                    form_right_grid_file.addEventListener('mouseenter', () => {
                        file_overlay.style.display = "flex"
                        if (type.includes('image')) {
                            file_overlay.append(eye_icon,flag_icon,trash_icon,file_overlay_name)
                        } else {
                            file_overlay.append(eye_icon,trash_icon,file_overlay_name)
                        }
                        form_right_grid_file.appendChild(file_overlay)
                    })

                    form_right_grid_file.addEventListener('mouseleave', () => {
                        file_overlay.style.display = 'none'
                    })

                    if(window.File && window.FileReader && window.FileList && window.Blob) {
                        const reader = new FileReader()
                        reader.addEventListener('load', (event) => {
                            if (type.includes('image')){
                                form_right_grid_file.innerHTML = `<img class="thumbnail" src="${event.target.result}" loading="lazy" decoding="async">`
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

        if (item.data_main_image !== "") {
            datarecieve.find(function(post, index) {
                if(post.originalname == item.data_main_image) {
                    folder_main_cover.innerHTML = `
                        <div class="folder-main-cover-shadow">
                            <i class="fa fa-folder-open-o" style="font-size: 50px;"></i>
                        </div>
                        <img class='thumbnail' src="${post.path}" alt="${post.originalname}"
                        style="border-radius: 0px;">
                    `
                    return
                }
            });
        } else {
            if (datarecieve.length !== 0) {
                if (datarecieve[0].mimetype.includes('image')) {
                    folder_main_cover.innerHTML = `
                        <div class="folder-main-cover-shadow">
                            <i class="fa fa-folder-open-o" style="font-size: 50px;"></i>
                        </div>
                        <img class='thumbnail' src="${datarecieve[0].path}" alt="${datarecieve[0].originalname}"
                        style="border-radius: 0px;">
                    `
                } else {
                    folder_main_cover.innerHTML = `
                        <div class="folder-main-cover-shadow">
                            <i class="fa fa-folder-open-o" style="font-size: 50px;"></i>
                        </div>
                    `
                }
            }
        }
        
        let grid_index = 0
        datarecieve.forEach(file => {
            if (grid_index < 15) {
                const folder_content_card = document.createElement('div')
                folder_content_card.classList.add('folder-content-card')
                /*console.log(file)*/
                if (file.mimetype.includes('image')){
                    folder_content_card.innerHTML = `<img class='thumbnail' src="${file.path}" loading="lazy" decoding="async" alt="${file.originalname}">`
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
        
        function urlify(text) {
            const urlRegex = new RegExp(/(https?:\/\/[^\s]+)/g);
            return text.replace(urlRegex, function(url) {
                return '<a href="' + url + '">' + url + '</a>';
            })
        }
        const urlifyed_text = urlify(item.data_description)

        icd_p.innerHTML = `${urlifyed_text}`
        info_content_description.append(icd_label,icd_p)

        folder_info_description.appendChild(info_content_description)

        folder_info.append(folder_info_alias,folder_info_description)

        /*folder append*/
        folder.append(folder_main,folder_content,folder_info)

        grid.append(folder)
    }
}