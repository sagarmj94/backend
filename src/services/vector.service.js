// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create a dense index with integrated embedding

//pc means pinecone client
//index name is chat-gpt-sagar
// what index mean? 
// An index in Pinecone is a collection of vectors that you can query against. Each index can be thought of as a separate database table that holds vectors and their associated metadata. You can create multiple indexes within a single Pinecone project, each with its own configuration and purpose.
const chatGptSagar = pc.Index('chat-gpt-sagar');

// upsert vectors?
// Upserting vectors in Pinecone involves adding new vectors to an index or updating existing ones. When you upsert a vector, you provide its unique identifier (ID), the vector values (the actual data points), and optionally, any metadata associated with that vector.
// If a vector with the same ID already exists in the index, the upsert operation will update its values and metadata. If it doesn't exist, a new vector will be created.   
async function createMemory(vectors, metadata) {
    await chatGptSagar.upsert([
        {
            id: metadata.userId,
            values: vectors,
            metadata: metadata
        }
    ]
    );
}



// query the index?
// Querying an index in Pinecone involves searching for vectors that are similar to a given query vector. This is typically done using similarity search algorithms like cosine similarity or Euclidean distance.
// When you query an index, you provide a query vector and specify parameters such as the number of top results to return (topK) and any filters based on metadata. The index then returns the most similar vectors along with their associated metadata.
async function queryMemory(queryVector, limit = 5, metadata) {
    const data = await chatGptSagar.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? { metadata } : undefined,
        includeMetadata: true
    })
    return data.matches;
}


module.exports = { createMemory, queryMemory }