import React, { useMemo } from 'react'
import generateBooks from '../utils/genrate_color';

const Decorarive = () => {
    const books = useMemo(() => generateBooks(), []);
  return (
     <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 w-32 h-full bg-amber-900/20" />
        <div className="absolute right-0 top-0 w-32 h-full bg-amber-900/20" />

        <div className="absolute left-2 top-0 h-full flex flex-col justify-around py-8">
          {books.slice(0, 6).map((book) => (
            <div
              key={book.id}
              className="w-12 rounded-sm shadow-lg opacity-70"
              style={{
                height: `${book.height}px`,
                backgroundColor: book.color,
              }}
            />
          ))}
        </div>

        <div className="absolute right-2 top-0 h-full flex flex-col justify-around py-8">
          {books.slice(6, 12).map((book) => (
            <div
              key={book.id}
              className="w-12 rounded-sm shadow-lg opacity-70"
              style={{
                height: `${book.height}px`,
                backgroundColor: book.color,
              }}
            />
          ))}
        </div>
      </div>
  )
}

export default Decorarive
