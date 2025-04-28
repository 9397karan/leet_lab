import axios from "axios"

export const getJudge0LanguageId = (language) => {
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63
    }
    return languageMap[language.toUpperCase()] || null
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const pollBatchResults = async (tokens) => {
    while (true) {
        const { data } = await axios.get(`${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false&tokens=${tokens.join(',')}`)
        const result = data.submissions
        const isAllDone = result.every((r) => r.status.id !== 1 && r.status.id !== 2)
        if (isAllDone) return result
        await sleep(1000)
    }
}

export const submitBatch = async (submissions) => {
    const { data } = await axios.post(`${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`, { submissions })
    return data
}