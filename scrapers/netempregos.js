module.exports = async (page, params) => {
    searchLink = buildLink(params);
    console.log(searchLink);

    
    await page.goto(searchLink);
  
    await handleOptionalDialog(page);
    
    const jobs = await page.$$('.job-item.media');
    let jobsScraped = [];
    if(jobs.length > 0){
      let i = 0;
      while(i < jobs.length && i < 20){
        let jobScraped = {};
        const info = await jobs[i].$('.oferta-link');
        const metadata = await jobs[i].$('.job-ad-item');

        jobScraped["link"] = info ? await info.evaluate(el => el.href) : ""

        jobScraped["title"] = info ? await info.evaluate(el => el.innerText) : "";

        const subtitle = await metadata.$eval('li:has(i.flaticon-work)', el =>
            el.textContent.trim()
          );
        jobScraped["subtitle"] = subtitle;

        const location = await metadata.$eval('li:has(i.flaticon-pin)', el =>
            el.textContent.trim()
          );
        jobScraped["location"] = location;

        jobScraped["benefits"]  = "";
        jobScraped["origin"] = "netempregos";
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
      const dialog = await page.waitForSelector('.sp-prompt-message', {
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
      '.sp-prompt-close'
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
    link = "https://www.net-empregos.com/pesquisa-empregos.asp?";
    
    link += "chaves=" + params["keywords"].split(" ").join("+") + "&";
    link += "cidade=" + params["location"].split(/[ ,]/).join("+") + "&";

    jobType = "0";
    jobTypeDict = {"full-time": "1", "part-time": "2", "internship": "3", "remote": "4" };
    const jobTypePlusWorkModel = [...params["jobType"], ...params["workModel"]];

    const typesChosen = jobTypePlusWorkModel.filter(key => key in jobTypeDict);

    if (typesChosen.length <= 1){
        jobType = jobTypeDict[typesChosen[0]];
    }

    link+= "tipo=" + jobType + "&";

    return link;
  }
