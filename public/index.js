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

//NOTIFICATION AREA
const notification_area = document.querySelector('#notification-area')

//FIRST INITIATION
getAllData(search_bar.value,direction_var,filter_value);

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
    //UPLOAD-OVERLAY INITIATION
    const overlayShadow = document.createElement('div');
    overlayShadow.id = 'overlay-shadow';
    const overlay = document.createElement('div');
    overlay.id = 'overlay';

    //UPLOAD-OVERLAY-DOTS-CLOSEDOT
    const closeDot = document.createElement('div');
    closeDot.classList.add('dot','close-dot');
    const iconCloseDot = document.createElement('i');
    iconCloseDot.classList.add('fa','fa-close');
    closeDot.append(iconCloseDot);
    closeDot.addEventListener('click',() => {
        overlayShadow.remove();
    });

    //UPLOAD-OVERLAY-DOTS-SAVEDOT
    const saveDot = document.createElement('div');
    saveDot.classList.add('dot','save-dot');
    const iconSaveDot = document.createElement('i');
    iconSaveDot.classList.add('fa','fa-save');
    saveDot.append(iconSaveDot);
    saveDot.addEventListener('click', async () => {
        if (formLeftName.value !== '') {
            //checking the individuality of folder name
            const name_check = { data_name : formLeftName.value }
            await fetch("/namecheck",{
                method: "POST", 
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(name_check)
            })
            const name_check_response_fetch = await fetch("/namecheck")
            const name_check_response_json = await name_check_response_fetch.json()
            if (name_check_response_json.name_check_data) {
                const notification = document.createElement('div')
                notification.classList.add('notification','appear')
                notification.innerHTML = `
                    <h5>File name already taken!</h5> 
                    <p>Name: ${formLeftName.value}</p>
                `
                notification_area.prepend(notification)
                setTimeout(function() {
                    notification.remove()
                },5000)
                return
            }

            //creating and sending an object containing text content
            const data_name = formLeftName.value;
            const data_name_lc = data_name.toLowerCase()
            const data_alias = formLeftAlias.value;
            const data_alias_lc = data_alias.toLowerCase()
            const data_description = formLeftDescription.value;
            const data_description_lc = data_description.toLowerCase()
            const data_main_image = flag_image
            const _id = String(Date.now());
            const data_modified = _id
            const data = { data_name, data_name_lc, data_alias, data_alias_lc, data_description, data_description_lc, data_modified, data_main_image, _id };
            const data_content = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            fetch('/uploadtext',data_content);

            //creating and sending formData containing file content
            const formData = new FormData()    
            for (let i = 0; i < importField.files.length; i++) {
                formData.append("files", importField.files[i])
            }
            await fetch("/uploadfiles", { method: "POST", body: formData} );

            //reset
            getAllData(search_bar.value,direction_var,filter_value);
            overlayShadow.remove();
        } else {
            const notification = document.createElement('div')
            notification.classList.add('notification','appear')
            notification.innerHTML = `
                <h5>Specify folder name!</h5> 
            `
            notification_area.prepend(notification)
            setTimeout(function() {
                notification.remove()
            },5000)
        }
    })

    //UPLOAD-OVERLAY-FORMLEFT
    const formLeft = document.createElement('form');
    formLeft.id = 'form-left';

    //UPLOAD-OVERLAY-FORMLEFT-(NAME/ALIAS/DESCRIPTION)
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

    //UPLOAD-OVERLAY-FORMRIGHT
    const formRight = document.createElement('div');
    formRight.id = 'form-right';

    //UPLOAD-OVERLAY-FORMRIGHT-(GRID/IMPORT)
    const formRightGrid = document.createElement('div');
    formRightGrid.id = 'form-right-grid';
    const formRightImport = document.createElement('form');
    formRightImport.id = 'form-right-import';
    const importField = document.createElement('input');
    importField.type = 'file';
    importField.id = 'import-field';
    importField.setAttribute("multiple","");

    //add files, add more files, show, flag and delete files
    let flag_image = ''
    const dt = new DataTransfer();
    const dtsc = new DataTransfer();
    importField.addEventListener('change', () => {
        let big_files = false
        let delete_files = []
        for(let i = 0; i < importField.files.length; i++){
            if (importField.files[i].size > 20000000) { //20MB
                dtsc.clearData()
                big_files = true

                for (file of importField.files) {
                    dtsc.items.add(file); 
                }

                const notification = document.createElement('div')
                notification.classList.add('notification','appear')
                notification.innerHTML = `
                    <h5>The file you tried to upload is bigger than 20Mb!</h5> 
                    <p>File: ${importField.files[i].name}</p>
                `
                notification_area.prepend(notification)
                setTimeout(function() {
                    notification.remove()
                },5000)

                delete_files.push(importField.files.item(i).name)
                continue
            } 
            
            const form_right_grid_file = document.createElement('div')
            form_right_grid_file.classList.add('form-right-grid-file','new-frgf')
            form_right_grid_file.id = i

            const file_overlay = document.createElement('div')
            file_overlay.classList.add('file-overlay')
            file_overlay.style.display = "none"
            
            const trash_icon = document.createElement('i')
            trash_icon.classList.add('fa','fa-trash-o')
            trash_icon.addEventListener('click', () => {
                let delete_file = trash_icon.parentElement.lastElementChild.textContent
                trash_icon.parentElement.parentElement.remove()
                for(let i = 0; i < dt.items.length; i++){
                    if(delete_file === dt.items[i].getAsFile().name){
                        dt.items.remove(i);
                        continue;
                    }
                }
                if (flag_image === trash_icon.nextSibling.textContent) {
                    flag_image = ''
                }
                importField.files = dt.files;
                const current_files = document.querySelectorAll('.new-frgf')       
                current_files.forEach((file,file_index) => {
                    file.id = file_index
                })
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
                    flag_image = flag_icon.nextSibling.nextSibling.textContent
                } else {
                    flag_icon.classList.remove('fa-flag')
                    flag_icon.classList.add('fa-flag-o')
                    flag_image = ''
                }
            })

            const type = importField.files.item(i).type
            const eye_icon = document.createElement('i')
            eye_icon.classList.add('fa','fa-eye')
            eye_icon.addEventListener('click', () => {
                const current_files = document.querySelectorAll('.new-frgf')       
                current_files.forEach((file,file_index) => {
                    file.id = file_index
                })
                let index = eye_icon.parentElement.parentElement.id

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
                } else { alert('Your browser does not spport File API') }

                const closeDot = document.createElement('div');
                closeDot.classList.add('dot','close-dot');
                const iconCloseDot = document.createElement('i');
                iconCloseDot.classList.add('fa','fa-close');
                closeDot.append(iconCloseDot);
                closeDot.addEventListener('click',() => {
                    document.removeEventListener("keydown", ArrowFunctionRemove);
                    overlay_show_shadow.remove();
                });
                
                const leftArrowDot = document.createElement('div');
                leftArrowDot.classList.add('dot','left-arrow-dot')
                const iconLeftArrowDot = document.createElement('i');
                iconLeftArrowDot.classList.add('fa','fa-chevron-left');
                leftArrowDot.append(iconLeftArrowDot);
                function LeftArrowFunction() {
                    index --
                    if (index < 0) {
                        index = importField.files.length - 1
                    }

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
                            if (importField.files.item(index).type.includes('image')){
                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                            } else if (importField.files.item(index).type.includes('video')) {
                                overlay_show_content.innerHTML = `
                                <video class="overlay-show-content" controls autoplay>
                                    <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                </video>
                                `
                                overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                            } else if (importField.files.item(index).type.includes('audio')) {
                                overlay_show_content.innerHTML = `
                                <audio controls autoplay>
                                    <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                </audio>
                                `
                                overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                            } else {
                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                            }
                        })
                        reader.readAsDataURL(importField.files[index])
                    } else { alert('Your browser does not spport File API') }
                }
                leftArrowDot.addEventListener('click', LeftArrowFunction);
                
                const rightArrowDot = document.createElement('div');
                rightArrowDot.classList.add('dot','right-arrow-dot')
                const iconRightArrowDot = document.createElement('i');
                iconRightArrowDot.classList.add('fa','fa-chevron-right');
                rightArrowDot.append(iconRightArrowDot);
                function RightArrowFunction() {
                    index ++
                    if (index > importField.files.length - 1) {
                        index = 0
                    }

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
                            if (importField.files.item(index).type.includes('image')){
                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                            } else if (importField.files.item(index).type.includes('video')) {
                                overlay_show_content.innerHTML = `
                                <video class="overlay-show-content" controls autoplay>
                                    <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                </video>
                                `
                                overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                            } else if (importField.files.item(index).type.includes('audio')) {
                                overlay_show_content.innerHTML = `
                                <audio controls autoplay>
                                    <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                </audio>
                                `
                                overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                            } else {
                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                            }
                        })
                        reader.readAsDataURL(importField.files[index])
                    } else { alert('Your browser does not spport File API') }
                }
                rightArrowDot.addEventListener('click', RightArrowFunction);

                const ArrowFunctionRemove = (e) => {
                    if (e.key == 'ArrowRight') {
                        RightArrowFunction()
                    }
                    if (e.key == 'ArrowLeft') {
                        LeftArrowFunction()
                    }
                }
                document.addEventListener('keydown', ArrowFunctionRemove)

                //SHOW-OVERLAY APPEND
                const formDots = document.createElement('div');
                formDots.id = 'form-dots';
                formDots.append(closeDot,leftArrowDot,rightArrowDot)

                overlay_show_container.append(overlay_show_content,overlay_show_content_name)
                overlay_show.append(overlay_show_container,formDots)
                overlay_show_shadow.append(overlay_show)
                document.body.append(overlay_show_shadow)
            })

            const file_overlay_name = document.createElement('p')
            file_overlay_name.classList.add('file-overlay-name')
            file_overlay_name.innerHTML = `${importField.files.item(i).name}` 
            
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
            } else { alert('Your browser does not spport File API') }
        };

        if (big_files) {
            for (let j = 0; j < dtsc.items.length; j++){
                for (let k = 0; k < delete_files.length; k++){
                    if(dtsc.items[j].getAsFile().name === delete_files[k]){
                        dtsc.items.remove(j);
                        continue
                    }
                }    
            }
            importField.files = dtsc.files
            dtsc.clearData()
            big_files = false
            delete_files = []
        }

        for (let file of importField.files) {
            dt.items.add(file);
        }
        importField.files = dt.files;
    });

    //FORM/UPLOAD-OVERLAY-APPEND
    const formDots = document.createElement('div');
    formDots.id = 'form-dots';
    formDots.append(closeDot,saveDot)

    formRightImport.append(importField)
    formRight.append(formRightGrid,formRightImport)
    overlay.append(formLeft,formRight,formDots)
    overlayShadow.append(overlay)
    document.body.append(overlayShadow)
})    

