
export const options = {
    method: 'GET',
    url: 'https://twitter-api45.p.rapidapi.com/search.php',
    params: {query: 'gündem'},
    headers: {
      'X-RapidAPI-Key': import.meta.env.VITE_API_RAPID_KEY,
      'X-RapidAPI-Host': 'twitter-api45.p.rapidapi.com'
    }
  };