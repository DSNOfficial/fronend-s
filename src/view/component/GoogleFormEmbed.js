// import React from "react";

// const GoogleFormEmbed = () => {
//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "768px",
//         margin: "0 auto",
//         padding: "10px",
//         boxSizing: "border-box",
//       }}
//     >
//       <iframe
//         src="https://forms.gle/nMVR8gqAzQUKpksP6"
//         width="100%"
//         height="820"
//         frameBorder="0"
//         marginHeight="0"
//         marginWidth="0"
//         title="Google Form"
//         style={{
//           border: "none",
//           background: "#fff",
//         }}
//       >
//         Loading…
//       </iframe>
//     </div>
//   );
// };

// export default GoogleFormEmbed;


import React from "react";

const GoogleFormEmbed = () => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "768px",
        margin: "0 auto",
        padding: "30px 20px",
        boxSizing: "border-box",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <iframe
       src="https://forms.gle/nMVR8gqAzQUKpksP6"
        width="100%"
        height="850"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Google Form"
        style={{
          border: "none",
        }}
      >
        Loading…
      </iframe>
    </div>
  );
};

export default GoogleFormEmbed;
