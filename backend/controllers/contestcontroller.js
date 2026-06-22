// Used clist API and this is public route


// @desc    Get Upcoming Contests
// @route   Get /contests
// @access  Public

const getContests=  async (req, res) => {
  try {
        const username = `${process.env.CLIST_USERNAME}`;
        const apiKey = `${process.env.CLIST_API_KEY}`;
        const currentDate = new Date().toISOString();
        const url = `https://clist.by/api/v1/contest/?username=${username}&api_key=${apiKey}&start__gt=${currentDate}&resource__id__in=1,2,102,93&limit=20&order_by=start`;


        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data= await response.json();
        res.json(data.objects);

  } catch (err) {
    console.error('Error fetching contests:', err.message);

    res.status(500).send('Error fetching contests');
  }
};

module.exports = getContests