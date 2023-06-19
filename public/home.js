
const dataUrl = `${baseUrl}/all-data`;

console.log(dataUrl);

new JDom({
    type: "button",
    content: "Create a New Event",
    events: {
        click: e => {
            const newID = Date.now();
            INIT_DATA.id = newID;
            console.log(INIT_DATA);
            window.open(`/edit-event?id=${newID}`, "_blank");
        }
    }
}).render("#app");



readData(dataUrl, (data) => {
  console.log(data["2022"])
  Object.values(data).forEach((event) => {

    new JDom({
      type: "div",
      style: {
        display: "block",
      },
      children: [
        {
          type: "a",
          content: event.year + " " + event.page_title,
          attr: {
            href: `./?id=${event.id}`,
            target: "_blank",
            style: {
              marginRight: "16px"
            },
          },
        },
        {
          type: "a",
          content: "Edit Event",
          attr: {
            href: `./edit-event?id=${event.id}`,
            target: "_blank"
          },
        },
      ],
    }).render("#app")
  })
});

var INIT_DATA = {
    "capacity": 12,
    "date": "21",
    "description": "Start to add your description.",
    "doc": "https://ndusbpos-my.sharepoint.com/:w:/g/personal/zhenhua_yang_1_ndus_edu/EQi0rr2Aze1DtvNCL-PsGgoBHZL9ADDbmhxFso0svF-vhA?rtime=psq1wCxJ20g",
    "group-data": [
        {
            "capacity": 15,
            "description": "Start to add your description",
            "id": 1,
            "image": "https://res.cloudinary.com/dop0mlakv/image/upload/v1682955577/public_upload/dtsq77rzlf2oso3bcakl.jpg",
            "memberCount": 1,
            "members": {},
            "name": "Give a name for the group"
        }
    ],
    "id": 2022,
    "image": "https://res.cloudinary.com/dop0mlakv/image/upload/v1682778512/public_upload/udl1o7jhxdljmquplzhk.jpg",
    "month": "4",
    "page_title": "Add an event name",
    "video_url": "https://res.cloudinary.com/dop0mlakv/video/upload/v1683041851/public_upload/tl4cjuzd7lxsl1rqmjkx.mp4",
    "year": new Date().getFullYear()
}