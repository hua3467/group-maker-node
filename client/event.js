const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const projectID = urlParams.get("id");

const dataUrl = `${baseUrl}/event-data/${projectID}`;
const editEventUrl = `${baseUrl}/edit-event/${projectID}`;

let state = {};

readData(dataUrl, (data) => {
    state = {
        eventName: data.page_title,
        eventDescription: data.description,
        eventImage: data.image,
        eventVideo: data.video_url,
        capacity: data.capacity,
        document: data.doc
    };
    console.log(data);
    eventEdit(data).render("#eventEditContaner");
});

const eventEdit = (eventInfo) => {
    clearElements("#eventEditContaner");

    return new JDom({
        type: "div",
        attr: {
            className: "event-edit"
        }, 
        children: [
            {
                type: "h4",
                content: `Event Edit`,
                attr: {
                    style: {
                        margin: "16px 0"
                    }
                }
            },
            input("Event Name: ", "text", "eventName", setState, eventInfo.page_title),
            input("Capacity per Group: ", "number", "capacity", setState, eventInfo.capacity),
            input("Event Description: ", "textarea", "eventDescription", setState, eventInfo.description), 
            input("Attached Document: ", "text", "document", setState, eventInfo.doc),
            input("Event Image: ", "text", "eventImage", setState, eventInfo.image),
            imageUpload(eventInfo.image),
            input("Event Video: ", "text", "eventVideo", setState, eventInfo.video_url),

            
            {
                type: "button",
                content: "Cancel",
                attr: {
                    className: "btn btn-cancel"
                },
                events: {
                    click: (e) => {
                        e.preventDefault();
                        clearElements("#eventEditContaner");
                    }
                }
            },
            {
                type: "button",
                content: "Save",
                attr: {
                    className: "btn"
                },
                events: {
                    click: e => {
                        e.preventDefault();
                        state.eventImage = document.querySelector("#eventImage").value;
                        const dataUpdated = {
                            page_title: state.eventName,
                            description: state.eventDescription,
                            image: state.eventImage,
                            video_url: state.eventVideo,
                            capacity: state.capacity,
                            doc: state.document,
                        }

                        console.log(dataUpdated);

                        setData(editEventUrl, dataUpdated, (result) => {
                            console.log(result);
                        });
                    }
                }
            }
        ]
    })
}






