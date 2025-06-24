// import React, { useState, useEffect } from 'react';
// import { Line } from '@ant-design/charts';
// import '../admin/css/ViewerCount.module.css'; // Ensure this path is correct

// const ViewerCount = () => {
//   const [viewerCount, setViewerCount] = useState(0);
//   const [viewerData, setViewerData] = useState([]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setViewerCount(prevCount => {
//         const newCount = prevCount + Math.floor(Math.random() * 10);
//         console.log(`New Count: ${newCount}`); // Log new count
//         setViewerData(prevData => {
//           const newData = [...prevData, { time: new Date().toLocaleTimeString('en-GB'), count: newCount }];
//           console.log('New Data:', newData); // Log new data
//           return newData.slice(-30); // Limit to last 30 data points
//         });
//         return newCount;
//       });
//     }, 10000); // Update every second

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

//   const config = {
//     data: viewerData,
//     xField: 'time',
//     yField: 'count',
//     height: 400,
//     point: {
//       size: 5,
//       shape: 'diamond',
//     },
//     xAxis: {
//       title: {
//         text: 'Time',
//       },
//     },
//     yAxis: {
//       title: {
//         text: 'Viewer Count',
//       },
//     },
//   };

//   return (
//     <div className="viewer-count-container">
//       <p className="viewer-count-number">{viewerCount}</p>
//       <Line {...config} />
//     </div>
//   );
// };

// export default ViewerCount;
