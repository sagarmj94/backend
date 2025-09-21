const { Pinecone } = require('@pinecone-database/pinecone')

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const chatGptSagar = pc.Index('chat-gpt-sagar');

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