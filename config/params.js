const PARAMS_SCHEMA = {
    keywords: {
      type: "string",
      label: "Job Keywords",
      default: "software engineer",
      required: true
    },
  
    location: {
      type: "string",
      label: "Location",
      default: "United States",
      required: true
    },
  
    salary: {
      type: "range",
      label: "Salary Range",
      fields: {
        min: {
          type: "number",
          default: 60000
        },
        max: {
          type: "number",
          default: 120000
        }
      }
    },
  
    experienceLevel: {
      type: "enum",
      label: "Experience Level",
      values: ["junior", "mid", "senior","assistant","intern"],
      default: ["junior","mid"],
      multiple: true
    },
  
    jobType: {
      type: "enum",
      label: "Job Type",
      values: ["full-time", "part-time", "contract","internship","temporary"],
      default: [],
      multiple: true
    },
  
    workModel: {
      type: "enum",
      label: "Work Model",
      values: ["remote", "hybrid", "onsite"],
      default: [],
      multiple: true
    },
  
    datePosted: {
      type: "enum",
      label: "Date Posted",
      values: ["24h", "7d", "30d","anytime"],
      default: "7d"
    }
  };
  
  module.exports = { PARAMS_SCHEMA };
  
  