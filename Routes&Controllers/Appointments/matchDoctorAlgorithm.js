import doctorModel from "../../Model/Users/doctorSchema.js"
import { pipeline } from "@xenova/transformers"

//computes the dot product btw two vectors
const dotProduct = (vecA, vecB) => {
    let product = 0;
    for(let i=0;i<vecA.length;i++){
        product += vecA[i] * vecB[i];
    }
    return product;
}

//computes the magnitude of two vectors
const magnitude = (vec) => {
    let sum = 0;
    for (let i = 0;i<vec.length;i++){
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}

//returns the cosine similarity of two vectors
const cosineSimilarity = (vecA, vecB) => {
    return dotProduct(vecA,vecB)/ (magnitude(vecA) * magnitude(vecB));
}

//creates a patient vector
const createPatientVector = async (reason) => {
    const extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
    )    

    const response = await extractor( 
        [reason],
        { pooling: "mean", normalize: true }
    )  
 
    const result = Array.from(response.data)
    // console.log(result)
    return result
}

//creates a doctor vector
const createDoctorVector = async () => {
    const extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
    )    
    const doctors = await doctorModel.find()
    var specialties = [ ]

    for (const doctor of doctors) {
       specialties.push(doctor.specialty)
    }

    const response = await extractor( 
        specialties,
        { pooling: "mean", normalize: true }
    )  

    return response.tolist()
}

//retrieves at most top 3 doctors suited for a patient
const getTopDoctors = async (reason) => {
    const doctors = await createDoctorVector()
    
    var thresholds = []
    for (let index = 0; index < doctors.length; index++) {
        var point = cosineSimilarity(await createPatientVector(reason), doctors[index])//please replace mental with reason in matchdoctor
        thresholds.push(point)        
    }

    // Create objects with num and index
    let filtered = thresholds.map((num, index) => ({ num, index })).filter(item => item.num > 0.5)// Keep only items where num > 0.5

    // Sort the filtered array in descending order by num
    filtered.sort((a, b) => b.num - a.num)

    // Extract the indexes of the top 3 numbers (or fewer if less than 3)
    return filtered.slice(0, 3).map(item => item.index)
}

export default getTopDoctors