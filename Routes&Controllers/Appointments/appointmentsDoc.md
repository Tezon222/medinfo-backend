# DOCUMENTATION FOR Appointments API 

## Routes
1. POST '/bookAppointment' 
-   This route matches a patient with a doctor 
-   It collects the patient info from the form and uses it to match to a doctor
-   It then returns the doctor object

Request is sent as a JSON body, eg.
```json
 { 
  "name": "Ferdinard",
  "email": "ferditoosmall@gmail.com",
  "dob": "2003-11-28", 
  "gender": "Female",
  "phoneNumber": "08022298109",
  "reason": "I'm having pains in my urethra",
  "dateOfAppointment": "2024-01-01",
  "medicalConditions": "Mental Problems",
  "allergies": "I can't drink milk",
  "healthInsurance": "No" 
}
```
A doctor is returned, eg.
```json
{
    "_id": "673109050319d9baf0dd6510",
    "firstName": "Zayne",
    "lastName": "Edeh",
    "picture": "https://avatar/public/boy",
    "gender": "Male",
    "email": "zayne@gmail.com",
    "password": "$2a$10$q7lWhmRS3gtI1",
    "country": "Nigeria",
    "address": "Trenches",
    "specialty": "Birth",
    "medicalCert": "MBSS",
    "role": "Doctor",
    "haveAppointment": false,
    "createdAt": "2024-11-10T19:27:01.348Z",
    "updatedAt": "2024-11-10T19:27:01.348Z",
    "__v": 0
  }
```

2. POST '/bookAppointment/decline' 
-   This route matches a patient with another doctor if the patient clicks on decline
-   It redrects to '/bookAppointment' 

3. POST '/bookAppointment/booked/:doctorId' 
-   This route books the appointment once the payment has been made
-   It uses the doctor ID from the Params to create a reference to the doctor in the appointments database collection
-   The frontend should send the doctor id as a param to this route. It will be available from the doctor object returned from /bookAppointment
-   It returns an appointment object with ids of the patient and doctor with the appointment. 
A doctor is returned, eg.
```json
{
  "message": "Appointment successfully booked",
  "appointment": {
    "name": "Ferdinard",
    "email": "smallboy@gmail.com",
    "dob": "2003-11-28T00:00:00.000Z",
    "gender": "Female",
    "phoneNumber": 8022298109,
    "reason": "Can't Poop",
    "dateOfAppointment": "2024-01-01T00:00:00.000Z",
    "medicalConditions": "Nopoopitis",
    "allergies": "Deez Nutz",
    "healthInsurance": "Yes",
    "patient": "673109050319d9baf0dd6510",
    "doctor": "66cbb741889a4cf72b5ca8eb",
    "_id": "673111a3ed79e3b6e28c8a0d",
    "__v": 0
  }
}
```