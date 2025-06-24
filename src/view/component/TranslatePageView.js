import axios from 'axios';

const API_KEY = 'AIzaSyD-7uWTjTodZba7ky7mgfSgnVxAX_opoh8';
const API_URL = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyD-7uWTjTodZba7ky7mgfSgnVxAX_opoh8&q=flowers&source=en&target=fr&callback=handleResponse or AIzaSyD-7uWTjTodZba7ky7mgfSgnVxAX_opoh8';

const translateText = async (text, targetLanguage) => {
  const response = await axios.post(
    `${API_URL}?key=${API_KEY}`,
    {
      q: text,
      target: targetLanguage,
    }
  );

  return response.data.data.translations[0].translatedText;

};

export default translateText