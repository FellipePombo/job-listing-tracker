const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }

async function getParams(){
    const newParams = {};

    const check = await ask("Change filters: type '1', Clean filters: type '0', anything else keeps old filters.")
    if(check == "0") return {"clean":"clean"};
    if(check != "1") return {};
    
    const keywords = await ask("set search keywords (enter empty to not change): ");
    const location = await ask("set search location (enter empty to not change): ");
    if(keywords != ""){
        newParams["keywords"] = keywords;
    }
    if(location != ""){
        newParams["location"] = location;
    }
    
    const minsalary = await ask("set minimal salary (enter empty to not change) (numerical value): ");
    const maxsalary = await ask("set maximal salary (enter empty to not change) (numerical value): ");
    if(isNumeric(minsalary) && isNumeric(maxsalary)){
        newParams["salary"] = {};
        newParams["salary"]["min"]=minsalary;
        newParams["salary"]["max"]=maxsalary;
    }
    
    experienceLevels = [];
    let experienceLevel = "";
    while(experienceLevel != "-1"){
        experienceLevel = await ask("pick experience level: intern[1], assistant[2], junior[3], mid[4], senior[5] (to stop selecting: -1)");
        const experiencePicker = {"1": "intern","2": "assistant","3": "junior","4": "mid","5": "senior"}
        if(["1","2","3","4","5"].includes(experienceLevel)){
            experienceLevels.push(experiencePicker[experienceLevel]);
        }
    }
    if(experienceLevels.length > 0) newParams["experienceLevel"] = experienceLevels;

    jobTypes = [];
    let jobType = "";
    while(jobType != "-1"){
        jobType = await ask("pick job type: full-time[1], part-time[2], contract[3], internship[4], temporary[5] (to stop selecting: -1)");
        const jtPicker = {"1": "full-time","2": "part-time","3": "contract","4": "internship","5": "temporary"}
        if(["1","2","3","4","5"].includes(jobType)){
            jobTypes.push(jtPicker[jobType]);
        }
    }
    if(jobTypes.length > 0) newParams["jobType"] = jobTypes;

    workModels = [];
    let workModel = "";
    while(workModel != "-1"){
        workModel = await ask("pick work model: onsite[1], hybrid[2], remote[3](to stop selecting: -1)");
        const wmPicker = {"1": "onsite","2": "hybrid","3": "remote"}
        if(["1","2","3"].includes(workModel)){
            workModels.push(wmPicker[workModel]);
        }
    }
    if(workModels.length > 0) newParams["workModel"] = workModels;


    let datePosted = "anytime";
    const datePostedInput = await ask("pick date posted: last 24h[1], past 7d[2], past 30d[3](any other value: anytime)");
    const dpPicker = {"1": "24h","2": "7d","3": "30d"}
    if(["1","2","3"].includes(datePostedInput)){
        datePosted = dpPicker[datePostedInput];
    }
    newParams["datePosted"] = datePosted;
        
    console.log(newParams);
    rl.close();

    return newParams;
}

module.exports = { getParams };
