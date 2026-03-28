module.exports = async (page, params) => {
    searchLink = buildLink(params);
    console.log(searchLink);
    console.log(params);

    
    await page.goto(searchLink);
  
    await handleOptionalDialog(page);
    
    const title = await page.title();
  
    return {
      title,
      timestamp: new Date()
    };
  };


  // handles dialog pop-up
  async function handleOptionalDialog(page, timeout = 5000) {
    try {
      const dialog = await page.waitForSelector('[role="dialog"]', {
        timeout
      });
  
      if (dialog) {
        await closeDialog(page);
      }
    } catch (err) {
      
    }
  }
  
  async function closeDialog(page) {
    
    const closeSelectors = [
      'button[aria-label="Dismiss"]',
      'button[aria-label="Close"]',
      '[role="dialog"] button'
    ];
  
    for (let i = 0; i < closeSelectors.length; i++) {
      const btn = await page.$(closeSelectors[i]);
      if (btn) {
        await btn.click();
        return;
      }
    }
  
    
    await page.keyboard.press("Escape");
  }
  

  //builds search link according to parameter rules
  function buildLink(params){
    link = "https://www.linkedin.com/jobs/search?";
    
    
    for (const key in LINKEDIN_MAPPINGS){
        if (key == "datePosted"){
            link += `f_SB2=${LINKEDIN_MAPPINGS["datePosted"][params["datePosted"]]}&`
        }else{
            link += buildParam(key,params);
        }
    }

    return link;
  }

  //builds part of search link for parameters of same behavior
  function buildParam(param,params){
    linkAddition = "";
    const paramKeys = {
        "experienceLevel": "f_E=",
        "jobType": "f_JT=",
        "workModel": "f_WT=",
    }
    linkAddition += paramKeys[param];
    if(params[param].length > 1){
        linkAddition += LINKEDIN_MAPPINGS[param][params[param][0]];
        for (let i = 1; i < params[param].length; i++){
            linkAddition += "%2C";
            linkAddition += LINKEDIN_MAPPINGS[param][params[param][i]];
        }
        linkAddition += "&"; 
    }else{
        linkAddition += LINKEDIN_MAPPINGS[param][params[param]];
    }
    linkAddition += "&";
    return linkAddition;
  }


  //maps parameter associations with each search link option
  const LINKEDIN_MAPPINGS = {
    experienceLevel: {
        "": "", 
        intern: "1",
        assistant: "2",
        junior: "3",   
        mid: "4",      
        senior: "5"    
    },
  
    jobType: {
        "": "", 
      "full-time": "F",
      "part-time": "P",
      contract: "C",
      internship: "I",
      temporary: "T"
    },
  
    workModel: {
        "": "", 
      remote: "3",
      onsite: "1",
      hybrid: "2"
    },
  
    datePosted: {
        "": "", 
      "24h": "r86400",
      "7d": "r604800",
      "30d": "r2592000"
    }
  };
  