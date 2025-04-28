import { db } from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.libs.js";

export const createProblem = async (req, res) => {
    const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body

    if (req.user.role !== 'ADMIN') {
        return res.status(400).json({ message: "You're not authorised to perform this action.." })
    }

    try {
        for (const [language, solution] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language)
            if (!languageId) {
                return res.status(400).json({ message: "Invalid language" })
            }

            const submission = testcases.map(({ input, output }) => ({
                source_code: solution,
                language_id: languageId,
                stdin: input,
                expected_output: output
            }))

            const submissionResults = await submitBatch(submission)
            const tokens = submissionResults.map((res) => res.token)
            const results = await pollBatchResults(tokens)

            for (let i = 0; i < results.length; i++) {
                console.log("Results:---", results);
                
                const result = results[i]
                if (result.status.id !== 3) {
                    return res.status(400).json({ error: `Testcase ${i + 1} failed for language ${language}` })
                }
            }
        }

        const newProblem = await db.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testcases,
                codeSnippets,
                referenceSolutions,
                userId: req.user.id
            }
        })

        return res.status(200).json(newProblem)

    } catch (error) {
        console.error(error)
        res.status(400).json({ message: "Contact admin" })
    }
}
export const getAllProblems=()=>{}
export const getProblemById=()=>{}
export const updateProblem=()=>{}
export const deleteProblem=()=>{}
export const getAllProblemsSolvedByUser=()=>{}