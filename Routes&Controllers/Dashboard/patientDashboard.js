const axios = require('axios');
const patientModel = require("../../Model/Users/patientSchema")
const jwt = require("jsonwebtoken") 


const getPatientAnalytics = async (req, res) => {
    //patientID Collection
    const token = req.cookies.accessToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET) 
    const patientId = decoded.user_id
    const patient = await patientModel.findById(patientId)

    const currentYear = new Date().getFullYear()
    const {selectedYear} = req.body

    const yearToSend = selectedYear ? selectedYear : currentYear
    // console.log(yearToSend)

    const logins = patient.logins

    const countsForYear = Array(12).fill(0)
    logins.forEach((login) => {
        if (login.month.startsWith(yearToSend.toString())) {
          const monthIndex = parseInt(login.month.split('-')[1], 10) - 1// Get month index (0 = January, 11 = December)
          countsForYear[monthIndex] += login.count
        }
    })

    const janCount = countsForYear[0]
    const febCount = countsForYear[1]
    const marCount = countsForYear[2]
    const aprCount = countsForYear[3]
    const mayCount = countsForYear[4]
    const junCount = countsForYear[5]
    const julCount = countsForYear[6]
    const augCount = countsForYear[7] 
    const septCount = countsForYear[8]
    const octCount = countsForYear[9]
    const novCount = countsForYear[10]
    const decCount = countsForYear[11]
    // console.log(janCount, febCount, marCount, aprCount, mayCount, junCount, julCount, augCount, septCount, octCount, novCount, decCount)
  
    axios({
        method: 'post',
        url: 'https://medinfo-python.onrender.com/plot',
        headers: {
          'Content-Type': 'application/json', //Set content type for JSON data
          'Accept': 'image/png' //Specify that an image is expected in the response
        },
        data: {
          year: yearToSend,
          data: [
            { month: `Jan ${yearToSend}`, count: janCount ? janCount : 0},
            { month: `Feb ${yearToSend}`, count: febCount ? febCount : 0},
            { month: `Mar ${yearToSend}`, count: marCount ? marCount : 0 },
            { month: `Apr ${yearToSend}`, count: aprCount ? aprCount : 0 },
            { month: `May ${yearToSend}`, count: mayCount ? mayCount : 0 },
            { month: `Jun ${yearToSend}`, count: junCount ? junCount : 0 },
            { month: `Jul ${yearToSend}`, count: julCount ? julCount : 0 },
            { month: `Aug ${yearToSend}`, count: augCount ? augCount : 0},
            { month: `Sept ${yearToSend}`, count: septCount ? septCount : 0 },
            { month: `Oct ${yearToSend}`, count: octCount ? octCount : 0 },
            { month: `Nov ${yearToSend}`, count: novCount ? novCount : 0 },
            { month: `Dec ${yearToSend}`, count: decCount ? decCount : 0 }
          ] 
        },
        responseType: 'arraybuffer'// Ensures binary data is received
    })
    .then((response) => {
        res.setHeader('Content-Type', 'image/png')//Inform the client about the content type
        res.send(Buffer.from(response.data, 'binary'))//Send the binary PNG data as a response
    })
    .catch((error) => {
        console.error('Error:', error.message)
        res.status(500).send('Error generating the plot')
    })
}

module.exports = {
    getPatientAnalytics
}  
// `Jan ${selectedYear}`