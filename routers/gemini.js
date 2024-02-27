const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-pro"});

// 問題文を生成する
router.post("/generateQuestion", async(req, res) => {

    const { pl } = req.body;

    // 問題を生成
    const generateQuestionPrompt = `プログラミング言語"${pl}"のquestionを1つ出力して。questionとは、プログラミング言語${pl}の知識を試すものであるとする。生成した問題に対する模範解答も生成して。ただし、学生に解答が知られてはいけないので、問題と模範解答は改行文字で必ず区切って。`;

    const generateQuestion = await model.generateContentStream(generateQuestionPrompt);

    const responce = await (await generateQuestion.response).text().split(/(?=模範解答)|(?=\*\*模範解答\*\*)/);

    const returnData = {
        question: responce[0],
        modelAnswer: responce[1]
    }

    return res.json({ returnData });
});

// 模範解答を生成する

// 解答の正誤判定
router.post("/answerCheck", async(req, res) => {

    const {question, answer, modelAnswer, pl} = req.body;
    
    // クエリパラメータから問題文に対する回答を出力
    // 問題文に対して、ユーザの記述したプログラムが正しいかどうかをAiが判断する
    const answerCheckPrompt = `プログラミング言語${pl}に関する問題文「${question}」に対する模範解答「${modelAnswer}」を表す内容として、ユーザの解答「${answer}」が適している場合は"Y"を出力して。そうでない場合は"Great"を出力して。判断できない場合は"Great"を出力して。`;
    const descriptionPrompt = `プログラミング言語${pl}に関する問題文「${question}」の模範解答「${modelAnswer}」を生成して。また、問題文「${question}」そのものに対する解説を生成して。もし存在するなら「${answer}」以外の簡単な別解、その別解の解説を出力して。ただし、必ずそれぞれの項目の間に特殊文字"---"を入れて。`;

    const answerCheck = await model.generateContentStream(answerCheckPrompt);
    const description = await model.generateContentStream(descriptionPrompt);

    const answerCheckResponce = await answerCheck.response;
    const descriptionResponce = await description.response;

    // 正誤判定記録
    const tof = answerCheckResponce.text();
    // コメント記録変数
    console.log(descriptionResponce.text());
    const comments = descriptionResponce.text().split("---");

    let returnData = {
        tof: tof,
    }

    let index = 0;
    comments.map((text) => {
        if (text !== "") {
            returnData[`comment${index}`] = `${text}`;
            index++;
        }
    })

    return res.json({returnData});
});

module.exports = router;