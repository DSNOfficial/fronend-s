// // App.js
// import React, { useState } from 'react';
// import translateText from './TranslatePageView';

// function GoogleTranslatePageView() {
//   const [inputText, setInputText] = useState('');
//   const [targetLanguage, setTargetLanguage] = useState('es'); // Default: Spanish

//   const handleTranslate = async () => {
//     if (inputText) {
//       const translatedText = await translateText(inputText, targetLanguage);
//       // Do something with the translatedText, e.g., display it on the page.
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={inputText}
//         onChange={(e) => setInputText(e.target.value)}
//       />
//       <select
//         value={targetLanguage}
//         onChange={(e) => setTargetLanguage(e.target.value)}
//       >
//         <option value="es">Spanish</option>
//         <option value="fr">French</option>
       
//       </select>
//       <button onClick={handleTranslate}>Translate</button>
//     </div>
//   );
// }

// export default GoogleTranslatePageView;