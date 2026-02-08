import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import api from "../configs/api";
import {toast} from "react-hot-toast";

const Preview = () => {
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadResume = async () => {
    // setIsLoading(true);
    // setTimeout(() => {
    //   setResumeData(
    //     dummyResumeData.find((resume) => {
    //       return resume._id === resumeId && resume.public === true
    //         ? resume
    //         : null;
    //     }),
    //   );
    //   setIsLoading(false);
    // }, 2000);
    
    try {
      setIsLoading(true); 
      const {data}  = await api.get(`/api/resumes/public/${resumeId}`);
       setResumeData(data.resume);
      toast.success("Success");
    } catch (error) {
      toast.error(error.message);
    }finally{
      setIsLoading(false); 
    }

  };
  useEffect(() => {
    loadResume();
  }, []);

  return resumeData ? (
    <div className="bg-slate-100">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          classes="py-4 bg-white"
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
        />
      </div>
    </div>
  ) : (
    <div>
      <div>
        {isLoading ? (
          <Loader /> //Latest Add skeleton A4 page size.
        ) : (
          <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-center text-6xl text-slate-400 font-medium">
              Resume not found
            </p>
            <a
              href="/"
              className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors"
            >
              <ArrowLeftIcon className="mr-2 size-4" />
              go to home page
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
