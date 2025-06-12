//ALL CODE TO CREATE ZOOM MEETING
import base64 from "base-64"
import fetch from "node-fetch"

const clientID = process.env.ZOOM_CLIENTID 
const clientSecret = process.env.ZOOM_CLIENTSECRET
const accountID = process.env.ZOOM_ACCOUNTID

const getAuthHeaders = ()=> {
    return{
        Authorization : `Basic ${base64.encode(`${clientID}:${clientSecret}`)}`,
        'Content-Type': 'application/json'
    }
}

const generateZoomAccessToken = async () => {
    try{
        const response = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountID}`, {
            method: "POST",
            headers: getAuthHeaders()
        })

        const jsonResponse = await response.json()
        // console.log("generateZoomAccessToken jsonResponse ==>", jsonResponse)

        return jsonResponse?.access_token //returns the property in the object with the name access_token
    }catch(err){
        console.log("generateZoomAccessToken Error ==>", err)
        throw err
    }
}

export const createZoomMeeting = async (patientEmail, doctorEmail, reason, dateOfAppointment) => {
    const zoomAccessToken = await generateZoomAccessToken()
    try{
        const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${zoomAccessToken}`
            },
            body: JSON.stringify({
                agenda: `${reason}`, 
                default_password: true,
                duration: 60,
                password: '123456', 
                schedule_for: 'tezonteam@gmail.com',
                settings: {
                allow_multiple_devices: true,
               /* alternative_hosts: `tezonteam@gmail.com`,*/ /*`${patientEmail};${doctorEmail}*/
                alternative_hosts_email_notification: true,
                breakout_room: { 
                    enable: true,
                    rooms: [{
                    name: 'Breakout Room1', 
                    participants: [`${patientEmail};${doctorEmail}`]
                    }]
                },
                calendar_type: 1,
                contact_email: 'tezonteam@gmail.com', 
                contact_name: 'Tezon Team',
                email_notification: true,
                encryption_type: 'enhanced_encryption',
                host_video: true,
                join_before_host: true,
                meeting_authentication: true,
                meeting_invitees: [{
                    email: `${patientEmail};${doctorEmail}`
                }],
                mute_upon_entry: false,
                participant_video: true,
                private_meeting: true,
                waiting_room: false,
                watermark: false,
                host_save_video_order: false,
                continuous_meeting_chat: {
                    enable: true,
                    who_is_added: 'all_users'
                }
            },
            start_time: dateOfAppointment, 
            timezone: 'Europe/London',
            topic: `${reason}`, 
            type: 2 //1-->instant meeting, 2-->scheduled meeting etc
            })
        })
        
        const jsonResponse = await response.json()
        // console.log(jsonResponse)
        return jsonResponse
    }catch(err){
        console.log("createZoomMeeting Error ==>", err)
        throw err
    }   
}

export const deleteZoomMeeting = async (meetingID) => {
    const zoomAccessToken = await generateZoomAccessToken()
    try{
        const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${zoomAccessToken}`
            }
        })

        const statusResponse = await response.status
        const responseString = statusResponse.toString()

        if(responseString !== "204"){
            return "Meeting has not been Deleted"
        }
        
        return "Meeting Deleted Successfully"
    }catch(err){
        console.log("deleteZoomMeeting Error ==>", err)
        throw err
    }   
}

// module.exports =  {}
// delete meetings
// document your process of getting authorization
