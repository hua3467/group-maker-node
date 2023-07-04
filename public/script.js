let state = {
    name: "",
    email: "",
    groupID: "",
    uid: Date.now(),
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const eventId = urlParams.get("id");

const dataUrl = `${baseUrl}/event-data/${eventId}`;
const signUpUrl = `${baseUrl}/sign-up-group/${eventId}`;

fetch(dataUrl)
    .then((response) => response.text())
    .then((rawData) => {
        data = JSON.parse(rawData)

        clearElements("#app")

        document.querySelector("#description").innerHTML = data.description
        document.querySelector("#eventTitle").innerHTML = data.page_title


        const groupData = data["group-data"]
        const capacity = data.capacity

        console.log(data)

        Object.values(groupData).forEach((info) => {

            if (info !== null) {

                let isFull = false
                if (info.members) {
                    isFull = Object.keys(info.members).length >= capacity ? true : false
                }
                card(info, capacity, isFull).render("#app")
            }

        })
    })



/**
 *
 * @param {*} data single group data
 */
function card(data, capacity, isFull) {
    const joinBtnStyle = isFull
        ? {
            display: "none",
        }
        : {
            display: "block",
        }

    let seatRemain = capacity

    if (data.members) {
        seatRemain = capacity - Object.keys(data.members).length
    }

    let image = null
    if (data.image) {
        image = {
            type: "div",
            attr: {
                style: {
                    width: "100%",
                    height: "200px",
                    backgroundImage: `url(${data.image})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat"
                },
            },
        }
    }

    return new JDom({
        type: "div",
        attr: {
            className: "group-card",
        },
        children: [
            image,
            {
                type: "h3",
                content: data.name,
                attr: {
                    className: "card-title",
                },
            },
            {
                type: "p",
                content: data.description,
                attr: {
                    className: "card-description",
                },
            },
            {
                type: "h3",
                content: isFull
                    ? "This group is full."
                    : `Open Slots: ${seatRemain} / ${capacity}`,
                attr: {
                    className: "group-status",
                },
            },
            {
                type: "button",
                content: "Join",
                attr: {
                    style: joinBtnStyle,
                    className: "btn btn-join",
                },
                events: {
                    click: (e) => {
                        state = {
                            name: "",
                            email: "",
                            groupID: "",
                            uid: Date.now(),
                        }

                        clearElements("#form")
                        setState("groupID", data.id)
                        signUpForm(data).render("#form")
                        document.querySelector(".form-container").classList.remove("hide")
                    },
                },
            },
        ],
    })
}

function signUpForm(data) {
    return new JDom({
        type: "form",
        attr: {
            className: "sign-up-form"
        },
        children: [
            {
                type: "div",
                children: [
                    {
                        type: "h3",
                        content: data.name,
                    },
                    {
                        type: "br",
                    },
                ],
            },
            {
                type: "div",
                children: [
                    input("Full Name: ", "input", "name", setState),
                    input("Email: ", "input", "email", setState),
                    input("Note: ", "textarea", "note", setState)
                ],
            },
            {
                type: "button",
                content: "Cancel",
                attr: {
                    className: "btn btn-cancel",
                },
                events: {
                    click: (e) => {
                        e.preventDefault()
                        console.log("cencel button")
                        clearElements("#form")
                        document.querySelector(".form-container").classList.add("hide")
                    },
                },
            },
            {
                type: "button",
                content: "Submit",
                attr: {
                    className: "btn btn-signup",
                },
                events: {
                    click: (e) => {
                        e.preventDefault();
                        if (state.name.trim().length > 0) {
                            setData(signUpUrl, state, (result) => {
                                console.log(result);
                            });
                        } else {
                            alert("Please enter a name.");
                        }
                        
                    }
                }
            },
        ],
    })
}

function setState(key, value) {
    state[key] = value
}

