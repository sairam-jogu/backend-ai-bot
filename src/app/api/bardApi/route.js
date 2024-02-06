// import { NextResponse } from "next/server";

import { NextResponse } from "next/server";

// const { DiscussServiceClient } = require("@google-ai/generativelanguage");
// const { GoogleAuth } = require("google-auth-library");

// const MODEL_NAME = "models/chat-bison-001";
// const API_KEY = 'AIzaSyD-ljbqYrsgUWuObt0qc9qB9UOPx00qCUY';

// const client = new DiscussServiceClient({
//     authClient: new GoogleAuth().fromAPIKey(API_KEY)
// });

// export async function GET(req, res) {
//     let messages = [{ content: req.query?.ques }];
//     try {
//         const result = await client.generateMessage({
//             model: MODEL_NAME,
//             temperature: 0.25,
//             candidateCount: 1,
//             top_k: 40,
//             top_p: 0.95,
//             prompt: {
//                 messages: messages
//             },
//         });

//         console.log("First Response: ", result[0].candidates[0]?.content);
//         messages.push({ content: result[0].candidates[0]?.content });
//         NextResponse.json({ resp: messages });
//     } catch (error) {
//         console.error("Error generating message:", error);
//         NextResponse.error("Internal Server Error");
//     }
// }


// // const client = new DiscussServiceClient({
// //   authClient: new GoogleAuth().fromAPIKey(API_KEY),
// // });

// // export async function POST(req, res) {
// //   try {
// //     let msgs = [{content: req.query.ques}]
// //     const result = await client.generateMessage({
    
// //       model: MODEL_NAME,
// //       temperature: 0.5,
// //       candidateCount: 1,
// //       prompt: {
// //         messages:msgs
// //       },
// //     });

// //     const generatedResponse = result[0].candidates[0]?.content;

// //     // Add your logic to modify the response or process it further if needed

// //     // Send response to the client
// //     return NextResponse.json({generatedResponse});
// //   } catch (error) {
// //     console.error(error);
// //     return NextResponse.text("Internal Server Error", { status: 500 });
// //   }
// // }

// // pages/api/generativeAI.js

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// import { NextResponse } from "next/server";

// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// export async function GET(req,res) {
//   // For text-only input, use the gemini-pro model
//   const model = genAI.getGenerativeModel({ model: "gemini-pro"});

//   const chat = model.startChat({
//     history: [
//       {
//         role: "user",
//         parts: "Hello, I have 2 dogs in my house.",
//       },
//       {
//         role: "model",
//         parts: "Great to meet you. What would you like to know?",
//       },
//     ],
//     generationConfig: {
//       maxOutputTokens: 100,
//     },
//   });

// //   const msg = "How many paws are in my house?";
//   console.log(req.query);
//   const msg = req.query.prompt

//   const result = await chat.sendMessage(msg);
//   const response = await result.response;
//   const text = response.text();
//   console.log(text);
//   return NextResponse.json({text})
// }


// node --version # Should be >= 18
// npm install @google/generative-ai

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const MODEL_NAME = "gemini-pro";
  const API_KEY = process.env.API_KEY;
  
  export async function GET(req,res) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query")
    console.log(query)
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const parts = [
      {text: `${query}`},
    ];
  
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
  
    const response = result.response;
    console.log(response.text());
    return NextResponse.json({response : response.text()})
  }

  
  