//get data from text database
async function getAllData(keyword_value, direction_value, filter_value) {
    // send search direction and filter
    const value_in = {keyword_value, direction_value, filter_value}
    const value_req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value_in)
    };
    const length_response = await fetch('/sort',value_req)
    const length_json = await length_response.json()

    // recieve filtered data
    const fetch_text_response = await fetch('/fetchtext')
    const data = await fetch_text_response.json();

    // clear grid each time function is called
    const grid = document.querySelector('#grid')
    grid.innerHTML = ''

    const main_container_info = document.querySelector('#main-container-info')
    main_container_info.innerHTML = `Showing ${data.length} from ${length_json.length} folders`

    // for each object from data create a folder
    for (item of data) {
        //FOLDER
        const folder = document.createElement('div')
        folder.classList.add('folder')
        const current_item_data = item
        folder.id = item._id

        //FOLDER-FOLDERMAIN
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
        const folder_main_content_h4 = document.createElement('h4')
        folder_main_content_h4.textContent = `${item.data_name}`
        const folder_main_content_p_u = document.createElement('p')
        const folder_main_content_p_m = document.createElement('p')
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
        folder_main_content_p_u.innerHTML = `Uploaded: ${date_u}`
        const date_m = `${
            padL(dt_m.getDate())}/${
            padL(dt_m.getMonth()+1)}/${
            dt_m.getFullYear()} ${
            padL(dt_m.getHours())}:${
            padL(dt_m.getMinutes())}:${
            padL(dt_m.getSeconds())
        }`
        folder_main_content_p_m.innerHTML = `Modified: ${date_m}`
        folder_main_content.append(folder_main_content_h4,folder_main_content_p_m,folder_main_content_p_u)

        folder_main.append(folder_main_cover,folder_main_content)

        // folder open
        folder_main.addEventListener('click', async () => {
            //UPDATE/DELETE-OVERLAY INITIATION
            const overlayShadow = document.createElement('div');
            overlayShadow.id = 'overlay-shadow';
            const overlay = document.createElement('div');
            overlay.id = 'overlay';
        
            //UPDATE/DELETE-OVERLAY-DOTS-CLOSEDOT
            const closeDot = document.createElement('div');
            closeDot.classList.add('dot','close-dot');
            const iconCloseDot = document.createElement('i');
            iconCloseDot.classList.add('fa','fa-close');
            closeDot.append(iconCloseDot);
            closeDot.addEventListener('click',() => {
                overlayShadow.remove();
            });
            
            //UPDATE/DELETE-OVERLAY-DOTS-DELETEDOT
            const deleteDot = document.createElement('div');
            deleteDot.classList.add('dot','delete-dot');
            const iconDeleteDot = document.createElement('i');
            iconDeleteDot.classList.add('fa','fa-trash');
            deleteDot.append(iconDeleteDot);
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
                fetch('/deletefolder',deletion);
                getAllData(search_bar.value,direction_var,filter_value);
                overlayShadow.remove();
            })
            
            //UPDATE/DELETE-OVERLAY-DOTS-SAVEDOT
            const saveDot = document.createElement('div');
            saveDot.classList.add('dot','save-dot');
            const iconSaveDot = document.createElement('i');
            iconSaveDot.classList.add('fa','fa-save');
            saveDot.append(iconSaveDot);
            saveDot.addEventListener('click', async() => {
                if (formLeftName.value !== '') {
                    //checking the individuality of folder name
                    const name_check = { data_name : formLeftName.value, _id : folder.id}
                    await fetch("/namecheck",{
                        method: "POST", 
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify(name_check)
                    })
                    const name_check_response_fetch = await fetch("/namecheck")
                    const name_check_response_json = await name_check_response_fetch.json()
                    if (name_check_response_json.name_check_data) {
                        const notification = document.createElement('div')
                        notification.classList.add('notification','appear')
                        notification.innerHTML = `
                            <h5>File name already taken!</h5> 
                            <p>Name: ${formLeftName.value}</p>
                        `
                        notification_area.prepend(notification)
                        setTimeout(function() {
                            notification.remove()
                        },5000)
                        return
                    }

                    //creating and sending an object containing text content
                    const data_name = formLeftName.value;
                    const data_name_lc = data_name.toLowerCase()
                    const data_alias = formLeftAlias.value;
                    const data_alias_lc = data_alias.toLowerCase()
                    const data_description = formLeftDescription.value;
                    const data_description_lc = data_description.toLowerCase()
                    const data_main_image = flag_image
                    const data_modified = String(Date.now());
                    const _id = folder.id;
                    const data = {data_name, data_name_lc, data_alias, data_alias_lc, data_description,  data_description_lc, data_modified, data_main_image, _id};
                    const data_content = {
                        method: 'POST',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify(data)
                    };
                    fetch('/updatetext',data_content);

                    //creating and sending formData containing file content
                    const formData = new FormData()
                    for (let i = 0; i < importField.files.length; i++) {
                        formData.append("files", importField.files[i])
                    }
                    await fetch("/uploadfiles", {method: "POST",body: formData});

                    //checking if user wants to delete any file
                    if (delete_array.length !== 0) {
                        const data = { array:delete_array };
                        const deletion = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        };
                        fetch('/deletefiles',deletion);
                        delete_array = ''
                    }

                    //reset
                    getAllData(search_bar.value,direction_var,filter_value);   
                    overlayShadow.remove();              
                } else {
                    const notification = document.createElement('div')
                    notification.classList.add('notification','appear')
                    notification.innerHTML = `
                        <h5>Specify folder name!</h5> 
                    `
                    notification_area.prepend(notification)
                    setTimeout(function() {
                        notification.remove()
                    },5000)
                }
            })
        
            //UPDATE/DELETE-OVERLAY-FORMLEFT
            const formLeft = document.createElement('form');
            formLeft.id = 'form-left';
            
            //UPDATE/DELETE-OVERLAY-FORMLEFT-(NAME/ALIAS/DESCRIPTION)
            const formLeftName = document.createElement('input');
            formLeftName.id = 'form-left-name';
            formLeftName.type = 'text';
            formLeftName.placeholder = 'Folder Title...';
            formLeftName.maxLength = '20'
            formLeftName.autocomplete = 'off'
            formLeftName.value = `${folder_main_content_h4.textContent}`
            const formLeftAlias = document.createElement('textarea');
            formLeftAlias.id = 'form-left-alias';
            formLeftAlias.placeholder = 'Alias names...';
            formLeftAlias.value = `${info_content_alias_p.textContent}`
            const formLeftDescription = document.createElement('textarea');
            formLeftDescription.id = 'form-left-description';
            formLeftDescription.placeholder = 'Description...';
            formLeftDescription.value = `${info_content_description_p.textContent}`
        
            formLeft.append(formLeftName,formLeftAlias,formLeftDescription);
        
            //UPDATE/DELETE-OVERLAY-FORMRIGHT
            const formRight = document.createElement('div');
            formRight.id = 'form-right';

            //UPDATE/DELETE-OVERLAY-FORMRIGHT-(GRID/IMPORT)
            const formRightGrid = document.createElement('div');
            formRightGrid.id = 'form-right-grid';
            const formRightImport = document.createElement('form');
            formRightImport.id = 'form-right-import';
            const importField = document.createElement('input');
            importField.type = 'file';
            importField.id = 'import-field';
            importField.setAttribute("multiple","");

            //send id and get files from files database
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

            //for each recieved file create a box in a grid
            let delete_array = []
            let current_item_main_image = current_item_data.data_main_image
            let flag_image = current_item_main_image
            for(current_data_item of datarecieve){
                let current_item = current_data_item

                const form_right_grid_file = document.createElement('div')
                form_right_grid_file.classList.add('form-right-grid-file')

                const file_overlay = document.createElement('div')
                file_overlay.classList.add('file-overlay')
                file_overlay.style.display = 'none'
                
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

                let index = datarecieve.indexOf(current_data_item)
                const eye_icon = document.createElement('i')
                eye_icon.classList.add('fa','fa-eye')
                eye_icon.addEventListener('click', () => {
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
                        document.removeEventListener("keydown", ArrowFunctionRemove);
                        overlay_show_shadow.remove();
                    });

                    const leftArrowDot = document.createElement('div');
                    leftArrowDot.classList.add('dot','left-arrow-dot')
                    const iconLeftArrowDot = document.createElement('i');
                    iconLeftArrowDot.classList.add('fa','fa-chevron-left');
                    leftArrowDot.append(iconLeftArrowDot);
                    let circle = true
                    function LeftArrowFunction() {
                        index --

                        if (index < 0 && !circle) {
                            if(datarecieve.length > 0) {
                                index = datarecieve.length - 1
                                circle = true
                            } else {
                                index = importField.files.length - 1
                            } 
                        }

                        if (index < 0 && circle) {
                            if(importField.files.length > 0) {
                                index = importField.files.length - 1
                                circle = false
                            } else {
                                index = datarecieve.length - 1
                            }
                        } else if (circle) {
                            if (delete_array.includes(datarecieve[index]._id)) {
                                return LeftArrowFunction()
                            }
                        }
    
                        let final_byte_size = ''
                        if (!circle) {
                            if (importField.files[index].size * 0.000001 > 1) {
                                let byte_size = importField.files[index].size * 0.000001
                                final_byte_size = byte_size.toFixed(2) + 'MB'
                            } else {
                                let byte_size = importField.files[index].size * 0.001
                                final_byte_size = byte_size.toFixed(2) + 'KB'
                            }
                        } else {
                            if (datarecieve[index].size * 0.000001 > 1) {
                                let byte_size = datarecieve[index].size * 0.000001
                                final_byte_size = byte_size.toFixed(2) + 'MB'
                            } else {
                                let byte_size = datarecieve[index].size * 0.001
                                final_byte_size = byte_size.toFixed(2) + 'KB'
                            }
                        }

                        if (!circle) {
                            if(window.File && window.FileReader && window.FileList && window.Blob) {
                                const reader = new FileReader()
                                reader.addEventListener('load', (event) => {
                                    if (importField.files.item(index).type.includes('image')){
                                        overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                        overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                    } else if (importField.files.item(index).type.includes('video')) {
                                        overlay_show_content.innerHTML = `
                                        <video class="overlay-show-content" controls autoplay>
                                            <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                        </video>
                                        `
                                        overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                    } else if (importField.files.item(index).type.includes('audio')) {
                                        overlay_show_content.innerHTML = `
                                        <audio controls autoplay>
                                            <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                        </audio>
                                        `
                                        overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                    } else {
                                        overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                        overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                    }
                                })
                                reader.readAsDataURL(importField.files[index])
                            } else { alert('Your browser does not spport File API') }
                        } else {
                            if (datarecieve[index].mimetype.includes('image')){
                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[index].path}" loading="lazy" decoding="async">`
                                overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                            } else if (datarecieve[index].mimetype.includes('video')) {
                                overlay_show_content.innerHTML = `
                                <video class="overlay-show-content" controls autoplay>
                                    <source src="${datarecieve[index].path}" type="${datarecieve[index].mimetype}" />
                                </video>
                                `
                                overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                            } else if (datarecieve[index].mimetype.includes('audio')) {
                                overlay_show_content.innerHTML = `
                                <audio controls autoplay>
                                    <source src="${datarecieve[index].path}" type="${datarecieve[index].mimetype}" />
                                </audio>
                                `
                                overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                            } else {
                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                            }
                        }  
                    }
                    leftArrowDot.addEventListener('click', LeftArrowFunction);
                    
                    const rightArrowDot = document.createElement('div');
                    rightArrowDot.classList.add('dot','right-arrow-dot')
                    const iconRightArrowDot = document.createElement('i');
                    iconRightArrowDot.classList.add('fa','fa-chevron-right');
                    rightArrowDot.append(iconRightArrowDot);
                    function RightArrowFunction() {
                        index ++

                        if (index > importField.files.length - 1 && !circle) {
                            if(datarecieve.length > 0) {
                                index = 0
                                circle = true
                            } else {
                                index = 0
                            } 
                        }

                        if (index > datarecieve.length - 1 && circle) {
                            if(importField.files.length > 0) {
                                index = 0
                                circle = false
                            } else {
                                index = 0
                            }
                        } else if (circle) {
                            if (delete_array.includes(datarecieve[index]._id)) {
                                return RightArrowFunction()
                            }
                        }
    
                        let final_byte_size = ''
                        if (!circle) {
                            if (importField.files[index].size * 0.000001 > 1) {
                                let byte_size = importField.files[index].size * 0.000001
                                final_byte_size = byte_size.toFixed(2) + 'MB'
                            } else {
                                let byte_size = importField.files[index].size * 0.001
                                final_byte_size = byte_size.toFixed(2) + 'KB'
                            }
                        } else {
                            if (datarecieve[index].size * 0.000001 > 1) {
                                let byte_size = datarecieve[index].size * 0.000001
                                final_byte_size = byte_size.toFixed(2) + 'MB'
                            } else {
                                let byte_size = datarecieve[index].size * 0.001
                                final_byte_size = byte_size.toFixed(2) + 'KB'
                            }
                        }

                        if (!circle) {
                            if(window.File && window.FileReader && window.FileList && window.Blob) {
                                const reader = new FileReader()
                                reader.addEventListener('load', (event) => {
                                    if (importField.files.item(index).type.includes('image')){
                                        overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                        overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                    } else if (importField.files.item(index).type.includes('video')) {
                                        overlay_show_content.innerHTML = `
                                        <video class="overlay-show-content" controls autoplay>
                                            <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                        </video>
                                        `
                                        overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                    } else if (importField.files.item(index).type.includes('audio')) {
                                        overlay_show_content.innerHTML = `
                                        <audio controls autoplay>
                                            <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                        </audio>
                                        `
                                        overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                    } else {
                                        overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                        overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                    }
                                })
                                reader.readAsDataURL(importField.files[index])
                            } else { alert('Your browser does not spport File API') }
                        } else {
                            if (datarecieve[index].mimetype.includes('image')){
                                overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[index].path}" loading="lazy" decoding="async">`
                                overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                            } else if (datarecieve[index].mimetype.includes('video')) {
                                overlay_show_content.innerHTML = `
                                <video class="overlay-show-content" controls autoplay>
                                    <source src="${datarecieve[index].path}" type="${datarecieve[index].mimetype}" />
                                </video>
                                `
                                overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                            } else if (datarecieve[index].mimetype.includes('audio')) {
                                overlay_show_content.innerHTML = `
                                <audio controls autoplay>
                                    <source src="${datarecieve[index].path}" type="${datarecieve[index].mimetype}" />
                                </audio>
                                `
                                overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                            } else {
                                overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                            }
                        }  
                    }
                    rightArrowDot.addEventListener('click', RightArrowFunction);
    
                    const ArrowFunctionRemove = (e) => {
                        if (e.key == 'ArrowRight') {
                            RightArrowFunction()
                        }
                        if (e.key == 'ArrowLeft') {
                            LeftArrowFunction()
                        }
                    }
                    document.addEventListener('keydown', ArrowFunctionRemove)

                    //SHOW-OVERLAY APPEND
                    const formDots = document.createElement('div');
                    formDots.id = 'form-dots';
                    formDots.append(closeDot,leftArrowDot,rightArrowDot)
    
                    overlay_show_container.append(overlay_show_content,overlay_show_content_name)
                    overlay_show.append(overlay_show_container,formDots)
                    overlay_show_shadow.append(overlay_show)
                    document.body.append(overlay_show_shadow)
                })

                const file_overlay_name = document.createElement('p')
                file_overlay_name.classList.add('file-overlay-name')
                file_overlay_name.innerHTML = `${current_data_item.originalname}`
        
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

            //add files, add more files, show, flag and delete files
            const dt = new DataTransfer();
            const dtsc = new DataTransfer();
            importField.addEventListener('change', () => {
                let big_files = false
                let delete_files = []
                for(let i = 0; i < importField.files.length; i++){
                    if (importField.files[i].size > 20000000) { //20MB
                        dtsc.clearData()
                        big_files = true
        
                        for (file of importField.files) {
                            dtsc.items.add(file); 
                        }
        
                        const notification = document.createElement('div')
                        notification.classList.add('notification','appear')
                        notification.innerHTML = `
                            <h5>The file you tried to upload is bigger than 20Mb!</h5> 
                            <p>File: ${importField.files[i].name}</p>
                        `
                        notification_area.prepend(notification)
                        setTimeout(function() {
                            notification.remove()
                        },5000)
        
                        delete_files.push(importField.files.item(i).name)
                        continue
                    }

                    //for each file imported, each time files are imported
                    const form_right_grid_file = document.createElement('div')
                    form_right_grid_file.classList.add('form-right-grid-file','new-frgf')
                    form_right_grid_file.id = i

                    const file_overlay = document.createElement('div')
                    file_overlay.classList.add('file-overlay')
                    file_overlay.style.display = "none"

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
                        if (flag_image === trash_icon.nextSibling.innerText) {
                            flag_image = ''
                        }
                        importField.files = dt.files;
                        const current_files = document.querySelectorAll('.new-frgf')       
                        current_files.forEach((file,file_index) => {
                            file.id = file_index
                        })
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

                    const type = importField.files.item(i).type
                    const eye_icon = document.createElement('i')
                    eye_icon.classList.add('fa','fa-eye')
                    eye_icon.addEventListener('click', () => {
                        const current_files = document.querySelectorAll('.new-frgf')       
                        current_files.forEach((file,file_index) => {
                            file.id = file_index
                        })
                        let index = eye_icon.parentElement.parentElement.id
        
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
                        } else { alert('Your browser does not spport File API') }
        
                        const closeDot = document.createElement('div');
                        closeDot.classList.add('dot','close-dot');
                        const iconCloseDot = document.createElement('i');
                        iconCloseDot.classList.add('fa','fa-close');
                        closeDot.append(iconCloseDot);
                        closeDot.addEventListener('click',() => {
                            document.removeEventListener("keydown", ArrowFunctionRemove);
                            overlay_show_shadow.remove();
                        });

                        const leftArrowDot = document.createElement('div');
                        leftArrowDot.classList.add('dot','left-arrow-dot')
                        const iconLeftArrowDot = document.createElement('i');
                        iconLeftArrowDot.classList.add('fa','fa-chevron-left');
                        leftArrowDot.append(iconLeftArrowDot);
                        let circle = false
                        function LeftArrowFunction() {
                            index --

                            if (index < 0 && !circle) {
                                if(datarecieve.length > 0) {
                                    index = datarecieve.length - 1
                                    circle = true
                                } else {
                                    index = importField.files.length - 1
                                } 
                            }

                            if (index < 0 && circle) {
                                if(importField.files.length > 0) {
                                    index = importField.files.length - 1
                                    circle = false
                                } else {
                                    index = datarecieve.length - 1
                                }
                            } else if (circle) {
                                if (delete_array.includes(datarecieve[index]._id)) {
                                    return LeftArrowFunction()
                                }
                            }
        
                            let final_byte_size = ''
                            if (!circle) {
                                if (importField.files[index].size * 0.000001 > 1) {
                                    let byte_size = importField.files[index].size * 0.000001
                                    final_byte_size = byte_size.toFixed(2) + 'MB'
                                } else {
                                    let byte_size = importField.files[index].size * 0.001
                                    final_byte_size = byte_size.toFixed(2) + 'KB'
                                }
                            } else {
                                if (datarecieve[index].size * 0.000001 > 1) {
                                    let byte_size = datarecieve[index].size * 0.000001
                                    final_byte_size = byte_size.toFixed(2) + 'MB'
                                } else {
                                    let byte_size = datarecieve[index].size * 0.001
                                    final_byte_size = byte_size.toFixed(2) + 'KB'
                                }
                            }

                            if (!circle) {
                                if(window.File && window.FileReader && window.FileList && window.Blob) {
                                    const reader = new FileReader()
                                    reader.addEventListener('load', (event) => {
                                        if (importField.files.item(index).type.includes('image')){
                                            overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                        } else if (importField.files.item(index).type.includes('video')) {
                                            overlay_show_content.innerHTML = `
                                            <video class="overlay-show-content" controls autoplay>
                                                <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                            </video>
                                            `
                                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                        } else if (importField.files.item(index).type.includes('audio')) {
                                            overlay_show_content.innerHTML = `
                                            <audio controls autoplay>
                                                <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                            </audio>
                                            `
                                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                        } else {
                                            overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                        }
                                    })
                                    reader.readAsDataURL(importField.files[index])
                                } else { alert('Your browser does not spport File API') }
                            } else {
                                if (datarecieve[index].mimetype.includes('image')){
                                    overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[index].path}" loading="lazy" decoding="async">`
                                    overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                                } else if (datarecieve[index].mimetype.includes('video')) {
                                    overlay_show_content.innerHTML = `
                                    <video class="overlay-show-content" controls autoplay>
                                        <source src="${datarecieve[index].path}" type="${datarecieve[index].mimetype}" />
                                    </video>
                                    `
                                    overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                                } else if (datarecieve[index].mimetype.includes('audio')) {
                                    overlay_show_content.innerHTML = `
                                    <audio controls autoplay>
                                        <source src="${datarecieve[index].path}" type="${datarecieve[index].mimetype}" />
                                    </audio>
                                    `
                                    overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                                } else {
                                    overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                    overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                                }
                            }  
                        }
                        leftArrowDot.addEventListener('click', LeftArrowFunction);
                        
                        const rightArrowDot = document.createElement('div');
                        rightArrowDot.classList.add('dot','right-arrow-dot')
                        const iconRightArrowDot = document.createElement('i');
                        iconRightArrowDot.classList.add('fa','fa-chevron-right');
                        rightArrowDot.append(iconRightArrowDot);
                        function RightArrowFunction() {
                            index ++

                            if (index > importField.files.length - 1 && !circle) {
                                if(datarecieve.length > 0) {
                                    index = 0
                                    circle = true
                                } else {
                                    index = 0
                                } 
                            }

                            if (index > datarecieve.length - 1 && circle) {
                                if(importField.files.length > 0) {
                                    index = 0
                                    circle = false
                                } else {
                                    index = 0
                                }
                            } else if (circle) {
                                if (delete_array.includes(datarecieve[index]._id)) {
                                    return RightArrowFunction()
                                }
                            }
        
                            let final_byte_size = ''
                            if (!circle) {
                                if (importField.files[index].size * 0.000001 > 1) {
                                    let byte_size = importField.files[index].size * 0.000001
                                    final_byte_size = byte_size.toFixed(2) + 'MB'
                                } else {
                                    let byte_size = importField.files[index].size * 0.001
                                    final_byte_size = byte_size.toFixed(2) + 'KB'
                                }
                            } else {
                                if (datarecieve[index].size * 0.000001 > 1) {
                                    let byte_size = datarecieve[index].size * 0.000001
                                    final_byte_size = byte_size.toFixed(2) + 'MB'
                                } else {
                                    let byte_size = datarecieve[index].size * 0.001
                                    final_byte_size = byte_size.toFixed(2) + 'KB'
                                }
                            }

                            if (!circle) {
                                if(window.File && window.FileReader && window.FileList && window.Blob) {
                                    const reader = new FileReader()
                                    reader.addEventListener('load', (event) => {
                                        if (importField.files.item(index).type.includes('image')){
                                            overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${event.target.result}" loading="lazy" decoding="async">`
                                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                        } else if (importField.files.item(index).type.includes('video')) {
                                            overlay_show_content.innerHTML = `
                                            <video class="overlay-show-content" controls autoplay>
                                                <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                            </video>
                                            `
                                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                        } else if (importField.files.item(index).type.includes('audio')) {
                                            overlay_show_content.innerHTML = `
                                            <audio controls autoplay>
                                                <source src="${event.target.result}" type="${importField.files.item(index).type}" />
                                            </audio>
                                            `
                                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                        } else {
                                            overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                            overlay_show_content_name.innerHTML = `${importField.files[index].name} ${final_byte_size}`
                                        }
                                    })
                                    reader.readAsDataURL(importField.files[index])
                                } else { alert('Your browser does not spport File API') }
                            } else {
                                if (datarecieve[index].mimetype.includes('image')){
                                    overlay_show_content.innerHTML = `<img class="overlay-show-content" src="${datarecieve[index].path}" loading="lazy" decoding="async">`
                                    overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                                } else if (datarecieve[index].mimetype.includes('video')) {
                                    overlay_show_content.innerHTML = `
                                    <video class="overlay-show-content" controls autoplay>
                                        <source src="${datarecieve[index].path}" type="${datarecieve[index].mimetype}" />
                                    </video>
                                    `
                                    overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                                } else if (datarecieve[index].mimetype.includes('audio')) {
                                    overlay_show_content.innerHTML = `
                                    <audio controls autoplay>
                                        <source src="${datarecieve[index].path}" type="${datarecieve[index].mimetype}" />
                                    </audio>
                                    `
                                    overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                                } else {
                                    overlay_show_content.innerHTML = `<i class="fa fa-file-o"></i>`
                                    overlay_show_content_name.innerHTML = `${datarecieve[index].originalname} ${final_byte_size}`
                                }
                            }  
                        }
                        rightArrowDot.addEventListener('click', RightArrowFunction);
        
                        const ArrowFunctionRemove = (e) => {
                            if (e.key == 'ArrowRight') {
                                RightArrowFunction()
                            }
                            if (e.key == 'ArrowLeft') {
                                LeftArrowFunction()
                            }
                        }
                        document.addEventListener('keydown', ArrowFunctionRemove)        

                        //SHOW-OVERLAY APPEND
                        const formDots = document.createElement('div');
                        formDots.id = 'form-dots';
                        formDots.append(closeDot,leftArrowDot,rightArrowDot)
        
                        overlay_show_container.append(overlay_show_content,overlay_show_content_name)
                        overlay_show.append(overlay_show_container,formDots)
                        overlay_show_shadow.append(overlay_show)
                        document.body.append(overlay_show_shadow)
                    })

                    const file_overlay_name = document.createElement('p')
                    file_overlay_name.classList.add('file-overlay-name')
                    file_overlay_name.innerHTML = `${importField.files.item(i).name}`
            
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
                    } else { alert('Your browser does not spport File API') }
                };

                if (big_files) {
                    for (let j = 0; j < dtsc.items.length; j++){
                        for (let k = 0; k < delete_files.length; k++){
                            if(dtsc.items[j].getAsFile().name === delete_files[k]){
                                dtsc.items.remove(j);
                                continue
                            }
                        }    
                    }
                    importField.files = dtsc.files
                    dtsc.clearData()
                    big_files = false
                    delete_files = []
                }

                for (let file of importField.files) {
                    dt.items.add(file);
                }
                importField.files = dt.files;
            });
            
            //UPDATE/DELETE-OVERLAY-APPEND
            const formDots = document.createElement('div');
            formDots.id = 'form-dots';
            formDots.append(closeDot,deleteDot,saveDot)

            formRightImport.append(importField)
            formRight.append(formRightGrid,formRightImport)
            overlay.append(formLeft,formRight,formDots)
            overlayShadow.append(overlay)
            document.body.append(overlayShadow)
        });

        //FOLDER-FOLDERCONTENT
        const folder_content = document.createElement('div')
        folder_content.classList.add('folder-content')
        const folder_content_container = document.createElement('div')
        folder_content_container.classList.add('folder-content-container')

        //send id and get files from files database
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

        //setting a folder cover image
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
        
        //setting preview images for folder content
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

        //FOLDER-FOLDERINFO
        const folder_info = document.createElement('div')
        folder_info.classList.add('folder-info')

        const folder_info_alias = document.createElement('div')
        folder_info_alias.classList.add('folder-info-alias')
        const info_content_alias = document.createElement('div')
        info_content_alias.classList.add('info-content')
        const info_content_alias_label = document.createElement('label')
        info_content_alias_label.textContent = 'Alias'
        const info_content_alias_p = document.createElement('p')
        info_content_alias_p.textContent = `${item.data_alias}`
        info_content_alias.append(info_content_alias_label,info_content_alias_p)
        folder_info_alias.appendChild(info_content_alias)

        const folder_info_description = document.createElement('div')
        folder_info_description.classList.add('folder-info-description')
        const info_content_description = document.createElement('div')
        info_content_description.classList.add('info-content')
        const info_content_description_label = document.createElement('label')
        info_content_description_label.textContent = 'Description'
        const info_content_description_p = document.createElement('p')
        
        function urlify(text) {
            const urlRegex = new RegExp(/(https?:\/\/[^\s]+)/g);
            return text.replace(urlRegex, function(url) {
                return '<a href="' + url + '">' + url + '</a>';
            })
        }
        const urlifyed_text = urlify(item.data_description)

        info_content_description_p.innerHTML = `${urlifyed_text}`
        info_content_description.append(info_content_description_label,info_content_description_p)
        folder_info_description.appendChild(info_content_description)
        folder_info.append(folder_info_alias,folder_info_description)

        //FOLDER APPEND
        folder.append(folder_main,folder_content,folder_info)
        grid.append(folder)
    }
}