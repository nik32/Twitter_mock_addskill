import M from "materialize-css";

import {storage} from "./firebase";

const disableButtons = (val) => {
    const buttons = document.querySelectorAll("button");
    for(let button of buttons)
        button.disabled = val;
}

const clearImage = (setImgStateToNull) => {
    document.getElementById("file").value = null;
    setImgStateToNull();
    disableButtons(false);
}

const errorCallback = (error, setImgStateToNull) => {
    console.log(error);
    clearImage(setImgStateToNull);
    M.toast({html: "Error Occured while Uploading the image.", classes:"#c62828 red darken-3"})
}

const handleUpload = (e, img, setURLCallback, setImgCallback) => {
    //Q - why stored on firebase and not in the file system of node server itself - 
    //ANS - (ans 2 by cole and accepted ans para 2) https://stackoverflow.com/questions/7703867/storing-image-files-in-mongo-database-is-it-a-good-idea. 
    //Not only above reason, but in case if you want create a diff server or multiple servers. storage access becomes difficult if you maintain them on one server and want to access from multiple servers.
    
    //Q - why to store on some other Db and not mongo - firebase was cheaper than atlas (5Gb in firebase free vs 512MB in atlas). And some other services even provide better management like cloudinary (which also allow to perform transofrmations on images before being sent. And it is even more cheaper than firebase). That's why prefer other storage than your own DB
    //Ans - In short - pricing and better management are reasons for other DB than mongo atlas. - sai charan sir
    
    e.preventDefault();
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    if(img == null || !validImageTypes.includes(img.type)) {
        clearImage(setImgCallback);
        return M.toast({html: "Select an Image (jpg, png, or gif only)", classes:"#c62828 red darken-3"});
    }
    disableButtons(true);

    const uploadTask = storage.ref(`/images/${img.name}`).put(img);
    uploadTask.on("state_changed", console.log, (err) => errorCallback(err, setImgCallback), 
    () => {
        storage
            .ref(`/images/${img.name}`)
            .getDownloadURL()
            .then((profile_pic_url) => {
                setURLCallback(profile_pic_url);
                disableButtons(false);
                M.toast({html: "Image uploaded Sucessfully", classes:"#43a047 green darken-1"});
            })
            .catch((err) => errorCallback(err, setImgCallback));
    });
}

export default handleUpload;