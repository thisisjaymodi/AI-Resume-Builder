import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

// Controller for enhancing a resume's professional summary.
// POST: /api/ai/enhance-pro-summary

const promptProfessionalSummary =
  "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.";
const promptJobDescription =
  "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.";

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing required field" });
    }
    const response = await ai.chat.completions.create({
      model: "Gemini 2.5 Flash",
      messages: [
        { role: "system", content: promptProfessionalSummary },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    
    
    if (!userContent) {
      return res.status(400).json({ message: "Missing required field" });
    }
    const response = await ai.chat.completions.create({
      model: "Gemini 2.5 Flash",
      messages: [
        { role: "system", content: promptJobDescription },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for uploading a resume to the Database
// POST: /api/ai/upload-resume

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;
    
    
    const sysPromptUploadResume =
      "You are an expert AI agent to extract data from resume.";
    const userPromptUploadResume = `extract data from this resume: ${resumeText} provide data in the following JSON format with no additional text before or after:
{
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    title: {type: String, default: "Untitled Resume"},
    public:{type: Boolean, default: false},
    template:{type: String, default: "classic"},
    accent_color: {type:String, default:"#3B82F6"},
    professional_summary: {type:String, default:""},
    skills:[{type: String}],
    personal_info: {
        image: {type: String, default:""},
        full_name: {type: String, default:""},
        profession: {type: String, default:""},
        email: {type: String, default:""},
        phone: {type: String, default:""},
        location: {type: String, default:""},
        linkedin: {type: String, default:""},
        website: {type: String, default:""},
    },
    experience: [
        {
            company: {type: String},
            position: {type: String},
            start_date: {type: String},
            end_date: {type: String},
            description: {type: String},
            isCurrent: {type: Boolean},
        }
    ],
    project: [
        {
            name: {type: String},
            type: {type: String},
            description: {type: String}
        }
    ],
    eduction: [
        {
            institution: {type: String},
            degree: {type: String},
            field: {type: String},
            graduation_date: {type: String},
            gpa: {type: String}
        }
    ]
}
`;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required field" });
    }

    const response = await ai.chat.completions.create({
      model: "Gemini 2.5 Flash",
      messages: [
        { role: "system", content: sysPromptUploadResume },
        {
          role: "user",
          content: userPromptUploadResume,
        },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    
    const newResume = await Resume.create({ ...parsedData, userId, title  });
    //Above please keep spread operator first, otherwise userId gets overridden with null.
    
    return res.json({ resumeId: newResume._id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
