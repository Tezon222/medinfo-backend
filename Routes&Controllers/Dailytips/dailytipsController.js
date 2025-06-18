import fetch from 'node-fetch';

//Array of health tip IDs
const numbers = [
  25, 327, 329, 350, 510, 512, 514, 527, 528, 529, 530, 531, 532, 533, 534, 536,
  537, 538, 539, 540, 541, 542, 543, 544, 546, 547, 549, 551, 552, 553,
  30530, 30531, 30532, 30533, 30534
]

//Function to return 6 random healthtips
function getRandomNumbers(array, count) {
    const result = [];
    const totalNumbers = array.length;
    
    // Generate 'count' unique random indices
    while (result.length < count) {
        const randomIndex = Math.floor(Math.random() * totalNumbers)
        if (!result.includes(randomIndex)) {
            result.push(randomIndex)
        }
    }
    
    // Pick numbers corresponding to the random indices
    return result.map(index => array[index]);
}

// @desc    Get 6 random tips for homepage
// @returns Object of 6 tips with ImageUrl, id and title
export const getRandomTips = async (req, res) => {
  const randomNumbers = getRandomNumbers(numbers, 6)

  try {
    // Build all URLs
    const urls = randomNumbers.map(
      num => `https://health.gov/myhealthfinder/api/v3/topicsearch.json?TopicId=${num}`
    )

    // Fetch all in parallel
    const fetchResponses = await Promise.all(urls.map(url => fetch(url)))

    // Convert all to JSON
    const jsonDataArray = await Promise.all(fetchResponses.map(res => res.json()))

    // Extract relevant data from each response
    const dataPackage = jsonDataArray.map(data => {
      const resource = data?.Result?.Resources?.Resource?.[0]

      return {
        imageUrl: resource?.ImageUrl || null,
        id: resource?.Id || null,
        title: resource?.Title || "No Title Found"
      }
    })

    res.status(200).json({
      status: "Success",
      message: "Data retrieved successfully",
      data: dataPackage
    })

  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Error fetching data from API",
      error: `${err}`
    })
  }
}

// @desc    Get single tip
// @returns Object of content, lastupdated, imageurl and imagealt
export const getSingleTip = async (req, res) => {
  const apiUrl = `https://health.gov/myhealthfinder/api/v3/topicsearch.json?TopicId=${req.params.id}`

  try {
    const response = await fetch(apiUrl)

    if (!response.ok) {
      return res.status(response.status).json({
        status: "Error",
        message: `API responded with status ${response.status}`,
      })
    }

    const data = await response.json()

    // ?. is Optional chaining operator. If anything in the chain is 
    // undefined or null, the result will be undefined instead of throwing an error
    const resource = data?.Result?.Resources?.Resource?.[0]

    if (!resource) {
      return res.status(404).json({
        status: "Fail",
        message: "No resource found for the given TopicId"
      })
    }

    const mainTitle = resource.Title
    const imageAlt = resource.ImageAlt
    const imageUrl = resource.ImageUrl
    const lastUpdatedDate = new Date(parseInt(resource.LastUpdate)).toLocaleDateString()
    const lastUpdatedTime = new Date(parseInt(resource.LastUpdate)).toLocaleTimeString()
    const lastUpdated = `${lastUpdatedDate} ${lastUpdatedTime}`
    const mainBody = resource.Sections.section

    const dataPackage = {
      mainTitle,
      imageAlt,
      imageUrl,
      lastUpdated,
      mainBody
    }

    res.status(200).json({
      status: "Success",
      message: "Data retrieved successfully",
      data: dataPackage
    })

  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Unexpected error occurred while fetching data",
      errors: `${err}`
    })
  }
}

// btw try-catch only works with synchronous code, or asynchronous code using async/await.
