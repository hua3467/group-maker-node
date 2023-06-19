const urlParams = getUrlParams(["uid", "gid", "eid"]);

let state = {
    name: "",
    email: "",
    school: "",
    groupID: "",
    uid: ''
};

const submit = (groupName) => {

    if (state.name.length > 1 && state.email.length > 1 && state.school.length > 1) {

        db.set(`group-data/${state.groupID}/members/${state.uid}`, state, () => {
            clearElements("#form");
            document.querySelector(".form-container").classList.add("hide");
        });

    } else {

        alert("All the fields are required.");

    }
}

const signUpForm = (data, callback) => {

    return new JDom({
        type: "form",
        attr: {
            className: "sign-up-form"
        },
        children: [{
                type: "div",
                children: [{
                    type: "h3",
                    content: data.name
                }, {
                    type: "br"
                }]
            },
            {
                type: "div",
                children: [
                    input("Full Name: ", "input", "name", setState),
                    input("Email: ", "input", "email", setState),
                    input("School: ", "input", "school", setState)
                ]
            }, {
                type: "button",
                content: "Cancel",
                attr: {
                    className: "btn btn-cancel"
                },
                events: {
                    click: (e) => {
                        e.preventDefault();
                        console.log("cencel button");
                        clearElements("#form");
                        document.querySelector(".form-container").classList.add("hide");
                    }
                }
            }, {
                type: "button",
                content: "Submit",
                attr: {
                    className: "btn btn-signup"
                },
                events: {
                    click: (e) => {
                        e.preventDefault();
                        callback(data.name);
                    }
                }
            }
        ]
    });
}

const memberCard = (memberData) => {

    state = memberData;

    return new JDom({
        type: "div",
        attr: {
            className: "member-card"
        },
        children: [
            {
                type: "button",
                content: "Leave this Group",
                attr: {
                    className: "btn-delete no-print"
                },
                events: {
                    click: () => {
                        let isConfirmed = confirm(`Are you sure you want to leave this group? This will delete your information.`);

                        if (isConfirmed) {
                            db.remove(`group-data/${memberData.groupID}/members/${memberData.uid}`, () => {
                                window.open("./index.html", "_self");
                            });
                        }

                    }
                }
            },
            {
                type: "h3",
                content: memberData.name
            }, {
                type: "p",
                content: memberData.school
            }, {
                type: "p",
                content: memberData.email
            }
        ]
    });
}

const groupCard = (groupInfo) => {

    return new JDom({
        type: "div",
        attr: {
            className: "group-section"
        },
        children: [{
            type: "div",
            attr: {
                className: "group-info"
            },
            children: [{
                    type: "p",
                    content: "You joined the group"
                },
                {
                    type: "h2",
                    content: groupInfo.name,
                    attr: {
                        className: "group-title"
                    }
                }, {
                    type: "p",
                    attr: {
                        innerHTML: "You can save this page for your records."
                    }
                },
            ]
        }]
    });
}

db.read(`${urlParams.eid}/group-data/${urlParams.gid}`, data => {
    groupCard(data).render("#group");
});

db.onDataUpdated(`${urlParams.eid}/group-data/${urlParams.gid}/members/${urlParams.uid}`, data => {
    console.log(data);
    if (data) {
        memberCard(data).render("#app");
    }
});