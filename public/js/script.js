// Function to format date from yyyy-mm-dd to Month day, year format
function formatDate(inputDate) {
    return inputDate ? new Date(inputDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
}

// Function to convert time from 24-hour format to 12-hour format
function convertTo12HourFormat(time24) {
    if (!time24) return 'Not selected';

    const [hours, minutes] = time24.split(':');
    let period = 'AM';
    let hour12 = parseInt(hours, 10);

    if (hour12 >= 12) {
        period = 'PM';
        if (hour12 > 12) {
            hour12 -= 12;
        }
    }

    // Pad single-digit hours with leading zero for consistency
    const formattedHour = hour12.toString().padStart(2, '0');

    return `${formattedHour}:${minutes} ${period}`;
}

// Function to update the visibility of the Remove Last Task button
function updateRemoveTaskButtonVisibility(taskContainerId) {
    const taskContainer = document.getElementById(taskContainerId);
    const removeTaskBtn = taskContainer.nextSibling.nextSibling.nextSibling.nextSibling;
    
    if (taskContainer && taskContainer.querySelectorAll('.tasks__item').length > 0) {
        removeTaskBtn.style.display = 'block'; // Show the button
    } else {
        removeTaskBtn.style.display = 'none'; // Hide the button
    }
}

// Function to update the visibility of the Remove Last Meeting button
function updateRemoveMeetingButtonVisibility(meetingContainerId) {
    const meetingContainer = document.getElementById(meetingContainerId);
    const removeMeetingBtn = meetingContainer.nextSibling.nextSibling.nextSibling.nextSibling;
    if (meetingContainer && meetingContainer.querySelectorAll('.report__meeting').length > 0) {
        removeMeetingBtn.style.display = 'block'; // Show the button
    } else {
        removeMeetingBtn.style.display = 'none'; // Hide the button
    }
}

// Call the visibility update functions for both tasks and meetings on page load
updateRemoveTaskButtonVisibility('yesterdayTasks');
updateRemoveMeetingButtonVisibility('yesterdayMeetings');
updateRemoveTaskButtonVisibility('todayTasks');
updateRemoveMeetingButtonVisibility('todayMeetings');


// Updated addTask function with link button
function addTask(taskContainerId) {
    const taskContainer = document.getElementById(taskContainerId);
    const taskCount = taskContainer.querySelectorAll('.tasks__item').length + 1;

    const newTask = document.createElement('li');
    newTask.classList.add('tasks__item');
    newTask.innerHTML = `
        <div>
            <textarea name="" class="task-description" cols="40" rows="5">Task ${taskCount} description</textarea>
        </div>
        <button class="add-link-btn" onclick="addLink(this)" type="button">Add Link</button>
        <div class="link-inputs" style="display: none;">
            <input type="text" placeholder="Link description" class="link-description">
            <input type="url" placeholder="Link URL" class="link-url">
            <button onclick="saveLink(this)" type="button">Save</button>
        </div>
        <div class="task-links"></div>
        <label for="task-deadline">Deadline:</label> <input type="date" class="task-deadline">
        <p>Priority:</p>
        <div class="priority">
            <input type="radio" name="priority-${taskContainerId}-${taskCount}" value="High🔴"/>
            <label>High🔴</label><br>
            <input type="radio" name="priority-${taskContainerId}-${taskCount}" value="Medium🟡" checked />
            <label>Medium🟡</label><br>
            <input type="radio" name="priority-${taskContainerId}-${taskCount}" value="Low🟢" />
            <label>Low🟢</label><br>
        </div>
    `;

    taskContainer.appendChild(newTask);
    updateRemoveTaskButtonVisibility(taskContainerId);
}

// Updated addMeeting function with link button
function addMeeting(meetingContainerId) {
    const meetingContainer = document.getElementById(meetingContainerId);
    const meetingCount = meetingContainer.querySelectorAll('.report__meeting').length + 1;

    const newMeeting = document.createElement('li');
    newMeeting.classList.add('report__meeting');
    newMeeting.innerHTML = `
        <label for="meeting-person">Name and Position / Team</label>
        <input type="text" class="meeting-person" placeholder="Attendee ${meetingCount}"> 
        <label for="meeting-cst">Time CST:</label>
        <input type="time" class="meeting-cst">
        <label for="meeting-eet">Time EET:</label>
        <input type="time" class="meeting-eet">
        ${meetingContainerId.includes('yesterday') ? `
            <textarea name="" class="meeting-brief" cols="40" rows="3">Meeting ${meetingCount} brief</textarea>
            <button class="add-link-btn" onclick="addLink(this)" type="button">Add Link</button>
            <div class="link-inputs" style="display: none;">
                <input type="text" placeholder="Link description" class="link-description">
                <input type="url" placeholder="Link URL" class="link-url">
                <button onclick="saveLink(this)" type="button">Save</button>
            </div>
            <div class="task-links"></div>
        ` : ''}
    `;

    meetingContainer.appendChild(newMeeting);
    updateRemoveMeetingButtonVisibility(meetingContainerId);
}


function removeLastTask(taskContainerId) {
    const taskContainer = document.getElementById(taskContainerId);
    const taskItems = taskContainer.querySelectorAll('.tasks__item');
    if (taskItems.length > 0) {
        taskContainer.removeChild(taskItems[taskItems.length - 1]);
    }
    updateRemoveTaskButtonVisibility(taskContainerId);
}

function removeLastMeeting(meetingContainerId) {
    const meetingContainer = document.getElementById(meetingContainerId);
    const meetingItems = meetingContainer.querySelectorAll('.report__meeting');
    if (meetingItems.length > 0) {
        meetingContainer.removeChild(meetingItems[meetingItems.length - 1]);
    }
    updateRemoveMeetingButtonVisibility(meetingContainerId);
}


function getTasksInfo(taskContainerId) {
    const taskContainer = document.getElementById(taskContainerId);
    const taskItems = taskContainer.querySelectorAll('.tasks__item');
    let tasksInfo = '';
    taskItems.forEach((task, index) => {
        const taskDescriptionInput = task.querySelector('.task-description');
        const taskDescription = taskDescriptionInput.value.trim() || `Task ${index + 1} description`;
        const taskDeadlineInput = task.querySelector('.task-deadline');
        const taskDeadline = formatDate(taskDeadlineInput.value) || 'None';

        const taskLinkContainer = task.querySelector('.task-links');
        const taskLinkItems = taskLinkContainer.querySelectorAll('.task-link');
        let taskLinkInfo = '';
        taskLinkItems.forEach((link) =>  {
            console.log(link.querySelector('a').innerText)
            const linkDescription = link.querySelector('a').innerText;
            const linkUrl = link.querySelector('a').href;
            taskLinkInfo += ` | [${linkDescription}](${linkUrl})`;
        })
        const taskPriorityRadios = task.querySelectorAll(`input[name="priority-${taskContainerId}-${index + 1}"]:checked`);
        let taskPriority = 'Not selected';
        if (taskPriorityRadios.length > 0) {
            taskPriority = taskPriorityRadios[0].value;
        }

        tasksInfo += `- ${taskDescription} ${taskLinkInfo}\n> Deadline: ${taskDeadline}\n> Priority: ${taskPriority}\n\n`;
    });
    return tasksInfo;
}

function getMeetingsInfo(meetingContainerId) {
    const meetingContainer = document.getElementById(meetingContainerId);
    const meetingItems = meetingContainer.querySelectorAll('.report__meeting');
    let meetingsInfo = '';
    meetingItems.forEach((meeting, index) => {
        const attendeeName = meeting.querySelector('.meeting-person').value || `Attendee ${index + 1}`;
        const meetingCST = meeting.querySelector('.meeting-cst').value || '';
        const meetingEET = meeting.querySelector('.meeting-eet').value || '';
        const meetingBrief = meeting.querySelector('.meeting-brief')?.value || '';
        const timeCST = meetingCST ? convertTo12HourFormat(meetingCST) : 'Not selected';
        const timeEET = meetingEET ? convertTo12HourFormat(meetingEET) : 'Not selected';

        // Get the added link description and URL for this meeting
        const meetingLinkContainer = meeting.querySelector('.task-links');
        const meetingLinkItems = meetingLinkContainer?.querySelectorAll('.task-link');
        let meetingLinkInfo = '';
        if (meetingLinkItems) {
        meetingLinkItems.forEach((link) =>  {
            console.log(link.querySelector('a').innerText)
            const linkDescription = link.querySelector('a').innerText;
            const linkUrl = link.querySelector('a').href;
            meetingLinkInfo += ` [${linkDescription}](${linkUrl})`;
        })
      }
        meetingsInfo += `${attendeeName} 🕒 ${timeCST}, CST / ${timeEET}, EET\n${meetingBrief ? `> ${meetingBrief} ${meetingLinkInfo}\n\n` : ''}`;
    });
    return meetingsInfo;
}


// Function to add a new file input for additional photos
function addPhoto() {
    const photosInput = document.getElementById('photos');
    const newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.name = 'photos';
    newInput.accept = 'image/*';
    // newInput.multiple = true;
    newInput.addEventListener('change', function(e) {
        displayPhotos(e.target.files);
    });
    photosInput.parentNode.insertBefore(newInput, photosInput.nextSibling);
}

// Add event listener to trigger file input click on "Add Photo" button click
document.getElementById('addPhotoBtn').addEventListener('click', function() {
    document.getElementById('photos').click(); // Trigger file input click
});

let uploadedPhotos = []; // Array to store uploaded photos

// Function to update the visibility of the Remove Last Photo button
function updateRemoveButtonVisibility() {
    const removePhotoBtn = document.getElementById('removePhotoBtn');
    if (uploadedPhotos.length > 0) {
        removePhotoBtn.style.display = 'block'; // Show the button
    } else {
        removePhotoBtn.style.display = 'none'; // Hide the button
    }
}

// Function to remove the last uploaded photo from the array and UI
function removeLastPhoto() {
    const photoList = document.getElementById('photoList');
    const lastPhotoContainer = photoList.lastElementChild; // Get the last photo container

    if (lastPhotoContainer) {
        uploadedPhotos.pop(); // Remove the last photo from the uploadedPhotos array
        photoList.removeChild(lastPhotoContainer); // Remove the last photo container from the UI
        updateRemoveButtonVisibility(); // Update button visibility
    }
}

// Add event listener to trigger removal of last photo on button click
document.getElementById('removePhotoBtn').addEventListener('click', function() {
    removeLastPhoto();
});

// Function to display uploaded photos
function displayPhotos(files) {
    const photoList = document.getElementById('photoList');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageElement = document.createElement('img');
        imageElement.src = URL.createObjectURL(file);
        imageElement.alt = file.name;
        imageElement.classList.add('uploaded-photo');

        // Create a container div for each photo with additional styling
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('photo-container');
        photoContainer.appendChild(imageElement);

        // Append the container to the photo list
        photoList.appendChild(photoContainer);
        uploadedPhotos.push(file); // Add file to uploaded photos array
    }

    updateRemoveButtonVisibility(); // Update button visibility after adding photos
}


