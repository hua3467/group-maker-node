const imageUpload = (imagePreviewUrl) => {
    let previewContainer =  {
        type: "div",
        attr: {
            id: "preview"
        }
    };
    if(imagePreviewUrl) {
        previewContainer =  {
            type: "div",
            attr: {
                id: "preview"
            },
            children: [{
                type: "img",
                attr: {
                    src: imagePreviewUrl,
                    style: {
                        width: "300px"
                    }
                }
                
            }]
        };
    }

    return {
        type: "div",
        attr: {
            className: "image-uploader"
        },
        children:[
            previewContainer,
            {
            type: "button",
            content: imagePreviewUrl ? "Change Image" : "Add Image",
            attr: {
                id: "upload_widget",
                className: "cloudinary-button"
            },
            events: {
                click: () => {
                    myWidget.open();
                }
            }
        }, {
            type: "p",
            content: "Maximum allowed image size: 5 MB."
        }]
    };
}

var myWidget = cloudinary.createUploadWidget({
    cloudName: 'dop0mlakv',
    uploadPreset: 'dw5p6gbl',
    maxFileSize: 5242880,
    sources: [ 'local', 'url', 'camera', 'image_search'],
    googleApiKey: "AIzaSyBZZBAf49ZlGA23L-Bvy8WjCzNM6KMZjkM"
}, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', result.info);

        clearElements("#preview");

        new JDom({
            type: "img",
            attr: {
                src: `https://res.cloudinary.com/dop0mlakv/image/upload/c_limit,h_360,w_420/${result.info.path}`,
            }
        }).render("#preview");

        setState("groupImage", result.info.secure_url);
        document.querySelector("#groupImage").value = result.info.secure_url;
        document.querySelector("#upload_widget").content = "Change Image";
    }
});