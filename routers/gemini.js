const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-pro"});

// 問題文を生成する
router.post("/GenerateQuestion", async(req, res) => {

    const { pl } = req.body;

    // 問題を生成
    const generateQuestionPrompt = `"${pl}"に関するプログラミングの問題を1つ出力して`;

    const generateQuestion = await model.generateContentStream(generateQuestionPrompt);

    const responce = await generateQuestion.response;
    const returnData = {
        question: responce.text()
    }

    return res.json({ returnData });
});

// 解答の正誤判定
router.post("/AnswerCheck", async(req, res) => {

    const {question, answer} = req.body;
    const MAX_COMMENTS = 4;
    
    // クエリパラメータから問題文に対する回答を出力
    // 問題文に対して、ユーザの記述したプログラムが正しいかどうかをAiが判断する
    const answerCheckPrompt = `問題文「${question}」を解答「${answer}」が満たす場合は"Y"を出力して。そうでない場合は"Great"を表示して。`;
    const descriptionPrompt = `問題文「${question}」に対する解説、また「${answer}」以外の簡単な別解、その別解の解説、合計3項目を出力して。ただし、必ずそれぞれの項目の間に特殊文字"---"を入れて。`;

    const answerCheck = await model.generateContentStream(answerCheckPrompt);
    const description = await model.generateContentStream(descriptionPrompt);

    const answerCheckResponce = await answerCheck.response;
    const descriptionResponce = await description.response;

    // 正誤判定記録
    const tof = answerCheckResponce.text();
    // コメント記録変数
    console.log(descriptionResponce.text());
    const comments = descriptionResponce.text().split("---");

    const returnData = {
        tof: tof,
        comment1: comments[0],
        comment2: comments[1],
        comment3: comments[2],
        comment4: comments[3]
    }

    return res.json({returnData});
});

module.exports = router;