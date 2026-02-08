import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ExperienceForm = ({ data, onChange }) => {

  const { token } = useSelector(state => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);


  
  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
    //Yes we should handle input data state change using onChange. But on every character change we should not update object structure. I think to update the object once the input gets blur
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, i) => {
      return i !== index;
    });
    onChange(updated);
  };
  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };
  
  const generateJD = async (index) => {
    try {
      setGeneratingIndex(index);
      
      const experience = data[index];
      const prompt = `Enhance this Job description ${experience.description} for the position of ${experience.position} at ${experience.company}`;
      const response = await api.post(
        "/api/ai/enhance-pro-sum",
        { userContent: prompt },
        { headers: { Authorization: token } },
      );
      console.log(response.data);
      
      // updateExperience(index, "description", response.data.enhancedContent);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setGeneratingIndex(-1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            Professional Experience
          </h3>
          <p className="text-sm text-gray-500">Add your job Experience</p>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm">
            Click "{<Plus className="size-4 text-gray-400 inline" />} Add
            Experience" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => {
            return (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4>Experience #{index + 1}</h4>{" "}
                  {/* Experience #1 .. #2 .. #3 */}
                  <button
                    onClick={() => {
                      removeExperience(index);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={experience.company || ""}
                    onChange={(e) => {
                      updateExperience(index, "company", e.target.value);
                    }}
                    placeholder="Company Name"
                    className="px-3 py-2 text-sm rounded-lg"
                  />
                  <input
                    type="text"
                    value={experience.position || ""}
                    onChange={(e) => {
                      updateExperience(index, "position", e.target.value);
                    }}
                    placeholder="Job TItle"
                    className="px-3 py-2 text-sm rounded-lg"
                  />
                  <input
                    type="month"
                    value={experience.start_date || ""}
                    onChange={(e) => {
                      updateExperience(index, "start_date", e.target.value);
                    }}
                    className="px-3 py-2 text-sm rounded-lg"
                  />
                  <input
                    type="month"
                    value={experience.end_date || ""}
                    onChange={(e) => {
                      updateExperience(index, "end_date", e.target.value);
                    }}
                    disabled={experience.is_current || false }
                    className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={ experience.is_current || false }
                    onChange={(e) => {
                      updateExperience(
                        index,
                        "is_current",
                        e.target.checked ? true : false,
                      );
                    }}
                  />
                  <span className="text-sm text-gray-700">
                    Currently working here
                  </span>
                </label>
                <div className="flex items-center space-y-2">
                  <div className="flex items-center justify-between pt-2">
                    <label htmlFor="">Job Description</label>
                  </div>
                  <button disabled={generatingIndex === index || !experience.position || !experience.company} onClick={() => generateJD(index)} className="flex ml-auto items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50">
                    {generatingIndex === index ? (<Loader2 className="size-4 animate-spin" />) : (<Sparkles className="size-4" /> )}
                    {generatingIndex === index ?  "Generating Content..." : "Rewrite using AI" }
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={experience.description || ""}
                  onChange={(e) => {
                    updateExperience(index, "description", e.target.value);
                  }}
                  className="w-full text-sm px-3 py-2 rounded-lg resize-none"
                  placeholder="Describe your key responsibilities and achievements..."
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
