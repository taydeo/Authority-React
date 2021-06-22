import React, {useContext, useEffect, useState} from 'react';
import { withRouter } from 'react-router';
import { UserContext } from '../../context/UserContext'
import Body from '../Structure/Body';
import firebase from '../../firebase/firebase';
import AuthorizationService from '../../service/AuthService';
import MDEditor from '@uiw/react-md-editor';

import '../../css/profile.css';

function EditProfile(props){
    const { setAlert, sessionData, playerData } = useContext(UserContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [bioText, setBioText] = useState(`${playerData.bio}`);


    const onImageChange = function(e){
        if(e.target.files[0]){
            setSelectedFile(e.target.files[0]);
        }
    }
    const onImageUpload = async function(){
        let file = selectedFile;
        var storage=firebase.storage();
        var storageRef=storage.ref();

        // Upload new.
        var uploadTask=storageRef.child(`userPics/${sessionData.loggedInId}`).put(file, {'cacheControl':'public,max-age=86400'});
        var url = await uploadTask.snapshot.ref.getDownloadURL()
        .then(async (url)=>{
            var response = await AuthorizationService.updateUserPictureURL(url);
            if(response == "OK"){
                setAlert("Image successfully uploaded!");
            }
        });
    }

    const onBioSubmit = async function(){
        var response = AuthorizationService.updateUserBio(bioText);
        if(response == "OK"){
            setAlert("Biography successfully changed!");
        }
    }

    useEffect(()=>{
        if(!sessionData.loggedIn){
            props.history.push("/");
            setAlert("Not logged in.");
        }
    })

    return(
        <Body middleColWidth="7">
            <br/>
            <h2>Edit Profile</h2>
            <hr/>

            <table className='table table-striped table-responsive'>
                <thead className='dark'>
                    <tr>
                        <th scope='col'>Action</th>
                        <th scope='col'>Input</th>
                        <th scope='col'>Submit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Change Profile Picture</td>
                        <td>
                            <input className="form-control" type="file" onChange={onImageChange}/>
                            <p style={{textAlign:"left",marginBottom:"1px",marginLeft:"2px"}}>
                                Accepted File Types: .png, .jpeg, .gif, .bmp
                            </p>
                        </td>
                        <td>
                            <button className="btn btn-primary" onClick={onImageUpload}>Change Picture</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr/>
            <h4>Change Bio</h4>
            <hr/>
            <MDEditor
                value={playerData.bio}
                onChange={setBioText}
            />
            <br/>
            <button onClick={onBioSubmit} className='btn btn-primary'>Change Biography</button>

        </Body>
    )
}

export default withRouter(EditProfile);