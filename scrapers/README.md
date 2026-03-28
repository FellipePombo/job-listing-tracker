# Puppeteer Scrapers
These are the files based on the structure of each job listing website, each scraper automatically retrieves the desired data.

## Linkedin

### Search Link Parameters

Initial Link = https://www.linkedin.com/jobs/search?

character between each parameter = &

Job Type
f_JT=F& full time
f_JT=P& half time 
f_JT=C& contract 
f_JT=I& internship 
f_JT=T& temporary 

concatenation of parameters on link (multiple viable options): +%2Cx, x = F, P, C, I, T

Experience
f_E=1& Intern
f_E=2& Assistant
f_E=3& Junior
f_E=4& Mid
f_E=5& Senior

concatenation of parameters on link (multiple viable options): + %2Cx , x = 1, 2, 3, 4, 5

Work Model
f_WT=1 on-site
f_WT=2 hybrid
f_WT=3 remote

concatenation of parameters on link (multiple viable options): + %2Cx , x = 1, 2, 3, 4, 5

Time Posted
f_TPR=& any moment
f_TPR=r2592000& last month
f_TPR=r604800& last week
f_TPR=r86400& last 24 hours


Yearly Wage 
f_SB2=1 +de 40.000usd
f_SB2=2 +de 60.000usd
f_SB2=3 +de 80.000usd
f_SB2=4 +de 100.000usd
f_SB2=5 +de 120.000usd