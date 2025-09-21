const { GoogleGenAI } = require("@google/genai")


//what is this doing?
// This code initializes a GoogleGenAI client using an API key stored in environment variables. The client is used to interact with Google's Generative AI services, allowing you to generate content and embeddings.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})


// what is this function doing?
// This function generates a response using the Google GenAI API. It takes a string or an array of strings as input and returns the generated text based on the provided content.

async function generateResponse(content) {

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content
    })
    return response.text;
}


//what is this function doing?
// This function generates vector embeddings for the given content using the Google GenAI API. It takes a string or an array of strings as input and returns their corresponding vector representations.

async function generateVector(content) {
    const response = await ai.models.embedContent({
        // what is this model? 
        // The "gemini-embedding-001" model is a specific model provided by Google GenAI for generating vector embeddings from text content. Embeddings are numerical representations of text that capture semantic meaning, allowing for tasks such as similarity search, clustering, and classification.
        // This model is designed to convert text into high-dimensional vectors that can be used in various machine learning and AI applications.
        model: "gemini-embedding-001",
        contents: content,
        config: {
            //what is this? 
            // Output dimensionality refers to the number of dimensions in the vector space that the embedding model generates. In this case, setting outputDimensionality to 768 means that each piece of text will be converted into a vector with 768 numerical values.
            // The choice of dimensionality can impact the quality and performance of the embeddings for various tasks. Higher dimensionality can capture more nuanced semantic information but may also require more computational resources.
            outputDimensionality: 768,

        }
    })
    return response.embeddings;

}

module.exports = { generateResponse, generateVector }