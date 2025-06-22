import React from "react";

function Calendar({ selectedDate, onDateSelect }) {
  const currentDate = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(currentDate.getDate() + i);
    return date;
  });

  const isSelected = (date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  const isToday = (date) => {
    return date.getDate() === currentDate.getDate() && 
           date.getMonth() === currentDate.getMonth() && 
           date.getFullYear() === currentDate.getFullYear();
  };

  return (
    <div className="flex gap-6 justify-between items-center mt-5 w-full whitespace-nowrap">
      {nextSevenDays.map((date, index) => {
        const dayName = days[date.getDay()];
        const dayNumber = date.getDate();
        const isDaySelected = isSelected(date);
        
        return (
          <div 
            key={index} 
            onClick={() => onDateSelect(date)}
            className={`flex flex-col justify-center items-center self-stretch py-1.5 px-1.5 my-auto rounded-xl cursor-pointer ${
              isDaySelected 
                ? 'bg-yellow-700 text-zinc-100' 
                : isToday(date) 
                  ? 'text-stone-300' 
                  : 'text-neutral-500'
            }`}
            style={{ width: isDaySelected ? '35px' : '23px' }}
          >
            <p className="text-[10px] font-semibold">{dayName}</p>
            <p className="mt-1 text-[18px] font-medium leading-tight">{dayNumber}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Calendar;