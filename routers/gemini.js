const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-pro"});

// 問題文を生成する
router.post("/generateQuestion", async(req, res) => {

    const { pl } = req.body;

    // 問題を生成
    const generateQuestionPrompt = `プログラミング言語"${pl}"のquestionを1つ出力して。questionとは、プログラミング言語${pl}の知識を試すものであるとする。生成した問題に対する模範解答も生成して。ただし、学生に解答が知られてしまうといけないので、必ず問題と模範解答を"\n"で区切ること。`;

    const generateQuestion = await model.generateContentStream(generateQuestionPrompt);

    let response = await (await generateQuestion.response).text().split(/(?=模範解答)/);
    
    const pattern = /^模範解答\n/;

    if (response[1] !== null && response[1] !== '' && !pattern.test(response[1])) {
      const lastIndex = response[0].lastIndexOf('\n');
      const rawResponse = response[0];
      response[0] = rawResponse.slice(0, lastIndex) + '\n';
      const tmp = rawResponse.slice(lastIndex + 1);
      response[1] = tmp + response[1];
    }

    const returnData = {
      question: response[0],
      modelAnswer: response[1]
    }

    return res.json({ returnData });
});

// 模範解答を生成する

// 解答の正誤判定
router.post("/answerCheck", async(req, res) => {

    const {question, answer, modelAnswer, pl} = req.body;
    console.log("answerChecking...");
    
    // クエリパラメータから問題文に対する回答を出力
    // 問題文に対して、ユーザの記述したプログラムが正しいかどうかをAiが判断する
    const answerCheckPrompt = `プログラミング言語${pl}に関する問題文「${question}」に対して、ユーザの解答「${answer}」が問題文の解答として正しい、あるいは問題文の題意に沿っており、要求された問題文を満たす解答である場合は"Apple"を出力して。そうでない場合は"Grape"を表示して。どちらにも当てはまらない場合は"Orange"を出力して。そうでない場合あるいはどちらにも当てはまらない場合と判断した際には、その理由を出力して。`;
    const descriptionPrompt = `プログラミング言語${pl}に関する問題文「${question}」の模範解答「${modelAnswer}」を生成して。また、問題文「${question}」そのものに対する解説を生成して。もし存在するなら「${answer}」以外の簡単な別解、その別解の解説を出力して。ただし、必ずそれぞれの項目の間に特殊文字"---"を入れて。`;

    const answerCheck = await model.generateContentStream(answerCheckPrompt);
    const description = await model.generateContentStream(descriptionPrompt);

    const answerCheckResponce = await answerCheck.response;
    const descriptionResponce = await description.response; 

    // 正誤判定記録
    const tof_comment = answerCheckResponce.text();
    const firstline = tof_comment.indexOf('\n');
    // コメント記録変数
    const comments = descriptionResponce.text().split("---");

    console.log(tof_comment);

    let returnData = {
        tof: tof_comment.substring(0, firstline),
        reasons: firstline + 1 >= tof_comment.length ? null : tof_comment.substring(firstline + 1)
    }

    let index = 0;
    comments.map((text) => {
        if (text !== "") {
            returnData[`comment${index}`] = `${text}`;
            index++;
        }
    })

    console.log("sending...");
    return res.json({returnData});
});

module.exports = router;