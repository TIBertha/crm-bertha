import React from "react";
import WatchImage from "../Components/watchImage.jsx";
import Upload from "../Components/Upload/upload.jsx";

export default function InputAreaImage({image, campoName, nombreImg, loadingImage, handleUpload, handleDelete}) {
    return(
        <>
            {(loadingImage) ?
                <div className="input-area active loading text-center">
                    <i className="fas fa-circle-notch fa-spin"></i>
                </div>
                :
                <>
                    {(image) ?
                        <WatchImage file={image} handleDelete={handleDelete} campo={campoName} nombreImg={nombreImg} />
                        :
                        <Upload accept={'image/*'} onUpload={(e) => handleUpload(e, campoName)}/>
                    }
                </>
            }
        </>
    )
}
