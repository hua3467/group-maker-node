let state = {
  groupName: "",
  groupDescription: "",
  groupImage: "",
  capacity: "",
  newGroupId: "",
  groupId: "",
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const eventId = urlParams.get("id");


const dataUrl = `${baseUrl}/event-data/${eventId}`;
const signUpUrl = `${baseUrl}/sign-up-group/${eventId}`;
const addGroupUrl = `${baseUrl}/add-group/${eventId}`;
const removeUrl = `${baseUrl}/remove/${eventId}`;


console.log(addGroupUrl);

let isNewGroup = false;

const remove = (dataPath, callback) => {

  const dataBody = {"dataPath": dataPath}

  fetch(removeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataBody),
    redirect: 'follow'
  })
    .then(response => response.text())
    .then(result => {
      callback(result);
    })
    .catch(error => {
      console.log("ERROR: ", error);
    });

}


const memberCard = (memberData, key) => {

  return new JDom({
    type: "div",
    attr: {
      className: "member-card",
    },
    children: [
      {
        type: "button",
        content: "Remove",
        attr: {
          className: "btn-delete no-print",
          data_id: key,
          data_group: memberData.groupID,
        },
        events: {
          click: () => {
            let isConfirmed = confirm(
              `Are you sure you want to remove ${memberData.name}?`
            )

            if (isConfirmed) {

              remove(`group-data/${memberData.groupID}/members/${key}`, result => {
                console.log(result);
              });
            }
          },
        },
      },
      {
        type: "h3",
        content: memberData.name,
      },
      {
        type: "p",
        content: memberData.school,
      },
      {
        type: "p",
        content: memberData.email,
      },
    ],
  })
}

const groupEdit = (info) => {

  clearElements("#groupEditContaner");

  return new JDom({
    type: "div",
    attr: {
      className: "group-edit",
    },
    children: [
      {
        type: "h4",
        content: `Edit Group "${info.name}"`,
        attr: {
          style: {
            margin: "16px 0",
          },
        },
      },
      input("Group Name: ", "input", "groupName", setState, info.name),
      input("Description: ", "textarea", "groupDescription", setState, info.description),
      input("Image Address: ", "input", "groupImage", setState, info.image),
      imageUpload(info.image),
      {
        type: "button",
        content: "Cancel",
        attr: {
          className: "btn btn-cancel",
        },
        events: {
          click: (e) => {
            e.preventDefault();
            clearElements("#groupEditContaner");
          },
        },
      },
      {
        type: "button",
        content: "Save",
        attr: {
          className: "btn",
        },
        events: {
          click: (e) => {

            e.preventDefault()
            state.image = document.querySelector("#groupImage").value;

            let dataBody;

            if (isNewGroup) {

              dataBody = {
                "name": state.groupName,
                "description": state.groupDescription,
                "image": state.groupImage,
                "id": state.newGroupId
              };

              isNewGroup = false;

            } else {

              dataBody = {
                "name": state.groupName,
                "description": state.groupDescription,
                "image": state.groupImage,
                "id": info.id
              };

            }

            console.log(state, dataBody);

            fetch(addGroupUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dataBody),
              redirect: 'follow'
            })
              .then(response => response.text())
              .then(result => console.log("result: ", result))
              .catch(error => {
                console.log("ERROR: ", error);
              });

            clearElements("#groupEditContaner");

          },
        },
      },
    ],
  })
}

const groupCard = (groupInfo) => {


  const members = []

  if (groupInfo.members) {
    for (key in groupInfo.members) {
      members.push(memberCard(groupInfo.members[key], key))
    }
  }

  return new JDom({
    type: "div",
    attr: {
      className: "group-section",
    },
    children: [
      {
        type: "div",
        attr: {
          className: "group-info",
        },
        children: [
          {
            type: "h2",
            content: groupInfo.name,
            attr: {
              className: "group-title",
            },
          },
          {
            type: "button",
            content: "Delete Group",
            attr: {
              className: "no-print"
            },
            events: {
              click: e => {
                const isConfirmed = confirm("The group with its members will be permanantly deleted! Are you sure?");
                if (isConfirmed) {

                  remove(`group-data/${groupInfo.id}`, result => {
                    console.log(result);
                  });
                }
              }
            }
          },
          {
            type: "button",
            content: "Edit Group",
            attr: {
              className: "no-print btn-edit-group",
            },
            events: {
              click: (e) => {
                setState("groupName", groupInfo.name)
                setState("groupDescription", groupInfo.description)
                setState("groupImage", groupInfo.image)
                groupEdit(groupInfo).render("#groupEditContaner")
                window.scrollTo(0, 0)
              },
            },
          },
          {
            type: "p",
            content: groupInfo.description,
          },
          {
            type: "h3",
            content: `(${members.length} Participants)`,
            attr: {
              className: "group-size",
            },
          },
        ],
      },
      {
        type: "div",
        attr: {
          className: "member-list",
        },
        children: members,
      },
    ],
  })
}


fetch(dataUrl)
  .then((response) => response.text())
  .then((rawData) => {

    data = JSON.parse(rawData);
    console.log(data);

    const signUpData = data["group-data"];

    clearElements("#app");

    Object.values(signUpData).forEach((info) => {

      if (info !== null) {
        groupCard(info).render("#app");
      }

    });

  });


document.querySelector("#btnAddGroup").addEventListener("click", e => {
  state.newGroupId = Date.now();
  isNewGroup = true;

  groupEdit(state).render("#groupEditContaner");

});

document.querySelector("#btnEditEvent").addEventListener("click", () => {
  window.open(`./event.html?id=${eventId}`, "_blank");
});


document.querySelector("#btnPrint").addEventListener("click", (e) => {
  window.print()
});
