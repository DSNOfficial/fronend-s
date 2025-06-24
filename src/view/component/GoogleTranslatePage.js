import { useEffect } from "react";

const GoogleTranslatePage = () => {
  const googleTranslateElementInit = () => {
    setTimeout(() => {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "kh", // Khmer is the base language
              autoDisplay: false,
            },
            "google_translate_element"
          );
        } catch (err) {
          console.error("Error initializing Google Translate:", err);
        }
      } else {
        console.error("Google Translate script is not fully loaded or TranslateElement is undefined");
      }
    }, 500);
  };

  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );

    addScript.onload = () => {
      console.log("Google Translate script loaded successfully");
      googleTranslateElementInit();
    };

    addScript.onerror = () => {
      console.error("Error loading Google Translate script");
    };

    document.body.appendChild(addScript);

    return () => {
      document.body.removeChild(addScript);
    };
  }, []);

  return (
    <>
      <div id="google_translate_element"></div>
      <style jsx>{`
        /* Main container style for the Google Translate widget */
        .goog-te-gadget-simple {
          background: linear-gradient(135deg, #34408c, #34408c); /* Vibrant gradient */
          border-radius: 25px; /* Smooth rounded corners */
          padding: 12px 28px;
          font-size: 14px;
          font-family: 'Poppins', sans-serif; /* Modern font */
          color: white;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          border: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth hover transitions */
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2); /* Deeper shadow for depth */
        }

        .goog-te-gadget-simple:hover {
          background: linear-gradient(135deg, #8e24aa, #34408c); /* Brighter hover gradient */
          transform: scale(1.05); /* Slight zoom effect on hover */
          box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3); /* Stronger shadow on hover */
        }

        .goog-te-gadget-simple span {
          color: white !important;
          font-weight: bold;
        }

        .goog-te-gadget-icon {
          display: inline-block !important;
          vertical-align: middle;
          margin-right: 12px; /* Space between icon and text */
        }

        .goog-te-menu-value span:first-child {
          display: inline-block !important;
        }

        /* Icon size adjustments */
        .goog-te-gadget-icon img {
          width: 20px; /* Resize the globe icon */
          height: 20px;
          margin-right: 10px;
        }

        /* Responsive design for mobile screens */
        @media (max-width: 768px) {
          .goog-te-gadget-simple {
            padding: 10px 18px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .goog-te-gadget-simple {
            padding: 8px 16px;
            font-size: 10px;
          }
        }

        /* Additional styling for the dropdown menu */
        .goog-te-combo {
          background: #34408c; /* Dark background for the dropdown #34408c */
          color: white;
          border: none;
          padding: 6px;
          border-radius: 8px;
          margin-left: 12px;
        }

        .goog-te-combo:hover {
          background: #34408c;
       
          
        }
      `}</style>
    </>
  );
};

export default GoogleTranslatePage;