document.getElementById('photos').addEventListener('change', function(e) {
    const files = e.target.files;
    // uploadedPhotos = []; // Clear previous uploaded photos array
    displayPhotos(files);
});


    const departmentDropdown = document.getElementById('department');
    const employeeDropdown = document.getElementById('employee');
    
    let departmentsData; // Store JSON data

    // Load JSON data
    fetch('employees.json')
        .then(response => response.json())
        .then(data => {
            departmentsData = data;
            // populateDepartmentsDropdown();
            getEmployeesDepartment();
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });

    function getEmployeesDepartment(){
        let employeesUsername = document.getElementById('employeesUsername').innerHTML;
        let department = document.getElementById('department');
        let employeesUsernameData = departmentsData.find(employee => employee.Discord === employeesUsername)
        department.innerHTML = employeesUsernameData.Department;
    }

let ReportDate;
let name;
let YesterdayDate;
let TodayDate;
let blockers;

let modal = document.querySelector('.popup');
let closeModalBtn = document.querySelector('#close-modal-btn');
closeModalBtn.addEventListener('click', () => modal.classList.remove('popup_active'));
var webhooksData;
fetch('webhookURLs.json')
    .then(response => response.json())
    .then(data => {
        webhooksData = data;
    })
    .catch(error => {
        console.error('Error loading JSON webhooks:', error);
});
async function sendMessage() {
    var webhookUrl;
    
    const departmentNameFilled = document.getElementById('department').innerHTML;
    var webhookUserData = webhooksData.find(department => department.name === departmentNameFilled);
    webhookUrl = webhookUserData.webhook;
      
    const formData = new FormData();

    ReportDate = formatDate(document.getElementById('today-date').value);
    name = document.getElementById('employee').innerHTML;
    YesterdayDate = formatDate(document.getElementById('yesterday-date').value);
    blockers = document.getElementById('blockers').value;

    // Append all uploaded photos to FormData
    for (let i = 0; i < uploadedPhotos.length; i++) {
        formData.append(`photos${i}`, uploadedPhotos[i]);
    }
    const payload = {
        username: `${name}`,
        content: `📅 Date: ${ReportDate} \n\n✅What I did yesterday ${YesterdayDate}:\n\n${getTasksInfo('yesterdayTasks')}👥Met with: \n${getMeetingsInfo('yesterdayMeetings')}📌What I will do today:\n\n${getTasksInfo('todayTasks')}👥Meeting with:\n${getMeetingsInfo('todayMeetings')}\n⛔️Blockers: ${blockers}\n[Documentation on daily reports](https://docs.google.com/document/d/11sqd6GyqTMoch-a5z6dAFRVII0nmgxj_m1EeZ2yNVQY/edit#heading=h.ac36khbgswt8)`,
    };
    formData.append('payload_json', JSON.stringify(payload)); // Append payload as JSON
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
        },
        modal.classList.add('popup_active')
    );
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }


}



