import {
  FilePenLineIcon,
  LoaderCircle,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import { useState, useEffect } from "react";
import { dummyResumeData } from "../assets/assets";
import { data, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api.js";
import pdfToText from "react-pdftotext";

const Dashboard = () => {
  const { user, token } = useSelector(state => state.auth);
  
  const [allResumes, setAllResumes] = useState([]);
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a "];
  const [showCreateResumeBox, setShowCreateResumeBox] = useState(false);
  const [showUploadResumeBox, setShowUploadResumeBox] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const loadAllResumes = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(
        "/api/users/resumes",
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
    // setAllResumes(dummyResumeData);
    // console.log(allResumes);
  };

  const createResume = async (event) => {
    event.preventDefault();
    // setShowCreateResumeBox(false);
    // navigate(`/app/builder/resume123`);
    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setAllResumes([...allResumes, data.resume]);
      navigate(`/app/builder/${data.resume._id}`);
      setShowCreateResumeBox(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setTitle("");
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    // setShowUploadResumeBox(false);
    // navigate(`/app/builder/resume123`);
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText},
        {
          headers: {
            Authorization: token,
          },
        },
      );
      console.log(data);
      setTitle("");
      setResume(null);
      setShowUploadResumeBox(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
       toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const editResumeTitle = async (event) => {
    event.preventDefault();
    // console.log(title);
    // Additional step
    // I think we need to pass resume id along with use map func to edit title of particular object.
    try {
      const { data } = await api.put(
        `/api/resumes/update/`,
        { 
          resumeId: editResumeId, 
          resumeData: {title}
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? {...resume, title} : resume));
      setTitle("");
      setEditResumeId("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteResume = async (resumeId) => {
    const confirm = window.confirm("Would you like to delete this resume?");
    // confirm &&
    //   setAllResumes((prev) => {
    //     return prev.filter((resume) => resume._id !== resumeId);
    //   });
    try {
      if(confirm){
      const { data } = await api.delete(
        `/api/resumes/delete/${resumeId}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      setAllResumes(allResumes => allResumes.filter(resume => resume._id !== resumeId));
      toast.success(data.message);
    }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadAllResumes();
    document.title = "Dashboard - Resume Builder";
  }, []);

  return (
    <div>
      <div className="max-w-7x1 mx-auto px-4 py-8">
        <p className="text-2x1 font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, chang manga
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateResumeBox(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center
              justify-center rounded-lg gap-2 text-slate-600 border border-dashed
              border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all
              duration-300 cursor-pointer"
          >
            <PlusIcon
              className="size-11 transition-all duration-300 p-2.5
              bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full"
            />
            <p
              className="text-sm group-hover:text-indigo-600 transition-all
              duration-300"
            >
              Create Resume
            </p>
          </button>
          <button
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center
              justify-center rounded-lg gap-2 text-slate-600 border border-dashed
              border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all
              duration-300 cursor-pointer"
            onClick={() => {
              setShowUploadResumeBox(true);
            }}
          >
            <UploadCloudIcon
              className="size-11 transition-all duration-300 p-2.5
              bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full"
            />
            <p
              className="text-sm group-hover:text-purple-600 transition-all
              duration-300"
            >
              Upload Existing
            </p>
          </button>
        </div>
        <hr className="border-slate-300 my-6 sm:w-[305px]" />
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            //"Give me the color at this index, but if the index is too big, wrap around to the start and keep counting."
            return (
              <button
                onClick={() => {
                  navigate(`/app/builder/${resume._id}`);
                }}
                key={index}
                className="relative w-full sm:max-w-36 h-48 flex
                flex-col items-center justify-center rounded-lg gap-2 border group
                hover: shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10,${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />
                <p className="text-sm group-hover:scale-105 transition-all px-2 text-center">
                  {resume.title}
                </p>
                <p
                  className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 group-hover:flex items-center hidden"
                >
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id);
                      setTitle(resume.title);
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {showCreateResumeBox && (
          <form
            onSubmit={createResume}
            onClick={() => {
              setShowCreateResumeBox(false);
            }}
            action=""
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input
                type="text"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                placeholder="Enter resume title"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Create Resume
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResumeBox(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {showUploadResumeBox && (
          <form
            onSubmit={uploadResume}
            onClick={() => {
              setShowUploadResumeBox(false);
            }}
            action=""
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload a Resume</h2>
              <input
                type="text"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                placeholder="Enter resume title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                required
              />
              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  Select resume file
                  <div
                    className="flex flex-col items-center justify-center gap-2
                    border group text-slate-400 border-slate-400 border-dashed
                    rounded-md p-4 py-10 my-4 hover:border-green-500
                    hover:text-green-700 cursor-pointer transition-colors"
                  >
                    {resume ? (
                      <p className="text-green-700">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14 stroke-1" />
                        <span>Drag and Drop your files</span>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) => {
                    setResume(e.target.files[0]);
                  }}
                />
              </div>
              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2" disabled={isLoading}>
                {isLoading && <LoaderCircle  className="animate-spin size-4 text-white"/>}
                {isLoading ? "Uploading..." : "Upload Resume"}
                {/* Upload Resume */}
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResumeBox(false);
                  setTitle("");
                  // We might need to clear the resume state as well right?
                }}
              />
            </div>
          </form>
        )}

        {editResumeId && (
          <form
            onSubmit={editResumeTitle}
            onClick={() => {
              setEditResumeId("");
            }}
            action=""
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                type="text"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                placeholder="Enter resume title"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Update Title
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId("");
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
