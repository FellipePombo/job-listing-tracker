module.exports = [
    {
      name: 'linkedin',
      run: require('../scrapers/linkedin')
    },
    {
      name: 'netempregos',
      run: require('../scrapers/netempregos')
    }
    // {
    //   name: 'indeed',
    //   run: require('../scrapers/indeed')
    // },
    // {
    //   name: 'glassdoor',
    //   run: require('../scrapers/glassdoor')
    // }
  ];
  