function addLink(button) {
    const linkInputs = button.nextElementSibling;
    linkInputs.style.display = 'block'; // Show link inputs
}

// Function to save the entered link for a task or meeting
function saveLink(button) {
    const linkInputs = button.parentNode;
    const linkDescInput = linkInputs.querySelector('.link-description');
    const linkUrlInput = linkInputs.querySelector('.link-url');
    const linkDescription = linkDescInput.value.trim();
    const linkUrl = linkUrlInput.value.trim();

    if (linkDescription && linkUrl) {
        const taskOrMeetingItem = linkInputs.nextSibling.nextElementSibling;
        const linkContainer = document.createElement('div');
        linkContainer.classList.add('task-link'); // Adjust this class name if needed
        linkContainer.innerHTML = `<a href="${linkUrl}" target="_blank">${linkDescription}</a>`;
        taskOrMeetingItem.appendChild(linkContainer);

        // Clear input fields and hide link inputs
        linkDescInput.value = '';
        linkUrlInput.value = '';
        linkInputs.style.display = 'none';
    } else {
        alert('Please enter both link description and URL.');
    }
}

// const webhookUrl = "https://discord.com/api/webhooks/1228352371961368597/KRc9w1rJcpHujyHJn9y95Q0Es0TNOrwnKGfHJklKcu8fDp8EYZnR2-wVF6aWePptCh52";
// const webhookUrl = "https://discord.com/api/webhooks/1227299910970249429/KPJ-NfB2aqT53rlifmw4e9z7nwEV-HwHRWANNc-olwhiDuyhjtZjmE5BgB7eUZAwnGut"; my server