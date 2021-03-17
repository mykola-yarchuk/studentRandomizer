'use strict';

const roomSize = 6;
const students = [];
const rooms = [];
const sessionQueue = [];
let result = {};
let sessionCount = 0;
let sessions = {};

const createRooms = () => {
  for (let i = 0; i < rooms.length; i++) {
    for (let j = 0; j < roomSize; j++) {
      const person = hookUnknownPerson(rooms[i]);

      if (person !== undefined) {
        rooms[i].push(person.id);
        sessionQueue.push(person.id);
      }
    }

    if (rooms[i].length !== roomSize) {
      fillWithFriends(rooms[i]);
    }

    for (let f = 0; f < rooms[i].length; f++) {
      for (let r = 0; r < rooms[i].length; r++) {
        if (rooms[i][f] !== rooms[i][r]) {
          students[rooms[i][f]].friends.push(rooms[i][r]);
        }
      }
    }

    const roomIndex = i + 1;

    if (!result[`room ${roomIndex}`]) {
      result[`room ${roomIndex}`] = [[...rooms[i]]];
    } else {
      result[`room ${roomIndex}`].push([...rooms[i]]);
    }

    rooms[i].length = 0;
  }

  sessionQueue.length = 0;
};

const hookUnknownPerson = (room) => {
  let i = Math.floor(Math.random() * students.length);

  for (let q = 0; q < students.length; q++) {
    let redFlag = false;

    if (!room.length) {
      if (sessionQueue.includes(students[i].id)) {
        i = i + 1 > students.length - 1 ? 0 : i + 1;
        continue;
      }

      return students[i];
    }

    for (let j = 0; j < room.length; j++) {
      if (students[room[j]].friends.includes(students[i].id)
        || sessionQueue.includes(students[i].id)) {
        redFlag = true;
      }
    }

    if (redFlag) {
      i = i + 1 > students.length - 1 ? 0 : i + 1;
      continue;
    }

    return students[i];
  }
};

const fillWithFriends = (notFullRoom) => {
  while (notFullRoom.length < roomSize) {
    const student = students.find(stud => !sessionQueue.includes(stud.id));

    if (!student) {
      break;
    }
    notFullRoom.push(student.id);
    sessionQueue.push(student.id);
  }
};

const replaceIdsWithNames = (arr) => {
  for (let j = 0; j < arr.length; j++) {
    const id = arr[j];

    arr[j] = `@${students[id].name}`;
  }
};

const createSessions = () => {
  for (const room in result) {
    const roomHistory = result[room];

    for (let i = 0; i < roomHistory.length; i++) {
      if (!sessions.hasOwnProperty(`session ${i + 1}`)) {
        sessions[`session ${i + 1}`] = [];
      }
      replaceIdsWithNames(roomHistory[i]);

      sessions[`session ${i + 1}`].push(roomHistory[i]);
    }
  }
};

const runFCode = () => {
  for (let i = 0; i < sessionCount; i++) {
    createRooms();
  }

  createSessions();
};

const container = document.querySelector('.container');

const showSessions = () => {
  container.innerHTML = ``;

  for (const session in sessions) {
    const sessionContainer = document.createElement('div');
    const sessionHeader = document.createElement('h3');

    sessionContainer.classList.add('session');
    sessionHeader.innerText = session;
    sessionContainer.append(sessionHeader);

    for (let i = 0; i < sessionCount; i++) {
      const room = document.createElement('div');
      const roomHeader = document.createElement('h3');
      const list = document.createElement('ul');

      list.classList.add('singleSession');
      room.classList.add('room');

      roomHeader.innerText = `room ${i + 1}`;
      room.append(roomHeader);

      for (let j = 0; j < roomSize; j++) {
        const listElement = document.createElement('ol');
        const studentName = sessions[session][i][j];

        if (studentName) {
          listElement.innerText = `${studentName}  `;
          list.append(listElement);
        }
      }

      room.append(list);
      sessionContainer.append(room);
      container.append(sessionContainer);
    }
  }
};

const clean = () => {
  students.length = 0;
  result = {};
  sessions = {};
};

// TODO cleanUp this mess
const createStudents = () => {
  const textarea = document.querySelector('#names');
  const text = textarea.value;
  const fixedTxt = text.replace(/\W/g, ' ');
  const words = fixedTxt.split(' ');
  const names = [];

  const removeSpaces = [];

  words.forEach((el) => {
    if (el.replace(/\W/g, ' ')) {
      removeSpaces.push(el.replace(/\W/g, ' '));
    }
  });

  for (let i = 0; i < removeSpaces.length; i += 2) {
    const redundantNumber = Math.ceil((i + 1) / 2);

    names.push(`${redundantNumber}) ${removeSpaces[i + 1]} ${removeSpaces[i]}`);
  }

  for (let i = 0; i < names.length; i += 1) {
    const info = names[i].split(' ');
    const name = `${info[1]} ${info[2]}`;

    students.push({
      id: i,
      name,
      friends: [],
    });
  }
};

const createEmptyRooms = () => {
  sessionCount = Math.ceil(students.length / roomSize);

  for (let i = 0; i < sessionCount; i += 1) {
    rooms[i] = [];
  }
};

// eslint-disable-next-line
genBtn.onclick = () => {
  clean();

  createStudents();
  createEmptyRooms();

  runFCode();
  showSessions();
};
