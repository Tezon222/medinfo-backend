import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';

// Get the current file path
const __filename = fileURLToPath(import.meta.url);

// Get the current directory path
const __dirname = path.dirname(__filename);


const diseaseFilePath = path.join(__dirname, 'medinfo.json')

// @desc    Get All Diseases
// @route   GET /diseases/allDiseases?page=${}&limit=6
// @returns Object of page, limit, total diseases and Diseases Array
export const getAllDiseases = (req, res) => {
    try {
        fs.readFile(diseaseFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: "Error",
                    message: "Error reading the JSON file",
                    errors: `${err}`
                })
            }

            const diseases = JSON.parse(data)

            // Get query parameters for pagination
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 6
            const startIndex = (page - 1) * limit
            const endIndex = startIndex + limit

            // Get the paginated data
            const paginatedDiseases = diseases.slice(startIndex, endIndex)

            // Extract only Disease and Description properties
            const simplifiedDiseases = paginatedDiseases.map(disease => ({
                Disease: disease.Disease,
                Description: disease.Description,
                Image: disease.Image
            }));
  
           
            // Prepare the response with pagination info
            const response = {
                page: page,
                limit: limit,
                totalDiseases: diseases.length,
                diseases: simplifiedDiseases
            }

            res.status(200).json({
                status: "Success",
                message: "Data retrieved successfully",
                data: response
            })
        })
    } catch (err) {
        res.status(500).json({   
            status: "Error",
            message: "Error fetching data from JSON file",
            errors: `${err}`
        })
    }
}

// @desc    Get One Diseases
// @route   GET /diseases/oneDisease?name=${}
// @returns Object of specific Disease containing disease, symptom, description and precaution
export const getOneDisease = (req, res) => {
    try {
        fs.readFile(diseaseFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: "Error",
                    message: "Error reading the JSON file",
                    errors: `${err}`
                })
            }
            const diseases = JSON.parse(data)

            // Get the disease name from the query parameter
            const diseaseName = req.query.name
            if (!diseaseName) {
                return res.status(400).json({ 
                    status: "Error",
                    message: "Disease name query parameter is required" 
                }) 
            }

            // Find the disease object with the specified name
            const oneDisease = diseases.find(disease => disease.Disease.toLowerCase() === diseaseName.toLowerCase())

            if (!oneDisease) {
                return res.status(404).json({
                    status: "Error",
                    message: "Disease not found" 
                }) 
            }

            res.status(200).json({
                status: "Success",
                message: "Data retrieved successfully",
                data: oneDisease
            })

        })
    } catch (err) {
        res.status(500).json({   
            status: "Error",
            message: "Error fetching data from JSON file",
            errors: `${err}`
        })
    }
}

/**ADMIN ACCESS ROUTES**/
// @desc    Add a New Disease
// @route   POST /diseases/addDisease
// @access  Private
export const addDisease = (req, res) => {
    try {
        fs.readFile(diseaseFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: "Error",
                    message: "Error reading the JSON file",
                    errors: `${err}`
                })
            }
            let diseases = JSON.parse(data)

            const newDisease = {
                Disease: req.body.Disease,
                Symptoms: req.body.Symptoms,
                Description: req.body.Description,
                Precautions: req.body.Precautions,
                Image: req.body.Image
            }

            diseases.push(newDisease)

            fs.writeFile(diseaseFilePath, JSON.stringify(diseases, null, 2), (err) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({ message: "Error writing to the JSON file" })
                    return
                }

                res.status(200).json({ 
                    status: "Success", 
                    message: "Disease added successfully", 
                    data: newDisease 
                })
            })
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: "Error processing request",
            errors: `${err}`
        })
    }
}

// @desc    Update a Disease
// @route   PUT /diseases/updateDisease?name=${}
// @access  Private
export const updateDisease = (req, res) => {
    try {
        fs.readFile(diseaseFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    status: "Error",
                    message: "Error reading the JSON file",
                    errors: `${err}`
                })
            }

            let diseases = JSON.parse(data)

            // Get the disease name from the query parameter
            const diseaseName = req.query.name
            if (!diseaseName) {
                return res.status(400).json({ 
                    status: "Error",
                    message: "Disease name query parameter is required" 
                })
            }

            // Find the index of the disease object with the specified name
            const diseaseIndex = diseases.findIndex(disease => disease.Disease.toLowerCase() === diseaseName.toLowerCase())

            if (diseaseIndex === -1) {
                return res.status(404).json({
                    status: "Error",
                    message: "Disease not found"
                })
            }

            // Update the disease details
            diseases[diseaseIndex] = {
                Disease: req.body.Disease,
                Symptoms: req.body.Symptoms,
                Description: req.body.Description,
                Precautions: req.body.Precautions,
                Image: req.body.Image
            }

            // Write the updated array back to the file
            fs.writeFile(diseaseFilePath, JSON.stringify(diseases, null, 2), (err) => {
                if (err) {
                    // console.log(err)
                    return res.status(500).json({
                        status: "Error", 
                        message: "Error writing to the JSON file" 
                    })
                }

                res.status(200).json({ 
                    status: "Success", 
                    message: "Disease updated successfully", 
                    data: diseases[diseaseIndex] 
                })
            })
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: "Error processing request",
            errors: `${err}`
        })
    }
}

// @desc    DELETE One Disease
// @route   DELETE /diseases?name=${}
// @access  Private
export const deleteDisease = (req, res) => {
    try {
        fs.readFile(diseaseFilePath, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    status: "Error",
                    message: "Error reading the JSON file",
                    errors: `${err}`
                })
            }
            let diseases = JSON.parse(data)

            // Get the disease name from the query parameter
            const diseaseName = req.query.name
            if (!diseaseName) {
                return res.status(400).json({ 
                    status: "Error",
                    message: "Disease name query parameter is required" 
                })
            }

            // Find the index of the disease object with the specified name
            const diseaseIndex = diseases.findIndex(disease => disease.Disease.toLowerCase() === diseaseName.toLowerCase())

            if (diseaseIndex === -1) {
                return res.status(404).json({ 
                    status: "Error", 
                    message: "Disease not found" 
                })
            }

            // Remove the disease from the array
            diseases.splice(diseaseIndex, 1)

            // Write the updated array back to the file
            fs.writeFile(diseaseFilePath, JSON.stringify(diseases, null, 2), (err) => {
                if (err) {
                    // console.log(err)
                    return res.status(500).json({ 
                        status: "Error",
                        message: "Error writing to the JSON file" 
                    })
                }

                res.status(200).json({
                    status: "Success!",
                    message: "Disease deleted successfully" 
                })
            })
        })
    } catch (err) {
        res.status(500).json({
            status: "Error",
            message: "Error processing request",
            errors: `${err}`
        })
    }
}

