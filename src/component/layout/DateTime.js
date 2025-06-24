import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/km'; // Import Khmer locale for dayjs
import relativeTime from 'dayjs/plugin/relativeTime'; // Import relativeTime plugin if needed

dayjs.locale('km'); // Set dayjs to use Khmer locale

// Optional: Use plugins if you need relative time formatting
dayjs.extend(relativeTime);

const khmerNumbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

const toKhmerNumber = (num) => {
  return num.toString().split('').map(digit => {
    if (digit >= '0' && digit <= '9') {
      return khmerNumbers[digit];
    }
    return digit;
  }).join('');
};

const DateTime = () => {
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = dayjs();
      const formattedDate = `ថ្ងៃទី${toKhmerNumber(now.date())} ខែ${now.format('MMMM')} ឆ្នាំ${toKhmerNumber(now.year())}`;
      const formattedTime = `ម៉ោង ${toKhmerNumber(now.hour())}:${toKhmerNumber(now.minute())}`;
      setDateTime(`${formattedDate} និង ${formattedTime}`);
    };

    updateDateTime(); // Update immediately
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      fontSize: 16, 
      marginRight: 15, 
      backgroundColor: '#f0f0f0', // Change this color to your desired background color
      padding: '4px 24px', 
      borderRadius: '5px' 
    }}>
      {dateTime}
    </div>
  );
};

export default DateTime;
