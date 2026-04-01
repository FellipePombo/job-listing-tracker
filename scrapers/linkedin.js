module.exports = async (page, params) => {
    searchLink = buildLink(params);

    
    await page.goto(searchLink);
  
    await handleOptionalDialog(page);
    
    const list = await page.waitForSelector('[class="jobs-search__results-list"]', { timeout: 0 });
    const jobs = await list.$$('.base-search-card');
    let jobsScraped = [];
    if(jobs.length > 0){
      let i = 0;
      while(i < jobs.length && i < 20){
        let jobScraped = {};
        const info = await jobs[i].$('.base-search-card__info');
        const metadata = await info.$('.base-search-card__metadata');
        const link = await jobs[i].$('.base-card__full-link');

        jobScraped["link"] = link ? await link.evaluate(el => el.href) : ""

        const title = await info.$('.base-search-card__title');
        jobScraped["title"] = title ? await title.evaluate(el => el.innerText) : "";

        const subtitle = await info.$('.base-search-card__subtitle');
        jobScraped["subtitle"] = subtitle ? await subtitle.evaluate(el => el.innerText) : "";

        const location = await metadata.$('.job-search-card__location');
        jobScraped["location"] = location ? await location.evaluate(el => el.innerText) : "";

        const benefits= await metadata.$('.job-posting-benefits__text');
        jobScraped["benefits"]  = benefits ? await benefits.evaluate(el => el.innerText) : "";
        jobScraped["origin"] = "linkedin";
        jobsScraped.push(jobScraped);
        i++;
      }
    }

  
    return {
      jobsScraped,
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
    
    link += "keywords=" + params["keywords"].split(" ").join("%20") + "&";
    link += "location=" + params["location"].split(/[ ,]/).join("%20") + "&";

    let wageMin = params["salary"]["min"]
    if(wageMin){
      let wageKey = 0;
      while(wageMin >= 20000 + 20000*wageKey+1 ){
        wageKey++;
      }
      if(wageKey > 0) link += `f_SB2=${wageKey}&`
    }

    for (const key in LINKEDIN_MAPPINGS){
        if (key == "datePosted"){
            link += `f_TPR=${LINKEDIN_MAPPINGS["datePosted"][params["datePosted"]]}&`
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
  